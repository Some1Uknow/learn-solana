import { openai } from "@ai-sdk/openai";
import { convertToModelMessages, streamText, stepCountIs } from "ai";
import { searchDocumentationTool } from "@/lib/ai/tools/searchDocumentation";
import { SYSTEM_PROMPT } from "@/lib/ai/prompts";

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const result = streamText({
      model: openai("gpt-4o"),
      messages: convertToModelMessages(messages),
      temperature: 0.1,
      system: SYSTEM_PROMPT,
      tools: {
        searchDocumentation: searchDocumentationTool,
      },
      toolChoice: "auto", // Allow model to choose when to use tools
      stopWhen: stepCountIs(5), // AI SDK 5: Enable multi-step tool calling loop (up to 5 steps)
      onStepFinish: ({ toolCalls, toolResults, text, finishReason }) => {
        // AI SDK 5: Log step completion for debugging
        console.log("🎯 Step finished:", {
          toolCallsCount: toolCalls?.length || 0,
          toolResultsCount: toolResults?.length || 0,
          hasText: !!text,
          finishReason,
          stepComplete: true,
        });
      },
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error("Chat API error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
