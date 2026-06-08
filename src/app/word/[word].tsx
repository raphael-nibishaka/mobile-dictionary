import { useLocalSearchParams } from 'expo-router';

import { WordDetailsScreen } from '@/screens/WordDetailsScreen';

/** Dynamic route for word detail pages */
export default function WordRoute() {
  const { word } = useLocalSearchParams<{ word: string }>();

  return <WordDetailsScreen word={word ?? ''} />;
}
