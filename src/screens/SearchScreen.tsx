import { Ionicons } from '@expo/vector-icons';
import { DrawerActions } from "expo-router/react-navigation";
import { useNavigation, useRouter } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { EmptyState } from '@/components/EmptyState';
import { HistoryList } from '@/components/HistoryList';
import { SearchBar } from '@/components/SearchBar';
import { WordCard } from '@/components/WordCard';
import { APP_NAME, EXPLORE_TOPICS, POPULAR_WORDS, WORD_OF_THE_DAY_POOL } from '@/constants/api';
import { BorderRadius } from '@/constants/theme';
import { useSearchHistory } from '@/hooks/useSearchHistory';
import { useThemeColors } from '@/hooks/useThemeColors';
import { getWordOfTheDay, validateSearchInput } from '@/utils/helpers';
import { navigateToWord } from '@/utils/navigation';

/** Home screen with search, recent history, and featured words */
export function SearchScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { colors } = useThemeColors();

  const [query, setQuery] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);

  const { recentSearches, history, clearAll } = useSearchHistory();

  const wordOfTheDay = useMemo(() => getWordOfTheDay(WORD_OF_THE_DAY_POOL), []);

  // Keep the home glance short; the full list lives on the History tab.
  const HOME_RECENT_LIMIT = 3;
  const homeRecents = recentSearches.slice(0, HOME_RECENT_LIMIT);

  const handleSearch = useCallback(
    (wordOverride?: string) => {
      const searchTerm = (wordOverride ?? query).trim();
      const validation = validateSearchInput(searchTerm);

      if (validation) {
        setValidationError(validation);
        return;
      }

      setValidationError(null);
      navigateToWord(router, searchTerm);
    },
    [query, router],
  );

  const openDrawer = () => navigation.dispatch(DrawerActions.openDrawer());

  return (
    <KeyboardAvoidingView
      className="flex-1"
      style={{ backgroundColor: colors.background }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      {/* Header */}
      <View
        className="flex-row items-center justify-between px-5 pb-4"
        style={{ paddingTop: insets.top + 8 }}>
        <Pressable onPress={openDrawer} hitSlop={8} className="p-1 active:opacity-70">
          <Ionicons name="menu" size={26} color={colors.text} />
        </Pressable>
        <Text className="font-headline text-xl" style={{ color: colors.secondary }}>
          {APP_NAME}
        </Text>
        <Pressable onPress={() => handleSearch()} hitSlop={8} className="p-1 active:opacity-70">
          <Ionicons name="search" size={24} color={colors.text} />
        </Pressable>
      </View>

      <ScrollView
        className="flex-1 px-5"
        contentContainerStyle={{ paddingBottom: insets.bottom + 32 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        {/* Logo & Title */}
        <View className="items-center mb-6 mt-2">
          <View
            className="w-16 h-16 rounded-card items-center justify-center mb-3"
            style={{ backgroundColor: `${colors.primary}15` }}>
            <Ionicons name="book" size={32} color={colors.primary} />
          </View>
          <Text className="font-headline text-3xl mb-1" style={{ color: colors.text }}>
            {APP_NAME}
          </Text>
          <Text className="font-body text-base text-center" style={{ color: colors.textSecondary }}>
            Discover meanings, pronunciations & examples
          </Text>
        </View>

        {/* Search */}
        <SearchBar
          value={query}
          onChangeText={(text) => {
            setQuery(text);
            if (validationError) setValidationError(null);
          }}
          onSubmit={() => handleSearch()}
          error={validationError}
        />

        {/* Recent Searches */}
        <>
            {recentSearches.length > 0 ? (
              <View className="mt-8">
                <HistoryList
                  items={homeRecents}
                  onItemPress={(word) => handleSearch(word)}
                  onClearAll={clearAll}
                  onShowMore={
                    history.length > homeRecents.length
                      ? () => router.navigate('/history')
                      : undefined
                  }
                />
              </View>
            ) : (
              <View className="mt-8">
                <EmptyState
                  title="No recent searches"
                  message="Your search history will appear here once you look up a word."
                  icon="time-outline"
                />
              </View>
            )}

            {/* Word of the Day */}
            <View className="mt-8">
              <Text className="font-headline text-lg mb-4" style={{ color: colors.text }}>
                Popular words
              </Text>
              <View className="mb-4">
                <WordCard
                  word={wordOfTheDay}
                  subtitle="Word of the day"
                  variant="wordOfDay"
                  onPress={() => handleSearch(wordOfTheDay)}
                />
              </View>
              <View className="flex-row gap-4">
                <WordCard
                  word="pinnacle"
                  partOfSpeech="noun"
                  variant="gradient"
                  onPress={() => handleSearch('pinnacle')}
                  icon="library-outline"
                />
                <WordCard
                  word="cognitive"
                  partOfSpeech="adj"
                  variant="light"
                  onPress={() => handleSearch('cognitive')}
                  icon="bulb-outline"
                />
              </View>
            </View>

            {/* Explore Topics */}
            <View className="mt-8">
              <Text className="font-headline text-lg mb-4" style={{ color: colors.text }}>
                Explore Topics
              </Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View className="flex-row gap-2">
                  {EXPLORE_TOPICS.map((topic) => (
                    <View
                      key={topic}
                      className="px-4 py-2.5"
                      style={{
                        backgroundColor: `${colors.primary}12`,
                        borderRadius: BorderRadius.pill,
                      }}>
                      <Text className="font-label text-sm" style={{ color: colors.primary }}>
                        {topic}
                      </Text>
                    </View>
                  ))}
                </View>
              </ScrollView>
            </View>

            {/* Quick search chips */}
            <View className="mt-6">
              <Text className="font-label text-sm mb-3" style={{ color: colors.textMuted }}>
                Try searching
              </Text>
              <View className="flex-row flex-wrap gap-2">
                {POPULAR_WORDS.map((word) => (
                  <Pressable
                    key={word}
                    onPress={() => {
                      setQuery(word);
                      handleSearch(word);
                    }}
                    className="px-4 py-2 active:opacity-80"
                    style={{
                      backgroundColor: colors.surface,
                      borderRadius: BorderRadius.pill,
                      borderWidth: 1,
                      borderColor: colors.border,
                    }}>
                    <Text className="font-body text-sm" style={{ color: colors.textSecondary }}>
                      {word}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>
          </>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
