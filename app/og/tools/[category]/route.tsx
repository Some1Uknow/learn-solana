import { getToolCategory } from "@/data/tools-data";
import { generateLearnSolOgImage } from "@/lib/og/learnsol";

export const runtime = "edge";
export const contentType = "image/png";
export const size = { width: 1200, height: 630 };

type Params = { category: string };

const truncate = (value: string, limit: number): string => {
  if (value.length <= limit) return value;
  return `${value.slice(0, limit - 1).trimEnd()}...`;
};

export async function GET(
  _request: Request,
  { params }: { params: Promise<Params> }
) {
  const { category } = await params;
  const categoryData = getToolCategory(category);

  if (!categoryData) {
    return new Response("Category not found", { status: 404 });
  }

  return generateLearnSolOgImage({
    eyebrow: "tool category",
    title: truncate(`${categoryData.name}\nfor Solana builders`, 56),
    subtitle: truncate(categoryData.description, 170),
    bullets: ["Curated picks and ecosystem context", "Beginner-friendly tool comparisons"],
    footer: "learn.sol",
  });
}
