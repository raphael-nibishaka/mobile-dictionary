import { ActivityIndicator, Text, View } from 'react-native';

import { useThemeColors } from '@/hooks/useThemeColors';

interface LoadingIndicatorProps {
  message?: string;
  size?: 'small' | 'large';
}

/** Centered loading spinner with optional message */
export function LoadingIndicator({
  message = 'Searching dictionary...',
  size = 'large',
}: LoadingIndicatorProps) {
  const { colors } = useThemeColors();

  return (
    <View className="flex-1 items-center justify-center py-16 px-6">
      <View
        className="items-center justify-center p-8 rounded-card"
        style={{ backgroundColor: colors.surface }}>
        <ActivityIndicator size={size} color={colors.primary} />
        <Text
          className="font-body text-base mt-4 text-center"
          style={{ color: colors.textSecondary }}>
          {message}
        </Text>
      </View>
    </View>
  );
}
