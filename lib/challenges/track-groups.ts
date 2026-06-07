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

const CPMM_TRACK_GROUPS: ChallengeTrackGroup[] = [
  {
    id: "amm-foundations",
    title: "AMM Foundations",
    days: "Challenges 1-5",
    description: "Pool reserves, constant product math, quote basics, fees, and slippage.",
    startOrder: 1,
    endOrder: 5,
  },
  {
    id: "swaps-and-fees",
    title: "Swaps & Fees",
    days: "Challenges 6-10",
    description: "Mutating swaps, fee accounting, average price, and invariant checks.",
    startOrder: 6,
    endOrder: 10,
  },
  {
    id: "liquidity-and-lp-shares",
    title: "Liquidity & LP Shares",
    days: "Challenges 11-15",
    description: "Initial liquidity, proportional deposits, LP supply, and withdrawals.",
    startOrder: 11,
    endOrder: 15,
  },
  {
    id: "solana-ready-security",
    title: "Solana-Ready Security",
    days: "Challenges 16-20",
    description: "Checked arithmetic, rounding policy, pause controls, and secure CPMM state logic.",
    startOrder: 16,
    endOrder: 20,
  },
];

const ORDERBOOK_TRACK_GROUPS: ChallengeTrackGroup[] = [
  {
    id: "foundations",
    title: "Orderbook Foundations",
    days: "Challenges 1-3",
    description: "Order sides, crossing logic, and top-of-book discovery.",
    startOrder: 1,
    endOrder: 3,
  },
  {
    id: "matching",
    title: "Matching Engine",
    days: "Challenges 4-7",
    description: "Fills, market orders, and average execution price.",
    startOrder: 4,
    endOrder: 7,
  },
  {
    id: "book-mutations",
    title: "Book Mutations",
    days: "Challenges 8-10",
    description: "Insertion, cancellation, and price-time priority.",
    startOrder: 8,
    endOrder: 10,
  },
  {
    id: "exchange-behavior",
    title: "Exchange Behavior",
    days: "Challenges 11-12",
    description: "Post-only rejection and immediate-or-cancel matching.",
    startOrder: 11,
    endOrder: 12,
  },
];

const TRACK_GROUPS: Record<string, ChallengeTrackGroup[]> = {
  rust: RUST_TRACK_GROUPS,
  cpmm: CPMM_TRACK_GROUPS,
  orderbook: ORDERBOOK_TRACK_GROUPS,
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
