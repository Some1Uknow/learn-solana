# LearnSol build runner

The runner accepts a short-lived upload token, claims the attempt from the web app, runs one untrusted SBF artifact in a separate child process, and sends a signed result callback. It stores no source code or binaries after the test completes.

Required Railway variables:

- `BUILD_CHALLENGE_UPLOAD_TOKEN_SECRET` — same value as the web app.
- `BUILD_CHALLENGE_RUNNER_CALLBACK_SECRET` — same value as the web app.
- `LEARN_SOL_APP_URL` — the deployed web origin, without a trailing slash.
- `RUNNER_ALLOWED_ORIGIN` — that same browser origin.

The web app also needs `BUILD_CHALLENGE_RUNNER_URL` and `BUILD_CHALLENGE_SUBMISSIONS_ENABLED=true`.

Run locally with `cargo run` after setting those variables. Use `cargo test` or submit a known-good `.so` only after the full stage fixtures have been verified.
