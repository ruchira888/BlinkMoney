/**
 * Home.
 *
 * Deliberately blank: the header and the bottom nav only. The promo carousel,
 * the Start SIP button, the SIP calculator and the quick actions have been
 * taken off the page -- their components are untouched and still in
 * components/home, so putting any of them back is an import and a line of JSX.
 */

import { Redirect, useRouter } from 'expo-router';
import { useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
// Rule 1: from safe-area-context, never react-native. React Native's own
// SafeAreaView is a no-op View on Android, which with edge-to-edge on would
// put the header under the status bar.
import { SafeAreaView } from 'react-native-safe-area-context';

import { BottomNav, type NavItem } from '@/components/home/bottom-nav';
import { HomeHeader } from '@/components/home/home-header';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/providers/theme-provider';

/**
 * Where a cold start lands.
 *
 * Home is blank, so opening on it gives a first-time visitor a header, a nav
 * bar and no product. For the shareable prototype build the app opens straight
 * into Rewards, which is the gifting loop and the thing worth showing.
 *
 * Set this to false to get the blank home screen back as the entry point.
 * While it is true, the Home item in the nav bar routes here and bounces
 * straight back to Rewards, so it reads as inert.
 */
const OPEN_ON_REWARDS = true;

export default function HomeScreen() {
  const router = useRouter();
  const { colors, scheme } = useTheme();

  const handleNav = useCallback(
    (item: NavItem) => {
      if (item.id === 'rewards') {
        router.push('/rewards');
      }
    },
    [router]
  );

  // After the hooks, never before them, so the hook order is identical on
  // every render whichever way the flag is set.
  if (OPEN_ON_REWARDS) {
    return <Redirect href="/rewards" />;
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]} edges={['top']}>
      <View style={styles.content}>
        <HomeHeader name="User" colors={colors} onPressHelp={() => {}} />
      </View>

      <BottomNav activeId="home" colors={colors} scheme={scheme} onPress={handleNav} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingTop: Spacing.md,
  },
});
