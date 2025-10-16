export type TrackId = "rust" | "anchor";

type RustPlaygroundExecutor = {
  type: "rust-playground";
  expectedStdout: string;
  harnessBefore?: string;
  harnessAfter?: string;
  channel?: "stable" | "beta" | "nightly";
  edition?: "2021" | "2024";
  mode?: "debug" | "release";
  description?: string;
};

export type ChallengeExecutor = RustPlaygroundExecutor;

export type ChallengeEntry = {
  id: number;
  track: TrackId;
  title: string;
  difficulty?: "Easy" | "Medium" | "Hard";
  tags?: string[];
  description: string;
  starterCode?: string;
  executor?: ChallengeExecutor;
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
    starterCode: `// Day 2: Fibonacci\nfn fib(n: u32) -> u64 {\n    // your code here\n    0\n}\n\nfn main() { println!("{}", fib(10)); }`,
  },
  {
    id: 3,
    track: "rust",
    title: "Day 3: Radiant Signal",
    difficulty: "Medium",
    tags: ["Strings", "Iteration", "Puzzle"],
    description:
      "Decode a fixed telemetry signal into a human-readable string using a simple alphabet mapping.",
    starterCode: `// Day 3: Radiant Signal\npub fn decode_signal(signal: &[u8]) -> String {\n    // Map 0..=25 -> 'A'..='Z', 26 -> ' ', 27 -> '-'\n    // Build the decoded string and return it.\n    String::new()\n}\n\n#[cfg(test)]\nmod tests {\n    use super::*;\n\n    #[test]\n    fn sample() {\n        let decoded = decode_signal(&[11, 4, 0, 17, 13, 27, 18, 14, 11]);\n        assert_eq!(decoded, "LEARN-SOL");\n    }\n}`,
    executor: {
      type: "rust-playground",
      expectedStdout: "LEARN-SOL",
      harnessAfter: `
fn main() {
    let answer = decode_signal(&[11, 4, 0, 17, 13, 27, 18, 14, 11]);
    println!("{answer}");
}`,
      description:
        "Runs your decode_signal implementation against the hidden input and checks the output.",
    },
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
