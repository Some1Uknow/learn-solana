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
      system: `You are a documentation assistant for Learn Solana. Your primary role is to help users by searching and citing the Learn Solana documentation with precision and accuracy.

CRITICAL CITATION RULES:
1. For ANY question about Solana, development, programming concepts, or technical topics, you MUST use the searchDocumentation tool first
2. AFTER using the tool and receiving results, you MUST ALWAYS provide a comprehensive response based on those results
3. NEVER provide answers from your general knowledge without searching the documentation first
4. ALWAYS cite sources using this exact format: [Source X: PageTitle - SectionTitle] 
5. When referencing specific concepts, include direct anchor links: "Learn more about [Proof of History](https://learn.sol/learn/week-1#proof-of-history-a-clock-before-consensus)"
6. If multiple sources support a point, reference them: [Sources 1-3]
7. At the end of responses, provide a "References" section with clickable links

MANDATORY RESPONSE FLOW:
1. ALWAYS use searchDocumentation tool first for any technical question
2. WAIT for search results
3. IMMEDIATELY provide a detailed response based on the search results (NEVER skip this step)
4. Include proper citations throughout your response
5. End with a "References" section listing all sources
6. If search finds no results, still provide a helpful response explaining this and suggesting alternatives

RESPONSE STRUCTURE (REQUIRED):
- Start with a direct answer to the user's question based on search results
- Include relevant details and examples from the documentation
- Provide proper citations for each claim
- End with clickable references

NEVER:
- Use the tool and then remain silent
- Skip providing a response after receiving search results
- Provide responses without using the tool first for technical questions

Remember: ALWAYS respond after using the searchDocumentation tool, even if results are limited.`,
      tools: {
        searchDocumentation: tool({
          description:
            "REQUIRED: Search the Learn Solana documentation for any technical question. This tool must be used for all Solana-related queries and provides detailed source information for citations.",
          inputSchema: z.object({
            query: z
              .string()
              .describe(
                "The search query to find relevant documentation content. Be specific and include key terms related to the user's question."
              ),
          }),
          execute: async ({ query }) => {
            console.log("🔍 Searching documentation for:", query);

            try {
              const relevantContent = await findRelevantContent(query);
              console.log(
                "📚 Found relevant content chunks:",
                relevantContent.length
              );

              if (relevantContent.length === 0) {
                return {
                  success: false,
                  message:
                    "No relevant documentation found for this query in the Learn Solana documentation.",
                  content: [],
                  suggestion:
                    "Try rephrasing your question or ask about a more specific Solana concept. You can also browse the documentation directly at the provided URLs.",
                };
              }

              // Format content with comprehensive source information for perfect citations
              const formattedContent = relevantContent.map((item, index) => {
                // Build the full URL with anchor if section exists
                const baseUrl = `https://learn.sol${item.pageUrl}`;
                const fullUrl = item.headingId
                  ? `${baseUrl}#${item.headingId}`
                  : baseUrl;

                // Create citation text with better formatting
                const citation = item.sectionTitle
                  ? `${item.pageTitle} - ${item.sectionTitle}`
                  : item.pageTitle;

                return {
                  sourceNumber: index + 1,
                  content: item.content.trim(),
                  relevanceScore: Math.round(item.similarity * 100),
                  pageTitle: item.pageTitle,
                  pageUrl: item.pageUrl,
                  sectionTitle: item.sectionTitle,
                  headingId: item.headingId,
                  url: fullUrl,
                  citation: citation,
                  headingLevel: item.headingLevel,
                  chunkIndex: item.chunkIndex,
                  // Enhanced metadata for better citations
                  module: item.pageTitle.includes("Week")
                    ? item.pageTitle.match(/Week \d+/)?.[0]
                    : "Core Concepts",
                  contentType: item.pageUrl.includes("exercise")
                    ? "Exercise"
                    : item.pageUrl.includes("project")
                    ? "Project"
                    : item.pageUrl.includes("challenge")
                    ? "Challenge"
                    : "Theory",
                };
              });

              // Group sources by page for better organization
              const sourcesByPage = formattedContent.reduce((acc, source) => {
                const pageKey = source.pageUrl;
                if (!acc[pageKey]) {
                  acc[pageKey] = {
                    pageTitle: source.pageTitle,
                    pageUrl: source.pageUrl,
                    baseUrl: `https://learn.sol${source.pageUrl}`,
                    sections: [],
                  };
                }
                acc[pageKey].sections.push(source);
                return acc;
              }, {} as Record<string, any>);

              return {
                success: true,
                message: `Found ${relevantContent.length} highly relevant documentation sections with similarity scores above 70%.`,
                totalSections: relevantContent.length,
                content: formattedContent,
                sourcesByPage,
                instructions: `
IMMEDIATE ACTION REQUIRED:
You MUST now provide a comprehensive response based on these search results. Do not remain silent after receiving this data.

CITATION INSTRUCTIONS:
- Use [Source X: PageTitle - SectionTitle] format for citations
- Include anchor links for specific sections: [concept](URL#anchor)
- Group related information and cite multiple sources when relevant
- Always end with a References section containing all clickable links
- Base your entire response on these search results only

SEARCH RESULTS ANALYSIS:
- ${relevantContent.length} sources found
- Average relevance: ${Math.round(
                  (relevantContent.reduce(
                    (sum, item) => sum + item.similarity,
                    0
                  ) /
                    relevantContent.length) *
                    100
                )}%
- Sources span ${Object.keys(sourcesByPage).length} different pages

RESPONSE FORMAT EXAMPLE:
"Based on the documentation, [answer the user's question] [Source 1: PageTitle]. 

[Provide more details] [Source 2: PageTitle - SectionTitle].

References:
- [Source 1 Title](URL)
- [Source 2 Title](URL)"
                `,
              };
            } catch (error) {
              console.error("❌ Error in searchDocumentation tool:", error);
              return {
                success: false,
                message: "Error occurred while searching documentation.",
                error: error instanceof Error ? error.message : "Unknown error",
                content: [],
                suggestion:
                  "Please try rephrasing your question or contact support if the issue persists.",
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
