import AsyncStorage from '@react-native-async-storage/async-storage';

import { MAX_HISTORY_ITEMS, SEARCH_HISTORY_KEY } from '@/constants/api';
import type { SearchHistoryItem } from '@/types/dictionary';

/** Load all search history items from AsyncStorage */
export async function loadSearchHistory(): Promise<SearchHistoryItem[]> {
  try {
    const raw = await AsyncStorage.getItem(SEARCH_HISTORY_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw) as SearchHistoryItem[];
    if (!Array.isArray(parsed)) return [];

    return parsed.sort((a, b) => b.searchedAt - a.searchedAt);
  } catch {
    return [];
  }
}

/**
 * Add a word to search history.
 * Removes duplicates and keeps the most recent search at the top.
 */
export async function addToSearchHistory(word: string): Promise<SearchHistoryItem[]> {
  const normalized = word.trim().toLowerCase();
  if (!normalized) return loadSearchHistory();

  const existing = await loadSearchHistory();
  const filtered = existing.filter((item) => item.word !== normalized);

  const updated: SearchHistoryItem[] = [
    { word: normalized, searchedAt: Date.now() },
    ...filtered,
  ].slice(0, MAX_HISTORY_ITEMS);

  await AsyncStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(updated));
  return updated;
}

/** Remove a single word from search history */
export async function removeFromSearchHistory(word: string): Promise<SearchHistoryItem[]> {
  const normalized = word.trim().toLowerCase();
  const existing = await loadSearchHistory();
  const updated = existing.filter((item) => item.word !== normalized);

  await AsyncStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(updated));
  return updated;
}

/** Clear all search history */
export async function clearSearchHistory(): Promise<void> {
  await AsyncStorage.removeItem(SEARCH_HISTORY_KEY);
}
