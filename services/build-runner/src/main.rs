mod grader;

use {
    axum::{
        extract::{DefaultBodyLimit, Multipart, State},
        http::{header, HeaderMap, HeaderValue, Method, StatusCode},
        response::IntoResponse,
        routing::{get, post},
        Json, Router,
    },
    hmac::{Hmac, Mac},
    jsonwebtoken::{decode, Algorithm, DecodingKey, Validation},
    serde::{Deserialize, Serialize},
    serde_json::json,
    sha2::{Digest, Sha256},
    std::{
        env,
        io::Write,
        net::SocketAddr,
        path::Path,
        process::Stdio,
        sync::Arc,
        time::Duration,
    },
    tempfile::NamedTempFile,
    tokio::{process::Command, sync::Semaphore, time::timeout},
    tower_http::{cors::CorsLayer, trace::TraceLayer},
    tracing::{error, info},
};

const MAX_ARTIFACT_BYTES: usize = 5 * 1024 * 1024;
const RUN_TIMEOUT: Duration = Duration::from_secs(20);

type HmacSha256 = Hmac<Sha256>;

#[derive(Clone)]
struct AppState {
    upload_secret: Arc<Vec<u8>>,
    callback_secret: Arc<Vec<u8>>,
    app_url: Arc<String>,
    client: reqwest::Client,
    concurrency: Arc<Semaphore>,
}

#[derive(Debug, Deserialize)]
#[allow(dead_code)]
struct SubmissionClaims {
    sub: String,
    jti: String,
    aud: String,
    exp: usize,
    #[serde(rename = "challengeSlug")]
    challenge_slug: String,
    #[serde(rename = "stageSlug")]
    stage_slug: String,
}

#[derive(Debug, Serialize, Deserialize)]
struct ChildReport {
    status: String,
    summary: String,
    result: grader::GradeResult,
}

#[derive(Serialize)]
struct HealthResponse {
    status: &'static str,
    runner_version: &'static str,
    grader: &'static str,
}

#[tokio::main]
async fn main() {
    if env::args().nth(1).as_deref() == Some("__grade") {
        run_child();
        return;
    }

    tracing_subscriber::fmt().with_env_filter("info").compact().init();
    let state = AppState {
        upload_secret: Arc::new(required_env("BUILD_CHALLENGE_UPLOAD_TOKEN_SECRET").into_bytes()),
        callback_secret: Arc::new(required_env("BUILD_CHALLENGE_RUNNER_CALLBACK_SECRET").into_bytes()),
        app_url: Arc::new(required_env("LEARN_SOL_APP_URL").trim_end_matches('/').to_string()),
        client: reqwest::Client::builder().timeout(Duration::from_secs(10)).build().expect("http client"),
        concurrency: Arc::new(Semaphore::new(2)),
    };
    let allowed_origin = HeaderValue::from_str(&required_env("RUNNER_ALLOWED_ORIGIN")).expect("valid RUNNER_ALLOWED_ORIGIN");
    let cors = CorsLayer::new()
        .allow_origin(allowed_origin)
        .allow_methods([Method::POST])
        .allow_headers([header::AUTHORIZATION, header::CONTENT_TYPE]);
    let app = Router::new()
        .route("/healthz", get(health))
        .route("/v1/submissions", post(submit))
        .layer(DefaultBodyLimit::max(MAX_ARTIFACT_BYTES + 32 * 1024))
        .layer(cors)
        .layer(TraceLayer::new_for_http())
        .with_state(state);
    let port = env::var("PORT").ok().and_then(|value| value.parse().ok()).unwrap_or(8080);
    let address = SocketAddr::from(([0, 0, 0, 0], port));
    eprintln!("learnsol build runner starting on {address}");
    info!(%address, "build runner listening");
    let listener = tokio::net::TcpListener::bind(address).await.expect("bind runner");
    axum::serve(listener, app).await.expect("serve runner");
}

fn run_child() {
    let args: Vec<String> = env::args().collect();
    let Some(path) = args.get(2) else { std::process::exit(2) };
    let Some(challenge_slug) = args.get(3) else { std::process::exit(2) };
    let Some(stage_slug) = args.get(4) else { std::process::exit(2) };
    let artifact = match std::fs::read(path) {
        Ok(bytes) => bytes,
        Err(_) => std::process::exit(2),
    };
    let report = grader::grade(challenge_slug, stage_slug, &artifact);
    println!("{}", serde_json::to_string(&report).expect("serialize result"));
}

async fn health() -> Json<HealthResponse> {
    Json(HealthResponse { status: "ok", runner_version: env!("CARGO_PKG_VERSION"), grader: "sol-vault-v1" })
}

