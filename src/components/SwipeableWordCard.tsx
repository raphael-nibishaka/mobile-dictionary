import { Ionicons } from '@expo/vector-icons';
import { Dimensions, Pressable, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  FadeIn,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { DiscoveryCard } from '@/components/DiscoveryCard';
import { useThemeColors } from '@/hooks/useThemeColors';
import type { WordSearchResult } from '@/types/dictionary';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.28;
const OFF_SCREEN = SCREEN_WIDTH * 1.5;

interface SwipeableWordCardProps {
  result: WordSearchResult;
  onSwipeRight: () => void;
  onSwipeLeft: () => void;
  onPress: () => void;
}

/**
 * A draggable word card. Swiping past the threshold flings it off-screen and
 * fires the corresponding callback; otherwise it springs back to center.
 */
export function SwipeableWordCard({
  result,
  onSwipeRight,
  onSwipeLeft,
  onPress,
}: SwipeableWordCardProps) {
  const { colors } = useThemeColors();
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  const pan = Gesture.Pan()
    .onUpdate((event) => {
      translateX.value = event.translationX;
      translateY.value = event.translationY * 0.15;
    })
    .onEnd((event) => {
      if (event.translationX > SWIPE_THRESHOLD) {
        translateX.value = withTiming(OFF_SCREEN, { duration: 240 }, () => {
          runOnJS(onSwipeRight)();
        });
      } else if (event.translationX < -SWIPE_THRESHOLD) {
        translateX.value = withTiming(-OFF_SCREEN, { duration: 240 }, () => {
          runOnJS(onSwipeLeft)();
        });
      } else {
        translateX.value = withSpring(0);
        translateY.value = withSpring(0);
      }
    });

  const cardStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { rotateZ: `${interpolate(translateX.value, [-SCREEN_WIDTH, 0, SCREEN_WIDTH], [-10, 0, 10])}deg` },
    ],
  }));

  const saveBadgeStyle = useAnimatedStyle(() => ({
    opacity: interpolate(translateX.value, [0, SWIPE_THRESHOLD], [0, 1], 'clamp'),
  }));

  const skipBadgeStyle = useAnimatedStyle(() => ({
    opacity: interpolate(translateX.value, [-SWIPE_THRESHOLD, 0], [1, 0], 'clamp'),
  }));

  return (
    <GestureDetector gesture={pan}>
      <Animated.View entering={FadeIn.duration(220)} className="w-full h-full" style={cardStyle}>
        {/* Swipe-intent badges */}
        <Animated.View
          pointerEvents="none"
          className="absolute z-10 top-6 left-6 px-3 py-1.5 rounded-xl border-2"
          style={[{ borderColor: colors.success }, saveBadgeStyle]}>
          <View className="flex-row items-center">
            <Ionicons name="heart" size={16} color={colors.success} />
            <View className="w-1" />
            <Animated.Text className="font-label text-sm font-bold" style={{ color: colors.success }}>
              SAVE
            </Animated.Text>
          </View>
        </Animated.View>

        <Animated.View
          pointerEvents="none"
          className="absolute z-10 top-6 right-6 px-3 py-1.5 rounded-xl border-2"
          style={[{ borderColor: colors.error }, skipBadgeStyle]}>
          <Animated.Text className="font-label text-sm font-bold" style={{ color: colors.error }}>
            SKIP
          </Animated.Text>
        </Animated.View>

        <Pressable onPress={onPress} className="w-full h-full">
          <DiscoveryCard result={result} />
        </Pressable>
      </Animated.View>
    </GestureDetector>
  );
}
