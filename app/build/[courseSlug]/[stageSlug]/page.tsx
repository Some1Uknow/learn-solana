import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { BuildStageWorkspace } from "@/components/build-challenges/BuildStageWorkspace";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { buildChallengeSubmissionsEnabled } from "@/lib/build-challenges/config";
import { getBuildChallengeCourse, getBuildChallengeStage, toPublicBuildChallengeCourse } from "@/lib/build-challenges/source";
import { createCanonical } from "@/lib/seo";

type Params = Promise<{ courseSlug: string; stageSlug: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { courseSlug, stageSlug } = await params;
  const challenge = getBuildChallengeCourse(courseSlug);
  const stage = getBuildChallengeStage(courseSlug, stageSlug);
  if (!challenge || !stage) return { title: "Build stage" };
  return { title: `${stage.title} · ${challenge.shortTitle}`, description: stage.promise, alternates: { canonical: createCanonical(`/build/${courseSlug}/${stageSlug}`) } };
}

export default async function BuildStagePage({ params }: { params: Params }) {
  const { courseSlug, stageSlug } = await params;
  const challenge = getBuildChallengeCourse(courseSlug);
  const stage = getBuildChallengeStage(courseSlug, stageSlug);
  if (!challenge || !stage) notFound();
  const view = toPublicBuildChallengeCourse(challenge);
  const publicStage = view.stages.find((item) => item.slug === stageSlug);
  if (!publicStage) notFound();
  return <><Navbar /><BuildStageWorkspace challenge={{ slug: view.slug, shortTitle: view.shortTitle, starter: view.starter, stages: view.stages }} stage={publicStage} submissionsEnabled={buildChallengeSubmissionsEnabled} /><Footer /></>;
}
