import { Ionicons } from '@expo/vector-icons';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';

import { usePronunciation } from '@/hooks/usePronunciation';
import { useThemeColors } from '@/hooks/useThemeColors';

interface PronunciationButtonProps {
  audioUrl?: string;
  /** Word or phonetic text used for TTS fallback */
  fallbackText?: string;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  /** Short caption shown beside the button, e.g. an accent code like "UK" */
  label?: string;
  /**
   * Visual tone. Use `'onDark'` when the button sits on a dark or gradient
   * surface so the icon stays legible; `'default'` uses the brand color.
   */
  tone?: 'default' | 'onDark';
}

/** Speaker button with play, pause, and stop controls for word audio */
export function PronunciationButton({
  audioUrl,
  fallbackText,
  size = 'md',
  showLabel = false,
  label,
  tone = 'default',
}: PronunciationButtonProps) {
  const { colors } = useThemeColors();
  const { playbackState, hasAudio, play, pause, stop, toggle } = usePronunciation({
    audioUrl,
    fallbackText,
  });

  if (!hasAudio) return null;

  const onDark = tone === 'onDark';
  const accentColor = onDark ? '#FFFFFF' : colors.primary;
  const accentSurface = onDark ? '#FFFFFF33' : `${colors.primary}20`;
  const mutedColor = onDark ? '#FFFFFFCC' : colors.textSecondary;
  const mutedSurface = onDark ? '#FFFFFF22' : `${colors.textMuted}20`;

  const iconSize = size === 'sm' ? 18 : size === 'lg' ? 28 : 22;
  const buttonSize = size === 'sm' ? 36 : size === 'lg' ? 52 : 44;

  const getIcon = (): keyof typeof Ionicons.glyphMap => {
    if (playbackState === 'loading') return 'hourglass-outline';
    if (playbackState === 'playing') return 'pause';
    return 'volume-high';
  };

  return (
    <View className="flex-row items-center gap-2">
      <Pressable
        onPress={toggle}
        disabled={playbackState === 'loading'}
        className="items-center justify-center active:opacity-80"
        style={{
          width: buttonSize,
          height: buttonSize,
          borderRadius: buttonSize / 2,
          backgroundColor: accentSurface,
        }}
        accessibilityLabel="Play pronunciation"
        accessibilityRole="button">
        {playbackState === 'loading' ? (
          <ActivityIndicator size="small" color={accentColor} />
        ) : (
          <Ionicons name={getIcon()} size={iconSize} color={accentColor} />
        )}
      </Pressable>

      {label ? (
        <Text
          className="font-label text-xs uppercase tracking-wider"
          style={{ color: playbackState === 'error' ? colors.error : accentColor }}>
          {label}
        </Text>
      ) : null}

      {playbackState === 'playing' || playbackState === 'paused' ? (
        <Pressable
          onPress={stop}
          className="items-center justify-center active:opacity-80"
          style={{
            width: buttonSize - 8,
            height: buttonSize - 8,
            borderRadius: (buttonSize - 8) / 2,
            backgroundColor: mutedSurface,
          }}
          accessibilityLabel="Stop pronunciation"
          accessibilityRole="button">
          <Ionicons name="stop" size={iconSize - 4} color={mutedColor} />
        </Pressable>
      ) : null}

      {showLabel && playbackState === 'error' ? (
        <Text className="font-label text-xs" style={{ color: colors.error }}>
          Audio unavailable
        </Text>
      ) : null}

      {showLabel && playbackState !== 'error' ? (
        <Pressable onPress={playbackState === 'playing' ? pause : play}>
          <Text className="font-label text-sm" style={{ color: accentColor }}>
            {playbackState === 'playing' ? 'Pause' : 'Listen'}
          </Text>
        </Pressable>
      ) : null}
    </View>
  );
}
