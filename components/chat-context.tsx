"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ChatContextType {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  panelWidth: number;
  setPanelWidth: (width: number) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [panelWidth, setPanelWidth] = useState(400);

  return (
    <ChatContext.Provider value={{ isOpen, setIsOpen, panelWidth, setPanelWidth }}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChatContext() {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChatContext must be used within a ChatProvider');
  }
  return context;
}
