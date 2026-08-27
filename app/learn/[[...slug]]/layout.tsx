import { DocsLayout, type DocsLayoutProps } from "fumadocs-ui/layouts/docs";
import type { ReactNode } from "react";
import { baseOptions } from "@/app/layout.config";
import { source } from "@/lib/source";
import DocsBackground from "@/components/docs-background";
import { ChatProvider } from "@/components/chat-context";
import ChatLayout from "@/components/chat-layout";
import { ReadingProgress } from "@/components/learn/reading-progress";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";

const docsOptions: DocsLayoutProps = {
  ...baseOptions,
  // The product navbar owns the learning navigation. Fumadocs remains the
  // content/TOC layout, but its duplicate mobile nav and course sidebar are
  // intentionally disabled for the BuildAnything-style lesson reader.
  nav: {
    ...baseOptions.nav,
    enabled: false,
  },
  tree: source.pageTree,
  containerProps: {
    className: "ls-docs-layout",
  },
  sidebar: {
    enabled: false,
    tabs: false,
  },
};

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <ChatProvider>
      <ChatLayout>
        <div className="ls-learn-shell">
          <Navbar />
          <div className="ls-learn-content">
            <DocsLayout {...docsOptions}>
              <DocsBackground />
              <ReadingProgress />
              {children}
            </DocsLayout>
          </div>
          <Footer />
        </div>
      </ChatLayout>
    </ChatProvider>
  );
}
