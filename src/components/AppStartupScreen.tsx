import { Ionicons } from '@expo/vector-icons';
import { Text, View } from 'react-native';

import { APP_NAME } from '@/constants/api';
import { useThemeColors } from '@/hooks/useThemeColors';

/** Branded fallback shown while core app resources initialize. */
export function AppStartupScreen() {
  const { colors } = useThemeColors();

  return (
    <View className="flex-1 items-center justify-center px-6" style={{ backgroundColor: colors.background }}>
      <View
        className="w-20 h-20 items-center justify-center rounded-card mb-5"
        style={{ backgroundColor: `${colors.primary}18` }}>
        <Ionicons name="book" size={34} color={colors.primary} />
      </View>
      <Text className="font-headline text-2xl mb-2" style={{ color: colors.text }}>
        {APP_NAME}
      </Text>
      <Text className="font-body text-base text-center" style={{ color: colors.textSecondary }}>
        Loading your dictionary experience...
      </Text>
    </View>
  );
}
