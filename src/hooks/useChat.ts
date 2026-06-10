/**
 * src/hooks/useChat.ts
 * Chat orchestration hook.
 * Manages chat state, calls smartEngine, and handles typing delays.
 * Follows exact hook structure and defensive patterns from CODE_QUALITY blueprint.
 */

import { useCallback } from 'react';
import { useAppStore } from '../store/appStore';
import { getSmartResponse, getTypingDelay } from '../utils/smartEngine';

export function useChat() {
  const {
    messages,
    isTyping,
    footprintSummary,
    addUserMessage,
    addAssistantMessage,
    setTyping,
    clearMessages,
  } = useAppStore();

  const send = useCallback(
    async (content: string) => {
      const trimmed = content.trim();
      
      // Layer 2 validation: reject empty/whitespace and prevent double-send
      if (!trimmed || isTyping) return;

      addUserMessage(trimmed);
      setTyping(true);

      // Async fetch from engine (which gracefully handles both static fallback and Gemini API)
      const response = await getSmartResponse(trimmed, footprintSummary);
      
      // Calculate delay based on response length for natural UX
      const delay = getTypingDelay(response);

      setTimeout(() => {
        addAssistantMessage(response);
      }, delay);
    },
    [isTyping, footprintSummary, addUserMessage, addAssistantMessage, setTyping],
  );

  return { messages, isTyping, send, clearMessages };
}
