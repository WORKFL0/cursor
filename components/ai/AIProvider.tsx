'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { AIChatbot } from './AIChatbot';
import { CommandPalette } from './CommandPalette';
import { intentDetector, UserIntent } from '@/lib/ai/intent-detection';

interface AIContextType {
  openChat: () => void;
  closeChat: () => void;
  openCommandPalette: () => void;
  detectIntent: (text: string) => Promise<{
    intent: UserIntent;
    confidence: number;
    suggestedAction?: string;
  }>;
}

const AIContext = createContext<AIContextType | undefined>(undefined);

export function useAI() {
  const context = useContext(AIContext);
  if (!context) {
    throw new Error('useAI must be used within AIProvider');
  }
  return context;
}

interface AIProviderProps {
  children: React.ReactNode;
  enableChat?: boolean;
  enableCommandPalette?: boolean;
  enableIntentDetection?: boolean;
}

export function AIProvider({ 
  children, 
  enableChat = true,
  enableCommandPalette = true,
  enableIntentDetection = true
}: AIProviderProps) {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  // Listen for chat open events
  useEffect(() => {
    const handleOpenChat = () => setIsChatOpen(true);
    window.addEventListener('openAIChat', handleOpenChat);
    
    return () => {
      window.removeEventListener('openAIChat', handleOpenChat);
    };
  }, []);

  // Setup keyboard shortcuts
  useEffect(() => {
    if (!enableCommandPalette) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Command/Ctrl + K for command palette
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
      
      // Command/Ctrl + / for AI chat
      if ((e.metaKey || e.ctrlKey) && e.key === '/') {
        e.preventDefault();
        setIsChatOpen((prev) => !prev);
      }
      
      // Escape to close both
      if (e.key === 'Escape') {
        setIsChatOpen(false);
        setIsCommandPaletteOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [enableCommandPalette]);

  const openChat = () => setIsChatOpen(true);
  const closeChat = () => setIsChatOpen(false);
  const openCommandPalette = () => setIsCommandPaletteOpen(true);

  const detectIntent = async (text: string) => {
    if (!enableIntentDetection) {
      return {
        intent: UserIntent.UNKNOWN,
        confidence: 0,
        suggestedAction: undefined,
      };
    }

    const result = await intentDetector.detectIntent(text);
    return {
      intent: result.intent,
      confidence: result.confidence,
      suggestedAction: result.suggestedAction,
    };
  };

  const contextValue: AIContextType = {
    openChat,
    closeChat,
    openCommandPalette,
    detectIntent,
  };

  return (
    <AIContext.Provider value={contextValue}>
      {children}
      {enableChat && <AIChatbot />}
      {enableCommandPalette && <CommandPalette />}
    </AIContext.Provider>
  );
}

// Hook for easy AI features access
export function useAIFeatures() {
  const ai = useAI();
  
  return {
    chat: {
      open: ai.openChat,
      close: ai.closeChat,
    },
    search: {
      open: ai.openCommandPalette,
    },
    intent: {
      detect: ai.detectIntent,
    },
  };
}