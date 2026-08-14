/**
 * The gift card itself.
 *
 * One component for all three places a card appears -- the picker, the preview
 * and the sent summary -- so what the sender chooses is provably what the
 * preview shows. Size and which details are filled in are props; the artwork
 * is never re-implemented.
 *
 * Gradient, blooms and confetti flecks are drawn with react-native-svg,
 * matching the promo cards and keeping the flow free of new native modules.
 * Ink is dark on light stock, so contrast is solved against each gradient's
 * *darkest* end -- see constants/gift-cards.ts.
 */

import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Rect, Stop } from 'react-native-svg';

import type { GiftCardDesign } from '@/constants/gift-cards';
import { Radius, Spacing, Typography } from '@/constants/theme';
import { formatRupees } from '@/lib/sip';

type Props = {
  design: GiftCardDesign;
  width: number;
  height: number;
  /** Rendered under the title once the sender has picked a value. */
  amount?: number;
  /** The sender's note. Replaces the tagline when present. */
  message?: string;
  /** Signs the card off, e.g. "From Ruchira". */
  sender?: string;
  /** Hides the motif and tightens padding, for the small summary card. */
  compact?: boolean;
};

/** Fixed fleck positions as fractions of the card, so the confetti is part of
 *  the design rather than re-randomised on every render. */
const FLECKS = [
  { x: 0.12, y: 0.09, r: -18 },
  { x: 0.74, y: 0.14, r: 24 },
  { x: 0.86, y: 0.3, r: -8 },
  { x: 0.1, y: 0.42, r: 32 },
  { x: 0.8, y: 0.82, r: -26 },
  { x: 0.22, y: 0.88, r: 14 },
];

function GiftCardArtComponent({
  design,
  width,
  height,
  amount,
  message,
  sender,
  compact = false,
}: Props) {
  const { tone } = design;
  const fillId = `gc-fill-${design.id}`;
  const fleckSize = Math.max(7, width * 0.035);

  return (
    <View style={[styles.card, { width, height, borderColor: tone.rule }]}>
      <Svg style={StyleSheet.absoluteFill} width={width} height={height} pointerEvents="none">
        <Defs>
          <LinearGradient id={fillId} x1="0" y1="0" x2="0.7" y2="1">
            <Stop offset="0" stopColor={tone.from} />
            <Stop offset="1" stopColor={tone.to} />
          </LinearGradient>
        </Defs>
        <Rect x={0} y={0} width={width} height={height} fill={`url(#${fillId})`} />

        {/* Soft blooms, as in the reference art. Low opacity so they read as
            paper texture rather than as shapes. */}
        <Circle cx={width * 0.14} cy={height * 0.3} r={width * 0.26} fill={tone.bloom} opacity={0.28} />
        <Circle cx={width * 0.88} cy={height * 0.72} r={width * 0.3} fill={tone.bloom} opacity={0.22} />
        <Circle cx={width * 0.3} cy={height * 0.92} r={width * 0.22} fill={tone.bloom} opacity={0.2} />

        {compact
          ? null
          : FLECKS.map((fleck, index) => (
              <Rect
                key={index}
                x={width * fleck.x}
                y={height * fleck.y}
                width={fleckSize}
                height={fleckSize * 1.15}
                rx={2}
                fill={design.confetti[index % design.confetti.length]}
                opacity={0.85}
                transform={`rotate(${fleck.r} ${width * fleck.x} ${height * fleck.y})`}
              />
            ))}
      </Svg>

      <View style={[styles.content, compact && styles.contentCompact]}>
        {compact ? null : (
          <View style={styles.motif}>
            {design.iconFamily === 'material' ? (
              <MaterialCommunityIcons name={design.icon as never} size={44} color={tone.motif} />
            ) : (
              <Ionicons name={design.icon as never} size={44} color={tone.motif} />
            )}
          </View>
        )}

        <Text
          style={[styles.title, compact && styles.titleCompact, { color: tone.ink }]}
          numberOfLines={2}
        >
          {design.title}
        </Text>

        {compact ? null : <View style={[styles.rule, { backgroundColor: tone.rule }]} />}

        {amount !== undefined ? (
          <Text style={[styles.amount, { color: tone.ink }]} numberOfLines={1}>
            {formatRupees(amount)}
          </Text>
        ) : null}

        <Text
          style={[styles.tagline, { color: tone.inkMuted }]}
          numberOfLines={compact ? 1 : 3}
        >
          {message || design.tagline}
        </Text>

        {sender ? (
          <Text style={[styles.sender, { color: tone.inkMuted }]} numberOfLines={1}>
            — From {sender}
          </Text>
        ) : null}
      </View>
    </View>
  );
}

export const GiftCardArt = memo(GiftCardArtComponent);

const styles = StyleSheet.create({
  card: {
    borderRadius: Radius.xl,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: 'hidden',
  },
  content: {
    flex: 1,
    padding: Spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
  },
  contentCompact: {
    padding: Spacing.lg,
    alignItems: 'flex-start',
    justifyContent: 'center',
    gap: Spacing.xxs,
  },
  motif: {
    marginBottom: Spacing.md,
  },
  title: {
    ...Typography.title,
    textAlign: 'center',
  },
  titleCompact: {
    ...Typography.subheading,
    textAlign: 'left',
  },
  rule: {
    height: StyleSheet.hairlineWidth,
    alignSelf: 'stretch',
    marginHorizontal: Spacing.xl,
    marginVertical: Spacing.sm,
    opacity: 0.7,
  },
  amount: {
    ...Typography.display,
  },
  tagline: {
    ...Typography.body,
    textAlign: 'center',
  },
  sender: {
    ...Typography.caption,
    marginTop: Spacing.sm,
  },
});
