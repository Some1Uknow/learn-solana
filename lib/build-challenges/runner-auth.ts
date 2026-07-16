import { createHmac, timingSafeEqual } from "node:crypto";
import { SignJWT } from "jose";

import { getBuildRunnerCallbackSecret, getBuildUploadTokenSecret } from "./secrets";

type SubmissionToken = {
  attemptId: string;
  userId: string;
  challengeSlug: string;
  stageSlug: string;
};

function uploadSecret() {
  const value = getBuildUploadTokenSecret();
  if (!value) throw new Error("BUILD_CHALLENGE_UPLOAD_TOKEN_SECRET is not configured");
  return new TextEncoder().encode(value);
}

function callbackSecret() {
  const value = getBuildRunnerCallbackSecret();
  if (!value) throw new Error("BUILD_CHALLENGE_RUNNER_CALLBACK_SECRET is not configured");
  return value;
}

export async function issueBuildSubmissionToken(input: SubmissionToken) {
  return new SignJWT({
    challengeSlug: input.challengeSlug,
    stageSlug: input.stageSlug,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(input.userId)
    .setJti(input.attemptId)
    .setAudience("learnsol-build-runner")
    .setIssuedAt()
    .setExpirationTime("5m")
    .sign(uploadSecret());
}

export function signRunnerCallback(body: string, timestamp: string) {
  return createHmac("sha256", callbackSecret())
    .update(`${timestamp}.${body}`)
    .digest("hex");
}

export function verifyRunnerCallback(body: string, timestamp: string | null, signature: string | null) {
  if (!timestamp || !signature || !/^\d{13}$/.test(timestamp)) return false;
  if (Math.abs(Date.now() - Number(timestamp)) > 5 * 60_000) return false;

  const expected = signRunnerCallback(body, timestamp);
  const supplied = Buffer.from(signature, "hex");
  const expectedBuffer = Buffer.from(expected, "hex");
  return supplied.length === expectedBuffer.length && timingSafeEqual(supplied, expectedBuffer);
}
