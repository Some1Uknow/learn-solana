import { openai } from '@ai-sdk/openai';
import {
  experimental_createMCPClient as createMCPClient,
  InvalidToolArgumentsError,
  Message,
  NoSuchToolError,
  smoothStream,
  streamText,
  ToolExecutionError,
} from 'ai';
import { NextRequest } from 'next/server';
import { chunkText, readFilesRecursively } from '@/lib/rag/file-reader';
import {
  generateAndStoreEmbeddings,
  searchSimilarDocuments,
} from '@/lib/rag/vector-store';
import path from 'path';

// Initialize RAG setup on startup
(async () => {
  const contentPath = path.join(process.cwd(), 'content');
  const docFiles = await readFilesRecursively(contentPath);
  const chunks = docFiles.flatMap((file) =>
    chunkText(file.content).map((text) => ({
      text,
      source: path.relative(contentPath, file.filePath),
    })),
  );
  await generateAndStoreEmbeddings(chunks);
})();

export async function POST(request: NextRequest) {
  const { messages }: { messages: Array<Message> } = await request.json();

  const lastUserMessage = messages[messages.length - 1]?.content;
  if (typeof lastUserMessage !== 'string') {
    return Response.json({ error: 'Invalid user message' }, { status: 400 });
  }

  const similarDocs = await searchSimilarDocuments(lastUserMessage);
  const context = similarDocs
    .map((doc) => `Source: ${doc.source}\n\n${doc.text}`)
    .join('\n\n---\n\n');

  try {
    const client = await createMCPClient({
      transport: {
        type: 'sse',
        url: 'https://mcp-on-vercel.vercel.app/sse',
      },
      onUncaughtError: (error) => {
        console.error('MCP Client error:', error);
      },
    });

    const toolSet = await client.tools();
    const tools = { ...toolSet };

    const result = streamText({
      // todo: add models.ts file
      model: openai('gpt-4o'),
      tools,
      maxSteps: 10,
      experimental_transform: [
        smoothStream({
          chunking: 'word',
        }),
      ],
      onStepFinish: async ({ toolResults }) => {
        console.log(`Step Results: ${JSON.stringify(toolResults, null, 2)}`);
      },
      onFinish: async () => {
        client.close();
      },
      onError: async () => {
        client.close();
      },
      system: `You are an AI assistant for a Solana learning platform. Your role is to help users with their questions about Solana development based on the provided documentation. Answer the user's question based *only* on the context below. If the context doesn't contain the answer, say that you don't have enough information. Do not use any other knowledge. For each piece of information you provide, you MUST cite the source file in the format [Source: path/to/file].\n\n---\n\nCONTEXT:\n${context}`,
      messages,
    });

    return result.toDataStreamResponse({
      getErrorMessage: (error) => {
        if (NoSuchToolError.isInstance(error)) {
          return 'The model tried to call a unknown tool.';
        } else if (InvalidToolArgumentsError.isInstance(error)) {
          return 'The model called a tool with invalid arguments.';
        } else if (ToolExecutionError.isInstance(error)) {
          console.log(error);
          return `An error occurred during tool execution. ${error}`;
        } else {
          return `An unknown error occurred. ${error} `;
        }
      },
    });
  } catch (error) {
    console.error(error);
    return Response.json({ error: 'Failed to generate text' });
  }
}