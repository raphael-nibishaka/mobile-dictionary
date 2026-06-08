import { ActivityIndicator, Text, View } from 'react-native';

import { useThemeColors } from '@/hooks/useThemeColors';

interface LoadingIndicatorProps {
  message?: string;
  size?: 'small' | 'large';
  variant?: 'spinner' | 'skeleton';
  skeletonRows?: number;
}

/** Centered loading spinner with optional message */
export function LoadingIndicator({
  message = 'Searching dictionary...',
  size = 'large',
  variant = 'spinner',
  skeletonRows = 4,
}: LoadingIndicatorProps) {
  const { colors } = useThemeColors();

  if (variant === 'skeleton') {
    return (
      <View className="flex-1 px-5 pt-6">
        <View
          className="mb-5 rounded-card"
          style={{
            backgroundColor: colors.surface,
            borderColor: colors.border,
            borderWidth: 1,
            padding: 18,
          }}>
          <View className="mb-3 h-4 w-28 rounded-full" style={{ backgroundColor: colors.surfaceSecondary }} />
          <View className="mb-3 h-5 w-full rounded-full" style={{ backgroundColor: colors.surfaceSecondary }} />
          <View className="h-5 w-3/4 rounded-full" style={{ backgroundColor: colors.surfaceSecondary }} />
        </View>

        {Array.from({ length: skeletonRows }).map((_, index) => (
          <View
            key={`skeleton-row-${index}`}
            className="mb-4 rounded-card"
            style={{
              backgroundColor: colors.surface,
              borderColor: colors.border,
              borderWidth: 1,
              padding: 18,
            }}>
            <View className="mb-3 h-3 w-20 rounded-full" style={{ backgroundColor: colors.surfaceSecondary }} />
            <View className="mb-2 h-4 w-full rounded-full" style={{ backgroundColor: colors.surfaceSecondary }} />
            <View className="mb-2 h-4 w-11/12 rounded-full" style={{ backgroundColor: colors.surfaceSecondary }} />
            <View className="h-4 w-2/3 rounded-full" style={{ backgroundColor: colors.surfaceSecondary }} />
          </View>
        ))}

        <Text className="font-body text-sm text-center mt-2" style={{ color: colors.textMuted }}>
          {message}
        </Text>
      </View>
    );
  }

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
