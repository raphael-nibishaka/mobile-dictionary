import { Drawer } from 'expo-router/drawer';

import { CustomDrawer } from '@/components/CustomDrawer';
import { useThemeColors } from '@/hooks/useThemeColors';

/** Drawer navigator wrapping the bottom-tab navigator with custom content */
export default function DrawerLayout() {
  const { colors } = useThemeColors();

  return (
    <Drawer
      drawerContent={(props) => <CustomDrawer {...props} />}
      screenOptions={{
        headerShown: false,
        drawerType: 'front',
        drawerStyle: {
          backgroundColor: colors.background,
          width: 300,
        },
        overlayColor: 'rgba(15, 23, 42, 0.5)',
      }}>
      <Drawer.Screen name="(tabs)" options={{ drawerLabel: 'Home', title: 'LexiDict' }} />
    </Drawer>
  );
}
