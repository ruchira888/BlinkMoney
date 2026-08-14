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
import type { ThemePalette } from '@/constants/theme';

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

    const scale = interpolate(scrollX.value, inputRange, [0.93, 1, 0.93], Extrapolation.CLAMP);
    const opacity = interpolate(scrollX.value, inputRange, [0.55, 1, 0.55], Extrapolation.CLAMP);

    return { transform: [{ scale }], opacity };
  });

  return (
    <View style={[styles.slide, { width: slideWidth }]}>
      <Animated.View style={animatedStyle}>
        <PromoCard promo={promo} width={cardWidth} colors={colors} onPress={onPress} />
      </Animated.View>
    </View>
  );
}

export const PromoSlide = memo(PromoSlideComponent);

const styles = StyleSheet.create({
  slide: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
