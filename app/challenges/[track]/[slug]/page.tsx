import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ChallengePageWorkspace from "@/components/challenges/ChallengePageWorkspace";
import {
  getAdjacentExercises,
  getExercise,
  listExercisesByTrack,
} from "@/lib/challenges/exercises";
import { createCanonical } from "@/lib/seo";

type Params = Promise<{ track: string; slug: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { track, slug } = await params;
  const exercise = getExercise(track, slug);
  if (!exercise) return { title: "Challenge" };

  const title = `${exercise.title} · ${exercise.track.toUpperCase()} Exercise`;
  const canonical = createCanonical(`/challenges/${track}/${exercise.slug}`);
  const ogImageUrl = createCanonical(`/og/challenges/${track}/${exercise.slug}`);

  // Generate keywords from challenge tags and track
  const trackKeywords = track === "rust"
    ? ["rust programming", "rust exercises", "learn rust"]
    : [`${track} exercises`, `${track} practice`, `learn ${track}`];
  
  const tagKeywords = (exercise.tags ?? []).map((tag: string) => tag.toLowerCase());
  const keywords = [
    ...tagKeywords,
    ...trackKeywords,
    "coding exercise",
    "solana development",
    exercise.difficulty?.toLowerCase() ?? "exercise",
  ];

  return {
    title,
    description: exercise.description,
    keywords,
    alternates: {
      canonical,
    },
    openGraph: {
      title,
      description: exercise.description,
      url: canonical,
      siteName: "learn.sol",
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: `${exercise.title} exercise`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: exercise.description,
      images: [ogImageUrl],
    },
  };
}

export default async function ChallengeRoute({ params }: { params: Params }) {
  const { track, slug } = await params;
  const exercise = getExercise(track, slug);
  if (!exercise) return notFound();
  const exercises = listExercisesByTrack(track);
  const currentIndex = exercises.findIndex((item) => item.slug === exercise.slug);
  const { previous, next } = getAdjacentExercises(track, slug);

  return (
    <ChallengePageWorkspace
      title={exercise.title}
      difficulty={exercise.difficulty}
      tags={exercise.tags}
      description={exercise.description}
      starterCode={exercise.starterCode}
      backHref={`/challenges/${track}`}
      mdxSlug={exercise.sourceSlugs}
      currentIndex={currentIndex + 1}
      totalCount={exercises.length}
      track={track}
      exerciseSlug={exercise.slug}
      previousHref={previous ? `/challenges/${track}/${previous.slug}` : undefined}
      nextHref={next ? `/challenges/${track}/${next.slug}` : undefined}
      executor={exercise.executor}
    />
  );
}
