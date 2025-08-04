import { openai } from "@ai-sdk/openai";
import { convertToModelMessages, streamText, tool } from "ai";
import { findRelevantContent } from "@/lib/ai/embedding";
import { z } from "zod";

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const result = streamText({
      model: openai("gpt-4o"),
      messages: convertToModelMessages(messages),
      temperature: 0.1,
      system: `You are a documentation assistant for Learn Solana. Your primary role is to help users by searching the Learn Solana documentation.

CRITICAL RULES:
1. For ANY question about Solana, development, programming concepts, or technical topics, you MUST use the searchDocumentation tool first
2. NEVER provide answers from your general knowledge without searching the documentation first
3. Always base your responses on the search results from the documentation
4. If the search finds no relevant information, clearly state that and suggest alternative resources

RESPONSE FORMAT:
- Always search the documentation using the tool
- Wait for search results before responding
- Base your answer on the documentation content found
- Include relevant code examples from the search results
- If no relevant documentation is found, say so explicitly

Remember: Your job is to be a documentation search assistant, not a general AI assistant.`,
      tools: {
        searchDocumentation: tool({
          description:
            "REQUIRED: Search the Learn Solana documentation for any technical question. This tool must be used for all Solana-related queries.",
          inputSchema: z.object({
            query: z
              .string()
              .describe(
                "The search query to find relevant documentation content. Be specific and include key terms."
              ),
          }),
          execute: async ({ query }) => {
            console.log("🔍 Searching documentation for:", query);

            try {
              const relevantContent = await findRelevantContent(query);
              console.log(
                "📚 Found relevant content chunks:",
                relevantContent
              );

              if (relevantContent.length === 0) {
                return {
                  success: false,
                  message:
                    "No relevant documentation found for this query in the Learn Solana documentation.",
                  content: [],
                  suggestion:
                    "Try rephrasing your question or ask about a more specific Solana concept.",
                };
              }

              const formattedContent = relevantContent.map((item, index) => ({
                section: `Section ${index + 1}`,
                content: item.content.trim(),
                relevanceScore: Math.round(item.similarity * 100),
                resourceId: item.resourceId,
              }));

              return {
                success: true,
                message: `Found ${relevantContent.length} relevant documentation sections with similarity scores.`,
                totalSections: relevantContent.length,
                content: formattedContent,
              };
            } catch (error) {
              console.error("❌ Error in searchDocumentation tool:", error);
              return {
                success: false,
                message: "Error occurred while searching documentation.",
                error: error instanceof Error ? error.message : "Unknown error",
                content: [],
              };
            }
          },
        }),
      },
      toolChoice: "auto", // Allow model to choose when to use tools
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error("Chat API error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
