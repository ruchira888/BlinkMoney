import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider as NavigationThemeProvider,
} from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'react-native-reanimated';

// Compiled by NativeWind's Metro transformer, and still required by the gift
// flow's envelope animation. The rest of the app is styled with StyleSheet and
// constants/theme.ts.
import '../global.css';

import { ThemeProvider, useTheme } from '@/providers/theme-provider';

export const unstable_settings = {
  anchor: '(tabs)',
};

/**
 * Everything that needs to read the theme.
 *
 * Split into its own module-level component because useTheme has to be called
 * below <ThemeProvider>, and rule 9 rules out declaring it inside
 * RootLayout's render body.
 *
 * Rule 5: nothing in here calls useNavigation, useRoute, useFocusEffect or
 * useNavigationState. useTheme reads a plain context, and NavigationThemeProvider
 * only supplies colours downward -- neither reaches into navigation state, so
 * both are safe to sit above <Stack>.
 */
function ThemedApp() {
  const { colors, isDark } = useTheme();

  // Hand the navigator our own background so the gap between screens during a
  // push matches the app rather than flashing @react-navigation's default.
  const navigationTheme = {
    ...(isDark ? DarkTheme : DefaultTheme),
    colors: {
      ...(isDark ? DarkTheme : DefaultTheme).colors,
      background: colors.background,
      card: colors.surface,
      text: colors.text,
      border: colors.border,
      primary: colors.accent,
    },
  };

  return (
    <NavigationThemeProvider value={navigationTheme}>
      {/* Exactly one navigator at this level. */}
      <Stack screenOptions={{ contentStyle: { backgroundColor: colors.background } }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="notifications" options={{ headerShown: false }} />
        <Stack.Screen name="rewards" options={{ headerShown: false }} />
        {/* The send flow. Its own layout owns the draft and the inner Stack. */}
        <Stack.Screen name="gift-send" options={{ headerShown: false }} />
        {/* The receive side: list, reveal, and what it grew into. */}
        <Stack.Screen name="gift-received" options={{ headerShown: false }} />
        <Stack.Screen name="gift-reveal" options={{ headerShown: false, animation: 'fade' }} />
        <Stack.Screen name="gift-growing" options={{ headerShown: false }} />
        {/* The Gift a Seed flow. All headerless -- each screen draws its own
            top bar so the chrome matches the rest of the app. */}
        <Stack.Screen name="gift" options={{ headerShown: false, animation: 'fade' }} />
        <Stack.Screen name="gift-create" options={{ headerShown: false }} />
        <Stack.Screen name="gift-confirm" options={{ headerShown: false }} />
        <Stack.Screen name="gift-claim" options={{ headerShown: false }} />
        <Stack.Screen name="gift-success" options={{ headerShown: false }} />
        <Stack.Screen name="gift-growth" options={{ headerShown: false }} />
        <Stack.Screen name="gift-thanks" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
      </Stack>

      {/* Rule 2: no backgroundColor. Android edge-to-edge ignores it and warns.
          Only the icon style is ours to set, and it inverts with the theme. */}
      <StatusBar style={isDark ? 'light' : 'dark'} />
    </NavigationThemeProvider>
  );
}

export default function RootLayout() {
  return (
    // Required by the calculator's gesture-driven slider. Must be the outermost
    // view and must flex, or gestures below it are dropped on Android.
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
        <ThemedApp />
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
