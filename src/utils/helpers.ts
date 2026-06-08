import type { AppError, WordSearchResult } from '@/types/dictionary';

/** User-friendly titles for each error type */
export function getErrorTitle(type: AppError['type']): string {
  switch (type) {
    case 'empty_input':
      return 'Enter a word';
    case 'not_found':
      return 'Word not found';
    case 'network':
      return 'Connection error';
    case 'api_error':
      return 'Service unavailable';
    case 'invalid_response':
      return 'Unexpected response';
    default:
      return 'Something went wrong';
  }
}

/** Icon name mapping for error states */
export function getErrorIcon(type: AppError['type']): keyof typeof import('@expo/vector-icons').Ionicons.glyphMap {
  switch (type) {
    case 'empty_input':
      return 'search-outline';
    case 'not_found':
      return 'book-outline';
    case 'network':
      return 'cloud-offline-outline';
    default:
      return 'alert-circle-outline';
  }
}

/** Validate search input before API call */
export function validateSearchInput(query: string): string | null {
  const trimmed = query.trim();
  if (!trimmed) {
    return 'Please enter a word before searching.';
  }
  if (trimmed.length < 2) {
    return 'Word must be at least 2 characters long.';
  }
  if (!/^[a-zA-Z\s'-]+$/.test(trimmed)) {
    return 'Please use only letters, spaces, hyphens, or apostrophes.';
  }
  return null;
}

/** Format a timestamp for display in history lists */
export function formatSearchDate(timestamp: number): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

/** Capitalize first letter of a word for display */
export function capitalizeWord(word: string): string {
  if (!word) return word;
  return word.charAt(0).toUpperCase() + word.slice(1);
}

/** Return a new array with the elements randomly shuffled (Fisher–Yates) */
export function shuffle<T>(items: readonly T[]): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * Pick a deterministic "Word of the Day" from a pool based on the calendar day,
 * so every user sees the same word on a given date and it rotates daily.
 */
export function getWordOfTheDay(pool: readonly string[]): string {
  if (pool.length === 0) return '';

  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 0);
  const dayOfYear = Math.floor((now.getTime() - startOfYear.getTime()) / 86400000);

  return pool[dayOfYear % pool.length];
}

/** Build a human-friendly, shareable summary of a word's definition */
export function buildShareText(result: WordSearchResult): string {
  const lines: string[] = [capitalizeWord(result.word)];

  if (result.phonetic) {
    lines.push(result.phonetic);
  }

  const primaryMeaning = result.meanings[0];
  const primaryDefinition = primaryMeaning?.definitions[0];

  if (primaryMeaning && primaryDefinition) {
    lines.push('', `(${primaryMeaning.partOfSpeech}) ${primaryDefinition.definition}`);

    if (primaryDefinition.example) {
      lines.push(`Example: "${primaryDefinition.example}"`);
    }
  }

  lines.push('', 'Shared from LexiDict 📖');
  return lines.join('\n');
}
