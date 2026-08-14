/**
 * One slide of the promo carousel.
 *
 * The card is drawn, not an asset. Four things give it depth, in back-to-front
 * order, and they matter in combination -- any one alone reads as flat:
 *
 *   1. the brand gradient
 *   2. a soft bloom in the top-right, the light source
 *   3. two concentric rings catching that light, the reference art's motif
 *   4. a specular sheen down the top edge, plus a lit hairline border
 *
 * The rings and the sheen are deliberately weak. They are surface texture; the
 * moment they compete with the headline the card stops being a promo and
 * starts being decoration.
 *
 * Gradients come from react-native-svg rather than expo-linear-gradient: svg
 * is already a dependency and ships inside Expo Go, so this needs no new
 * native module.
 */

import { memo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, {
  Circle,
  ClipPath,
  Defs,
  G,
  LinearGradient,
  RadialGradient,
  Rect,
  Stop,
} from 'react-native-svg';

import type { Promo } from '@/constants/promos';
import { Glass, Radius, Spacing, Typography, type ThemePalette } from '@/constants/theme';

/**
 * Height is derived from width, not fixed.
 *
 * A hardcoded height meant the aspect ratio changed on every device -- tall
 * and narrow on a small phone, short and wide on a large one -- and the strip
 * reserved exactly that height, so there was no tolerance for a long string or
 * a large system font before the card clipped.
 *
 * The floor keeps the tallest card's content (~271px) fitting on a narrow
 * phone; the ceiling stops it becoming a slab on a tablet.
 */
const CARD_RATIO = 0.78;
const MIN_CARD_HEIGHT = 280;
const MAX_CARD_HEIGHT = 320;

export function promoCardHeight(cardWidth: number): number {
  return Math.round(
    Math.min(MAX_CARD_HEIGHT, Math.max(MIN_CARD_HEIGHT, cardWidth * CARD_RATIO))
  );
}

type Props = {
  promo: Promo;
  width: number;
  colors: ThemePalette;
  onPress?: (promo: Promo) => void;
};

function PromoCardComponent({ promo, width, colors, onPress }: Props) {
  const tone = colors.promo[promo.tone];
  const h = promoCardHeight(width);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${promo.title} ${promo.titleAccent ?? ''}. ${promo.body}`}
      accessibilityHint={promo.cta}
      onPress={onPress ? () => onPress(promo) : undefined}
      style={({ pressed }) => [
        styles.card,
        { width, height: h, borderColor: Glass.edge },
        pressed && styles.cardPressed,
      ]}
    >
      <Svg style={StyleSheet.absoluteFill} width={width} height={h} pointerEvents="none">
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

          {/* Specular band down the top edge, faded out by a third of the way
              down so it never reaches the body copy. */}
          <LinearGradient id={`sheen-${promo.id}`} x1="0" y1="0" x2="0.35" y2="1">
            <Stop offset="0" stopColor={Glass.white} stopOpacity={Glass.sheen} />
            <Stop offset="0.34" stopColor={Glass.white} stopOpacity={Glass.sheenFade} />
            <Stop offset="1" stopColor={Glass.white} stopOpacity={0} />
          </LinearGradient>
          {/* The card's own silhouette. Everything decorative is drawn inside
              this, because svg does not clip to the parent View's rounded
              corners -- the rings reach ~1.03x the card width and would
              otherwise paint out over the corner. */}
          <ClipPath id={`clip-${promo.id}`}>
            <Rect x={0} y={0} width={width} height={h} rx={Radius.xl} ry={Radius.xl} />
          </ClipPath>
        </Defs>

        {/* rx/ry, not just the parent's borderRadius: Android does not
            reliably clip a native child view -- which is what an svg surface
            is -- to a parent's rounded corners, so the artwork has to carry
            its own rounding or the card renders as a square. */}
        <Rect
          x={0}
          y={0}
          width={width}
          height={h}
          rx={Radius.xl}
          ry={Radius.xl}
          fill={`url(#fill-${promo.id})`}
        />
        <G clipPath={`url(#clip-${promo.id})`}>
          <Circle cx={width * 0.86} cy={h * 0.2} r={width * 0.42} fill={`url(#glow-${promo.id})`} />

          {/* The motif. Lit by the bloom above so the rings read as glass
              rather than as outlines. Top-right, clear of the left-aligned
              headline, and deliberately running off the edge -- clipped, so it
              reads as a shape passing behind the card rather than a circle
              floating on it. */}
          <Circle
            cx={width * 0.85}
            cy={h * 0.23}
            r={width * 0.16}
            fill="none"
            stroke={Glass.ring}
            strokeWidth={width * 0.05}
          />
          <Circle
            cx={width * 0.75}
            cy={h * 0.38}
            r={width * 0.09}
            fill="none"
            stroke={Glass.ringSoft}
            strokeWidth={width * 0.032}
          />

          <Rect
            x={0}
            y={0}
            width={width}
            height={h}
            rx={Radius.xl}
            ry={Radius.xl}
            fill={`url(#sheen-${promo.id})`}
          />
        </G>
      </Svg>

      <View style={styles.content}>
        {promo.eyebrow ? (
          <Text
            style={[
              styles.eyebrow,
              { color: tone.chipInk, backgroundColor: Glass.chipFill, borderColor: Glass.chipEdge },
            ]}
            numberOfLines={1}
          >
            {promo.eyebrow}
          </Text>
        ) : null}

        <Text
          style={[styles.title, { color: tone.inkStrong }]}
          numberOfLines={2}
          maxFontSizeMultiplier={1.2}
        >
          {promo.title}
        </Text>
        {promo.titleAccent ? (
          <Text
            style={[styles.titleAccent, { color: tone.ink }]}
            numberOfLines={2}
            maxFontSizeMultiplier={1.2}
          >
            {promo.titleAccent}
          </Text>
        ) : null}

        <View style={styles.bodyRow}>
          <Text
            style={[styles.body, { color: tone.ink }]}
            numberOfLines={3}
            maxFontSizeMultiplier={1.2}
          >
            {promo.body}
          </Text>
          {promo.stat ? (
            <View style={styles.stat}>
              <Text style={[styles.statValue, { color: tone.inkStrong }]} maxFontSizeMultiplier={1.2}>{promo.stat.value}</Text>
              <Text style={[styles.statLabel, { color: tone.inkMuted }]} numberOfLines={2}>
                {promo.stat.label}
              </Text>
            </View>
          ) : null}
        </View>

        {/* One block pinned to the bottom, so the chips and the footnote are
            spaced against each other rather than each fighting the edge. */}
        <View style={styles.footer}>
          <View style={styles.chips}>
            {promo.chips.map((chip) => (
              <View
                key={chip.id}
                style={[
                  styles.chip,
                  { backgroundColor: Glass.chipFill, borderColor: Glass.chipEdge },
                ]}
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
    // A lit hairline. Reads as the edge of a physical card catching light, and
    // stops bright artwork bleeding into a dark background.
    borderWidth: StyleSheet.hairlineWidth,
  },
  cardPressed: {
    opacity: 0.92,
  },
  content: {
    flex: 1,
    padding: Spacing.xl,
  },
  // A pill in the reference ("Exclusive for you"), so it carries its own
  // chrome rather than sitting as bare text.
  eyebrow: {
    ...Typography.micro,
    fontWeight: '700',
    overflow: 'hidden',
    alignSelf: 'flex-start',
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: Radius.pill,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    marginBottom: Spacing.md,
  },
  title: {
    ...Typography.title,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  // Upright and equally heavy. The reference sets both headline lines in the
  // same weight; the italic serif treatment this used to have is not in it.
  titleAccent: {
    ...Typography.title,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  bodyRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.lg,
    marginTop: Spacing.md,
  },
  body: {
    ...Typography.body,
    fontWeight: '600',
    flex: 1,
    opacity: 0.94,
  },
  stat: {
    alignItems: 'center',
    maxWidth: 96,
  },
  statValue: {
    ...Typography.display,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  statLabel: {
    ...Typography.micro,
    fontWeight: '700',
    textAlign: 'center',
    opacity: 0.9,
  },
  footer: {
    marginTop: 'auto',
    gap: Spacing.sm,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
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
    opacity: 0.85,
  },
});
