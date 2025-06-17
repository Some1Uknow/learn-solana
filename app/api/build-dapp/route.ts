import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { streamObject } from "ai";
import { dappBuilderSchema } from "./schema";
import { NextResponse } from "next/server";

// Allow streaming responses up to 60 seconds
export const maxDuration = 60;

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error("GEMINI_API_KEY environment variable is not set");
}

// Create a Google Generative AI provider instance with the API key
const google = createGoogleGenerativeAI({ apiKey });

export async function POST(req: Request) {
  try {
    const { config, messages, files } = await req.json();
    
    // Initialize the Gemini model
    const model = google("gemini-2.0-flash");

    // Build our system prompt with improved instructions for balanced code generation
    const systemPrompt = `You are a Solana full-stack dApp developer assistant specializing in Next.js and Anchor/Rust. Your task is to help users build complete Solana dApps with smart contracts and frontends.

IMPORTANT RULES FOR CODE GENERATION:
1) Always generate BOTH contract files AND frontend files for every dApp request. The user should have a complete project.
2) Maintain EQUAL FOCUS on backend (Rust/Anchor) and frontend (Next.js) components.
3) ALWAYS use Next.js (App Router) as the frontend framework, with TypeScript and Tailwind CSS.
4) For Solana contracts, use the Anchor framework following best practices.
5) IMPORTANT: Structure ALL code as discrete files in a proper project structure.
6) When generating files, ensure they are clearly labeled with their type (contract or frontend).

For SMART CONTRACT files:
- Root project files like 'Anchor.toml'
- Contract source files in 'programs/[program-name]/src/...' (lib.rs, error.rs, etc.)
- Tests in 'tests/...'

For NEXT.JS files:
- Root project files like 'package.json', 'next.config.js', 'tsconfig.json', etc.
- Pages in 'app/...' following the App Router structure
- Components in 'components/...'
- Utilities in 'utils/...'
- Wallet and connection logic in 'contexts/...'

ALWAYS INCLUDE BOTH TYPES OF FILES in your response. The activeFile should start with a contract file, but you must include frontend files too. In your followUp message, explain both the smart contract architecture and the frontend implementation.`;

    // If this is a continuation of a conversation, use the existing files
    // if available to provide context to the model
    let fileContext = "";
    if (files && files.length > 0) {
      fileContext = "EXISTING FILES IN PROJECT:\n";
      files.forEach((file: any) => {
        fileContext += `${file.path} (${file.type}):\n`;
      });
    }

    // Create the message for the AI with dApp configuration
    const userMessage = config && config.contractType ? 
      `Generate a full Solana dApp with:
      
      Contract Type: ${config.contractType || "Custom"}
      Project Name: ${config.contractName || "My Solana dApp"}
      ${fileContext}

      Please provide ALL necessary files for BOTH the smart contract AND Next.js frontend. Include at least 2-3 frontend files and 2-3 contract files.` 
      : messages[messages.length - 1].content;

    // Create the full messages array with existing conversation history
    const fullMessages = messages && messages.length > 0 ? 
      messages : 
      [{ role: "user", content: userMessage }];

    console.log("Processing dApp Builder request:", {
      contractType: config?.contractType,
      contractName: config?.contractName,
      messageCount: fullMessages.length,
      existingFiles: files?.length || 0,
    });

    // Stream the response
    const result = streamObject({
      system: systemPrompt,
      model: model,
      schema: dappBuilderSchema,
      messages: fullMessages,
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error("dApp Builder API error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}