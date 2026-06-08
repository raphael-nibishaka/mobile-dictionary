import { Pressable, Text, View } from 'react-native';

import { BorderRadius } from '@/constants/theme';
import { useThemeColors } from '@/hooks/useThemeColors';
import type { DictionaryDefinition, DictionaryMeaning } from '@/types/dictionary';

interface MeaningCardProps {
  meaning: DictionaryMeaning;
  index: number;
  /** Invoked when a synonym/antonym chip is tapped, to look that word up */
  onWordPress?: (word: string) => void;
}

/** Card displaying a part of speech with its definitions and examples */
export function MeaningCard({ meaning, index, onWordPress }: MeaningCardProps) {
  const { colors } = useThemeColors();

  return (
    <View
      className="mb-4 overflow-hidden"
      style={{
        backgroundColor: colors.surface,
        borderRadius: BorderRadius.card,
        borderWidth: 1,
        borderColor: colors.border,
        shadowColor: colors.cardShadow,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
      }}>
      <View className="flex-row items-center px-5 pt-5 pb-3">
        <View
          className="px-3 py-1 rounded-full mr-3"
          style={{ backgroundColor: `${colors.secondary}20` }}>
          <Text
            className="font-label text-xs uppercase tracking-wider font-semibold"
            style={{ color: colors.secondary }}>
            {meaning.partOfSpeech}
          </Text>
        </View>
        <Text className="font-label text-sm" style={{ color: colors.textMuted }}>
          Meaning {index + 1}
        </Text>
      </View>

      <View className="px-5 pb-5">
        {meaning.definitions.map((definition, defIndex) => (
          <DefinitionItem
            key={`${meaning.partOfSpeech}-${defIndex}`}
            definition={definition}
            number={defIndex + 1}
            isLast={defIndex === meaning.definitions.length - 1}
            onWordPress={onWordPress}
          />
        ))}

        <WordChipGroup
          label="Synonyms"
          words={meaning.synonyms}
          tone="primary"
          onWordPress={onWordPress}
        />
        <WordChipGroup
          label="Antonyms"
          words={meaning.antonyms}
          tone="secondary"
          onWordPress={onWordPress}
        />
      </View>
    </View>
  );
}

interface DefinitionItemProps {
  definition: DictionaryDefinition;
  number: number;
  isLast: boolean;
  onWordPress?: (word: string) => void;
}

function DefinitionItem({ definition, number, isLast, onWordPress }: DefinitionItemProps) {
  const { colors } = useThemeColors();

  return (
    <View className={`py-3 ${!isLast ? 'border-b' : ''}`} style={{ borderColor: colors.border }}>
      <View className="flex-row">
        <Text className="font-label text-sm mr-2 mt-0.5" style={{ color: colors.primary }}>
          {number}.
        </Text>
        <View className="flex-1">
          <Text className="font-body text-base leading-6" style={{ color: colors.text }}>
            {definition.definition}
          </Text>
          {definition.example ? (
            <View
              className="mt-3 px-4 py-3 rounded-xl"
              style={{ backgroundColor: `${colors.primary}10` }}>
              <Text className="font-body text-sm italic leading-5" style={{ color: colors.textSecondary }}>
                {`“${definition.example}”`}
              </Text>
            </View>
          ) : null}
          <WordChipGroup
            label="Synonyms"
            words={definition.synonyms}
            tone="primary"
            onWordPress={onWordPress}
          />
          <WordChipGroup
            label="Antonyms"
            words={definition.antonyms}
            tone="secondary"
            onWordPress={onWordPress}
          />
        </View>
      </View>
    </View>
  );
}

interface WordChipGroupProps {
  label: string;
  words?: string[];
  tone: 'primary' | 'secondary';
  onWordPress?: (word: string) => void;
}

/** Renders a labelled row of tappable word chips that trigger a new search */
function WordChipGroup({ label, words, tone, onWordPress }: WordChipGroupProps) {
  const { colors } = useThemeColors();

  if (!words || words.length === 0) return null;

  const accent = tone === 'primary' ? colors.primary : colors.secondary;
  const unique = [...new Set(words)].slice(0, 8);

  return (
    <View className="mt-3">
      <Text className="font-label text-xs uppercase tracking-wider mb-2" style={{ color: colors.textMuted }}>
        {label}
      </Text>
      <View className="flex-row flex-wrap gap-2">
        {unique.map((word) => (
          <Pressable
            key={word}
            onPress={() => onWordPress?.(word)}
            disabled={!onWordPress}
            className="px-3 py-1.5 active:opacity-70"
            style={{ backgroundColor: `${accent}15`, borderRadius: BorderRadius.pill }}
            accessibilityRole="button"
            accessibilityLabel={`Look up ${word}`}>
            <Text className="font-label text-sm" style={{ color: accent }}>
              {word}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}
