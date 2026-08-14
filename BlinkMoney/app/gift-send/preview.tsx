/**
 * Step 3 of 4: exactly what the recipient will see.
 *
 * The card is the artwork asset, unmodified. The amount, message and sender
 * are shown as rows beneath it rather than drawn on top -- the title and
 * tagline are baked into the image, and overlaying more type on that would
 * mean covering part of the artwork.
 */

import { router } from 'expo-router';
import { ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { FlowFooter } from '@/components/gift-send/flow-footer';
import { GiftCardArt } from '@/components/gift-send/gift-card-art';
import { ScreenHeader } from '@/components/ui/screen-header';
import { GIFT_CARD_ASPECT, GIFT_RECIPIENT, GIFT_SENDER } from '@/constants/gift-cards';
import { Radius, Spacing, Typography } from '@/constants/theme';
import { formatRupees } from '@/lib/sip';
import { useGiftDraft } from '@/providers/gift-draft-provider';
import { useTheme } from '@/providers/theme-provider';

export default function GiftPreviewScreen() {
  const { colors, scheme } = useTheme();
  const { card, amount, message } = useGiftDraft();
  const { width } = useWindowDimensions();

  // Capped so the card does not become absurdly tall on a tablet.
  const cardWidth = Math.min(width - Spacing.xl * 2, 240);

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]} edges={['top']}>
      <ScreenHeader
        title="Preview Gift"
        subtitle={`Here’s what ${GIFT_RECIPIENT} will see.`}
        colors={colors}
        onBack={() => router.back()}
      />

      <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <GiftCardArt
          design={card}
          width={cardWidth}
          height={cardWidth * GIFT_CARD_ASPECT}
        />

        <View
          style={[styles.details, { backgroundColor: colors.surface, borderColor: colors.border }]}
        >
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: colors.textMuted }]}>Amount</Text>
            <Text style={[styles.detailValue, { color: colors.accentInk }]}>
              {formatRupees(amount)}
            </Text>
          </View>

          {message ? (
            <View style={[styles.divider, { backgroundColor: colors.border }]} />
          ) : null}
          {message ? (
            <View style={styles.messageBlock}>
              <Text style={[styles.detailLabel, { color: colors.textMuted }]}>Your message</Text>
              <Text style={[styles.message, { color: colors.text }]}>{message}</Text>
            </View>
          ) : null}

          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: colors.textMuted }]}>From</Text>
            <Text style={[styles.detailValue, { color: colors.text }]}>{GIFT_SENDER}</Text>
          </View>
        </View>

        <Text style={[styles.note, { color: colors.textMuted }]}>
          The amount is invested as a daily SIP the moment {GIFT_RECIPIENT} claims it, so it starts
          growing on day one.
        </Text>
      </ScrollView>

      <FlowFooter
        label="Send this Gift"
        colors={colors}
        scheme={scheme}
        step={3}
        onPress={() => router.replace('/gift-send/sent')}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  body: {
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.xxl,
    gap: Spacing.xl,
  },
  details: {
    alignSelf: 'stretch',
    borderRadius: Radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: Spacing.lg,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.lg,
    gap: Spacing.md,
  },
  messageBlock: {
    paddingVertical: Spacing.lg,
    gap: Spacing.xs,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
  },
  detailLabel: { ...Typography.caption },
  detailValue: { ...Typography.subheading },
  message: { ...Typography.body },
  note: {
    ...Typography.caption,
    textAlign: 'center',
    paddingHorizontal: Spacing.md,
  },
});
