/**
 * Gifts you have been sent.
 *
 * Unopened gifts sit at the top and are the only rows that lead anywhere --
 * an already-opened gift is a record, not an action, so it is shown flat
 * rather than as a pressable that does nothing.
 */

import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { GiftCardArt } from '@/components/gift-send/gift-card-art';
import { PressableScale } from '@/components/ui/pressable-scale';
import { ScreenHeader } from '@/components/ui/screen-header';
import { StateMessage } from '@/components/ui/state-message';
import { GIFT_CARD_ASPECT } from '@/constants/gift-cards';
import { RECEIVED_GIFTS, cardForGift } from '@/constants/received-gifts';
import { Radius, Spacing, Typography, elevation, type ThemePalette } from '@/constants/theme';
import { formatRupees } from '@/lib/sip';
import { useTheme } from '@/providers/theme-provider';

const THUMB_WIDTH = 56;

export default function GiftReceivedScreen() {
  const { colors, scheme, isDark } = useTheme();
  const s = useMemo(() => makeStyles(colors), [colors]);

  // Unopened first: the whole point of the screen is the one waiting for you.
  const gifts = useMemo(
    () => [...RECEIVED_GIFTS].sort((a, b) => Number(a.opened) - Number(b.opened)),
    []
  );

  return (
    <SafeAreaView style={[s.safe, { backgroundColor: colors.background }]} edges={['top']}>
      {/* Rule 2: style only, no backgroundColor. */}
      <StatusBar style={isDark ? 'light' : 'dark'} />

      <ScreenHeader
        title="Your Gifts"
        subtitle="Received from friends and family."
        colors={colors}
        onBack={() => router.back()}
      />

      <ScrollView contentContainerStyle={s.body} showsVerticalScrollIndicator={false}>
        {gifts.length === 0 ? (
          <StateMessage
            tone="empty"
            title="No gifts yet"
            description="When someone sends you a Seed Gift, it lands here."
            colors={colors}
            minHeight={220}
          />
        ) : null}

        {gifts.map((gift) => {
          const design = cardForGift(gift);

          const inner = (
            <>
              <GiftCardArt
                design={design}
                width={THUMB_WIDTH}
                height={THUMB_WIDTH * GIFT_CARD_ASPECT}
              />
              <View style={s.rowText}>
                <Text style={s.from}>From {gift.sender}</Text>
                <Text style={s.cardName} numberOfLines={1}>
                  {design.title}
                </Text>
                <Text style={s.amount}>{formatRupees(gift.amount)}</Text>
              </View>
              {gift.opened ? (
                <View style={s.openedTag}>
                  <Text style={s.openedText}>Opened</Text>
                </View>
              ) : (
                <View style={s.cta}>
                  <Text style={s.ctaText}>Tap to open</Text>
                  <Ionicons name="chevron-forward" size={16} color={colors.onAccent} />
                </View>
              )}
            </>
          );

          return gift.opened ? (
            <View key={gift.id} style={s.row}>
              {inner}
            </View>
          ) : (
            <PressableScale
              key={gift.id}
              accessibilityRole="button"
              accessibilityLabel={`Open gift from ${gift.sender}, ${formatRupees(gift.amount)}`}
              onPress={() =>
                router.push({ pathname: '/gift-reveal', params: { id: gift.id } })
              }
              haptic
              style={[s.row, s.rowUnopened, elevation(scheme, 2)]}
            >
              {inner}
            </PressableScale>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

function makeStyles(colors: ThemePalette) {
  return StyleSheet.create({
    safe: { flex: 1 },
    body: {
      paddingHorizontal: Spacing.xl,
      paddingTop: Spacing.sm,
      paddingBottom: Spacing.xxxl,
      gap: Spacing.md,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.lg,
      backgroundColor: colors.surface,
      borderRadius: Radius.lg,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: colors.border,
      padding: Spacing.lg,
    },
    rowUnopened: { borderColor: colors.accent },
    rowText: { flex: 1, gap: Spacing.xxs },
    from: { ...Typography.caption, color: colors.textMuted },
    cardName: { ...Typography.bodyStrong, color: colors.text },
    amount: { ...Typography.subheading, color: colors.accentInk },
    cta: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.xxs,
      backgroundColor: colors.accent,
      borderRadius: Radius.pill,
      paddingLeft: Spacing.md,
      paddingRight: Spacing.sm,
      paddingVertical: Spacing.sm,
    },
    ctaText: { ...Typography.micro, color: colors.onAccent, fontWeight: '700' },
    openedTag: {
      borderRadius: Radius.pill,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: colors.border,
      paddingHorizontal: Spacing.md,
      paddingVertical: Spacing.xs,
    },
    openedText: { ...Typography.micro, color: colors.textFaint },
  });
}
