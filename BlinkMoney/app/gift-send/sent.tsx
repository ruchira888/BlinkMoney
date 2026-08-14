/**
 * Step 4 of 4: sent.
 *
 * Reached with router.replace, so Back from here returns to Rewards rather
 * than to the preview -- a sent gift is not something you should be able to
 * navigate back into and re-send.
 */

import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect } from 'react';
import { Share, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';

import { ConfettiBurst } from '@/components/gift-send/confetti-burst';
import { GiftCardArt } from '@/components/gift-send/gift-card-art';
import { PressableScale } from '@/components/ui/pressable-scale';
import { GIFT_CARD_ASPECT, GIFT_RECIPIENT } from '@/constants/gift-cards';
import { Duration, Radius, Spacing, Typography, elevation } from '@/constants/theme';
import { formatRupees } from '@/lib/sip';
import { useGiftDraft } from '@/providers/gift-draft-provider';
import { useTheme } from '@/providers/theme-provider';
import * as Haptics from 'expo-haptics';

/** Stand-in for the real short link the backend would mint. */
const GIFT_LINK = 'https://blink.money/seed/7hk3';

/** Small enough that the tick and the headline stay the focus. */
const THUMB_WIDTH = 72;

export default function GiftSentScreen() {
  const { colors, scheme } = useTheme();
  const { card, amount } = useGiftDraft();

  useEffect(() => {
    // Success is the one moment in the flow worth a notification-weight haptic.
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
  }, []);

  const handleShare = async () => {
    try {
      await Share.share({
        message: `I sent you a Seed Gift of ${formatRupees(amount)} on BlinkMoney. Open it here: ${GIFT_LINK}`,
      });
    } catch {
      // The user dismissing the sheet is not an error worth surfacing.
    }
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]} edges={['top']}>
      <ConfettiBurst />

      <View style={styles.body}>
        <Animated.View
          entering={FadeIn.duration(Duration.slow)}
          style={[styles.tick, { backgroundColor: colors.accent }]}
        >
          <Ionicons name="checkmark" size={38} color={colors.onAccent} />
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(120).duration(Duration.slow)} style={styles.copy}>
          <Text style={[styles.title, { color: colors.text }]}>Gift sent!</Text>
          <Text style={[styles.subtitle, { color: colors.textMuted }]}>
            Your seed is on its way to {GIFT_RECIPIENT}.
          </Text>
        </Animated.View>

        <Animated.View
          entering={FadeInDown.delay(220).duration(Duration.slow)}
          style={styles.summary}
        >
          <GiftCardArt
            design={card}
            width={THUMB_WIDTH}
            height={THUMB_WIDTH * GIFT_CARD_ASPECT}
          />
          <View style={styles.summaryText}>
            <Text style={[styles.summaryAmount, { color: colors.accentInk }]}>
              {formatRupees(amount)}
            </Text>
            <Text style={[styles.summaryCard, { color: colors.textMuted }]} numberOfLines={2}>
              {card.title}
            </Text>
          </View>
        </Animated.View>
      </View>

      <View style={styles.actions}>
        <PressableScale
          accessibilityRole="button"
          accessibilityLabel="Share gift link"
          onPress={handleShare}
          haptic
          style={[styles.primary, { backgroundColor: colors.accent }, elevation(scheme, 2)]}
        >
          <Ionicons name="share-social-outline" size={18} color={colors.onAccent} />
          <Text style={[styles.primaryText, { color: colors.onAccent }]}>Share Gift Link</Text>
        </PressableScale>

        <PressableScale
          accessibilityRole="button"
          accessibilityLabel="View in gift history"
          onPress={() => router.replace('/rewards')}
          style={[styles.secondary, { borderColor: colors.border }]}
        >
          <Text style={[styles.secondaryText, { color: colors.text }]}>View in Gift History</Text>
        </PressableScale>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  body: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xl,
    gap: Spacing.xl,
  },
  tick: {
    width: 76,
    height: 76,
    borderRadius: Radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  copy: { alignItems: 'center', gap: Spacing.sm },
  summary: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.lg,
  },
  summaryText: { gap: Spacing.xxs },
  summaryAmount: { ...Typography.title },
  summaryCard: { ...Typography.caption },
  title: { ...Typography.display },
  subtitle: { ...Typography.body, textAlign: 'center' },
  actions: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.xxl,
    gap: Spacing.md,
  },
  primary: {
    height: 54,
    borderRadius: Radius.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
  },
  primaryText: { ...Typography.subheading },
  secondary: {
    height: 54,
    borderRadius: Radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryText: { ...Typography.bodyStrong },
});
