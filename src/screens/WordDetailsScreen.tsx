import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, Share, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { EmptyState } from '@/components/EmptyState';
import { ErrorState } from '@/components/ErrorState';
import { LoadingIndicator } from '@/components/LoadingIndicator';
import { MeaningCard } from '@/components/MeaningCard';
import { PronunciationGroup } from '@/components/PronunciationGroup';
import { SearchBar } from '@/components/SearchBar';
import { BorderRadius, Gradients } from '@/constants/theme';
import { useDictionary } from '@/hooks/useDictionary';
import { useFavorites } from '@/hooks/useFavorites';
import { useSearchHistory } from '@/hooks/useSearchHistory';
import { useThemeColors } from '@/hooks/useThemeColors';
import { buildShareText, capitalizeWord, validateSearchInput } from '@/utils/helpers';
import { navigateToWord } from '@/utils/navigation';

interface WordDetailsScreenProps {
  word: string;
}

/** Word details screen showing definitions, phonetics, and pronunciation */
export function WordDetailsScreen({ word }: WordDetailsScreenProps) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors } = useThemeColors();

  const { result, isLoading, error, searchWord } = useDictionary();
  const { refreshHistory } = useSearchHistory();
  const { toggle: toggleFavorite, isFavorite } = useFavorites();
  const [hasFetched, setHasFetched] = useState(false);
  const [query, setQuery] = useState('');
  const [queryError, setQueryError] = useState<string | null>(null);
  const [trackedWord, setTrackedWord] = useState(word);

  // Reset the inline search field when navigating to a different word:
  // router.replace reuses this component instance for the /word/[word] route,
  // so we clear during render rather than in an effect.
  if (word !== trackedWord) {
    setTrackedWord(word);
    setQuery('');
    setQueryError(null);
  }

  const fetchWord = useCallback(async () => {
    if (!word) return;
    const searchResult = await searchWord(decodeURIComponent(word));
    if (searchResult) {
      await refreshHistory();
    }
    setHasFetched(true);
  }, [word, searchWord, refreshHistory]);

  useEffect(() => {
    fetchWord();
  }, [fetchWord]);

  const handleRetry = () => fetchWord();

  const handleWordPress = useCallback(
    (nextWord: string) => navigateToWord(router, nextWord, 'replace'),
    [router],
  );

  // Search a new word in place, keeping the back button pointed at the
  // originating screen instead of stacking endless detail screens.
  const handleSubmitSearch = useCallback(() => {
    const term = query.trim();
    const validation = validateSearchInput(term);
    if (validation) {
      setQueryError(validation);
      return;
    }
    setQueryError(null);
    navigateToWord(router, term, 'replace');
  }, [query, router]);

  // Distinct parts of speech for an at-a-glance overview of the entry.
  const partsOfSpeech = useMemo(
    () => [...new Set((result?.meanings ?? []).map((meaning) => meaning.partOfSpeech))],
    [result],
  );

  const handleToggleFavorite = useCallback(async () => {
    if (!result) return;
    await toggleFavorite({
      word: result.word,
      phonetic: result.phonetic,
      partOfSpeech: result.meanings[0]?.partOfSpeech,
    });
  }, [result, toggleFavorite]);

  const handleShare = useCallback(async () => {
    if (!result) return;
    try {
      await Share.share({ message: buildShareText(result) });
    } catch {
      // User dismissed the share sheet or sharing is unavailable — no action needed.
    }
  }, [result]);

  const saved = result ? isFavorite(result.word) : false;

  return (
    <View className="flex-1" style={{ backgroundColor: colors.background }}>
      {/* Gradient Header */}
      <LinearGradient
        colors={[...Gradients.primary]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          paddingTop: insets.top + 8,
          paddingBottom: 20,
          paddingHorizontal: 20,
          borderBottomLeftRadius: BorderRadius.card,
          borderBottomRightRadius: BorderRadius.card,
        }}>
        <View className="flex-row items-center justify-between mb-5">
          <View className="flex-row items-center">
            <Pressable
              onPress={() => router.back()}
              hitSlop={8}
              className="w-10 h-10 rounded-full bg-white/20 items-center justify-center active:opacity-80"
              accessibilityRole="button"
              accessibilityLabel="Go back">
              <Ionicons name="arrow-back" size={22} color="#FFFFFF" />
            </Pressable>
            <Text className="font-body text-base text-white/80 ml-4">Word Details</Text>
          </View>

          {result && !isLoading ? (
            <View className="flex-row items-center gap-2">
              <Pressable
                onPress={handleShare}
                hitSlop={8}
                className="w-10 h-10 rounded-full bg-white/20 items-center justify-center active:opacity-80"
                accessibilityRole="button"
                accessibilityLabel="Share this word">
                <Ionicons name="share-outline" size={20} color="#FFFFFF" />
              </Pressable>
              <Pressable
                onPress={handleToggleFavorite}
                hitSlop={8}
                className="w-10 h-10 rounded-full bg-white/20 items-center justify-center active:opacity-80"
                accessibilityRole="button"
                accessibilityState={{ selected: saved }}
                accessibilityLabel={saved ? 'Remove from favorites' : 'Add to favorites'}>
                <Ionicons name={saved ? 'heart' : 'heart-outline'} size={20} color="#FFFFFF" />
              </Pressable>
            </View>
          ) : null}
        </View>

        {result && !isLoading ? (
          <View className="mb-5">
            <Text className="font-headline text-4xl text-white mb-2">
              {capitalizeWord(result.word)}
            </Text>
            <View className="flex-row items-center flex-wrap gap-y-2">
              {result.phonetic ? (
                <Text className="font-body text-lg text-white/90 mr-3">{result.phonetic}</Text>
              ) : null}
              <PronunciationGroup
                audioUrls={result.audioUrls}
                fallbackText={result.word}
                tone="onDark"
              />
            </View>

            {partsOfSpeech.length > 0 ? (
              <View className="flex-row flex-wrap gap-2 mt-4">
                {partsOfSpeech.map((partOfSpeech) => (
                  <View
                    key={partOfSpeech}
                    className="px-3 py-1 rounded-full"
                    style={{ backgroundColor: '#FFFFFF26' }}>
                    <Text className="font-label text-xs uppercase tracking-wider text-white">
                      {partOfSpeech}
                    </Text>
                  </View>
                ))}
              </View>
            ) : null}
          </View>
        ) : (
          <View className="mb-5 py-2">
            <Text className="font-headline text-3xl text-white/60">
              {capitalizeWord(decodeURIComponent(word))}
            </Text>
          </View>
        )}

        {/* Persistent search so users can look up the next word in place */}
        <SearchBar
          value={query}
          onChangeText={(text) => {
            setQuery(text);
            if (queryError) setQueryError(null);
          }}
          onSubmit={handleSubmitSearch}
          error={queryError}
          placeholder="Search another word..."
        />
      </LinearGradient>

      {/* Content */}
      {isLoading ? (
        <LoadingIndicator message="Fetching definition..." variant="skeleton" skeletonRows={3} />
      ) : error ? (
        <ErrorState error={error} onRetry={handleRetry} />
      ) : result && result.meanings.length > 0 ? (
        <ScrollView
          className="flex-1 px-5"
          contentContainerStyle={{ paddingTop: 20, paddingBottom: insets.bottom + 32 }}
          showsVerticalScrollIndicator={false}>
          <View className="flex-row items-baseline justify-between mb-4">
            <Text className="font-headline text-lg" style={{ color: colors.text }}>
              Definitions
            </Text>
            <Text className="font-label text-sm" style={{ color: colors.textMuted }}>
              {result.meanings.length} {result.meanings.length === 1 ? 'meaning' : 'meanings'}
            </Text>
          </View>
          {result.meanings.map((meaning, index) => (
            <MeaningCard
              key={`${meaning.partOfSpeech}-${index}`}
              meaning={meaning}
              index={index}
              onWordPress={handleWordPress}
            />
          ))}
        </ScrollView>
      ) : hasFetched ? (
        <EmptyState
          title="No definitions found"
          message="This word was found but has no available definitions."
          icon="document-text-outline"
        />
      ) : null}
    </View>
  );
}
