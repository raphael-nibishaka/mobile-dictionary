import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useRef } from 'react';
import { Animated, Easing, Text, View } from 'react-native';

import { APP_NAME } from '@/constants/api';
import { useThemeColors } from '@/hooks/useThemeColors';

/** Branded fallback shown while core app resources initialize. */
export function AppStartupScreen() {
  const { colors, isDark } = useThemeColors();
  const pulse = useRef(new Animated.Value(0.92)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: 900,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 0.92,
          duration: 900,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    );

    animation.start();
    return () => animation.stop();
  }, [pulse]);

  return (
    <LinearGradient
      colors={
        isDark
          ? [colors.background, '#131E36', colors.background]
          : ['#F7F8FF', colors.background, '#EEF2FF']
      }
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{ flex: 1 }}>
      <View className="flex-1 items-center justify-center px-6">
        <Animated.View
          className="w-24 h-24 items-center justify-center rounded-card mb-6"
          style={{
            backgroundColor: `${colors.primary}1F`,
            transform: [{ scale: pulse }],
            shadowColor: colors.cardShadow,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.22,
            shadowRadius: 10,
            elevation: 6,
          }}>
          <View
            className="w-16 h-16 rounded-full items-center justify-center"
            style={{ backgroundColor: `${colors.primary}2B` }}>
            <Ionicons name="book" size={30} color={colors.primary} />
          </View>
        </Animated.View>

        <Text className="font-headline text-3xl mb-2" style={{ color: colors.text }}>
          {APP_NAME}
        </Text>
        <Text className="font-label text-sm uppercase tracking-widest mb-3" style={{ color: colors.secondary }}>
          Dictionary and Learning
        </Text>
        <Text className="font-body text-base text-center" style={{ color: colors.textSecondary }}>
          Preparing your personalized word journey...
        </Text>
      </View>
    </LinearGradient>
  );
}
