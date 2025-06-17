import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { streamObject } from "ai";
import { contractSchema } from "./schema";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error("GEMINI_API_KEY environment variable is not set");
}

// Create a Google Generative AI provider instance with the API key
const google = createGoogleGenerativeAI({ apiKey });

export async function POST(req: Request) {
  const { messages } = await req.json();
  console.log("Messages", messages);
  const model = google("gemini-2.0-flash"); // Use a valid model ID

  const result = streamObject({
    system:
      "You are a smart contract generator for Solana (Anchor) . IMPORTANT RULES: 1) ONLY generate new or updated contract code when the user EXPLICITLY asks for changes or new code. 2) If the user is just asking questions or providing feedback but NOT requesting code changes, set codeChanged to false and return the EXACT SAME code that was previously provided. 3) When generating new or modified code, set codeChanged to true. 4) Preserve all code exactly as-is unless specifically instructed to modify it. 5) In your follow-up message, clearly state whether you've made changes to the code or kept it unchanged. Remember: consistency is critical - users expect stable output until they request changes.",
    model: model,
    schema: contractSchema,
    messages,
  });

  console.log("RESULT", result);

  return result.toTextStreamResponse();
}
