/**
 * The card that comes out of the envelope: a physical invitation, not a
 * dashboard tile.
 *
 * Warm white stock, black type, one hairline rule and a single deep-green
 * detail. Static presentation only -- its entrance is animated by the
 * `gift-card-in` utility on whatever renders it.
 */
import { StyleSheet, Text, useWindowDimensions, View } from 'react-native';

import { PAPER, RADIUS } from './theme';

const MAX_WIDTH = 330;
const PADDING = 24;
const DESIGN_LINE = MAX_WIDTH - PADDING * 2;

export function GiftRevealCard({
  amount,
  message,
  sender,
  note = 'A daily SIP has been started for you.',
}: {
  amount: string;
  message: string;
  sender: string;
  note?: string;
}) {
  // Scale the display type to the line actually available, so the amount is
  // never clipped on a narrow device.
  const { width } = useWindowDimensions();
  const line = Math.min(MAX_WIDTH, width - 40) - PADDING * 2;
  const scale = Math.max(0.76, Math.min(1, line / DESIGN_LINE));

  return (
    <View style={s.card}>
      <Text style={s.eyebrow}>CONGRATULATIONS</Text>

      <Text style={[s.headline, { fontSize: Math.round(24 * scale) }]}>
        You&rsquo;ve received{'\n'}a Gift a Seed
      </Text>

      <Text
        style={[s.amount, { fontSize: Math.round(56 * scale), lineHeight: Math.round(66 * scale) }]}
        numberOfLines={1}
        allowFontScaling={false}
      >
        {amount}
      </Text>

      <Text style={s.note}>{note}</Text>

      <View style={s.rule} />

      <Text style={s.message}>&ldquo;{message}&rdquo;</Text>
      <Text style={s.sender}>&mdash; {sender}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  card: {
    width: '100%',
    maxWidth: MAX_WIDTH,
    backgroundColor: PAPER.card,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: PAPER.cardEdge,
    paddingHorizontal: PADDING,
    paddingTop: 26,
    paddingBottom: 24,
    alignItems: 'center',
    // Lifts the paper off the black backdrop rather than letting it float.
    shadowColor: '#000',
    shadowOpacity: 0.45,
    shadowRadius: 28,
    shadowOffset: { width: 0, height: 14 },
    elevation: 10,
  },
  eyebrow: {
    color: PAPER.accent,
    fontSize: 10,
    letterSpacing: 2.4,
    fontWeight: '700',
  },
  headline: {
    color: PAPER.ink,
    fontFamily: 'serif',
    fontWeight: '700',
    textAlign: 'center',
    marginTop: 14,
    lineHeight: 32,
  },
  amount: {
    color: PAPER.ink,
    fontFamily: 'serif',
    fontWeight: '700',
    marginTop: 10,
  },
  note: {
    color: PAPER.inkMuted,
    fontSize: 13,
    textAlign: 'center',
    marginTop: 6,
  },
  rule: {
    height: 1,
    alignSelf: 'stretch',
    backgroundColor: PAPER.cardEdge,
    marginVertical: 20,
  },
  message: {
    color: PAPER.ink,
    fontFamily: 'serif',
    fontSize: 15,
    lineHeight: 23,
    textAlign: 'center',
  },
  sender: {
    color: PAPER.inkFaint,
    fontSize: 12.5,
    marginTop: 10,
    letterSpacing: 0.4,
  },
});
