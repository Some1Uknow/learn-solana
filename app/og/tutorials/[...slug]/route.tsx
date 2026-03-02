import { tutorialsSource } from "@/lib/tutorials/source";
import { generateLearnSolOgImage } from "@/lib/og/learnsol";

export const runtime = "nodejs";
export const contentType = "image/png";
export const size = { width: 1200, height: 630 };

const truncate = (value: string, limit: number): string => {
  if (value.length <= limit) return value;
  return `${value.slice(0, limit - 1).trimEnd()}...`;
};

type Params = { slug: string[] };

export async function GET(
  _request: Request,
  { params }: { params: Promise<Params> }
) {
  const { slug } = await params;
  const page = tutorialsSource.getPage(slug);

  if (!page) {
    return new Response("Tutorial not found", { status: 404 });
  }

  return generateLearnSolOgImage({
    eyebrow: "tutorial",
    title: truncate(page.data.title, 54),
    subtitle: truncate(page.data.description ?? "Hands-on Solana tutorial.", 170),
    bullets: ["Beginner-first walkthrough", "Code + explanation in one flow"],
    footer: "learn.sol",
  });
}
