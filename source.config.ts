import { defineDocs } from 'fumadocs-mdx/config';

export const docs = defineDocs({
  dir: 'content',
});

// Dedicated collection for coding challenges content (MDX only rendering)
export const challenges = defineDocs({
  dir: 'content/challenges',
});