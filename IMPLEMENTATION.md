## Complete Implementation Guide: FUMA Docs + AI SDK RAG Chatbot

### Architecture Overview

Your RAG chatbot will work by embedding your MDX files into chunks, storing them in a vector database, and then retrieving relevant context when users ask questions. The ingestion process fetches source documents, breaks them up into smaller chunks, and creates an embedding (vector) for each. Embeddings are stored in a vector database along with the original chunk text.

### Tech Stack

- **Next.js 14** (App Router) 
- **AI SDK** by Vercel for LLM interactions
- **PostgreSQL** with **pgvector** for vector storage
- **Drizzle ORM** for database management
- **OpenAI** for embeddings and chat completion
- **MDX processing** for documentation content

### Step 1: Project Setup

```bash
# Install core dependencies
npm install ai @ai-sdk/react @ai-sdk/openai
npm install drizzle-orm drizzle-kit pg @types/pg
npm install @mdx-js/loader @mdx-js/react
npm install pgvector
```

### Step 2: Database Schema Setup

Create your database schemas for storing MDX content and embeddings:

```typescript
// lib/db/schema/resources.ts
import { nanoid } from '@/lib/utils';
import { pgTable, text, timestamp, varchar } from 'drizzle-orm/pg-core';

export const resources = pgTable('resources', {
  id: varchar('id', { length: 191 }).primaryKey().$defaultFn(() => nanoid()),
  content: text('content').notNull(),
  filePath: varchar('file_path', { length: 500 }).notNull(),
  title: varchar('title', { length: 500 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// lib/db/schema/embeddings.ts
import { index, pgTable, text, varchar, vector } from 'drizzle-orm/pg-core';
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
  },
  table => ({
    embeddingIndex: index('embeddingIndex').using(
      'hnsw',
      table.embedding.op('vector_cosine_ops')
    ),
  })
);
```

### Step 3: MDX Processing and Chunking

Create a system to process your MDX files and extract content:

```typescript
// lib/mdx/processor.ts
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { serialize } from 'next-mdx-remote/serialize';

export interface MDXContent {
  content: string;
  frontmatter: Record<string, any>;
  filePath: string;
  title: string;
}

export async function processMDXFiles(docsDirectory: string): Promise<MDXContent[]> {
  const files = getAllMDXFiles(docsDirectory);
  const processedFiles: MDXContent[] = [];

  for (const filePath of files) {
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const { data: frontmatter, content } = matter(fileContent);
    
    // Clean content from MDX syntax for better embedding
    const cleanContent = content
      .replace(/^import\s+.*$/gm, '') // Remove import statements
      .replace(/^export\s+.*$/gm, '') // Remove export statements
      .replace(/<[^>]*>/g, '') // Remove HTML tags
      .replace(/\{[^}]*\}/g, '') // Remove JSX expressions
      .trim();

    processedFiles.push({
      content: cleanContent,
      frontmatter,
      filePath: path.relative(docsDirectory, filePath),
      title: frontmatter.title || path.basename(filePath, '.mdx'),
    });
  }

  return processedFiles;
}

function getAllMDXFiles(dir: string): string[] {
  const files: string[] = [];
  const items = fs.readdirSync(dir);

  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      files.push(...getAllMDXFiles(fullPath));
    } else if (item.endsWith('.mdx') || item.endsWith('.md')) {
      files.push(fullPath);
    }
  }

  return files;
}

// Advanced chunking for better context
export function generateChunks(input: string, maxChunkSize: number = 1000): string[] {
  const sentences = input.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const chunks: string[] = [];
  let currentChunk = '';

  for (const sentence of sentences) {
    if ((currentChunk + sentence).length <= maxChunkSize) {
      currentChunk += sentence.trim() + '. ';
    } else {
      if (currentChunk) {
        chunks.push(currentChunk.trim());
      }
      currentChunk = sentence.trim() + '. ';
    }
  }

  if (currentChunk) {
    chunks.push(currentChunk.trim());
  }

  return chunks.filter(chunk => chunk.length > 50); // Filter out very small chunks
}
```

### Step 4: Embedding Generation

Create embedding functions to generate vector representations of your content:

```typescript
// lib/ai/embedding.ts
import { embed, embedMany } from 'ai';
import { openai } from '@ai-sdk/openai';
import { db } from '../db';
import { cosineDistance, desc, gt, sql } from 'drizzle-orm';
import { embeddings } from '../db/schema/embeddings';
import { generateChunks } from '../mdx/processor';

const embeddingModel = openai.embedding('text-embedding-ada-002');

export const generateEmbeddings = async (
  value: string,
): Promise<Array<{ embedding: number[]; content: string }>> => {
  const chunks = generateChunks(value);
  const { embeddings } = await embedMany({
    model: embeddingModel,
    values: chunks,
  });
  return embeddings.map((e, i) => ({
    content: chunks[i],
    embedding: e
  }));
};

export const generateEmbedding = async (value: string): Promise<number[]> => {
  const input = value.replaceAll('\\n', ' ');
  const { embedding } = await embed({
    model: embeddingModel,
    value: input,
  });
  return embedding;
};

export const findRelevantContent = async (userQuery: string) => {
  const userQueryEmbedded = await generateEmbedding(userQuery);
  const similarity = sql<number>`1 - (${cosineDistance(
    embeddings.embedding,
    userQueryEmbedded,
  )})`;
  
  const similarContent = await db
    .select({
      content: embeddings.content,
      similarity,
      resourceId: embeddings.resourceId
    })
    .from(embeddings)
    .where(gt(similarity, 0.7)) // Higher threshold for better relevance
    .orderBy(t => desc(t.similarity))
    .limit(5);
    
  return similarContent;
};
```

