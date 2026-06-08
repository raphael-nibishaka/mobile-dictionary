import { useRouter } from 'expo-router';

type AppRouter = ReturnType<typeof useRouter>;

/** How to enter the word details route */
type NavigationMode = 'push' | 'replace';

/**
 * Navigate to the word details screen with typed route params.
 *
 * Use `'push'` (default) from list/home screens so the back button returns
 * to the list. Use `'replace'` when already on a word screen (e.g. tapping a
 * synonym) so chained look-ups don't grow the navigation stack indefinitely.
 */
export function navigateToWord(
  router: AppRouter,
  word: string,
  mode: NavigationMode = 'push',
): void {
  const params = { word: word.trim().toLowerCase() };
  const target = { pathname: '/word/[word]' as const, params };

  if (mode === 'replace') {
    router.replace(target);
    return;
  }

  router.push(target);
}
