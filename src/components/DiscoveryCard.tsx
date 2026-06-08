import { Ionicons } from '@expo/vector-icons';
import { Text, View } from 'react-native';

import { BorderRadius } from '@/constants/theme';
import { useThemeColors } from '@/hooks/useThemeColors';
import type { WordSearchResult } from '@/types/dictionary';
import { capitalizeWord } from '@/utils/helpers';

interface DiscoveryCardProps {
  result: WordSearchResult;
}

/** Presentational word card used in the Discover deck (no gestures) */
export function DiscoveryCard({ result }: DiscoveryCardProps) {
  const { colors, isDark } = useThemeColors();

  const primaryMeaning = result.meanings[0];
  const primaryDefinition = primaryMeaning?.definitions[0];

  return (
    <View
      className="w-full h-full justify-between overflow-hidden"
      style={{
        backgroundColor: isDark ? colors.surfaceSecondary : colors.surface,
        borderRadius: BorderRadius.card,
        borderWidth: 1,
        borderColor: colors.border,
        padding: 24,
        shadowColor: colors.cardShadow,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.16,
        shadowRadius: 14,
        elevation: 6,
      }}>
      <View>
        <View className="flex-row items-center mb-5">
          <View
            className="w-9 h-9 rounded-full items-center justify-center mr-2"
            style={{ backgroundColor: `${colors.primary}15` }}>
            <Ionicons name="sparkles" size={18} color={colors.primary} />
          </View>
          <Text
            className="font-label text-xs uppercase tracking-widest"
            style={{ color: colors.textMuted }}>
            Discover
          </Text>
        </View>

        <Text className="font-headline text-4xl mb-2" style={{ color: colors.text }}>
          {capitalizeWord(result.word)}
        </Text>

        {result.phonetic ? (
          <Text className="font-body text-lg mb-4" style={{ color: colors.textSecondary }}>
            {result.phonetic}
          </Text>
        ) : null}

        {primaryMeaning ? (
          <View
            className="self-start px-3 py-1 rounded-full mb-4"
            style={{ backgroundColor: `${colors.secondary}20` }}>
            <Text
              className="font-label text-xs uppercase tracking-wider font-semibold"
              style={{ color: colors.secondary }}>
              {primaryMeaning.partOfSpeech}
            </Text>
          </View>
        ) : null}

        {primaryDefinition ? (
          <Text
            className="font-body text-base leading-7"
            style={{ color: colors.text }}
            numberOfLines={4}>
            {primaryDefinition.definition}
          </Text>
        ) : null}

        {primaryDefinition?.example ? (
          <Text
            className="font-body text-sm italic leading-6 mt-3"
            style={{ color: colors.textSecondary }}
            numberOfLines={2}>
            {`“${primaryDefinition.example}”`}
          </Text>
        ) : null}
      </View>

      <View className="flex-row items-center justify-center mt-6">
        <Ionicons name="swap-horizontal" size={16} color={colors.textMuted} />
        <Text className="font-label text-xs ml-2" style={{ color: colors.textMuted }}>
          Swipe right to save · left to skip
        </Text>
      </View>
    </View>
  );
}
