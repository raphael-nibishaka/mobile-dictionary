import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { usePathname, useRouter } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { HistoryList } from '@/components/HistoryList';
import { APP_NAME } from '@/constants/api';
import { Gradients } from '@/constants/theme';
import { useSearchHistory } from '@/hooks/useSearchHistory';
import { useThemeColors } from '@/hooks/useThemeColors';
import { navigateToWord } from '@/utils/navigation';

interface CustomDrawerProps {
  navigation: { closeDrawer: () => void };
}

interface DrawerNavItem {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  href: '/' | '/discover' | '/favorites' | '/history';
}

const NAV_ITEMS: DrawerNavItem[] = [
  { label: 'Home', icon: 'home-outline', href: '/' },
  { label: 'Discover', icon: 'sparkles-outline', href: '/discover' },
  { label: 'Favorites', icon: 'heart-outline', href: '/favorites' },
  { label: 'Search History', icon: 'time-outline', href: '/history' },
];

/** Keep the drawer preview short; the full list lives on the History tab. */
const DRAWER_RECENT_LIMIT = 4;

/** Custom drawer content with navigation links and live search history */
export function CustomDrawer({ navigation }: CustomDrawerProps) {
  const router = useRouter();
  const pathname = usePathname();
  const insets = useSafeAreaInsets();
  const { colors } = useThemeColors();
  const { history, clearAll } = useSearchHistory();

  const isActive = (href: DrawerNavItem['href']) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  const navigateTo = (href: DrawerNavItem['href']) => {
    navigation.closeDrawer();
    router.navigate(href);
  };

  const handleHistoryPress = (word: string) => {
    navigation.closeDrawer();
    navigateToWord(router, word);
  };

  return (
    <View className="flex-1" style={{ backgroundColor: colors.background }}>
      <LinearGradient
        colors={[...Gradients.primary]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ paddingTop: insets.top + 24, paddingBottom: 24, paddingHorizontal: 24 }}>
        <View className="flex-row items-center mb-2">
          <View className="w-12 h-12 rounded-card bg-white/20 items-center justify-center mr-3">
            <Ionicons name="book" size={24} color="#FFFFFF" />
          </View>
          <View>
            <Text className="font-headline text-2xl text-white">{APP_NAME}</Text>
            <Text className="font-body text-sm text-white/80">Dictionary & Reference</Text>
          </View>
        </View>
      </LinearGradient>

      <ScrollView className="flex-1" contentContainerStyle={{ paddingTop: 8, paddingBottom: 24 }}>
        <View className="px-4 mb-4">
          {NAV_ITEMS.map((item) => {
            const focused = isActive(item.href);

            return (
              <Pressable
                key={item.href}
                onPress={() => navigateTo(item.href)}
                className="flex-row items-center py-3.5 px-3 rounded-card mb-1 active:opacity-80"
                style={{ backgroundColor: focused ? `${colors.primary}15` : 'transparent' }}
                accessibilityRole="button"
                accessibilityState={{ selected: focused }}>
                <Ionicons
                  name={item.icon}
                  size={22}
                  color={focused ? colors.primary : colors.textSecondary}
                />
                <Text
                  className="font-body text-base ml-3"
                  style={{ color: focused ? colors.primary : colors.text }}>
                  {item.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <View className="px-4 pt-2 border-t" style={{ borderColor: colors.border }}>
          <HistoryList
            items={history.slice(0, DRAWER_RECENT_LIMIT)}
            onItemPress={handleHistoryPress}
            onClearAll={clearAll}
            onShowMore={
              history.length > DRAWER_RECENT_LIMIT ? () => navigateTo('/history') : undefined
            }
            title="Recent"
            emptyMessage="Your recent searches will appear here."
          />
        </View>
      </ScrollView>
    </View>
  );
}
