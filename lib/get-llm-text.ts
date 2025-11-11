import { remark } from 'remark';
import remarkGfm from 'remark-gfm';
import remarkMdx from 'remark-mdx';
import { remarkInclude } from 'fumadocs-mdx/config';
import { source } from '@/lib/source';
import type { InferPageType } from 'fumadocs-core/source';

const processor = remark()
  .use(remarkMdx)
  // needed for Fumadocs MDX
  .use(remarkInclude)
  .use(remarkGfm);

export async function getLLMText(page: InferPageType<typeof source>) {
  const data = page.data as typeof page.data & {
    _file?: { absolutePath?: string; path?: string };
    content?: string;
  };
  const filePath =
    data._file?.absolutePath ??
    data._file?.path ??
    `${page.slugs.join("/") || "index"}.mdx`;
  const processed = await processor.process({
    path: filePath,
    value: data.content ?? "",
  });

  return `# ${page.data.title}
URL: ${page.url}

${page.data.description}

${processed.value}`;
}
