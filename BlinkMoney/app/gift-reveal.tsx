/**
 * The moment the gift is opened.
 *
 * Confetti fires on mount together with a success haptic, and the card, the
 * amount and the message stagger in behind it. This is the payoff of the whole
 * feature, so it is the one screen that leads with celebration before it leads
 * with information.
 *
 * Guards against a missing or unknown id rather than rendering a broken
 * screen: the id arrives through a route param, so it can be anything.
 */

import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { ConfettiBurst } from '@/components/gift-send/confetti-burst';
import { GiftCardArt } from '@/components/gift-send/gift-card-art';
import { PressableScale } from '@/components/ui/pressable-scale';
import { ScreenHeader } from '@/components/ui/screen-header';
import { StateMessage } from '@/components/ui/state-message';
import { GIFT_CARD_ASPECT } from '@/constants/gift-cards';
import { cardForGift, findReceivedGift } from '@/constants/received-gifts';
import { Duration, Radius, Spacing, Typography, elevation } from '@/constants/theme';
import { formatRupees } from '@/lib/sip';
import { useTheme } from '@/providers/theme-provider';

export default function GiftRevealScreen() {
  const { colors, scheme, isDark } = useTheme();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { width } = useWindowDimensions();

  const gift = findReceivedGift(id);

  useEffect(() => {
    if (!gift) {
      return;
    }
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
  }, [gift]);

  if (!gift) {
    return (
      <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]} edges={['top']}>
        <StatusBar style={isDark ? 'light' : 'dark'} />
        <ScreenHeader title="Your Gift" colors={colors} onBack={() => router.back()} />
        <View style={styles.missing}>
          <StateMessage
            tone="error"
            title="Gift not found"
            description="This gift may have already been opened or the link has expired."
            colors={colors}
            onRetry={() => router.replace('/gift-received')}
            retryLabel="See your gifts"
          />
        </View>
      </SafeAreaView>
    );
  }

  const design = cardForGift(gift);
  const cardWidth = Math.min(width - Spacing.xl * 2, 220);

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]} edges={['top']}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <ConfettiBurst />

      <ScreenHeader title="" colors={colors} onBack={() => router.back()} />

      <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <Animated.Text
          entering={FadeInDown.duration(Duration.slow)}
          style={[styles.headline, { color: colors.text }]}
        >
          {gift.sender} sent you a gift!
        </Animated.Text>

        <Animated.View entering={FadeInDown.delay(120).duration(Duration.slow)}>
          <GiftCardArt
            design={design}
            width={cardWidth}
            height={cardWidth * GIFT_CARD_ASPECT}
          />
        </Animated.View>

        <Animated.View
          entering={FadeInDown.delay(220).duration(Duration.slow)}
          style={[styles.amountBlock, { backgroundColor: colors.accentWash }]}
        >
          <Text style={[styles.amount, { color: colors.accentInk }]}>
            {formatRupees(gift.amount)}
          </Text>
          <Text style={[styles.invested, { color: colors.accentInk }]}>
            has been invested for you
          </Text>
        </Animated.View>

        <Animated.View
          entering={FadeInDown.delay(320).duration(Duration.slow)}
          style={styles.messageBlock}
        >
          <Text style={[styles.message, { color: colors.text }]}>“{gift.message}”</Text>
          <Text style={[styles.sender, { color: colors.textMuted }]}>— From {gift.sender}</Text>
        </Animated.View>
      </ScrollView>

      <View style={styles.footer}>
        <PressableScale
          accessibilityRole="button"
          accessibilityLabel="See it grow"
          onPress={() => router.replace({ pathname: '/gift-growing', params: { id: gift.id } })}
          haptic
          style={[styles.cta, { backgroundColor: colors.accent }, elevation(scheme, 2)]}
        >
          <Text style={[styles.ctaText, { color: colors.onAccent }]}>See it grow</Text>
          <Ionicons name="arrow-forward" size={18} color={colors.onAccent} />
        </PressableScale>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  missing: { paddingHorizontal: Spacing.xl, paddingTop: Spacing.xl },
  body: {
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.xxl,
    gap: Spacing.xl,
  },
  headline: { ...Typography.title, textAlign: 'center' },
  amountBlock: {
    alignSelf: 'stretch',
    alignItems: 'center',
    borderRadius: Radius.lg,
    paddingVertical: Spacing.xl,
    gap: Spacing.xxs,
  },
  amount: { ...Typography.display },
  invested: { ...Typography.caption },
  messageBlock: { alignItems: 'center', gap: Spacing.sm },
  message: { ...Typography.body, textAlign: 'center', fontStyle: 'italic' },
  sender: { ...Typography.caption },
  footer: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.xxl,
  },
  cta: {
    height: 54,
    borderRadius: Radius.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
  },
  ctaText: { ...Typography.subheading },
});
