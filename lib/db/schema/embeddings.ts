import { nanoid } from 'nanoid';
import { index, integer, pgTable, text, varchar, vector } from 'drizzle-orm/pg-core';
import { resources } from './resources';

export const embeddings = pgTable(
  'embeddings',
  {
    id: varchar('id', { length: 191 }).primaryKey().$defaultFn(() => nanoid()),
    resourceId: varchar('resource_id', { length: 191 }).references(
      () => resources.id,
      { onDelete: 'cascade' }
    ),
    content: text('content').notNull(),
    embedding: vector('embedding', { dimensions: 1536 }).notNull(),
    
    // Enhanced citation support
    pageUrl: text('page_url').notNull(), // /learn/week-1
    pageTitle: text('page_title').notNull(), // "A Beginners Guide to Solana Architecture"
    sectionTitle: text('section_title'), // "Proof of History: A Clock Before Consensus"
    headingId: text('heading_id'), // "proof-of-history-a-clock-before-consensus"
    chunkIndex: integer('chunk_index').notNull().default(0),
    headingLevel: integer('heading_level').default(1), // 1-6 for h1-h6
  },
  table => ({
    embeddingIndex: index('embeddingIndex').using(
      'hnsw',
      table.embedding.op('vector_cosine_ops')
    ),
  })
);

export type Embedding = typeof embeddings.$inferSelect;
export type NewEmbedding = typeof embeddings.$inferInsert;
