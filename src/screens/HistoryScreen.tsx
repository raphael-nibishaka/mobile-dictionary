import { Ionicons } from '@expo/vector-icons';
import { DrawerActions } from "expo-router/react-navigation";
import { useNavigation, useRouter } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { HistoryList } from '@/components/HistoryList';
import { LoadingIndicator } from '@/components/LoadingIndicator';
import { useSearchHistory } from '@/hooks/useSearchHistory';
import { useThemeColors } from '@/hooks/useThemeColors';
import { navigateToWord } from '@/utils/navigation';

/** Full search history screen accessible from the drawer */
export function HistoryScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { colors } = useThemeColors();
  const { history, isLoading, removeWord, clearAll } = useSearchHistory();

  const openDrawer = () => navigation.dispatch(DrawerActions.openDrawer());

  const handleItemPress = (word: string) => {
    navigateToWord(router, word);
  };

  return (
    <View className="flex-1" style={{ backgroundColor: colors.background }}>
      <View
        className="flex-row items-center px-5 pb-4"
        style={{ paddingTop: insets.top + 8 }}>
        <Pressable onPress={openDrawer} hitSlop={8} className="p-1 active:opacity-70 mr-4">
          <Ionicons name="menu" size={26} color={colors.text} />
        </Pressable>
        <Text className="font-headline text-xl" style={{ color: colors.text }}>
          Search History
        </Text>
      </View>

      {isLoading ? (
        <LoadingIndicator message="Loading history..." />
      ) : (
        <ScrollView
          className="flex-1 px-5"
          contentContainerStyle={{ paddingBottom: insets.bottom + 32 }}
          showsVerticalScrollIndicator={false}>
          <HistoryList
            items={history}
            onItemPress={handleItemPress}
            onItemRemove={removeWord}
            onClearAll={clearAll}
            showTimestamps
            title="All searches"
            emptyMessage="You haven't searched for any words yet. Start exploring from the home screen."
          />
        </ScrollView>
      )}
    </View>
  );
}
