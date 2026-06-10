/**
 * src/hooks/useTranslation.ts
 * Translation hook with caching using the MyMemory API.
 * Follows EFFICIENCY blueprint patterns (module-level cache, graceful degradation).
 */

import { useState, useCallback } from 'react';

// Module-level cache prevents redundant network calls across re-renders
const translationCache = new Map<string, string>();

// MyMemory is a free translation API — no API key required
// Limit: 5000 chars/day per IP
const MYMEMORY_URL = 'https://api.mymemory.translated.net/get';

export async function translateText(text: string, targetLang: string): Promise<string> {
  // English is the base language — no translation needed
  if (targetLang === 'en' || !text.trim()) return text;

  // Truncated cache key for efficiency (per EFFICIENCY blueprint)
  const cacheKey = `${targetLang}:${text.slice(0, 50)}`;
  
  if (translationCache.has(cacheKey)) {
    return translationCache.get(cacheKey)!;
  }

  try {
    // encodeURIComponent prevents URL injection (SECURITY blueprint)
    const url = `${MYMEMORY_URL}?q=${encodeURIComponent(text)}&langpair=en|${targetLang}`;
    const res = await fetch(url);
    const data = await res.json() as { responseData?: { translatedText?: string } };
    
    const translated = data.responseData?.translatedText ?? text;
    translationCache.set(cacheKey, translated);
    return translated;
  } catch {
    // Graceful fallback on error — never crash the UI
    return text;
  }
}

export function useTranslation() {
  const [translating, setTranslating] = useState(false);

  const translate = useCallback(async (text: string, targetLang: string): Promise<string> => {
    if (targetLang === 'en') return text;
    
    setTranslating(true);
    const result = await translateText(text, targetLang);
    setTranslating(false);
    
    return result;
  }, []);

  return { translate, translating };
}
