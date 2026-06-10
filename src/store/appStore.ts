/**
 * src/store/appStore.ts
 * Single global Zustand store with persist middleware.
 * Flat store — no slices, no nested state (per CODE_QUALITY blueprint).
 *
 * Persisted: language, quizScore, quizTotal, footprintEntries
 * NOT persisted: messages, isTyping (transient — per EFFICIENCY blueprint)
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  ViewId,
  LanguageCode,
  ChatMessage,
  FootprintEntry,
  FootprintSummary,
  ActivityCategory,
} from '../types';
import { CARBON_AVERAGES } from '../data/carbonData';

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Inline random ID generator — avoids external UUID dependency */
function uid(): string {
  return Math.random().toString(36).slice(2, 11);
}

/** Compute a FootprintSummary from raw entries */
function computeSummary(entries: FootprintEntry[]): FootprintSummary {
  const totalKgCO2e = entries.reduce((sum, e) => sum + e.kgCO2e, 0);

  const byCategory: Record<ActivityCategory, number> = {
    transport: 0,
    food: 0,
    energy: 0,
    shopping: 0,
  };

  for (const entry of entries) {
    byCategory[entry.category] += entry.kgCO2e;
  }

  const categoryPercentages: Record<ActivityCategory, number> = {
    transport: totalKgCO2e > 0 ? (byCategory.transport / totalKgCO2e) * 100 : 0,
    food:      totalKgCO2e > 0 ? (byCategory.food      / totalKgCO2e) * 100 : 0,
    energy:    totalKgCO2e > 0 ? (byCategory.energy    / totalKgCO2e) * 100 : 0,
    shopping:  totalKgCO2e > 0 ? (byCategory.shopping  / totalKgCO2e) * 100 : 0,
  };

  return {
    totalKgCO2e,
    totalTonnesCO2e: totalKgCO2e / 1000,
    byCategory,
    categoryPercentages,
    vsGlobalAverage: totalKgCO2e - CARBON_AVERAGES.global,
    vsHighIncomeAverage: totalKgCO2e - CARBON_AVERAGES.usa,
  };
}

// ─── Store Interface ──────────────────────────────────────────────────────────

interface AppState {
  // ── Navigation ──────────────────────────────────────────────────────────────
  activeView: ViewId;
  setActiveView: (v: ViewId) => void;

  // ── Language ─────────────────────────────────────────────────────────────────
  language: LanguageCode;
  setLanguage: (l: LanguageCode) => void;

  // ── Chat ─────────────────────────────────────────────────────────────────────
  messages: ChatMessage[];
  isTyping: boolean;
  addUserMessage: (content: string) => void;
  addAssistantMessage: (content: string) => void;
  setTyping: (v: boolean) => void;
  clearMessages: () => void;

  // ── Quiz ─────────────────────────────────────────────────────────────────────
  quizScore: number;
  quizTotal: number;
  incrementScore: (correct: boolean) => void;
  resetQuiz: () => void;

  // ── Carbon Footprint ─────────────────────────────────────────────────────────
  footprintEntries: FootprintEntry[];
  footprintSummary: FootprintSummary | null;
  /** Add or update a footprint entry — deduplicates by activityId */
  upsertFootprintEntry: (entry: FootprintEntry) => void;
  removeFootprintEntry: (activityId: string) => void;
  clearFootprint: () => void;
  recalculate: () => void;
}

// ─── Store ────────────────────────────────────────────────────────────────────

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // ── Navigation ───────────────────────────────────────────────────────────
      activeView: 'chat',
      setActiveView: (activeView) => set({ activeView }),

      // ── Language ─────────────────────────────────────────────────────────────
      language: 'en',
      setLanguage: (language) => set({ language }),

      // ── Chat ─────────────────────────────────────────────────────────────────
      messages: [],
      isTyping: false,

      addUserMessage: (content) =>
        set((s) => ({
          messages: [
            ...s.messages,
            { id: uid(), role: 'user', content, timestamp: new Date() },
          ],
        })),

      addAssistantMessage: (content) =>
        set((s) => ({
          isTyping: false, // Reset typing AND add message in ONE atomic update
          messages: [
            ...s.messages,
            { id: uid(), role: 'assistant', content, timestamp: new Date() },
          ],
        })),

      setTyping: (isTyping) => set({ isTyping }),
      clearMessages: () => set({ messages: [] }),

      // ── Quiz ─────────────────────────────────────────────────────────────────
      quizScore: 0,
      quizTotal: 0,

      incrementScore: (correct) =>
        set((s) => ({
          quizScore: s.quizScore + (correct ? 1 : 0),
          quizTotal: s.quizTotal + 1,
        })),

      resetQuiz: () => set({ quizScore: 0, quizTotal: 0 }),

      // ── Carbon Footprint ─────────────────────────────────────────────────────
      footprintEntries: [],
      footprintSummary: null,

      upsertFootprintEntry: (entry) => {
        const entries = get().footprintEntries;
        const existing = entries.findIndex((e) => e.activityId === entry.activityId);
        const updated =
          existing >= 0
            ? entries.map((e) => (e.activityId === entry.activityId ? entry : e))
            : [...entries, entry];
        set({ footprintEntries: updated, footprintSummary: computeSummary(updated) });
      },

      removeFootprintEntry: (activityId) => {
        const updated = get().footprintEntries.filter((e) => e.activityId !== activityId);
        set({ footprintEntries: updated, footprintSummary: computeSummary(updated) });
      },

      clearFootprint: () => set({ footprintEntries: [], footprintSummary: null }),

      recalculate: () => {
        const entries = get().footprintEntries;
        set({ footprintSummary: computeSummary(entries) });
      },
    }),
    {
      name: 'carbonsense-v1',
      // Only persist user preferences and data — NOT transient UI state
      // (per EFFICIENCY blueprint: don't serialize messages or isTyping)
      partialize: (s) => ({
        language: s.language,
        quizScore: s.quizScore,
        quizTotal: s.quizTotal,
        footprintEntries: s.footprintEntries,
        footprintSummary: s.footprintSummary,
      }),
    },
  ),
);
