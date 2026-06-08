import { useCallback, useEffect, useRef, useState } from 'react';

import { DISCOVERY_WORDS } from '@/constants/api';
import { fetchWordResult } from '@/services/dictionaryApi';
import type { WordSearchResult } from '@/types/dictionary';
import { shuffle } from '@/utils/helpers';

/** How many cards to keep fetched ahead of the current one */
const BUFFER_SIZE = 3;

interface UseDiscoveryReturn {
  current: WordSearchResult | null;
  upcoming: WordSearchResult | null;
  isInitialLoading: boolean;
  isFetchingMore: boolean;
  hasError: boolean;
  next: () => void;
  retry: () => void;
}

/**
 * Powers the "Discover" feed: shuffles a curated word pool, fetches definitions
 * on demand, keeps a small buffer of upcoming cards prefetched, and reshuffles
 * indefinitely so the deck never runs out.
 */
export function useDiscovery(): UseDiscoveryReturn {
  const [cards, setCards] = useState<WordSearchResult[]>([]);
  const [index, setIndex] = useState(0);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Refs mirror state so the async fetch loop avoids stale-closure reads.
  const cardsRef = useRef<WordSearchResult[]>([]);
  const queueRef = useRef<string[]>([]);
  const fetchingRef = useRef(false);

  const pushCard = useCallback((card: WordSearchResult) => {
    cardsRef.current = [...cardsRef.current, card];
    setCards(cardsRef.current);
  }, []);

  /** Pull the next word that resolves to a usable definition (skips failures). */
  const fetchNextValid = useCallback(async (): Promise<WordSearchResult | null> => {
    let attempts = 0;
    const maxAttempts = DISCOVERY_WORDS.length;

    while (attempts < maxAttempts) {
      if (queueRef.current.length === 0) {
        queueRef.current = shuffle(DISCOVERY_WORDS);
      }
      const word = queueRef.current.shift();
      attempts += 1;
      if (!word) continue;

      try {
        const result = await fetchWordResult(word);
        if (result.meanings.length > 0) return result;
      } catch {
        // Word unavailable or network hiccup — skip and try the next one.
      }
    }
    return null;
  }, []);

  /** Ensure enough cards are fetched to stay ahead of the current index. */
  const ensureBuffer = useCallback(
    async (targetCount: number) => {
      if (fetchingRef.current) return;
      fetchingRef.current = true;
      setIsFetchingMore(true);

      try {
        while (cardsRef.current.length < targetCount) {
          const card = await fetchNextValid();
          if (!card) break;
          pushCard(card);
        }
      } finally {
        fetchingRef.current = false;
        setIsFetchingMore(false);
      }
    },
    [fetchNextValid, pushCard],
  );

  const load = useCallback(async () => {
    setIsInitialLoading(true);
    setHasError(false);
    cardsRef.current = [];
    queueRef.current = shuffle(DISCOVERY_WORDS);
    setCards([]);
    setIndex(0);

    await ensureBuffer(BUFFER_SIZE);

    if (cardsRef.current.length === 0) {
      setHasError(true);
    }
    setIsInitialLoading(false);
  }, [ensureBuffer]);

  // Kick off the first load on the next tick so we don't call setState
  // synchronously inside the effect body.
  useEffect(() => {
    const timer = setTimeout(load, 0);
    return () => clearTimeout(timer);
  }, [load]);

  const next = useCallback(() => {
    setIndex((prev) => {
      const nextIndex = prev + 1;
      void ensureBuffer(nextIndex + BUFFER_SIZE);
      return nextIndex;
    });
  }, [ensureBuffer]);

  return {
    current: cards[index] ?? null,
    upcoming: cards[index + 1] ?? null,
    isInitialLoading,
    isFetchingMore,
    hasError,
    next,
    retry: load,
  };
}
