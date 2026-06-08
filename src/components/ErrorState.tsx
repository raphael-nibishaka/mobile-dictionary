import { Ionicons } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';

import { BorderRadius } from '@/constants/theme';
import { useThemeColors } from '@/hooks/useThemeColors';
import type { AppError } from '@/types/dictionary';
import { getErrorIcon, getErrorTitle } from '@/utils/helpers';

interface ErrorStateProps {
  error: AppError | string;
  onRetry?: () => void;
  compact?: boolean;
}

/** Friendly error display with optional retry action */
export function ErrorState({ error, onRetry, compact = false }: ErrorStateProps) {
  const { colors } = useThemeColors();

  const appError: AppError =
    typeof error === 'string'
      ? { type: 'unknown', message: error, retryable: Boolean(onRetry) }
      : error;

  const title = getErrorTitle(appError.type);
  const icon = getErrorIcon(appError.type);

  return (
    <View className={`items-center justify-center ${compact ? 'py-8 px-4' : 'flex-1 py-16 px-6'}`}>
      <View
        className="items-center p-8 w-full max-w-sm rounded-card"
        style={{
          backgroundColor: colors.surface,
          shadowColor: colors.cardShadow,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.15,
          shadowRadius: 12,
          elevation: 4,
        }}>
        <View
          className="w-16 h-16 rounded-full items-center justify-center mb-4"
          style={{ backgroundColor: `${colors.error}20` }}>
          <Ionicons name={icon} size={32} color={colors.error} />
        </View>
        <Text className="font-headline text-xl mb-2 text-center" style={{ color: colors.text }}>
          {title}
        </Text>
        <Text
          className="font-body text-base text-center leading-6"
          style={{ color: colors.textSecondary }}>
          {appError.message}
        </Text>
        {onRetry && appError.retryable !== false ? (
          <Pressable
            onPress={onRetry}
            className="mt-6 px-8 py-3 active:opacity-80"
            style={{ backgroundColor: colors.primary, borderRadius: BorderRadius.button }}>
            <Text className="font-label text-base text-white font-medium">Try Again</Text>
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}
