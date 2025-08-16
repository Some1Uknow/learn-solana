import { z } from "zod";

// AI SDK 5: Input schema for searchDocumentation tool
export const searchDocumentationInputSchema = z.object({
  query: z
    .string()
    .describe(
      "The search query to find relevant documentation content. Be specific and include key terms related to the user's question."
    ),
});

// AI SDK 5: Output schema for searchDocumentation tool (enables type safety)
export const searchDocumentationOutputSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  totalSections: z.number().optional(),
  content: z.array(z.object({
    sourceNumber: z.number(),
    content: z.string(),
    relevanceScore: z.number(),
    pageTitle: z.string(),
    pageUrl: z.string(),
    sectionTitle: z.string().nullable(), // Database field is nullable
    headingId: z.string().nullable(), // Database field is nullable  
    url: z.string(),
    citation: z.string(),
    headingLevel: z.number().nullable(), // Database field can be null
    chunkIndex: z.number(),
    module: z.string().optional(), // Computed field, can be undefined
    contentType: z.string(),
  })).optional(),
  sourcesByPage: z.record(z.string(), z.object({
    pageTitle: z.string(),
    pageUrl: z.string(),
    baseUrl: z.string(),
    sections: z.array(z.any()),
  })).optional(),
  instructions: z.string().optional(),
  suggestion: z.string().optional(),
  error: z.string().optional(),
});

export type SearchDocumentationInput = z.infer<typeof searchDocumentationInputSchema>;
export type SearchDocumentationOutput = z.infer<typeof searchDocumentationOutputSchema>;
