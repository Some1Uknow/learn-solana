export type TrackId = "rust" | "anchor";

export type ChallengeEntry = {
  id: number;
  track: TrackId;
  title: string;
  difficulty?: "Easy" | "Medium" | "Hard";
  tags?: string[];
  description: string;
  starterCode?: string;
};

const rustStarter = `// Day 1: Factorial
// Implement factorial(n) -> u128
pub fn factorial(n: u32) -> u128 {
    // your code here
    1
}

fn main() {
    println!("{}", factorial(5));
}`;

export const challenges: ChallengeEntry[] = [
  {
    id: 1,
    track: "rust",
    title: "Day 1: Factorial",
    difficulty: "Easy",
    tags: ["Basics", "Loops", "Ownership"],
    description:
      "Implement a function that computes n! for a non-negative integer n. Aim for clarity and safety. Consider edge cases like n = 0.",
    starterCode: rustStarter,
  },
  {
    id: 2,
    track: "rust",
    title: "Day 2: Fibonacci",
    difficulty: "Easy",
    tags: ["Basics", "Iteration"],
    description:
      "Compute the nth Fibonacci number iteratively. Optimize for minimal allocations.",
    starterCode: `// Day 2: Fibonacci\nfn fib(n: u32) -> u64 {\n    // your code here\n    0\n}\n\nfn main() { println!(\"{}\", fib(10)); }`,
  },
];

export function getChallenge(track: TrackId, id: number) {
  return challenges.find((c) => c.track === track && c.id === id) || null;
}

export function getTrackCount(track: TrackId) {
  return challenges.filter((c) => c.track === track).length;
}

export function toMdxSlug(track: TrackId, id: number) {
  return [track, String(id)];
}
