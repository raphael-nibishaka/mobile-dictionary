/** Normalize audio URLs returned by the Dictionary API (often protocol-relative) */
export function normalizeAudioUrl(url: string): string {
  const trimmed = url.trim();
  if (!trimmed) return trimmed;
  if (trimmed.startsWith('//')) return `https:${trimmed}`;
  return trimmed;
}

/** Human-readable region labels for known Dictionary API accent codes */
const ACCENT_LABELS: Record<string, string> = {
  us: 'US',
  uk: 'UK',
  au: 'AU',
  ca: 'CA',
  in: 'IN',
};

/**
 * Derive an accent label (e.g. "UK", "US") from a pronunciation URL so multiple
 * audio variants can be distinguished. The Free Dictionary API names files like
 * `hello-uk.mp3` / `hello-us.mp3`. Falls back to "Audio N" when no code is found.
 */
export function getAccentLabel(url: string, index: number): string {
  const match = url
    .toLowerCase()
    .match(/-([a-z]{2})\.(?:mp3|wav|ogg|m4a|aac)(?:\?.*)?$/);

  if (match) {
    const code = match[1];
    return ACCENT_LABELS[code] ?? code.toUpperCase();
  }

  return `Audio ${index + 1}`;
}

/** Returns true when the URL looks like a playable audio resource */
export function isValidAudioUrl(url?: string): boolean {
  if (!url?.trim()) return false;
  const normalized = normalizeAudioUrl(url);
  return (
    /^https?:\/\/.+\.(mp3|wav|ogg|m4a|aac)(\?.*)?$/i.test(normalized) ||
    normalized.includes('dictionaryapi.dev') ||
    normalized.includes('gstatic.com')
  );
}
