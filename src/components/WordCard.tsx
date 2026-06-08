import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, Text, View } from 'react-native';

import { BorderRadius, Gradients } from '@/constants/theme';
import { useThemeColors } from '@/hooks/useThemeColors';
import { capitalizeWord } from '@/utils/helpers';

interface WordCardProps {
  word: string;
  partOfSpeech?: string;
  variant?: 'gradient' | 'light' | 'wordOfDay';
  subtitle?: string;
  onPress?: () => void;
  icon?: keyof typeof Ionicons.glyphMap;
}

/** Featured word card for home screen highlights */
export function WordCard({
  word,
  partOfSpeech,
  variant = 'light',
  subtitle,
  onPress,
  icon = 'book-outline',
}: WordCardProps) {
  const { colors, isDark } = useThemeColors();

  const content = (
    <>
      <View className="flex-row items-center justify-between mb-3">
        <Ionicons
          name={icon}
          size={22}
          color={variant === 'light' ? colors.primary : '#FFFFFF'}
        />
        <Ionicons
          name="trending-up"
          size={18}
          color={variant === 'light' ? colors.secondary : '#FFFFFF90'}
        />
      </View>
      {subtitle ? (
        <Text
          className="font-label text-xs uppercase tracking-widest mb-1"
          style={{ color: variant === 'light' ? colors.textMuted : '#FFFFFF90' }}>
          {subtitle}
        </Text>
      ) : null}
      {partOfSpeech ? (
        <Text
          className="font-label text-xs uppercase tracking-wider mb-1"
          style={{ color: variant === 'light' ? colors.secondary : '#FFFFFFB0' }}>
          {partOfSpeech}
        </Text>
      ) : null}
      <Text
        className="font-headline text-2xl"
        style={{ color: variant === 'light' ? colors.text : '#FFFFFF' }}>
        {capitalizeWord(word)}
      </Text>
    </>
  );

  if (variant === 'gradient' || variant === 'wordOfDay') {
    const gradientColors =
      variant === 'wordOfDay' ? Gradients.wordOfDay : Gradients.primary;

    return (
      <Pressable onPress={onPress} className="active:opacity-90 flex-1">
        <LinearGradient
          colors={[...gradientColors]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            borderRadius: BorderRadius.card,
            padding: 20,
            minHeight: variant === 'wordOfDay' ? 160 : 120,
            shadowColor: colors.cardShadow,
            shadowOffset: { width: 0, height: 3 },
            shadowOpacity: 0.18,
            shadowRadius: 6,
            elevation: 4,
          }}>
          {content}
        </LinearGradient>
      </Pressable>
    );
  }

  return (
    <Pressable onPress={onPress} className="active:opacity-90 flex-1">
      <View
        style={{
          backgroundColor: isDark ? colors.surfaceSecondary : colors.surface,
          borderRadius: BorderRadius.card,
          padding: 20,
          minHeight: 120,
          borderWidth: 1,
          borderColor: colors.border,
          shadowColor: colors.cardShadow,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.08,
          shadowRadius: 5,
          elevation: 2,
        }}>
        {content}
      </View>
    </Pressable>
  );
}
