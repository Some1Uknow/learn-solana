import { getBuildRunnerCallbackSecret, getBuildUploadTokenSecret } from "./secrets";

const configuredRunnerUrl = process.env.BUILD_CHALLENGE_RUNNER_URL?.replace(/\/$/, "");
const productionRunnerUrl =
  process.env.VERCEL_ENV === "production"
    ? "https://build-runner-production.up.railway.app"
    : null;

export const buildRunnerUrl = configuredRunnerUrl ?? productionRunnerUrl;
export const buildArtifactMaxBytes = 5 * 1024 * 1024;
export const buildAttemptRateLimit = 5;
export const buildAttemptRateWindowMs = 60_000;
export const buildAttemptExpiryMs = 10 * 60_000;
export const buildRunExpiryMs = 90_000;

export const buildChallengeSubmissionsEnabled =
  (process.env.BUILD_CHALLENGE_SUBMISSIONS_ENABLED === "true" ||
    process.env.VERCEL_ENV === "production") &&
  Boolean(buildRunnerUrl) &&
  Boolean(getBuildUploadTokenSecret()) &&
  Boolean(getBuildRunnerCallbackSecret());

export const buildChallengeUnavailableMessage =
  "Automated testing is being prepared. You can still download the starter and build locally.";
