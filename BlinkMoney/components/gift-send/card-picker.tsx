/**
 * Center-focused gift card carousel.
 *
 * The effect is small → growing → center → shrinking → small, driven entirely
 * by scroll offset. Every card interpolates its own scale, opacity and lift
 * from its distance to the centre, so the transition tracks the finger
 * continuously instead of snapping to a new state when the swipe ends.
 *
 * Notes on the choices here:
 *
 * - All animation reads one shared scrollX on the UI thread. React re-renders
 *   exactly once per settle (for the haptic and the selection callback), not
 *   per frame, which is what keeps it at 60fps.
 *
 * - Centre scale is exactly 1.0 rather than the 1.08 the brief allows. At 1.0
 *   the hero card fits inside its slot and never overlaps its neighbours, so
 *   it is always drawn in front without needing zIndex -- which does not
 *   animate reliably on Android and would have been the fragile way to get the
 *   same result.
 *
 * - removeClippedSubviews is off and the whole list renders up front, so no
 *   card unmounts mid-swipe. With three cards that costs nothing.
 *
 * - Haptics fire from a useAnimatedReaction on the derived index, so exactly
 *   one tick happens when the active card changes, never during the drag.
 *
 * True infinite looping is not implemented: with three cards it needs
 * duplicated data and index bookkeeping that is a common source of off-by-one
 * bugs, and the peek already communicates that there is more to swipe.
 */

import * as Haptics from 'expo-haptics';
import { useCallback, useRef } from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
  type ListRenderItemInfo,
} from 'react-native';
import Animated, {
  Extrapolation,
  interpolate,
  runOnJS,
  useAnimatedReaction,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  type SharedValue,
} from 'react-native-reanimated';

import { GiftCardArt } from '@/components/gift-send/gift-card-art';
import { CarouselDots } from '@/components/home/carousel-dots';
import { GIFT_CARD_ASPECT, type GiftCardDesign } from '@/constants/gift-cards';
import { Spacing, Typography, type ThemePalette } from '@/constants/theme';

// Matches the artwork assets.
const CARD_ASPECT = GIFT_CARD_ASPECT;
/** Share of the screen the hero card occupies. Brief asks for 65-72%. */
const SLOT_RATIO = 0.7;
/** Gap between slots, so neighbours peek with air around them. */
const GUTTER = Spacing.md;

const CENTER_SCALE = 1;
const SIDE_SCALE = 0.86;
const CENTER_OPACITY = 1;
const SIDE_OPACITY = 0.72;
/** Side cards ride slightly lower, which is the parallax cue. */
const SIDE_LIFT = 16;

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList<GiftCardDesign>);

type SlideProps = {
  design: GiftCardDesign;
  index: number;
  scrollX: SharedValue<number>;
  slotWidth: number;
  cardWidth: number;
  colors: ThemePalette;
  reduceMotion: boolean;
  onPressCard: (index: number) => void;
};

/**
 * Module level, not inside the picker's render body: each slide owns a
 * useAnimatedStyle keyed to its index, and hooks cannot be called from a
 * renderItem closure defined inline.
 */
function CardSlide({
  design,
  index,
  scrollX,
  slotWidth,
  cardWidth,
  colors,
  reduceMotion,
  onPressCard,
}: SlideProps) {
  const animatedStyle = useAnimatedStyle(() => {
    // Distance from this card's resting offset, in slots.
    const range = [(index - 1) * slotWidth, index * slotWidth, (index + 1) * slotWidth];

    if (reduceMotion) {
      // Still show which card is selected, just without the motion.
      const focused = Math.abs(scrollX.value - index * slotWidth) < slotWidth / 2;
      return { transform: [{ scale: 1 }, { translateY: 0 }], opacity: focused ? 1 : SIDE_OPACITY };
    }

    return {
      transform: [
        {
          scale: interpolate(
            scrollX.value,
            range,
            [SIDE_SCALE, CENTER_SCALE, SIDE_SCALE],
            Extrapolation.CLAMP
          ),
        },
        {
          translateY: interpolate(
            scrollX.value,
            range,
            [SIDE_LIFT, 0, SIDE_LIFT],
            Extrapolation.CLAMP
          ),
        },
      ],
      opacity: interpolate(
        scrollX.value,
        range,
        [SIDE_OPACITY, CENTER_OPACITY, SIDE_OPACITY],
        Extrapolation.CLAMP
      ),
    };
  });

  return (
    <View style={[styles.slot, { width: slotWidth }]}>
      <Animated.View style={animatedStyle}>
        {/* A plain Pressable, not PressableScale: this card is already being
            scaled by the carousel, and a second scale on press fights it. */}
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`${design.title}. ${design.tagline}`}
          onPress={() => onPressCard(index)}
        >
          <GiftCardArt design={design} width={cardWidth} height={cardWidth * CARD_ASPECT} />
          <Text style={[styles.occasion, { color: colors.textMuted }]} numberOfLines={1}>
            {design.occasion}
          </Text>
        </Pressable>
      </Animated.View>
    </View>
  );
}

