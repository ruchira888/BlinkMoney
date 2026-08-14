/**
 * Rewards — two things you can do, and nothing else.
 *
 * Give a gift, or open the ones you have been sent. The earn/redeem/history
 * tabs and the gift counters that used to be here are gone: this screen is the
 * doorway to the gifting loop, and every extra row on it was competition for
 * the only two actions that matter.
 *
 * The two rows enter staggered rather than together. With only two elements on
 * a screen, landing them simultaneously reads as a page that snapped into
 * place; 90ms apart reads as one that arrived.
 */

import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ScrollView, StyleSheet, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BottomNav, type NavItem } from '@/components/home/bottom-nav';
import { OptionCard } from '@/components/rewards/option-card';
import { ScreenHeader } from '@/components/ui/screen-header';
import { UNOPENED_COUNT } from '@/constants/received-gifts';
import { Duration, Spacing, Typography } from '@/constants/theme';
import { useTheme } from '@/providers/theme-provider';

/** Clears the floating nav bar. */
const SCROLL_BOTTOM_PADDING = 108;

export default function RewardsScreen() {
  const { colors, scheme, isDark } = useTheme();

  const handleNav = (item: NavItem) => {
    if (item.id === 'home') {
      router.replace('/');
    }
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]} edges={['top']}>
      {/* Rule 2: style only, no backgroundColor. */}
      <StatusBar style={isDark ? 'light' : 'dark'} />

      <ScreenHeader
        title="Rewards"
        subtitle="Small steps. Bigger future."
        colors={colors}
        onBack={() => router.replace('/')}
      />

      <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeInDown.duration(Duration.slow)}>
          <OptionCard
            icon="gift"
            title="Gift a Seed"
            body="Send someone a head start. They claim it, it starts growing."
            emphasis
            colors={colors}
            scheme={scheme}
            accessibilityLabel="Gift a Seed"
            accessibilityHint="Send someone a gift that gets invested"
            onPress={() => router.push('/gift-send/card')}
          />
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(90).duration(Duration.slow)}>
          <OptionCard
            icon="mail-open"
            title="Received Gifts"
            body="Check the gifts your friends have sent you."
            badge={UNOPENED_COUNT}
            colors={colors}
            scheme={scheme}
            accessibilityLabel={
              UNOPENED_COUNT > 0
                ? `Received gifts, ${UNOPENED_COUNT} waiting to be opened`
                : 'Received gifts'
            }
            accessibilityHint="Open gifts your friends have sent you"
            onPress={() => router.push('/gift-received')}
          />
        </Animated.View>

        <Animated.Text
          entering={FadeInDown.delay(180).duration(Duration.slow)}
          style={[styles.note, { color: colors.textFaint }]}
        >
          Gifting a seed starts a SIP for someone else. They keep it, and it
          compounds from the day they claim it.
        </Animated.Text>

        <View style={{ height: SCROLL_BOTTOM_PADDING }} />
      </ScrollView>

      <BottomNav activeId="rewards" colors={colors} scheme={scheme} onPress={handleNav} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  body: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.sm,
    gap: Spacing.lg,
  },
  note: {
    ...Typography.caption,
    textAlign: 'center',
    paddingHorizontal: Spacing.lg,
    marginTop: Spacing.xs,
  },
});
