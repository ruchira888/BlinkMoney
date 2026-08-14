/**
 * One slide of the promo carousel.
 *
 * The gradient and the glow are drawn with react-native-svg rather than
 * expo-linear-gradient: svg is already a dependency and ships inside Expo Go,
 * so the card needs no new native module to render its background.
 *
 * The card is a pure presentational component -- it takes a Promo and a width
 * and owns no state, which is what lets the carousel mount three of them and
 * animate their container without any of them re-rendering mid-swipe.
 */

import { memo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Defs, LinearGradient, RadialGradient, Rect, Stop } from 'react-native-svg';

import { Radius, Spacing, Typography, type ThemePalette } from '@/constants/theme';
import type { Promo } from '@/constants/promos';

/** Fixed so every slide is the same height and the carousel never reflows as
 *  it advances between cards with different amounts of copy.
 *
 *  Trimmed from 296. The vertical rhythm below was tightened by more than that
 *  at the same time -- the green card's three chips wrap to two rows, and at
 *  the old spacing the second row fell past the bottom edge and was clipped by
 *  the card's overflow. A shorter card on its own would have clipped it
 *  harder, so the space had to come out of the gaps, not the height. */
export const PROMO_CARD_HEIGHT = 284;

type Props = {
  promo: Promo;
  width: number;
  colors: ThemePalette;
  onPress?: (promo: Promo) => void;
};

function PromoCardComponent({ promo, width, colors, onPress }: Props) {
  const tone = colors.promo[promo.tone];

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${promo.title} ${promo.titleAccent ?? ''}. ${promo.body}`}
      accessibilityHint={promo.cta}
      onPress={onPress ? () => onPress(promo) : undefined}
      style={[styles.card, { width, height: PROMO_CARD_HEIGHT }]}
    >
      {/* Background: gradient wash plus a soft bloom in the top-right, which is
          what gives the card depth without an image asset. */}
      <Svg
        style={StyleSheet.absoluteFill}
        width={width}
        height={PROMO_CARD_HEIGHT}
        pointerEvents="none"
      >
        <Defs>
          <LinearGradient id={`fill-${promo.id}`} x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor={tone.from} />
            <Stop offset="1" stopColor={tone.to} />
          </LinearGradient>
          <RadialGradient id={`glow-${promo.id}`} cx="0.5" cy="0.5" r="0.5">
            {/* Kept low. On these bright grounds the bloom is a gloss
                highlight, not a light source -- pushed higher it flattens the
                gradient and takes the remaining contrast out of the type. */}
            <Stop offset="0" stopColor={tone.glow} stopOpacity={0.12} />
            <Stop offset="1" stopColor={tone.glow} stopOpacity={0} />
          </RadialGradient>
        </Defs>
        <Rect x={0} y={0} width={width} height={PROMO_CARD_HEIGHT} fill={`url(#fill-${promo.id})`} />
        <Circle cx={width * 0.86} cy={PROMO_CARD_HEIGHT * 0.2} r={width * 0.42} fill={`url(#glow-${promo.id})`} />
      </Svg>

      <View style={styles.content}>
        {promo.eyebrow ? (
          <Text
            style={[
              styles.eyebrow,
              { color: tone.chipInk, backgroundColor: tone.chipBg, borderColor: tone.chipBorder },
            ]}
            numberOfLines={1}
          >
            {promo.eyebrow}
          </Text>
        ) : null}

        <Text style={[styles.title, { color: tone.inkStrong }]} numberOfLines={2}>
          {promo.title}
        </Text>
        {promo.titleAccent ? (
          <Text style={[styles.titleAccent, { color: tone.ink }]} numberOfLines={2}>
            {promo.titleAccent}
          </Text>
        ) : null}

        <View style={[styles.rule, { backgroundColor: tone.chipBorder }]} />

        <View style={styles.bodyRow}>
          <Text style={[styles.body, { color: tone.ink }]} numberOfLines={4}>
            {promo.body}
          </Text>
          {promo.stat ? (
            <View style={styles.stat}>
              <Text style={[styles.statValue, { color: tone.inkStrong }]}>{promo.stat.value}</Text>
              <Text style={[styles.statLabel, { color: tone.inkMuted }]} numberOfLines={2}>
                {promo.stat.label}
              </Text>
            </View>
          ) : null}
        </View>

        <View style={styles.chips}>
          {promo.chips.map((chip) => (
            <View
              key={chip.id}
              style={[styles.chip, { backgroundColor: tone.chipBg, borderColor: tone.chipBorder }]}
            >
              <Text style={[styles.chipText, { color: tone.chipInk }]} numberOfLines={1}>
                {chip.label}
              </Text>
            </View>
          ))}
        </View>

        {promo.footnote ? (
          <Text style={[styles.footnote, { color: tone.inkMuted }]} numberOfLines={1}>
            {promo.footnote}
          </Text>
        ) : null}
      </View>
    </Pressable>
  );
}

/** Memoised: the carousel re-renders on every scroll frame of the dots, and
 *  the cards themselves never change within a theme. */
export const PromoCard = memo(PromoCardComponent);

const styles = StyleSheet.create({
  card: {
    borderRadius: Radius.xl,
    overflow: 'hidden',
  },
  content: {
    flex: 1,
    padding: Spacing.xl,
  },
  // Rendered as a pill in the reference ("Exclusive for you"), so it carries
  // its own chrome rather than sitting as bare text.
  eyebrow: {
    ...Typography.micro,
    fontWeight: '700',
    overflow: 'hidden',
    alignSelf: 'flex-start',
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: Radius.pill,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    marginBottom: Spacing.sm,
  },
  title: {
    ...Typography.title,
    fontWeight: '800',
  },
  // Upright and equally heavy. The reference sets both headline lines in the
  // same weight; the italic serif treatment this used to have is not in it.
  titleAccent: {
    ...Typography.title,
    fontWeight: '800',
  },
  rule: {
    height: StyleSheet.hairlineWidth,
    opacity: 0.5,
    marginVertical: Spacing.md,
  },
  bodyRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.lg,
  },
  body: {
    ...Typography.body,
    fontWeight: '600',
    flex: 1,
  },
  stat: {
    alignItems: 'center',
    maxWidth: 96,
  },
  statValue: {
    ...Typography.display,
    fontWeight: '800',
  },
  statLabel: {
    ...Typography.micro,
    fontWeight: '700',
    textAlign: 'center',
  },
  // marginTop auto pins the block to the bottom; the marginBottom is what
  // keeps the last chip row off the card's edge instead of touching it.
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginTop: 'auto',
    marginBottom: Spacing.xs,
  },
  chip: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: Radius.pill,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs + 1,
  },
  chipText: {
    ...Typography.micro,
    fontWeight: '700',
  },
  footnote: {
    ...Typography.micro,
    fontWeight: '600',
    alignSelf: 'flex-end',
    marginTop: Spacing.xs,
  },
});
