import { DocsLayout, type DocsLayoutProps } from "fumadocs-ui/layouts/docs";
import type { ReactNode } from "react";
import { baseOptions } from "@/app/layout.config";
import { tutorialsSource } from "@/lib/tutorials/source";
import DocsBackground from "@/components/docs-background";
import { ChatProvider } from "@/components/chat-context";
import ChatLayout from "@/components/chat-layout";

const docsOptions: DocsLayoutProps = {
  ...baseOptions,
  tree: tutorialsSource.pageTree,
  sidebar: {
    tabs: {
      transform(option, node) {
        const meta = tutorialsSource.getNodeMeta(node);
        if (!meta) return option;

        const color = `var(--${meta.file.dirname}-color, var(--color-fd-foreground))`;

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
        </DocsLayout>
      </ChatLayout>
    </ChatProvider>
  );
}
