import { source } from "@/lib/source";
import { createCanonical, siteUrl } from "@/lib/seo";

export const revalidate = false;

export async function GET() {
  const pages = source
    .getPages()
    .map((page) => {
      const description = page.data.description?.trim();

      return [
        `- ${page.data.title}`,
        `  URL: ${createCanonical(page.url)}`,
        `  Markdown: ${createCanonical(`${page.url}.mdx`)}`,
        description ? `  Summary: ${description}` : null,
      ]
        .filter(Boolean)
        .join("\n");
    })
    .join("\n\n");

  const body = `# learn.sol

> Learn Solana development through structured lessons and hands-on projects.

- Docs home: ${createCanonical("/learn")}
- Full content dump: ${createCanonical("/llms-full.txt")}
- Markdown route pattern: ${siteUrl}/learn/<slug>.mdx

## Pages

${pages}
`;

  return new Response(body, {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "public, max-age=0, must-revalidate",
      "x-robots-tag": "noindex, nofollow, noarchive",
    },
  });
}
