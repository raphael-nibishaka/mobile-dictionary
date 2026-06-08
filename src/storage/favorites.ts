import AsyncStorage from '@react-native-async-storage/async-storage';

import { FAVORITES_KEY } from '@/constants/api';
import type { FavoriteItem } from '@/types/dictionary';

/** Load all favorite words, most recently saved first */
export async function loadFavorites(): Promise<FavoriteItem[]> {
  try {
    const raw = await AsyncStorage.getItem(FAVORITES_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw) as FavoriteItem[];
    if (!Array.isArray(parsed)) return [];

    return parsed.sort((a, b) => b.savedAt - a.savedAt);
  } catch {
    return [];
  }
}

/** Returns true when the given word is already saved as a favorite */
export async function isFavorite(word: string): Promise<boolean> {
  const normalized = word.trim().toLowerCase();
  if (!normalized) return false;

  const favorites = await loadFavorites();
  return favorites.some((item) => item.word === normalized);
}

/** Add a word to favorites, ignoring duplicates */
export async function addFavorite(
  item: Omit<FavoriteItem, 'savedAt'>,
): Promise<FavoriteItem[]> {
  const normalized = item.word.trim().toLowerCase();
  if (!normalized) return loadFavorites();

  const existing = await loadFavorites();
  if (existing.some((favorite) => favorite.word === normalized)) {
    return existing;
  }

  const updated: FavoriteItem[] = [
    { ...item, word: normalized, savedAt: Date.now() },
    ...existing,
  ];

  await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
  return updated;
}

/** Remove a word from favorites */
export async function removeFavorite(word: string): Promise<FavoriteItem[]> {
  const normalized = word.trim().toLowerCase();
  const existing = await loadFavorites();
  const updated = existing.filter((item) => item.word !== normalized);

  await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
  return updated;
}

/** Toggle a word's favorite status and return the resulting state */
export async function toggleFavorite(
  item: Omit<FavoriteItem, 'savedAt'>,
): Promise<{ favorites: FavoriteItem[]; isFavorite: boolean }> {
  const normalized = item.word.trim().toLowerCase();
  const existing = await loadFavorites();
  const alreadySaved = existing.some((favorite) => favorite.word === normalized);

  const favorites = alreadySaved
    ? await removeFavorite(normalized)
    : await addFavorite(item);

  return { favorites, isFavorite: !alreadySaved };
}

/** Clear all favorites */
export async function clearFavorites(): Promise<void> {
  await AsyncStorage.removeItem(FAVORITES_KEY);
}
