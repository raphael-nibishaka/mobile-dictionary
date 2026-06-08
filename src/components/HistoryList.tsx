import { Ionicons } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';

import { useThemeColors } from '@/hooks/useThemeColors';
import type { SearchHistoryItem } from '@/types/dictionary';
import { capitalizeWord, formatSearchDate } from '@/utils/helpers';

interface HistoryListProps {
  items: SearchHistoryItem[];
  onItemPress: (word: string) => void;
  onItemRemove?: (word: string) => void;
  onClearAll?: () => void;
  /** Renders a subtle "Show more" link; use when more items exist than shown */
  onShowMore?: () => void;
  showTimestamps?: boolean;
  title?: string;
  emptyMessage?: string;
}

/** Reusable list of previously searched words */
export function HistoryList({
  items,
  onItemPress,
  onItemRemove,
  onClearAll,
  onShowMore,
  showTimestamps = false,
  title = 'Recent searches',
  emptyMessage = 'No search history yet. Look up a word to get started.',
}: HistoryListProps) {
  const { colors } = useThemeColors();

  if (items.length === 0) {
    return (
      <View className="py-6">
        <Text className="font-body text-sm text-center" style={{ color: colors.textMuted }}>
          {emptyMessage}
        </Text>
      </View>
    );
  }

  return (
    <View>
      <View className="flex-row items-center justify-between mb-3">
        <Text className="font-headline text-lg" style={{ color: colors.text }}>
          {title}
        </Text>
        {onClearAll && items.length > 0 ? (
          <Pressable onPress={onClearAll} className="active:opacity-70">
            <Text className="font-label text-xs uppercase tracking-wider" style={{ color: colors.secondary }}>
              Clear all
            </Text>
          </Pressable>
        ) : null}
      </View>

      {items.map((item) => (
        <Pressable
          key={`${item.word}-${item.searchedAt}`}
          onPress={() => onItemPress(item.word)}
          className="flex-row items-center py-3.5 active:opacity-75"
          style={{ transform: [{ scale: 0.995 }], borderBottomWidth: 1, borderBottomColor: colors.border }}
          >
          <View
            className="w-9 h-9 rounded-full items-center justify-center mr-3"
            style={{ backgroundColor: `${colors.primary}15` }}>
            <Ionicons name="time-outline" size={18} color={colors.primary} />
          </View>
          <View className="flex-1">
            <Text className="font-body text-base" style={{ color: colors.text }}>
              {capitalizeWord(item.word)}
            </Text>
            {showTimestamps ? (
              <Text className="font-label text-xs mt-0.5" style={{ color: colors.textMuted }}>
                {formatSearchDate(item.searchedAt)}
              </Text>
            ) : null}
          </View>
          {onItemRemove ? (
            <Pressable
              onPress={() => onItemRemove(item.word)}
              hitSlop={8}
              className="p-2 active:opacity-70">
              <Ionicons name="close-circle-outline" size={20} color={colors.textMuted} />
            </Pressable>
          ) : (
            <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
          )}
        </Pressable>
      ))}

      {onShowMore ? (
        <Pressable
          onPress={onShowMore}
          hitSlop={8}
          className="self-end mt-3 py-1 px-1 active:opacity-60"
          accessibilityRole="button"
          accessibilityLabel="Show more searches">
          <Text className="font-label text-sm" style={{ color: colors.primary }}>
            Show more
          </Text>
        </Pressable>
      ) : null}
    </View>
  );
}
