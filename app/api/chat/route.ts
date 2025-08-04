import { ProvideLinksToolSchema } from "../../../lib/chat/inkeep-qa-schema";
import { openai } from "@ai-sdk/openai";
import { convertToModelMessages, streamText } from "ai";

export const runtime = "edge";

export async function POST(req: Request) {
  const reqJson = await req.json();
  console.log("Request JSON:", reqJson);

  const result = streamText({
    model: openai("gpt-4o-mini"),
    tools: {
      provideLinks: {
        inputSchema: ProvideLinksToolSchema,
      },
    },
    messages: convertToModelMessages(reqJson.messages, {
      ignoreIncompleteToolCalls: true,
    }),
    toolChoice: "auto",
  });

  return result.toUIMessageStreamResponse();
}