async fn submit(
    State(state): State<AppState>,
    headers: HeaderMap,
    mut multipart: Multipart,
) -> Result<impl IntoResponse, (StatusCode, Json<serde_json::Value>)> {
    let token = bearer_token(&headers).ok_or_else(|| api_error(StatusCode::UNAUTHORIZED, "Missing upload token."))?;
    let claims = verify_token(token, &state.upload_secret).map_err(|_| api_error(StatusCode::UNAUTHORIZED, "Invalid or expired upload token."))?;
    let permit = state.concurrency.clone().try_acquire_owned().map_err(|_| api_error(StatusCode::SERVICE_UNAVAILABLE, "The grader is busy. Try again shortly."))?;

    let mut artifact: Option<(String, Vec<u8>)> = None;
    while let Some(field) = multipart.next_field().await.map_err(|_| api_error(StatusCode::BAD_REQUEST, "Could not read the upload."))? {
        if field.name() != Some("artifact") { continue; }
        let filename = field.file_name().unwrap_or("program.so").to_string();
        let bytes = field.bytes().await.map_err(|_| api_error(StatusCode::BAD_REQUEST, "Could not read the program."))?;
        artifact = Some((filename, bytes.to_vec()));
        break;
    }
    let (filename, artifact) = artifact.ok_or_else(|| api_error(StatusCode::BAD_REQUEST, "Attach one compiled .so file."))?;
    if !filename.to_ascii_lowercase().ends_with(".so") || artifact.len() > MAX_ARTIFACT_BYTES || artifact.len() < 4 || artifact[..4] != [0x7f, b'E', b'L', b'F'] {
        return Err(api_error(StatusCode::UNPROCESSABLE_ENTITY, "Upload a valid .so program under 5 MiB."));
    }

    claim_attempt(&state, &claims.jti).await.map_err(|_| api_error(StatusCode::CONFLICT, "This test is no longer available."))?;
    let mut temp = NamedTempFile::new().map_err(|_| api_error(StatusCode::INTERNAL_SERVER_ERROR, "Could not prepare the grader."))?;
    temp.write_all(&artifact).map_err(|_| api_error(StatusCode::INTERNAL_SERVER_ERROR, "Could not prepare the program."))?;
    let artifact_path = temp.into_temp_path();
    let artifact_hash = hex::encode(Sha256::digest(&artifact));
    let state_for_task = state.clone();
    let attempt_id = claims.jti.clone();
    tokio::spawn(async move {
        let report = run_grade_child(artifact_path.as_ref(), &claims.challenge_slug, &claims.stage_slug).await;
        let payload = match report {
            Ok(report) => json!({
                "status": report.status,
                "summary": report.summary,
                "result": report.result,
                "artifactSha256": artifact_hash,
                "artifactSize": artifact.len(),
                "runnerVersion": env!("CARGO_PKG_VERSION"),
            }),
            Err(code) => json!({
                "status": "error",
                "summary": "The grader could not finish this program. Build again and retry.",
                "errorCode": code,
                "artifactSha256": artifact_hash,
                "artifactSize": artifact.len(),
                "runnerVersion": env!("CARGO_PKG_VERSION"),
            }),
        };
        if let Err(error) = send_callback(&state_for_task, &attempt_id, "result", payload).await {
            error!(%error, attempt_id = %attempt_id, "failed to send grade result");
        }
        drop(artifact_path);
        drop(permit);
    });
    Ok((StatusCode::ACCEPTED, Json(json!({ "status": "running", "attemptId": claims.jti }))))
}

async fn run_grade_child(path: &Path, challenge_slug: &str, stage_slug: &str) -> Result<ChildReport, &'static str> {
    let executable = env::current_exe().map_err(|_| "runner_error")?;
    let output = timeout(
        RUN_TIMEOUT,
        Command::new(executable)
            .arg("__grade")
            .arg(path)
            .arg(challenge_slug)
            .arg(stage_slug)
            .stdin(Stdio::null())
            .stderr(Stdio::null())
            .output(),
    )
    .await
    .map_err(|_| "timeout")?
    .map_err(|_| "runner_error")?;
    if !output.status.success() { return Err("invalid_program"); }
    serde_json::from_slice(&output.stdout).map_err(|_| "runner_error")
}

async fn claim_attempt(state: &AppState, attempt_id: &str) -> Result<(), String> {
    send_callback(state, attempt_id, "claim", json!({})).await.map(|_| ())
}

async fn send_callback(state: &AppState, attempt_id: &str, action: &str, payload: serde_json::Value) -> Result<(), String> {
    let body = serde_json::to_string(&payload).map_err(|_| "serialize callback".to_string())?;
    let timestamp = chrono_timestamp();
    let signature = callback_signature(&state.callback_secret, &timestamp, &body);
    let response = state.client
        .post(format!("{}/api/build/attempts/{attempt_id}/{action}", state.app_url))
        .header("content-type", "application/json")
        .header("x-build-runner-timestamp", timestamp)
        .header("x-build-runner-signature", signature)
        .body(body)
        .send().await.map_err(|_| "callback request".to_string())?;
    if response.status().is_success() { Ok(()) } else { Err("callback rejected".to_string()) }
}

fn verify_token(token: &str, secret: &[u8]) -> Result<SubmissionClaims, ()> {
    let mut validation = Validation::new(Algorithm::HS256);
    validation.set_audience(&["learnsol-build-runner"]);
    decode::<SubmissionClaims>(token, &DecodingKey::from_secret(secret), &validation).map(|data| data.claims).map_err(|_| ())
}

fn bearer_token(headers: &HeaderMap) -> Option<&str> {
    headers.get(header::AUTHORIZATION)?.to_str().ok()?.strip_prefix("Bearer ")
}

fn callback_signature(secret: &[u8], timestamp: &str, body: &str) -> String {
    let mut mac = HmacSha256::new_from_slice(secret).expect("hmac secret");
    mac.update(format!("{timestamp}.{body}").as_bytes());
    hex::encode(mac.finalize().into_bytes())
}

fn chrono_timestamp() -> String {
    std::time::SystemTime::now().duration_since(std::time::UNIX_EPOCH).expect("clock").as_millis().to_string()
}

fn api_error(status: StatusCode, message: &str) -> (StatusCode, Json<serde_json::Value>) {
    (status, Json(json!({ "error": message })))
}

fn required_env(name: &str) -> String {
    env::var(name).unwrap_or_else(|_| panic!("{name} must be configured"))
}
