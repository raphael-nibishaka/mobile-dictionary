/**
 * Favorites are backed by a shared context provider so the word screen and the
 * Favorites tab stay in sync. This re-export keeps the established
 * `@/hooks/useFavorites` import path stable for all consumers.
 */
export { useFavorites } from '@/context/FavoritesProvider';
