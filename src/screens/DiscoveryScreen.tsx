import { Ionicons } from '@expo/vector-icons';
import { DrawerActions } from 'expo-router/react-navigation';
import { useNavigation, useRouter } from 'expo-router';
import { useCallback } from 'react';
import { ActivityIndicator, Dimensions, Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { DiscoveryCard } from '@/components/DiscoveryCard';
import { ErrorState } from '@/components/ErrorState';
import { LoadingIndicator } from '@/components/LoadingIndicator';
import { SwipeableWordCard } from '@/components/SwipeableWordCard';
import { useDiscovery } from '@/hooks/useDiscovery';
import { useFavorites } from '@/hooks/useFavorites';
import { useThemeColors } from '@/hooks/useThemeColors';
import { navigateToWord } from '@/utils/navigation';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const CARD_HEIGHT = Math.min(460, SCREEN_HEIGHT * 0.55);

/** Swipeable "Discover" feed of random words */
export function DiscoveryScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { colors } = useThemeColors();

  const { current, upcoming, isInitialLoading, hasError, next, retry } = useDiscovery();
  const { toggle, isFavorite } = useFavorites();

  const openDrawer = () => navigation.dispatch(DrawerActions.openDrawer());

  const handleSave = useCallback(() => {
    if (current && !isFavorite(current.word)) {
      void toggle({
        word: current.word,
        phonetic: current.phonetic,
        partOfSpeech: current.meanings[0]?.partOfSpeech,
      });
    }
    next();
  }, [current, isFavorite, toggle, next]);

  const handleSkip = useCallback(() => next(), [next]);

  const handleOpen = useCallback(() => {
    if (current) navigateToWord(router, current.word);
  }, [current, router]);

  const saved = current ? isFavorite(current.word) : false;

  return (
    <View className="flex-1" style={{ backgroundColor: colors.background }}>
      {/* Header */}
      <View
        className="flex-row items-center justify-between px-5 pb-4"
        style={{ paddingTop: insets.top + 8 }}>
        <View className="flex-row items-center">
          <Pressable onPress={openDrawer} hitSlop={8} className="p-1 active:opacity-70 mr-4">
            <Ionicons name="menu" size={26} color={colors.text} />
          </Pressable>
          <Text className="font-headline text-xl" style={{ color: colors.text }}>
            Discover
          </Text>
        </View>
        <Pressable
          onPress={retry}
          hitSlop={8}
          className="p-1 active:opacity-70"
          accessibilityRole="button"
          accessibilityLabel="Shuffle new words">
          <Ionicons name="shuffle" size={24} color={colors.primary} />
        </Pressable>
      </View>

      {isInitialLoading ? (
        <LoadingIndicator message="Finding interesting words..." />
      ) : hasError ? (
        <ErrorState
          error="Couldn't load words. Check your connection and try again."
          onRetry={retry}
        />
      ) : (
        <View className="flex-1">
          {/* Card deck */}
          <View className="flex-1 items-center justify-center px-5">
            <View style={{ width: '100%', height: CARD_HEIGHT }}>
              {upcoming ? (
                <View
                  className="absolute inset-0"
                  style={{ transform: [{ scale: 0.94 }, { translateY: 18 }], opacity: 0.55 }}>
                  <DiscoveryCard result={upcoming} />
                </View>
              ) : null}

              {current ? (
                <View className="absolute inset-0">
                  <SwipeableWordCard
                    key={current.word}
                    result={current}
                    onSwipeRight={handleSave}
                    onSwipeLeft={handleSkip}
                    onPress={handleOpen}
                  />
                </View>
              ) : (
                <View className="flex-1 items-center justify-center">
                  <ActivityIndicator size="large" color={colors.primary} />
                </View>
              )}
            </View>
          </View>

          {/* Action buttons */}
          <View
            className="flex-row items-center justify-center gap-6"
            style={{ paddingBottom: insets.bottom + 16, paddingTop: 8 }}>
            <ActionButton
              icon="close"
              color={colors.error}
              onPress={handleSkip}
              label="Skip word"
            />
            <ActionButton
              icon="open-outline"
              color={colors.primary}
              size={56}
              onPress={handleOpen}
              label="Open full definition"
            />
            <ActionButton
              icon={saved ? 'heart' : 'heart-outline'}
              color={colors.success}
              onPress={handleSave}
              label={saved ? 'Saved — next word' : 'Save word'}
            />
          </View>
        </View>
      )}
    </View>
  );
}

interface ActionButtonProps {
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  onPress: () => void;
  label: string;
  size?: number;
}

function ActionButton({ icon, color, onPress, label, size = 64 }: ActionButtonProps) {
  const { colors } = useThemeColors();

  return (
    <Pressable
      onPress={onPress}
      className="items-center justify-center active:opacity-70"
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: colors.surface,
        borderWidth: 1.5,
        borderColor: `${color}40`,
        shadowColor: colors.cardShadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
      }}
      accessibilityRole="button"
      accessibilityLabel={label}>
      <Ionicons name={icon} size={size * 0.42} color={color} />
    </Pressable>
  );
}
