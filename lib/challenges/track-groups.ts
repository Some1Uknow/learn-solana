export type ChallengeTrackGroup = {
  id: string;
  title: string;
  days: string;
  description: string;
  startOrder: number;
  endOrder: number;
};

export type ChallengeSection<T> = {
  id: string;
  title: string;
  days: string;
  description: string;
  challenges: T[];
};

const RUST_TRACK_GROUPS: ChallengeTrackGroup[] = [
  {
    id: "foundations",
    title: "Foundations",
    days: "Days 1-8",
    description: "Core syntax, ownership, borrowing, enums, error patterns.",
    startOrder: 1,
    endOrder: 8,
  },
  {
    id: "deep-dive",
    title: "Deep Dive",
    days: "Days 9-16",
    description: "Generics, traits, lifetimes, collections & iterators.",
    startOrder: 9,
    endOrder: 16,
  },
  {
    id: "advanced",
    title: "Advanced",
    days: "Days 17-23",
    description: "Algorithms, concurrency primitives, benchmarking.",
    startOrder: 17,
    endOrder: 23,
  },
  {
    id: "solana-ready",
    title: "Solana Ready",
    days: "Days 24-30",
    description: "PDAs, serialization, cross-program invocations, security.",
    startOrder: 24,
    endOrder: 30,
  },
];

const TRACK_GROUPS: Record<string, ChallengeTrackGroup[]> = {
  rust: RUST_TRACK_GROUPS,
};

export function getChallengeGroupsForTrack(track: string): ChallengeTrackGroup[] {
  return TRACK_GROUPS[track] ?? [];
}

export function buildChallengeSections<T extends { order: number }>(
  track: string,
  challenges: T[]
): ChallengeSection<T>[] {
  const groups = getChallengeGroupsForTrack(track);

  if (groups.length === 0) {
    return challenges.length === 0
      ? []
      : [
          {
            id: "all-challenges",
            title: "All Challenges",
            days: `${challenges.length} total`,
            description: "Practice problems for this track.",
            challenges,
          },
        ];
  }

  const sections = groups.map((group) => ({
    ...group,
    challenges: [] as T[],
  }));
  const additional: T[] = [];

  for (const challenge of challenges) {
    const matchingSection = sections.find(
      (section) =>
        challenge.order >= section.startOrder && challenge.order <= section.endOrder
    );

    if (matchingSection) {
      matchingSection.challenges.push(challenge);
      continue;
    }

    additional.push(challenge);
  }

  const populatedSections = sections
    .filter((section) => section.challenges.length > 0)
    .map((section) => ({
      id: section.id,
      title: section.title,
      days: section.days,
      description: section.description,
      challenges: section.challenges,
    }));

  if (additional.length > 0) {
    populatedSections.push({
      id: "additional-challenges",
      title: "Additional Challenges",
      days: `${additional.length} total`,
      description: "Problems outside the current roadmap ranges.",
      challenges: additional,
    });
  }

  return populatedSections;
}
