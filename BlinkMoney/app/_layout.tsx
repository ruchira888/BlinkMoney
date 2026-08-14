import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

// Compiled by NativeWind's Metro transformer. This is what puts the envelope
// keyframes and utilities from tailwind.config.js into the app.
import '../global.css';

import { useColorScheme } from '@/hooks/use-color-scheme';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="notifications" options={{ headerShown: false }} />
        <Stack.Screen name="rewards" options={{ headerShown: false }} />
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
      <StatusBar style="light" />
    </ThemeProvider>
  );
}
