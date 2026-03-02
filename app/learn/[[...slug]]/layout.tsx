import { DocsLayout, type DocsLayoutProps } from "fumadocs-ui/layouts/docs";
import type { ReactNode } from "react";
import { baseOptions } from "@/app/layout.config";
import { source } from "@/lib/source";
import DocsBackground from "@/components/docs-background";
import { ChatProvider } from "@/components/chat-context";
import ChatLayout from "@/components/chat-layout";
import { LearnWelcomeModal } from "@/components/learn-welcome-modal";

const docsOptions: DocsLayoutProps = {
  ...baseOptions,
  tree: source.pageTree,
  containerProps: {
    className: "ls-docs-layout",
  },
  sidebar: {
    tabs: {
      transform(option, node) {
        const meta = source.getNodeMeta(node);
        if (!meta) return option;

        return {
          ...option,
        };
      },
    },
  },
};

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <ChatProvider>
      <ChatLayout>
        <DocsLayout {...docsOptions}>
          <DocsBackground />
          {children}
          <LearnWelcomeModal />
        </DocsLayout>
      </ChatLayout>
    </ChatProvider>
  );
}
