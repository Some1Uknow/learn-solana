'use client';
import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useEffectEvent } from 'fumadocs-core/utils/use-effect-event';

export interface Engine {
  prompt: (
    text: string,
    onUpdate?: (full: string) => void,
    onEnd?: (full: string) => void,
  ) => Promise<void>;

  abortAnswer: () => void;
  getHistory: () => MessageRecord[];
  clearHistory: () => void;
  regenerateLast: (
    onUpdate?: (full: string) => void,
    onEnd?: (full: string) => void,
  ) => Promise<void>;
}

export interface MessageRecord {
  role: 'user' | 'assistant';
  content: string;

  suggestions?: string[];
  references?: MessageReference[];
}

export interface MessageReference {
  breadcrumbs?: string[];
  title: string;
  description?: string;
  url: string;
}

export type EngineType = 'inkeep' | 'orama' | 'ai-sdk';
// removed inkeep and orama they wont work

const Context = createContext<{
  engine?: Engine;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  onSubmit: (message: string) => void;

  regenerateLast: () => void;
  abortAnswer: () => void;
  clearMessages: () => void;
} | null>(null);

const listeners: (() => void)[] = [];

function onUpdate() {
  for (const listener of listeners) listener();
}

export function AIProvider({
  type,
  children,
  loadEngine = false,
}: {
  type: EngineType;
  children: ReactNode;
  loadEngine?: boolean;
}) {
  const pendingRef = useRef(false);
  const [loading, setLoading] = useState(false);
  const [engine, setEngine] = useState<Engine>();
  const prevTypeRef = useRef<EngineType>(type);

  useEffect(() => {
    if (prevTypeRef.current !== type) {
      pendingRef.current = false;
      prevTypeRef.current = type;
      setEngine(undefined);
    }

    if (!loadEngine || pendingRef.current) return;
    pendingRef.current = true;

    // preload processor
    void import('./markdown-processor');

    try {
      if (type === 'ai-sdk') {
        void import('./engines/ai-sdk').then(async (res) => {
          setEngine(await res.createAiSdkEngine());
        });
      }
    } catch (error) {
      console.error('Failed to load engine:', error);
      pendingRef.current = false;
    }
  }, [type, loadEngine]);

  const onSubmit = useEffectEvent((message: string) => {
    if (!engine || message.length === 0) return;

    setLoading(true);
    void engine.prompt(message, onUpdate).finally(() => {
      setLoading(false);
    });
  });

  const regenerateLast = useEffectEvent(() => {
    if (!engine) return;

    setLoading(true);
    void engine.regenerateLast(onUpdate).finally(() => {
      setLoading(false);
    });
  });

  const clearMessages = useEffectEvent(() => {
    engine?.clearHistory();
    onUpdate();
  });

  return (
    <Context
      value={useMemo(
        () => ({
          loading,
          setLoading,
          onSubmit,
          engine,
          abortAnswer: () => engine?.abortAnswer(),
          regenerateLast,
          clearMessages,
        }),
        [loading, onSubmit, engine, regenerateLast, clearMessages],
      )}
    >
      {children}
    </Context>
  );
}

export function useAI() {
  return useContext(Context)!;
}

export function useAIMessages() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, update] = useState(0);
  const { engine } = useAI();

  useEffect(() => {
    const listener = () => {
      update((prev) => prev + 1);
    };

    listeners.push(listener);
    return () => {
      listeners.splice(listeners.indexOf(listener), 1);
    };
  }, []);

  return engine?.getHistory() ?? [];
}