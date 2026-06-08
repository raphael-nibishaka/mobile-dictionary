import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

import { MAX_RECENT_SEARCHES } from '@/constants/api';
import {
  addToSearchHistory,
  clearSearchHistory,
  loadSearchHistory,
  removeFromSearchHistory,
} from '@/storage/searchHistory';
import type { SearchHistoryItem } from '@/types/dictionary';

interface SearchHistoryContextValue {
  history: SearchHistoryItem[];
  recentSearches: SearchHistoryItem[];
  isLoading: boolean;
  refreshHistory: () => Promise<void>;
  addWord: (word: string) => Promise<void>;
  removeWord: (word: string) => Promise<void>;
  clearAll: () => Promise<void>;
}

const SearchHistoryContext = createContext<SearchHistoryContextValue | null>(null);

/**
 * Holds search history as a single source of truth so every screen (home tab,
 * history tab, and the drawer) stays in sync the instant the list changes.
 */
export function SearchHistoryProvider({ children }: { children: ReactNode }) {
  const [history, setHistory] = useState<SearchHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const refreshHistory = useCallback(async () => {
    setIsLoading(true);
    try {
      setHistory(await loadSearchHistory());
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial load: set state from the async callback to avoid synchronous
  // setState inside the effect body.
  useEffect(() => {
    let active = true;

    loadSearchHistory().then((items) => {
      if (!active) return;
      setHistory(items);
      setIsLoading(false);
    });

    return () => {
      active = false;
    };
  }, []);

  const addWord = useCallback(async (word: string) => {
    setHistory(await addToSearchHistory(word));
  }, []);

  const removeWord = useCallback(async (word: string) => {
    setHistory(await removeFromSearchHistory(word));
  }, []);

  const clearAll = useCallback(async () => {
    await clearSearchHistory();
    setHistory([]);
  }, []);

  const value = useMemo<SearchHistoryContextValue>(
    () => ({
      history,
      recentSearches: history.slice(0, MAX_RECENT_SEARCHES),
      isLoading,
      refreshHistory,
      addWord,
      removeWord,
      clearAll,
    }),
    [history, isLoading, refreshHistory, addWord, removeWord, clearAll],
  );

  return <SearchHistoryContext.Provider value={value}>{children}</SearchHistoryContext.Provider>;
}

/** Access the shared search history state. Must be used within the provider. */
export function useSearchHistory(): SearchHistoryContextValue {
  const context = useContext(SearchHistoryContext);
  if (!context) {
    throw new Error('useSearchHistory must be used within a SearchHistoryProvider');
  }
  return context;
}
