"use client";

import React from 'react';
import { useChatContext } from './chat-context';
import DocsChat from './docs-chat';

interface ChatLayoutProps {
  children: React.ReactNode;
}

export default function ChatLayout({ children }: ChatLayoutProps) {
  const { isOpen } = useChatContext();

  return (
    <div className="relative min-h-screen">
      <div
        className={`min-h-screen transition duration-300 ease-out ${
          isOpen ? "pointer-events-none blur-[3px] brightness-75" : ""
        }`}
      >
        {children}
      </div>

      <DocsChat />
    </div>
  );
}
