/**
 * Animated wrapper around one PromoCard.
 *
 * Kept as its own module-level component because each slide needs its own
 * useAnimatedStyle keyed to its index -- rule 9 rules out defining it inside
 * the carousel's render body, and hooks could not be called from a .map()
 * callback anyway.
 *
 * The neighbouring cards sit slightly back and dimmed, so a swipe reads as
 * bringing a card forward rather than sliding a filmstrip.
 */

import { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  type SharedValue,
} from 'react-native-reanimated';

import { PromoCard } from '@/components/home/promo-card';
import type { Promo } from '@/constants/promos';
import { Spacing, type ThemePalette } from '@/constants/theme';

type Props = {
  promo: Promo;
  index: number;
  scrollX: SharedValue<number>;
  /** Full page width -- one slide occupies exactly this, which is what makes
   *  pagingEnabled land dead centre every time. */
  slideWidth: number;
  /** The card itself, inset from the slide by the page gutter. */
  cardWidth: number;
  colors: ThemePalette;
  onPress?: (promo: Promo) => void;
};

function PromoSlideComponent({
  promo,
  index,
  scrollX,
  slideWidth,
  cardWidth,
  colors,
  onPress,
}: Props) {
  const animatedStyle = useAnimatedStyle(() => {
    const inputRange = [(index - 1) * slideWidth, index * slideWidth, (index + 1) * slideWidth];

    // Scale only. Neighbours used to fade to 0.55 opacity, which meant that on
    // a short dwell -- when the carousel is nearly always mid-transition -- the
    // card on screen was usually part-faded and its copy looked washed out.
    // Depth now comes from scale alone, so the type is always at full strength.
    const scale = interpolate(scrollX.value, inputRange, [0.93, 1, 0.93], Extrapolation.CLAMP);

    return { transform: [{ scale }] };
  });

  return (
    // The gutter is padding on the page, not a centring rule. Centring only
    // lands the card in the middle if the card is narrower than the page; if
    // that maths is ever off the card drifts sideways and hangs off an edge.
    // Padding pins it to a known distance from the page's own left edge and
    // caps how wide it is allowed to be, which cannot drift.
    <View style={[styles.slide, { width: slideWidth }]}>
      <Animated.View style={[styles.cardWrap, animatedStyle]}>
        <PromoCard promo={promo} width={cardWidth} colors={colors} onPress={onPress} />
      </Animated.View>
    </View>
  );
}

export const PromoSlide = memo(PromoSlideComponent);

const styles = StyleSheet.create({
  slide: {
    justifyContent: 'center',
    paddingHorizontal: Spacing.xl,
  },
  cardWrap: {
    // Never wider than the page allows, whatever cardWidth says.
    maxWidth: '100%',
  },
});
