import type { Engine, MessageRecord } from '@/components/fumadocs/ai/context';
import { callChatApi } from '@ai-sdk/ui-utils';
import { generateId } from 'ai';
import type { Message } from "ai";

export async function createAiSdkEngine(): Promise<Engine> {
  let messages: Message[] = [];
  let controller: AbortController | null = null;

  async function fetchStream(
    userMessages: Message[],
    onUpdate?: (full: string) => void,
    onEnd?: (full: string) => void,
  ) {
    controller = new AbortController();

    try {
      let textContent = '';

      await callChatApi({
        api: '/api/chat',
        body: {
          messages: userMessages.map((msg) => ({
            role: msg.role,
            content: msg.content,
          })),
        },
        streamProtocol: 'data',
        credentials: undefined,
        headers: undefined,
        abortController: () => controller,
        restoreMessagesOnFailure() {
          messages = messages.slice(0, messages.length - 1);
        },
        onResponse: undefined,
        onUpdate({ message }) {
          const lastMessage = messages[messages.length - 1];
          const replaceLastMessage = lastMessage?.role === 'assistant';

          messages = [
            ...(replaceLastMessage
              ? messages.slice(0, messages.length - 1)
              : messages),
            message
          ];
          textContent = message.content;
          onUpdate?.(textContent);
        },
        onToolCall({ toolCall }) {
          console.log('calling tool', toolCall.toolName);
        },
        onFinish(message) {
          onEnd?.(message?.content || '');
        },
        generateId,
        fetch,
        lastMessage: messages[messages.length - 1] ? {
          ...messages[messages.length - 1],
          parts: messages[messages.length - 1].parts ?? [],
        } : undefined,
      });

      return textContent;
    } catch (error) {
      if (error instanceof Error && error.name !== 'AbortError') {
        controller = null;
        console.error('Error in AI stream:', error);
        const errorMessage = 'Sorry, an error occurred while generating a response.';
        onEnd?.(errorMessage);
        return errorMessage;
      }
      return '';
    }
  }

  return {
    async prompt(text, onUpdate, onEnd) {
      messages.push({
        id: generateId(),
        role: 'user',
        content: text,
      });

      await fetchStream(messages, onUpdate, onEnd);
    },
    async regenerateLast(onUpdate, onEnd) {
      const last = messages.at(-1);
      if (!last || last.role === 'user') {
        return;
      }

      messages.pop();

      await fetchStream(messages, onUpdate, onEnd);
    },
    getHistory() {
      return messages as MessageRecord[];
    },
    clearHistory() {
      messages = [];
    },
    abortAnswer() {
      controller?.abort();
    },
  };
}