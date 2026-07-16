import "server-only";

import { createHmac } from "node:crypto";

function deriveBuildSecret(purpose: "upload" | "callback") {
  const databaseUrl = process.env.POSTGRES_URL;
  if (!databaseUrl) return null;

  return createHmac("sha256", databaseUrl)
    .update(`learnsol-build-challenge:${purpose}:v1`)
    .digest("hex");
}

export function getBuildUploadTokenSecret() {
  return process.env.BUILD_CHALLENGE_UPLOAD_TOKEN_SECRET ?? deriveBuildSecret("upload");
}

export function getBuildRunnerCallbackSecret() {
  return process.env.BUILD_CHALLENGE_RUNNER_CALLBACK_SECRET ?? deriveBuildSecret("callback");
}
