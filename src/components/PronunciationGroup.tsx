import { View } from 'react-native';

import { PronunciationButton } from '@/components/PronunciationButton';
import { getAccentLabel } from '@/utils/audio';

interface PronunciationGroupProps {
  /** All distinct audio pronunciation URLs for the word */
  audioUrls?: string[];
  /** Word text used as a text-to-speech fallback if an audio file fails */
  fallbackText?: string;
  tone?: 'default' | 'onDark';
}

/**
 * Renders the pronunciation control(s) for a word:
 * - no audio URLs  → renders nothing (the audio feature is hidden)
 * - one audio URL  → a single speaker button
 * - many audio URLs → one labelled speaker per accent (UK, US, ...)
 *
 * This satisfies the requirements to handle multiple pronunciations and to
 * hide the audio feature entirely when none is provided.
 */
export function PronunciationGroup({
  audioUrls,
  fallbackText,
  tone = 'default',
}: PronunciationGroupProps) {
  const urls = audioUrls ?? [];

  // Requirement: hide/disable the audio feature when no pronunciation exists.
  if (urls.length === 0) return null;

  // Single pronunciation: a plain speaker button.
  if (urls.length === 1) {
    return <PronunciationButton audioUrl={urls[0]} fallbackText={fallbackText} tone={tone} />;
  }

  // Multiple pronunciations: one labelled, independently playable button each.
  return (
    <View className="flex-row flex-wrap items-center gap-3">
      {urls.map((url, index) => (
        <PronunciationButton
          key={url}
          audioUrl={url}
          fallbackText={fallbackText}
          label={getAccentLabel(url, index)}
          size="sm"
          tone={tone}
        />
      ))}
    </View>
  );
}
