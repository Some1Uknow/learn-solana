import { openai } from "@ai-sdk/openai";
import { convertToModelMessages, streamText, stepCountIs } from "ai";
import { searchDocumentationTool } from "@/lib/ai/tools/searchDocumentation";
import { SYSTEM_PROMPT } from "@/lib/ai/prompts";
import * as jose from "jose";
import { headers } from "next/headers";

export const maxDuration = 30;

async function verifyAuthentication(req: Request): Promise<{ isAuthenticated: boolean; user?: any }> {
  try {
    // Get Authorization header
    const authHeader = req.headers.get('authorization');
    let token = authHeader?.split(' ')[1];

    // Fallback to cookies if no Authorization header
    if (!token) {
      const headersList = await headers();
      const cookie = headersList.get('cookie');
      if (cookie) {
        const cookies = cookie.split(';').reduce((acc: any, cookie) => {
          const [key, value] = cookie.trim().split('=');
          acc[key] = value;
          return acc;
        }, {});
        token = cookies.web3auth_token;
      }
    }

    if (!token) {
      return { isAuthenticated: false };
    }

    // Verify JWT token
    const jwks = jose.createRemoteJWKSet(new URL('https://api-auth.web3auth.io/.well-known/jwks.json'));
    const { payload } = await jose.jwtVerify(token, jwks, { algorithms: ['ES256'] });

    return { 
      isAuthenticated: true, 
      user: {
        sub: payload.sub,
        email: payload.email,
        name: payload.name
      }
    };
  } catch (error) {
    console.error('Authentication verification failed:', error);
    return { isAuthenticated: false };
  }
}

export async function POST(req: Request) {
  try {
    // Verify authentication first
    const authResult = await verifyAuthentication(req);
    
    if (!authResult.isAuthenticated) {
      return new Response(
        JSON.stringify({ 
          error: 'Authentication required',
          message: 'Please log in to access the AI chat assistant.' 
        }), 
        { 
          status: 401, 
          headers: { 'Content-Type': 'application/json' } 
        }
      );
    }

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

    // Add user context to system prompt
    const enhancedSystemPrompt = `${SYSTEM_PROMPT}

User Context:
- User: ${authResult.user?.name || 'Anonymous'}
- Email: ${authResult.user?.email || 'N/A'}
- Authenticated: Yes

Please provide personalized assistance and remember that this user is authenticated and has access to premium features.`;

    const result = streamText({
      model: openai("gpt-4o"),
      messages: convertToModelMessages(messages),
      temperature: 0.1,
      system: enhancedSystemPrompt,
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
