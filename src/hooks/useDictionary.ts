import { useCallback, useState } from 'react';

import { fetchWordResult, parseApiError } from '@/services/dictionaryApi';
import { addToSearchHistory } from '@/storage/searchHistory';
import type { AppError, WordSearchResult } from '@/types/dictionary';

interface UseDictionaryReturn {
  result: WordSearchResult | null;
  isLoading: boolean;
  error: AppError | null;
  searchWord: (word: string) => Promise<WordSearchResult | null>;
  clearError: () => void;
  reset: () => void;
}

/** Hook for fetching and managing dictionary word data */
export function useDictionary(): UseDictionaryReturn {
  const [result, setResult] = useState<WordSearchResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<AppError | null>(null);

  const searchWord = useCallback(async (word: string): Promise<WordSearchResult | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const searchResult = await fetchWordResult(word);

      setResult(searchResult);
      await addToSearchHistory(searchResult.word);
      return searchResult;
    } catch (err) {
      const appError = parseApiError(err);
      setError(appError);
      setResult(null);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearError = useCallback(() => setError(null), []);
  const reset = useCallback(() => {
    setResult(null);
    setError(null);
    setIsLoading(false);
  }, []);

  return { result, isLoading, error, searchWord, clearError, reset };
}
