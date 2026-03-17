import { createCanonical } from "@/lib/seo";

type LLMReadablePage = {
  url: string;
  slugs: string[];
  data: {
    title: string;
    description?: string;
    getText?: (type: "raw" | "processed") => Promise<string>;
  };
};

export async function getLLMText(page: LLMReadablePage) {
  const getText = page.data.getText;
  if (!getText) {
    throw new Error(
      "Processed markdown is unavailable. Enable includeProcessedMarkdown in the Fumadocs collection.",
    );
  }

  const markdown = await getText("processed");
  const pageUrl = createCanonical(page.url);
  const markdownUrl = createCanonical(`${page.url}.mdx`);

  return `# ${page.data.title}
URL: ${pageUrl}
Markdown URL: ${markdownUrl}

${page.data.description ?? ""}

${markdown}`;
}
