import { tool } from "ai";
import { findRelevantContent } from "@/lib/ai/embedding";
import { 
  searchDocumentationInputSchema,
  type SearchDocumentationOutput 
} from "@/lib/ai/schemas";

export const searchDocumentationTool = tool({
  description:
    "REQUIRED: Search the Learn Solana documentation for any technical question. This tool must be used for all Solana-related queries and provides detailed source information for citations.",
  inputSchema: searchDocumentationInputSchema,
  execute: async ({ query }): Promise<SearchDocumentationOutput> => {
    console.log("🔍 Searching documentation for:", query);

    try {
      const relevantContent = await findRelevantContent(query);
      console.log("📚 Found relevant content chunks:", relevantContent.length);

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
        // Build the full URL with anchor if section exists (use www for canonical consistency)
        const baseUrl = `https://www.learnsol.site${item.pageUrl}`;
        const fullUrl = item.headingId ? `${baseUrl}#${item.headingId}` : baseUrl;

        // Create citation text with better formatting
        const citation = item.sectionTitle ? `${item.pageTitle} - ${item.sectionTitle}` : item.pageTitle;

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
          module: item.pageTitle.includes("Week") ? item.pageTitle.match(/Week \d+/)?.[0] : "Core Concepts",
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
- Average relevance: ${Math.round((relevantContent.reduce((sum, item) => sum + item.similarity, 0) / relevantContent.length) * 100)}%
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
});
