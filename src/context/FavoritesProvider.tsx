import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

import {
  clearFavorites,
  loadFavorites,
  removeFavorite,
  toggleFavorite,
} from '@/storage/favorites';
import type { FavoriteItem } from '@/types/dictionary';

interface FavoritesContextValue {
  favorites: FavoriteItem[];
  isLoading: boolean;
  refreshFavorites: () => Promise<void>;
  toggle: (item: Omit<FavoriteItem, 'savedAt'>) => Promise<boolean>;
  remove: (word: string) => Promise<void>;
  clearAll: () => Promise<void>;
  isFavorite: (word: string) => boolean;
}

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

/**
 * Holds favorites as a single source of truth so the heart toggle on a word
 * screen and the Favorites tab always reflect the same state immediately.
 */
export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const refreshFavorites = useCallback(async () => {
    setIsLoading(true);
    try {
      setFavorites(await loadFavorites());
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;

    loadFavorites().then((items) => {
      if (!active) return;
      setFavorites(items);
      setIsLoading(false);
    });

    return () => {
      active = false;
    };
  }, []);

  const toggle = useCallback(async (item: Omit<FavoriteItem, 'savedAt'>) => {
    const { favorites: updated, isFavorite } = await toggleFavorite(item);
    setFavorites(updated);
    return isFavorite;
  }, []);

  const remove = useCallback(async (word: string) => {
    setFavorites(await removeFavorite(word));
  }, []);

  const clearAll = useCallback(async () => {
    await clearFavorites();
    setFavorites([]);
  }, []);

  const isFavorite = useCallback(
    (word: string) => {
      const normalized = word.trim().toLowerCase();
      return favorites.some((item) => item.word === normalized);
    },
    [favorites],
  );

  const value = useMemo<FavoritesContextValue>(
    () => ({ favorites, isLoading, refreshFavorites, toggle, remove, clearAll, isFavorite }),
    [favorites, isLoading, refreshFavorites, toggle, remove, clearAll, isFavorite],
  );

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}

/** Access the shared favorites state. Must be used within the provider. */
export function useFavorites(): FavoritesContextValue {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
}
