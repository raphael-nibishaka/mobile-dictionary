import { Ionicons } from '@expo/vector-icons';
import { DrawerActions } from 'expo-router/react-navigation';
import { useNavigation, useRouter } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { EmptyState } from '@/components/EmptyState';
import { LoadingIndicator } from '@/components/LoadingIndicator';
import { BorderRadius } from '@/constants/theme';
import { useFavorites } from '@/hooks/useFavorites';
import { useThemeColors } from '@/hooks/useThemeColors';
import { capitalizeWord } from '@/utils/helpers';
import { navigateToWord } from '@/utils/navigation';

/** Saved words screen accessible from the tab bar and drawer */
export function FavoritesScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { colors } = useThemeColors();
  const { favorites, isLoading, remove, clearAll } = useFavorites();

  const openDrawer = () => navigation.dispatch(DrawerActions.openDrawer());

  return (
    <View className="flex-1" style={{ backgroundColor: colors.background }}>
      <View
        className="flex-row items-center justify-between px-5 pb-4"
        style={{ paddingTop: insets.top + 8 }}>
        <View className="flex-row items-center">
          <Pressable onPress={openDrawer} hitSlop={8} className="p-1 active:opacity-70 mr-4">
            <Ionicons name="menu" size={26} color={colors.text} />
          </Pressable>
          <Text className="font-headline text-xl" style={{ color: colors.text }}>
            Favorites
          </Text>
        </View>
        {favorites.length > 0 ? (
          <Pressable onPress={clearAll} hitSlop={8} className="active:opacity-70">
            <Text
              className="font-label text-xs uppercase tracking-wider"
              style={{ color: colors.secondary }}>
              Clear all
            </Text>
          </Pressable>
        ) : null}
      </View>

      {isLoading ? (
        <LoadingIndicator message="Loading favorites..." />
      ) : favorites.length === 0 ? (
        <EmptyState
          title="No favorites yet"
          message="Tap the heart on any word to save it here for quick access later."
          icon="heart-outline"
        />
      ) : (
        <ScrollView
          className="flex-1 px-5"
          contentContainerStyle={{ paddingTop: 8, paddingBottom: insets.bottom + 32 }}
          showsVerticalScrollIndicator={false}>
          {favorites.map((item) => (
            <Pressable
              key={`${item.word}-${item.savedAt}`}
              onPress={() => navigateToWord(router, item.word)}
              className="flex-row items-center p-4 mb-3 active:opacity-80"
              style={{
                backgroundColor: colors.surface,
                borderRadius: BorderRadius.card,
                borderWidth: 1,
                borderColor: colors.border,
              }}
              accessibilityRole="button"
              accessibilityLabel={`Open ${item.word}`}>
              <View
                className="w-10 h-10 rounded-full items-center justify-center mr-3"
                style={{ backgroundColor: `${colors.primary}15` }}>
                <Ionicons name="heart" size={18} color={colors.primary} />
              </View>
              <View className="flex-1">
                <Text className="font-body text-base" style={{ color: colors.text }}>
                  {capitalizeWord(item.word)}
                </Text>
                <Text className="font-label text-xs mt-0.5" style={{ color: colors.textMuted }}>
                  {[item.phonetic, item.partOfSpeech].filter(Boolean).join('  ·  ') || 'Saved word'}
                </Text>
              </View>
              <Pressable
                onPress={() => remove(item.word)}
                hitSlop={8}
                className="p-2 active:opacity-70"
                accessibilityRole="button"
                accessibilityLabel={`Remove ${item.word} from favorites`}>
                <Ionicons name="close-circle-outline" size={20} color={colors.textMuted} />
              </Pressable>
            </Pressable>
          ))}
        </ScrollView>
      )}
    </View>
  );
}
