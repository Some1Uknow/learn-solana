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

function stripFenceMetadata(markdown: string) {
  return markdown.replace(/^```([a-zA-Z0-9_-]+)[^\n]*$/gm, "```$1");
}

function normalizeBlockContent(content: string) {
  return normalizeMDXForLLMs(content)
    .trim()
    .replace(/\n{3,}/g, "\n\n");
}

function formatCallout(type: string | undefined, content: string) {
  const marker =
    type === "tip"
      ? "TIP"
      : type === "warn"
        ? "WARNING"
        : type === "info"
          ? "NOTE"
          : "NOTE";

  const lines = normalizeBlockContent(content).split("\n");
  return [`> [!${marker}]`, ...lines.map((line) => (line ? `> ${line}` : ">"))].join("\n");
}

function formatTitledBlock(title: string, content: string) {
  const normalized = normalizeBlockContent(content);
  const sameHeading = new RegExp(`^#{1,6}\\s+${title.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\s*$`, "i");

  if (sameHeading.test(normalized.split("\n")[0] ?? "")) {
    return normalized;
  }

  return `### ${title}\n\n${normalized}`;
}

function formatStep(index: number, content: string) {
  const normalized = normalizeBlockContent(content);
  const lines = normalized.split("\n");
  const [first = "", ...rest] = lines;

  return [`${index}. ${first}`, ...rest.map((line) => (line ? `   ${line}` : ""))].join("\n");
}

function normalizeProseChunk(markdown: string) {
  return markdown
    .replace(/^\s*import\s.+?;?\s*$/gm, "")
    .replace(/^\s*export\s+\{?.*?;?\s*$/gm, "")
    .replace(/<Callout(?:\s+type=["']([^"']+)["'])?[^>]*>\s*([\s\S]*?)\s*<\/Callout>/g, (_, type: string | undefined, content: string) =>
      formatCallout(type, content),
    )
    .replace(/<\/?Accordions>\s*/g, "")
    .replace(/<Accordion\s+title=["']([^"']+)["'][^>]*>\s*([\s\S]*?)\s*<\/Accordion>/g, (_, title: string, content: string) =>
      formatTitledBlock(title, content),
    )
    .replace(/<Tabs[^>]*>\s*/g, "")
    .replace(/<\/Tabs>\s*/g, "")
    .replace(/<Tab\s+value=["']([^"']+)["'][^>]*>\s*([\s\S]*?)\s*<\/Tab>/g, (_, value: string, content: string) =>
      formatTitledBlock(value, content),
    )
    .replace(/<Steps>\s*([\s\S]*?)\s*<\/Steps>/g, (_, content: string) => {
      const steps = [...content.matchAll(/<Step>\s*([\s\S]*?)\s*<\/Step>/g)].map((match, index) =>
        formatStep(index + 1, match[1]),
      );

      return steps.join("\n\n");
    })
    .replace(/^\s*<\/?[A-Z][^>]*>\s*$/gm, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export function normalizeMDXForLLMs(markdown: string) {
  const normalized = markdown
    .replace(/\r\n/g, "\n")
    .replace(/^---\n[\s\S]*?\n---\n*/u, "");
  const segments = normalized.split(/(```[\s\S]*?```)/g);

  return segments
    .map((segment) => {
      if (segment.startsWith("```")) {
        return stripFenceMetadata(segment).trim();
      }

      return normalizeProseChunk(segment).trim();
    })
    .filter(Boolean)
    .join("\n\n")
    .replace(/\n---\n/g, "\n\n---\n\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export async function getLLMText(page: LLMReadablePage) {
  const getText = page.data.getText;
  if (!getText) {
    throw new Error(
      "Processed markdown is unavailable. Enable includeProcessedMarkdown in the Fumadocs collection.",
    );
  }

  const markdown = normalizeMDXForLLMs(await getText("processed"));
  const pageUrl = createCanonical(page.url);
  const markdownUrl = createCanonical(`${page.url}.mdx`);

  return `# ${page.data.title}
URL: ${pageUrl}
Markdown URL: ${markdownUrl}

${page.data.description ?? ""}

${markdown}`;
}
