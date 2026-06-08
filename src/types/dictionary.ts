/** Definition within a meaning group */
export interface DictionaryDefinition {
  definition: string;
  example?: string;
  synonyms?: string[];
  antonyms?: string[];
}

/** A group of definitions sharing the same part of speech */
export interface DictionaryMeaning {
  partOfSpeech: string;
  definitions: DictionaryDefinition[];
  synonyms?: string[];
  antonyms?: string[];
}

/** Phonetic pronunciation data from the API */
export interface DictionaryPhonetic {
  text?: string;
  audio?: string;
}

/** Top-level dictionary entry returned by the API */
export interface DictionaryEntry {
  word: string;
  phonetic?: string;
  phonetics: DictionaryPhonetic[];
  meanings: DictionaryMeaning[];
  license?: {
    name: string;
    url: string;
  };
  sourceUrls?: string[];
}

/** API error response shape for 404 and other failures */
export interface DictionaryApiError {
  title: string;
  message: string;
  resolution?: string;
}

/** Normalized search result used across screens */
export interface WordSearchResult {
  word: string;
  phonetic?: string;
  audioUrl?: string;
  audioUrls?: string[];
  meanings: DictionaryMeaning[];
  entries: DictionaryEntry[];
}

/** Stored search history item */
export interface SearchHistoryItem {
  word: string;
  searchedAt: number;
}

/** Stored favorite (bookmarked) word with lightweight metadata for previews */
export interface FavoriteItem {
  word: string;
  phonetic?: string;
  partOfSpeech?: string;
  savedAt: number;
}

/** Typed error categories for user-facing messages */
export type AppErrorType =
  | 'empty_input'
  | 'not_found'
  | 'network'
  | 'api_error'
  | 'invalid_response'
  | 'unknown';

/** Structured application error */
export interface AppError {
  type: AppErrorType;
  message: string;
  retryable: boolean;
}
