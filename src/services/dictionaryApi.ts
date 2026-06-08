import axios, { AxiosError, isAxiosError } from 'axios';
import * as Network from 'expo-network';

import { API_BASE_URL } from '@/constants/api';
import type {
  AppError,
  DictionaryApiError,
  DictionaryEntry,
  WordSearchResult,
} from '@/types/dictionary';
import { normalizeAudioUrl } from '@/utils/audio';

/** Axios instance configured for the Dictionary API */
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    Accept: 'application/json',
  },
});

/**
 * Fetch dictionary entries for a given English word.
 * @param word - The word to look up (will be trimmed and lowercased)
 */
export async function fetchWordDefinition(word: string): Promise<DictionaryEntry[]> {
  const normalizedWord = word.trim().toLowerCase();

  if (!normalizedWord) {
    throw createAppError('empty_input', 'Please enter a word to search.');
  }

  await assertNetworkAvailable();

  const response = await apiClient.get<DictionaryEntry[]>(normalizedWord);
  const data = response.data;

  if (!Array.isArray(data) || data.length === 0) {
    throw createAppError('invalid_response', 'Received an unexpected response from the dictionary.');
  }

  return data;
}

/**
 * Fetch a word and map the raw API entries into the normalized result used
 * across screens (word, phonetic, audio, meanings).
 */
export async function fetchWordResult(word: string): Promise<WordSearchResult> {
  const entries = await fetchWordDefinition(word);
  const normalizedWord = word.trim().toLowerCase();

  return {
    word: entries[0]?.word ?? normalizedWord,
    phonetic: getPhoneticText(entries),
    audioUrl: getAudioUrl(entries),
    audioUrls: getAudioUrls(entries),
    meanings: mergeMeanings(entries),
    entries,
  };
}

/**
 * Convert Axios/network errors into typed AppError objects.
 */
export function parseApiError(error: unknown): AppError {
  if (isAxiosError(error)) {
    return parseAxiosError(error);
  }

  if (isAppError(error)) {
    return error;
  }

  return createAppError('unknown', 'Something went wrong. Please try again.');
}

function parseAxiosError(error: AxiosError): AppError {
  if (!error.response) {
    return createAppError(
      'network',
      'Unable to connect. Check your internet connection and try again.',
    );
  }

  const status = error.response.status;
  const data = error.response.data as DictionaryApiError | undefined;

  if (status === 404) {
    return createAppError(
      'not_found',
      data?.message ?? 'No definition found for this word. Try a different spelling.',
    );
  }

  if (status >= 500) {
    return createAppError('api_error', 'The dictionary service is temporarily unavailable.');
  }

  return createAppError(
    'api_error',
    data?.message ?? 'Failed to fetch the word definition. Please try again.',
  );
}

/** Create a structured AppError with sensible defaults per type */
export function createAppError(type: AppError['type'], message: string): AppError {
  const retryable = type !== 'empty_input' && type !== 'not_found';

  return { type, message, retryable };
}

function isAppError(error: unknown): error is AppError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'type' in error &&
    'message' in error &&
    'retryable' in error
  );
}

/**
 * Extract the best available phonetic text from API entries.
 */
export function getPhoneticText(entries: DictionaryEntry[]): string | undefined {
  for (const entry of entries) {
    if (entry.phonetic) return entry.phonetic;
    const phoneticWithText = entry.phonetics.find((p) => p.text);
    if (phoneticWithText?.text) return phoneticWithText.text;
  }
  return undefined;
}

/**
 * Extract all valid audio URLs from API entries (handles multiple pronunciations).
 */
export function getAudioUrls(entries: DictionaryEntry[]): string[] {
  const urls: string[] = [];

  for (const entry of entries) {
    for (const phonetic of entry.phonetics) {
      if (phonetic.audio?.trim()) {
        urls.push(normalizeAudioUrl(phonetic.audio));
      }
    }
  }

  return [...new Set(urls)];
}

/**
 * Extract the best available audio URL from API entries.
 * Prefers HTTPS URLs with common audio extensions.
 */
export function getAudioUrl(entries: DictionaryEntry[]): string | undefined {
  const urls = getAudioUrls(entries);
  if (urls.length === 0) return undefined;

  const preferred = urls.find((url) => url.startsWith('https://') && url.includes('.mp3'));
  return preferred ?? urls[0];
}

/** Verify device has network connectivity before API calls */
async function assertNetworkAvailable(): Promise<void> {
  try {
    const state = await Network.getNetworkStateAsync();
    if (!state.isConnected || state.isInternetReachable === false) {
      throw createAppError(
        'network',
        'No internet connection. Check your network and try again.',
      );
    }
  } catch (error) {
    if (isAppError(error)) throw error;
    // If network check fails, allow the request to proceed
  }
}

/**
 * Merge all meanings from multiple entries into a single list.
 */
export function mergeMeanings(entries: DictionaryEntry[]) {
  return entries.flatMap((entry) => entry.meanings);
}

export default apiClient;
