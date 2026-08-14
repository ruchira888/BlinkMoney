/**
 * Step 3 of 4: exactly what the recipient will see.
 *
 * Renders the same GiftCardArt the picker and the sent screen use, so this is
 * a real preview rather than a second implementation that can drift from what
 * actually gets sent.
 */

import { router } from 'expo-router';
import { ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { FlowFooter } from '@/components/gift-send/flow-footer';
import { GiftCardArt } from '@/components/gift-send/gift-card-art';
import { ScreenHeader } from '@/components/ui/screen-header';
import { GIFT_RECIPIENT, GIFT_SENDER } from '@/constants/gift-cards';
import { Spacing, Typography } from '@/constants/theme';
import { useGiftDraft } from '@/providers/gift-draft-provider';
import { useTheme } from '@/providers/theme-provider';

const CARD_ASPECT = 1.32;

export default function GiftPreviewScreen() {
  const { colors, scheme } = useTheme();
  const { card, amount, message } = useGiftDraft();
  const { width } = useWindowDimensions();

  // Capped so the card does not become absurdly tall on a tablet.
  const cardWidth = Math.min(width - Spacing.xl * 2, 320);

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
          height={cardWidth * CARD_ASPECT}
          amount={amount}
          message={message || undefined}
          sender={GIFT_SENDER}
        />

        <View style={styles.note}>
          <Text style={[styles.noteText, { color: colors.textMuted }]}>
            The amount is invested as a daily SIP the moment {GIFT_RECIPIENT} claims it, so it
            starts growing on day one.
          </Text>
        </View>
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
  note: {
    paddingHorizontal: Spacing.md,
  },
  noteText: {
    ...Typography.caption,
    textAlign: 'center',
  },
});