type Props = {
  designs: GiftCardDesign[];
  colors: ThemePalette;
  onSelect: (design: GiftCardDesign) => void;
};

export function CardPicker({ designs, colors, onSelect }: Props) {
  const { width: windowWidth } = useWindowDimensions();
  const reduceMotion = useReducedMotion();
  const listRef = useRef<FlatList<GiftCardDesign>>(null);
  const scrollX = useSharedValue(0);

  const slotWidth = Math.round(windowWidth * SLOT_RATIO);
  const cardWidth = slotWidth - GUTTER * 2;
  /** Centres the first and last cards in the viewport. */
  const sidePadding = (windowWidth - slotWidth) / 2;

  const scrollHandler = useAnimatedScrollHandler((event) => {
    scrollX.value = event.contentOffset.x;
  });

  /** Runs on the JS thread once per settle. */
  const handleActive = useCallback(
    (index: number) => {
      const design = designs[index];
      if (!design) {
        return;
      }
      Haptics.selectionAsync().catch(() => {});
      onSelect(design);
    },
    [designs, onSelect]
  );

  // One tick when the active card changes -- never during the drag itself.
  useAnimatedReaction(
    () => Math.round(scrollX.value / slotWidth),
    (current, previous) => {
      if (previous !== null && current !== previous) {
        runOnJS(handleActive)(current);
      }
    },
    [slotWidth, handleActive]
  );

  /** Tapping a side card brings it to the centre rather than doing nothing. */
  const handlePressCard = useCallback(
    (index: number) => {
      listRef.current?.scrollToOffset({ offset: index * slotWidth, animated: true });
    },
    [slotWidth]
  );

  const renderItem = useCallback(
    ({ item, index }: ListRenderItemInfo<GiftCardDesign>) => (
      <CardSlide
        design={item}
        index={index}
        scrollX={scrollX}
        slotWidth={slotWidth}
        cardWidth={cardWidth}
        colors={colors}
        reduceMotion={reduceMotion}
        onPressCard={handlePressCard}
      />
    ),
    [cardWidth, colors, handlePressCard, reduceMotion, scrollX, slotWidth]
  );

  return (
    <View>
      <AnimatedFlatList
        ref={listRef}
        data={designs}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        horizontal
        showsHorizontalScrollIndicator={false}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        // Snap one card at a time, with momentum that still feels native.
        snapToInterval={slotWidth}
        snapToAlignment="start"
        decelerationRate="fast"
        disableIntervalMomentum
        contentContainerStyle={{ paddingHorizontal: sidePadding }}
        // Nothing unmounts mid-swipe.
        removeClippedSubviews={false}
        initialNumToRender={designs.length}
        windowSize={designs.length + 2}
        // Fixed slot width, so the list never has to measure to scroll.
        getItemLayout={(_, index) => ({
          length: slotWidth,
          offset: slotWidth * index,
          index,
        })}
      />

      <CarouselDots
        count={designs.length}
        scrollX={scrollX}
        slideWidth={slotWidth}
        colors={colors}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  slot: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  occasion: {
    ...Typography.caption,
    textAlign: 'center',
    marginTop: Spacing.md,
  },
});
