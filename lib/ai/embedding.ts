import { embed } from "ai";
import { openai } from "@ai-sdk/openai";
import { db } from "../db";
import { cosineDistance, desc, gt, sql } from "drizzle-orm";
import { embeddings } from "../db/schema/embeddings";
import { config } from "dotenv";

config({ path: ".env" }); // Load environment variables from .env

const embeddingModel = openai.embedding("text-embedding-ada-002");

// export const generateEmbeddings = async (
//   value: string
// ): Promise<Array<{ embedding: number[]; content: string }>> => {
//   const chunks = generateChunks(value);

//   if (chunks.length === 0) {
//     return [];
//   }

//   const { embeddings: embeddingResults } = await embedMany({
//     model: embeddingModel,
//     values: chunks,
//   });

//   return embeddingResults.map((e, i) => ({
//     content: chunks[i],
//     embedding: e,
//   }));
// };

export const generateEmbedding = async (value: string): Promise<number[]> => {
  if (!value || typeof value !== 'string') {
    throw new Error('Invalid input: value must be a non-empty string');
  }
  
  const input = value.replaceAll("\\n", " ");
  const { embedding } = await embed({
    model: embeddingModel,
    value: input,
  });
  return embedding;
};

export const findRelevantContent = async (userQuery: string) => {
  try {
    if (!userQuery || typeof userQuery !== 'string') {
      console.log('Invalid query provided to findRelevantContent');
      return [];
    }

    const userQueryEmbedded = await generateEmbedding(userQuery);
    const similarity = sql<number>`1 - (${cosineDistance(
      embeddings.embedding,
      userQueryEmbedded
    )})`;

    const similarContent = await db
      .select({
        content: embeddings.content,
        similarity,
        resourceId: embeddings.resourceId,
      })
      .from(embeddings)
      .where(gt(similarity, 0.7)) 
      .orderBy((t) => desc(t.similarity))
      .limit(5);

    return similarContent;
  } catch (error) {
    console.error("Error finding relevant content:", error);
    return [];
  }
};
