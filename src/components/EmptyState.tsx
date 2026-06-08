import { Ionicons } from '@expo/vector-icons';
import { Text, View } from 'react-native';

import { BorderRadius } from '@/constants/theme';
import { useThemeColors } from '@/hooks/useThemeColors';

interface EmptyStateProps {
  title?: string;
  message?: string;
  icon?: keyof typeof Ionicons.glyphMap;
}

/** Illustration-style empty state for lists and idle screens */
export function EmptyState({
  title = 'Start exploring',
  message = 'Search for any English word to discover its meaning, pronunciation, and examples.',
  icon = 'book-outline',
}: EmptyStateProps) {
  const { colors } = useThemeColors();

  return (
    <View className="items-center justify-center py-12 px-6">
      <View
        className="w-20 h-20 rounded-full items-center justify-center mb-5"
        style={{ backgroundColor: `${colors.primary}15` }}>
        <Ionicons name={icon} size={36} color={colors.primary} />
      </View>
      <Text className="font-headline text-xl mb-2 text-center" style={{ color: colors.text }}>
        {title}
      </Text>
      <Text
        className="font-body text-base text-center leading-6 max-w-xs"
        style={{ color: colors.textSecondary }}>
        {message}
      </Text>
    </View>
  );
}
