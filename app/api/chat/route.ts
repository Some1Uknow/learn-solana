import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { streamText } from "ai";
import { NextResponse } from "next/server";

// Allow streaming responses up to 30 seconds
export const maxDuration = 40;

// Get the API key from environment variables
const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error("GEMINI_API_KEY environment variable is not set");
}

// Create a Google Generative AI provider instance with the API key
const google = createGoogleGenerativeAI({ apiKey });

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    if (!messages?.length) {
      return NextResponse.json(
        { error: "Messages are required" },
        { status: 400 }
      );
    }

    // Get the model instance using the provider
    const model = google("gemini-1.5-flash"); // Use a valid model ID

    // Call the streamText API
    const result = streamText({
      system:
        "You are learn.sol AI bot. Users can ask you anything about Solana, Rust, Anchor, or web3 development and your job is to answer it with perfection (detailed answer, easy language yet technical, conclusive advice).",
      model,
      messages: messages, // Assuming messages are already in the correct format for AI SDK
      // Add generationConfig if needed, mapping from the old format
      // generationConfig: {
      //   maxOutputTokens: 1000,
      //   temperature: 0.7,
      //   topP: 0.95,
      // },
    });

    // Return the stream using the correct method
    return result.toDataStreamResponse();
  } catch (error) {
    console.error("Chat API error:", error);
    // Use a generic error message for security
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
