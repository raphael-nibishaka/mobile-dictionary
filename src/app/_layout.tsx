import '@/global.css';
import 'react-native-reanimated';

import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  useFonts as useInterFonts,
} from '@expo-google-fonts/inter';
import {
  Montserrat_600SemiBold,
  Montserrat_700Bold,
  useFonts as useMontserratFonts,
} from '@expo-google-fonts/montserrat';
import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useMemo } from 'react';
import { useColorScheme } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { ErrorBoundary } from '@/components/ErrorBoundary';
import { Colors } from '@/constants/theme';
import { FavoritesProvider } from '@/context/FavoritesProvider';
import { SearchHistoryProvider } from '@/context/SearchHistoryProvider';

SplashScreen.preventAutoHideAsync();

/** Root layout: fonts, providers, stack navigation */
export default function RootLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const themeColors = isDark ? Colors.dark : Colors.light;

  const [montserratLoaded] = useMontserratFonts({
    Montserrat_600SemiBold,
    Montserrat_700Bold,
  });

  const [interLoaded] = useInterFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
  });

  const fontsLoaded = montserratLoaded && interLoaded;

  // Match the navigation container background to our palette so the
  // status-bar / system-nav regions never show the default black backdrop.
  const navigationTheme = useMemo(() => {
    const base = isDark ? DarkTheme : DefaultTheme;
    return {
      ...base,
      colors: {
        ...base.colors,
        background: themeColors.background,
        card: themeColors.background,
        text: themeColors.text,
        border: themeColors.border,
        primary: themeColors.primary,
      },
    };
  }, [isDark, themeColors]);

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: themeColors.background }}>
      <SafeAreaProvider>
        <ErrorBoundary>
          <SearchHistoryProvider>
            <FavoritesProvider>
              <ThemeProvider value={navigationTheme}>
                <StatusBar style={isDark ? 'light' : 'dark'} />
                <Stack
                  screenOptions={{
                    headerShown: false,
                    contentStyle: { backgroundColor: themeColors.background },
                    animation: 'slide_from_right',
                  }}>
                  <Stack.Screen name="(drawer)" />
                  <Stack.Screen
                    name="word/[word]"
                    options={{
                      presentation: 'card',
                      animation: 'slide_from_bottom',
                    }}
                  />
                </Stack>
              </ThemeProvider>
            </FavoritesProvider>
          </SearchHistoryProvider>
        </ErrorBoundary>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
