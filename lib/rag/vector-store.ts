import { embed, embedMany } from 'ai';
import { openai } from '@ai-sdk/openai';

// Simple in-memory vector store for demonstration
const vectorStore: { embedding: number[]; text: string; source: string }[] = [];

const embeddingModel = openai.embedding('text-embedding-3-small');

export async function generateAndStoreEmbeddings(chunks: { text: string; source: string }[]) {
  const { embeddings } = await embedMany({
    model: embeddingModel,
    values: chunks.map((chunk) => chunk.text),
  });

  chunks.forEach((chunk, i) => {
    vectorStore.push({ embedding: embeddings[i], ...chunk });
  });
}

export async function searchSimilarDocuments(query: string, topK = 3) {
  const { embedding: queryEmbedding } = await embed({
    model: embeddingModel,
    value: query,
  });

  const results = vectorStore
    .map((item) => ({
      ...item,
      similarity: cosineSimilarity(queryEmbedding, item.embedding),
    }))
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, topK);

  return results;
}

function cosineSimilarity(vecA: number[], vecB: number[]) {
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}