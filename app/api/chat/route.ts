import { openai } from "@ai-sdk/openai";
import { convertToModelMessages, streamText, stepCountIs } from "ai";
import { searchDocumentationTool } from "@/lib/ai/tools/searchDocumentation";
import { SYSTEM_PROMPT } from "@/lib/ai/prompts";
import { requirePrivyUser } from "@/lib/auth/privy-server";
import { syncAppUser } from "@/lib/auth/app-user";

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const verified = await requirePrivyUser(req);
    if (!verified) {
      return new Response(
        JSON.stringify({
          error: "Unauthorized",
          message: "Sign in to use the LearnSol assistant.",
        }),
        {
          status: 401,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    await syncAppUser({
      privyUserId: verified.userId,
    });

    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return new Response(
        JSON.stringify({ 
          error: 'Invalid request',
          message: 'Messages array is required.' 
        }), 
        { 
          status: 400, 
          headers: { 'Content-Type': 'application/json' } 
        }
      );
    }

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