### Step 5: Content Ingestion Script

Create a script to process and ingest your MDX files:

```typescript
// scripts/ingest-docs.ts
import { processMDXFiles } from '../lib/mdx/processor';
import { generateEmbeddings } from '../lib/ai/embedding';
import { db } from '../lib/db';
import { resources, embeddings } from '../lib/db/schema';

async function ingestDocumentation() {
  const docsPath = './content/docs'; // Adjust to your docs path
  console.log('Processing MDX files...');
  
  const mdxFiles = await processMDXFiles(docsPath);
  
  for (const file of mdxFiles) {
    console.log(`Processing: ${file.filePath}`);
    
    // Create resource record
    const [resource] = await db
      .insert(resources)
      .values({
        content: file.content,
        filePath: file.filePath,
        title: file.title,
      })
      .returning();
    
    // Generate embeddings
    const fileEmbeddings = await generateEmbeddings(file.content);
    
    // Store embeddings
    await db.insert(embeddings).values(
      fileEmbeddings.map(embedding => ({
        resourceId: resource.id,
        ...embedding,
      }))
    );
    
    console.log(`✅ Processed ${file.filePath} with ${fileEmbeddings.length} chunks`);
  }
  
  console.log('Documentation ingestion complete!');
}

ingestDocumentation().catch(console.error);
```

### Step 6: API Route for Chat

Create the chat API route with tools for querying your knowledge base:

```typescript
// app/api/chat/route.ts
import { openai } from '@ai-sdk/openai';
import { convertToModelMessages, streamText, tool, UIMessage } from 'ai';
import { z } from 'zod';
import { findRelevantContent } from '@/lib/ai/embedding';

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const result = streamText({
    model: openai('gpt-4o'),
    messages: convertToModelMessages(messages),
    system: `You are a helpful documentation assistant for FUMA docs. 
    
    Always search your knowledge base before answering questions about documentation.
    When providing answers, include relevant code examples and explain concepts clearly.
    If the information isn't in your knowledge base, clearly state that and suggest where users might find more information.
    
    Format your responses in clear sections with headings when appropriate.
    Use code blocks for any code examples.`,
    
    tools: {
      searchDocumentation: tool({
        description: 'Search the documentation knowledge base for relevant information',
        parameters: z.object({
          query: z.string().describe('The search query or question to find relevant documentation'),
        }),
        execute: async ({ query }) => {
          const results = await findRelevantContent(query);
          return results.map(r => ({
            content: r.content,
            similarity: r.similarity,
          }));
        },
      }),
    },
    maxSteps: 3, // Allow multi-step tool calls
  });

  return result.toUIMessageStreamResponse();
}
```

### Step 7: FUMA Docs Integration

Integrate the chatbot into your FUMA docs layout:

```tsx
// components/docs-chat.tsx
'use client';

import { useChat } from '@ai-sdk/react';
import { defaultChatStoreOptions } from 'ai';
import { useState } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';

export default function DocsChat() {
  const [isOpen, setIsOpen] = useState(false);
  
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    chatStore: defaultChatStoreOptions({
      api: '/api/chat',
      maxSteps: 3,
    }),
  });

  return (
    <>
      {/* Chat Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg z-50"
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </button>

      {/* Chat Panel */}
      {isOpen && (
        <div className="fixed bottom-20 right-4 w-96 h-96 bg-white border border-gray-200 rounded-lg shadow-xl z-40 flex flex-col">
          <div className="bg-blue-600 text-white p-3 rounded-t-lg">
            <h3 className="font-semibold">Documentation Assistant</h3>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.length === 0 && (
              <div className="text-gray-500 text-sm">
                Ask me anything about the documentation!
              </div>
            )}
            
            {messages.map(m => (
              <div key={m.id} className="space-y-2">
                <div className={`p-2 rounded-lg max-w-[80%] ${
                  m.role === 'user' 
                    ? 'bg-blue-100 ml-auto' 
                    : 'bg-gray-100'
                }`}>
                  {m.parts.map((part, index) => {
                    if (part.type === 'text') {
                      return (
                        <div key={index} className="prose prose-sm max-w-none">
                          <ReactMarkdown>{part.text}</ReactMarkdown>
                        </div>
                      );
                    } else if (part.type === 'tool-call') {
                      return (
                        <div key={index} className="text-xs text-gray-500 italic">
                          Searching documentation...
                        </div>
                      );
                    }
                    return null;
                  })}
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="text-gray-500 text-sm">Thinking...</div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="p-3 border-t flex gap-2">
            <input
              value={input}
              onChange={handleInputChange}
              placeholder="Ask about the docs..."
              className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded disabled:opacity-50"
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
```

### Step 8: Environment Configuration

Set up your environment variables:

```env
# .env.local
OPENAI_API_KEY=your_openai_api_key
DATABASE_URL=your_postgres_connection_string
```

### Usage Instructions

1. **Initial Setup**:
   ```bash
   npm run db:push  # Create database tables
   npm run ingest-docs  # Process and embed your MDX files
   ```

2. **Development**:
   ```bash
   npm run dev
   ```

3. **Adding New Documentation**:
   - Add MDX files to your docs directory
   - Run the ingestion script again
   - The chatbot will automatically have access to new content

This implementation gives you a fully functional, context-aware documentation chatbot that processes your MDX files locally without relying on external paid services like INKEEP. The system uses RAG to provide accurate, contextual responses based on your documentation content.