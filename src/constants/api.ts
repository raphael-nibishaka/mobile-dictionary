/** Default Free Dictionary API endpoint, used when no env override is set */
const DEFAULT_API_BASE_URL = 'https://api.dictionaryapi.dev/api/v2/entries/en/';

/**
 * API base URL for the Free Dictionary API.
 *
 * Configured via the `EXPO_PUBLIC_DICTIONARY_API_URL` environment variable
 * (see `.env` / `.env.example`). Falls back to the public endpoint so the app
 * still runs when no `.env` file is present.
 */
const envApiBaseUrl = process.env.EXPO_PUBLIC_DICTIONARY_API_URL?.trim();
export const API_BASE_URL =
  envApiBaseUrl && envApiBaseUrl.length > 0 ? envApiBaseUrl : DEFAULT_API_BASE_URL;

/** AsyncStorage key for persisted search history */
export const SEARCH_HISTORY_KEY = '@lexidict:search_history';

/** AsyncStorage key for persisted favorite words */
export const FAVORITES_KEY = '@lexidict:favorites';

/** Maximum number of recent searches to display on home screen */
export const MAX_RECENT_SEARCHES = 5;

/** Maximum number of words stored in search history */
export const MAX_HISTORY_ITEMS = 50;

/** App branding */
export const APP_NAME = 'LexiDict';

/** Popular words shown on the home screen empty/idle state */
export const POPULAR_WORDS = ['ephemeral', 'serendipity', 'ethereal', 'pinnacle', 'cognitive'];

/**
 * Curated pool used to derive a deterministic "Word of the Day".
 * The same word is shown to every user for a given calendar day.
 */
export const WORD_OF_THE_DAY_POOL = [
  'ethereal',
  'serendipity',
  'ephemeral',
  'luminous',
  'eloquent',
  'resilience',
  'panacea',
  'mellifluous',
  'epiphany',
  'quintessential',
  'solitude',
  'wanderlust',
  'nostalgia',
  'euphoria',
  'tenacity',
] as const;

/** Topic chips for explore section */
export const EXPLORE_TOPICS = ['Literature', 'Science', 'Philosophy', 'Arts'] as const;

/**
 * Curated pool of interesting words for the "Discover" feed. The Free
 * Dictionary API has no random endpoint, so the app shuffles this list and
 * fetches definitions on demand.
 */
export const DISCOVERY_WORDS = [
  'ephemeral', 'serendipity', 'ethereal', 'luminous', 'eloquent',
  'resilience', 'mellifluous', 'epiphany', 'quintessential', 'solitude',
  'wanderlust', 'nostalgia', 'euphoria', 'tenacity', 'serene',
  'candid', 'gregarious', 'benevolent', 'aesthetic', 'ambiguous',
  'cacophony', 'ebullient', 'fastidious', 'halcyon', 'idyllic',
  'juxtapose', 'kinetic', 'labyrinth', 'magnanimous', 'nuance',
  'oblivion', 'panacea', 'quaint', 'resplendent', 'sublime',
  'transient', 'ubiquitous', 'venerable', 'whimsical', 'zenith',
  'aplomb', 'copious', 'diligent', 'effervescent', 'frugal',
  'harbinger', 'incandescent', 'jubilant', 'lucid', 'myriad',
  'opaque', 'pristine', 'reverie', 'tranquil', 'vivid',
  'astute', 'cogent', 'eloquence', 'fervent', 'gossamer',
] as const;
