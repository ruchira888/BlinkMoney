/**
 * Home.
 *
 * Rule 8: this file composes and routes. The carousel's timing, the projection
 * maths, the four data states and every piece of styling live in the
 * components and hooks it pulls in.
 */

import { useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
// Rule 1: from safe-area-context, never react-native. React Native's own
// SafeAreaView is a no-op View on Android, which with edge-to-edge on would
// put the header under the status bar.
import { SafeAreaView } from 'react-native-safe-area-context';

import { BottomNav, type NavItem } from '@/components/home/bottom-nav';
import { HomeHeader } from '@/components/home/home-header';
import { PromoSection } from '@/components/home/promo-section';
import { QuickActions, type QuickAction } from '@/components/home/quick-actions';
import { SipCalculator } from '@/components/home/sip-calculator';
import { PrimaryButton } from '@/components/ui/primary-button';
import { Spacing } from '@/constants/theme';
import { usePromos } from '@/hooks/use-promos';
import { useTheme } from '@/providers/theme-provider';

/** Clears the floating nav bar so the last card is never trapped behind it. */
const SCROLL_BOTTOM_PADDING = 108;

export default function HomeScreen() {
  const router = useRouter();
  const { colors, scheme, isDark, toggle } = useTheme();
  const { state, retry } = usePromos();

  const [activePromo, setActivePromo] = useState(0);

  const promos = state.status === 'success' ? state.promos : [];
  const ctaLabel = promos[activePromo]?.cta ?? 'Start SIP';

  const handleQuickAction = useCallback(
    (action: QuickAction) => {
      if (action.id === 'rewards') {
        router.push('/rewards');
      }
    },
    [router]
  );

  const handleNav = useCallback(
    (item: NavItem) => {
      if (item.id === 'rewards') {
        router.push('/rewards');
      }
    },
    [router]
  );

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <HomeHeader
          name="User"
          colors={colors}
          scheme={scheme}
          isDark={isDark}
          onToggleTheme={toggle}
          onPressNotifications={() => router.push('/notifications')}
          onPressHelp={() => {}}
          hasNotifications
        />

        <PromoSection
          state={state}
          retry={retry}
          colors={colors}
          onActiveChange={setActivePromo}
        />

        <PrimaryButton label={ctaLabel} colors={colors} scheme={scheme} />

        <SipCalculator colors={colors} scheme={scheme} />

        <QuickActions colors={colors} scheme={scheme} onPress={handleQuickAction} />

        <View style={{ height: SCROLL_BOTTOM_PADDING }} />
      </ScrollView>

      <BottomNav activeId="home" colors={colors} scheme={scheme} onPress={handleNav} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  content: {
    paddingTop: Spacing.md,
    gap: Spacing.xl,
  },
});
