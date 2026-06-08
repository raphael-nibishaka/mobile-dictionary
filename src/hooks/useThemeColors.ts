import { useColorScheme } from 'react-native';

import { Colors } from '@/constants/theme';

/** Returns the active color palette based on system color scheme */
export function useThemeColors() {
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';

  return {
    isDark,
    colors: isDark ? Colors.dark : Colors.light,
  };
}
