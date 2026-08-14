/**
 * The auto-advancing promo carousel.
 *
 * Behaviour worth knowing:
 *
 * - It advances every Duration.carouselDwell and wraps at the end. The wrap is
 *   an animated rewind rather than an invisible jump: with three cards the
 *   sweep back reads as deliberate, and it avoids the duplicated-slides trick,
 *   which is where infinite carousels usually grow their index bugs.
 *
 * - Touching it stops the timer immediately and restarts it only after
 *   Duration.carouselResume of stillness, so it never pulls a card out from
 *   under someone mid-read.
 *
 * - With Reduce Motion on, auto-advance is off entirely and the carousel
 *   becomes a plain swipeable strip. Moving content on a timer is exactly what
 *   that setting exists to stop.
 *
 * - scrollX is a shared value read by the slides and the dots on the UI
 *   thread. Scrolling therefore causes no React re-render at all; the only
 *   state here is the paused flag.
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { useWindowDimensions, View, type NativeScrollEvent, type NativeSyntheticEvent } from 'react-native';
import Animated, {
  useAnimatedRef,
  useAnimatedScrollHandler,
  useReducedMotion,
  useSharedValue,
} from 'react-native-reanimated';

import { CarouselDots } from '@/components/home/carousel-dots';
import { PROMO_CARD_HEIGHT } from '@/components/home/promo-card';
import { PromoSlide } from '@/components/home/promo-slide';
import type { Promo } from '@/constants/promos';
import { Duration, Spacing, type ThemePalette } from '@/constants/theme';

type Props = {
  promos: Promo[];
  colors: ThemePalette;
  onSelect?: (promo: Promo) => void;
  /** Fires when the visible card changes, so the page's CTA can follow it. */
  onActiveChange?: (index: number) => void;
};

export function PromoCarousel({ promos, colors, onSelect, onActiveChange }: Props) {
  const { width: windowWidth } = useWindowDimensions();
  const reduceMotion = useReducedMotion();

  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const scrollX = useSharedValue(0);

  /** Current page. A ref, not state: the timer needs to read it without the
   *  effect re-subscribing on every page change. */
  const indexRef = useRef(0);
  const [paused, setPaused] = useState(false);
  const resumeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  /** One slide is exactly the window width, so pagingEnabled snaps centred.
   *  The card is inset from that by the page gutter on each side. */
  const slideWidth = windowWidth;
  const cardWidth = Math.max(0, windowWidth - Spacing.xl * 2);
  const count = promos.length;

  const scrollHandler = useAnimatedScrollHandler((event) => {
    scrollX.value = event.contentOffset.x;
  });

  const clearResume = useCallback(() => {
    if (resumeTimer.current) {
      clearTimeout(resumeTimer.current);
      resumeTimer.current = null;
    }
  }, []);

  /** Called when the user starts interacting: freeze until they stop. */
  const handleTouchStart = useCallback(() => {
    clearResume();
    setPaused(true);
  }, [clearResume]);

  const scheduleResume = useCallback(() => {
    clearResume();
    resumeTimer.current = setTimeout(() => setPaused(false), Duration.carouselResume);
  }, [clearResume]);

  const handleMomentumEnd = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      // Derive the page from the real offset rather than incrementing a
      // counter, so a fast multi-page fling cannot desynchronise the timer
      // from what is actually on screen.
      if (slideWidth > 0) {
        const settled = Math.round(event.nativeEvent.contentOffset.x / slideWidth);
        if (settled !== indexRef.current) {
          indexRef.current = settled;
        }
        onActiveChange?.(settled);
      }
      scheduleResume();
    },
    [onActiveChange, scheduleResume, slideWidth]
  );

  useEffect(() => clearResume, [clearResume]);

  // Auto-advance.
  useEffect(() => {
    if (paused || reduceMotion || count < 2 || slideWidth <= 0) {
      return;
    }
    const id = setInterval(() => {
      const next = (indexRef.current + 1) % count;
      indexRef.current = next;
      scrollRef.current?.scrollTo({ x: next * slideWidth, animated: true });
      // Reported here rather than relying on onMomentumScrollEnd: Android does
      // not reliably emit that for a programmatic animated scroll, so the CTA
      // would stop following the card on exactly the platform being targeted.
      onActiveChange?.(next);
    }, Duration.carouselDwell);

    return () => clearInterval(id);
  }, [paused, reduceMotion, count, slideWidth, scrollRef, onActiveChange]);

  // Keep the current page centred across a rotation or split-screen resize --
  // without this the offset stays in old-width units and lands mid-card.
  useEffect(() => {
    if (slideWidth <= 0) {
      return;
    }
    scrollRef.current?.scrollTo({ x: indexRef.current * slideWidth, animated: false });
  }, [slideWidth, scrollRef]);

  return (
    <View>
      <Animated.ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        onTouchStart={handleTouchStart}
        onScrollBeginDrag={handleTouchStart}
        onMomentumScrollEnd={handleMomentumEnd}
        onScrollEndDrag={scheduleResume}
        // Height is pinned so the strip does not grow with the scaled slides.
        style={{ height: PROMO_CARD_HEIGHT }}
        accessibilityRole="list"
        accessibilityLabel="Offers"
      >
        {promos.map((promo, index) => (
          <PromoSlide
            key={promo.id}
            promo={promo}
            index={index}
            scrollX={scrollX}
            slideWidth={slideWidth}
            cardWidth={cardWidth}
            colors={colors}
            onPress={onSelect}
          />
        ))}
      </Animated.ScrollView>

      <CarouselDots count={count} scrollX={scrollX} slideWidth={slideWidth} colors={colors} />
    </View>
  );
}
