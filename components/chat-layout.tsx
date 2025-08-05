"use client";

import React from 'react';
import { useChatContext } from './chat-context';
import DocsChat from './docs-chat';

interface ChatLayoutProps {
  children: React.ReactNode;
}

export default function ChatLayout({ children }: ChatLayoutProps) {
  const { isOpen, panelWidth } = useChatContext();

  return (
    <div className="relative min-h-screen">
      {/* Main Content Area */}
      <div
        className={`transition-all duration-300 ease-out min-h-screen ${
          isOpen ? 'mr-0' : 'mr-0'
        }`}
        style={{
          marginRight: isOpen ? `${panelWidth}px` : '0px',
        }}
      >
        {children}
      </div>
      
      {/* Chat Component */}
      <DocsChat />
    </div>
  );
}
