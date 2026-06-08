/**
 * Search history is backed by a shared context provider so every screen stays
 * in sync. This re-export keeps the established `@/hooks/useSearchHistory`
 * import path stable for all consumers.
 */
export { useSearchHistory } from '@/context/SearchHistoryProvider';
