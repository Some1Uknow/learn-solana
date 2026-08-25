export type NegotiatedRepresentation = "text/html" | "text/markdown";

type AcceptRange = {
  type: string;
  subtype: string;
  q: number;
  specificity: number;
  position: number;
};

const DEFAULT_REPRESENTATIONS: readonly NegotiatedRepresentation[] = [
  "text/html",
  "text/markdown",
];

function parseAcceptHeader(acceptHeader: string | null | undefined): AcceptRange[] {
  const value = acceptHeader?.trim();
  if (!value) {
    return [
      {
        type: "*",
        subtype: "*",
        q: 1,
        specificity: 0,
        position: 0,
      },
    ];
  }

  return value.split(",").flatMap((rawRange, position) => {
    const [rawMediaType, ...parameters] = rawRange
      .split(";")
      .map((part) => part.trim());
    const [type, subtype] = (rawMediaType ?? "").toLowerCase().split("/");

    if (!type || !subtype) return [];

    let q = 1;
    for (const parameter of parameters) {
      const [name, rawValue] = parameter.split("=", 2).map((part) => part.trim());
      if (name?.toLowerCase() !== "q") continue;

      const parsed = Number(rawValue);
      q = Number.isFinite(parsed) ? Math.min(1, Math.max(0, parsed)) : 0;
    }

    return [
      {
        type,
        subtype,
        q,
        specificity: type === "*" ? 0 : subtype === "*" ? 1 : 2,
        position,
      },
    ];
  });
}

function matches(range: AcceptRange, representation: string) {
  const [type, subtype] = representation.toLowerCase().split("/");
  if (!type || !subtype) return false;

  return (
    (range.type === "*" || range.type === type) &&
    (range.subtype === "*" || range.subtype === subtype)
  );
}

function bestMatch(
  ranges: AcceptRange[],
  representation: string,
): AcceptRange | undefined {
  return ranges
    .filter((range) => matches(range, representation))
    .sort(
      (left, right) =>
        right.specificity - left.specificity || left.position - right.position,
    )[0];
}

/**
 * Selects one representation using the HTTP Accept rules needed for Markdown
 * content negotiation: q-values, media-type specificity, and header order.
 */
export function negotiateRepresentation(
  acceptHeader: string | null | undefined,
  available: readonly string[] = DEFAULT_REPRESENTATIONS,
): string | null {
  const ranges = parseAcceptHeader(acceptHeader);

  return available
    .map((representation, index) => {
      const match = bestMatch(ranges, representation);
      if (!match || match.q <= 0) return null;

      return {
        representation,
        q: match.q,
        specificity: match.specificity,
        position: match.position,
        index,
      };
    })
    .filter((candidate): candidate is NonNullable<typeof candidate> => candidate !== null)
    .sort(
      (left, right) =>
        right.q - left.q ||
        right.specificity - left.specificity ||
        left.position - right.position ||
        left.index - right.index,
    )[0]?.representation ?? null;
}

export function mergeVaryHeader(
  current: string | null | undefined,
  ...values: string[]
): string {
  const merged: string[] = [];
  const seen = new Set<string>();

  for (const value of [current ?? "", ...values].flatMap((entry) => entry.split(","))) {
    const normalized = value.trim();
    if (!normalized) continue;

    const key = normalized.toLowerCase();
    if (seen.has(key)) continue;

    seen.add(key);
    merged.push(normalized);
  }

  return merged.join(", ");
}

function normalizeOrigin(origin: string) {
  return origin.replace(/\/+$/, "");
}

export function createAgentNotFoundMarkdown(origin: string) {
  const site = normalizeOrigin(origin);

  return `# Page not found

The requested URL does not exist on learn.sol.

Start here:

- [Homepage](${site}/)
- [Curriculum](${site}/learn)
- [Modules](${site}/modules)
- [LLM-readable docs index](${site}/llms.txt)
- [Full Markdown course content](${site}/llms-full.txt)
- [XML sitemap](${site}/sitemap.xml)

If you were looking for a lesson, browse the curriculum or use the Markdown URL listed for each page in the docs index.
`;
}

export function createHomepageMarkdown(origin: string) {
  const site = normalizeOrigin(origin);

  return `# learn.sol

> Onboarding and education layer for Solana.

learn.sol is a free learning product for developers who want to understand Solana by building through the stack. It combines structured lessons, executable coding challenges, and guided tools for builders learning the runtime, Rust, Anchor, and modern client development.

## Start learning

- [Explore modules](${site}/modules)
- [Browse the curriculum](${site}/learn)
- [Solve coding challenges](${site}/challenges)
- [Explore developer tools](${site}/tools)

## What you can learn

- Solana runtime concepts, accounts, transactions, fees, and program interaction.
- Rust ownership, borrowing, traits, pattern matching, and problem-solving for Solana.
- Anchor account validation, instruction design, constraints, and production habits.
- Solana Kit client flows, wallet-standard interfaces, transaction assembly, and reliable confirmation.

## Agent-readable resources

- [LLM-readable docs index](${site}/llms.txt)
- [Full Markdown course content](${site}/llms-full.txt)
- [XML sitemap](${site}/sitemap.xml)

Install the LearnSol agent skill with \`npx skills add Some1Uknow/learn-solana --skill learn-solana\` and ask your coding agent to explain a Solana concept from first principles.
`;
}
