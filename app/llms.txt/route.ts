import { brand } from "@/lib/brand";
import { source } from "@/lib/source";
import { createCanonical } from "@/lib/seo";

export const revalidate = false;

export async function GET() {
  const pages = source
    .getPages()
    .map((page) => {
      const description = page.data.description?.trim();
      const markdownUrl = createCanonical(`${page.url}.mdx`);

      return `- [${page.data.title}](${markdownUrl})${description ? `: ${description}` : ""}`;
    })
    .join("\n");

  const body = `# ${brand.name}

> ${brand.longDescription}

The public curriculum is readable without an account. Follow the Markdown links below for focused lessons and exercises.

## Curriculum

- [Curriculum home](${createCanonical("/learn")}): Browse the complete Learn Solana curriculum.
- [Full curriculum](${createCanonical("/llms-full.txt")}): Read all curriculum content as one Markdown document.
- [Markdown lesson index](${createCanonical("/learn.mdx")}): Access the curriculum's Markdown entry point.

${pages}
`;

  return new Response(body, {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800",
    },
  });
}
