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
import {
  StyleSheet,
  useWindowDimensions,
  View,
  type LayoutChangeEvent,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from 'react-native';
import Animated, {
  useAnimatedRef,
  useAnimatedScrollHandler,
  useReducedMotion,
  useSharedValue,
} from 'react-native-reanimated';

import { CarouselDots } from '@/components/home/carousel-dots';
import { promoCardHeight } from '@/components/home/promo-card';
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

  /**
   * The page width every measurement here derives from.
   *
   * Two sources can disagree: the window, and the width this strip is actually
   * given by its parent. `pagingEnabled` snaps to the latter, the slides were
   * sized from the former, and when they differ the cards settle off centre and
   * hang off the right edge. So take the smaller of the two -- whichever
   * measurement is lying, a page can never come out wider than the screen -- and
   * drive the slides, the card, the paging maths and the dots from that one
   * number.
   *
   * `measured` starts at 0, not at the window width, so the very first layout
   * pass is trusted rather than being min()'d against a seed that may be wrong.
   */
  const [measured, setMeasured] = useState(0);
  const pageWidth = measured > 0 ? Math.min(measured, windowWidth) : windowWidth;
  const slideWidth = pageWidth;
  const cardWidth = Math.max(0, pageWidth - Spacing.xl * 2);
  const count = promos.length;

  const handleStripLayout = useCallback((event: LayoutChangeEvent) => {
    const width = Math.round(event.nativeEvent.layout.width);
    if (width > 0) {
      setMeasured((current) => (current === width ? current : width));
    }
  }, []);

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
    // Two views on purpose. The outer one is unstyled so its onLayout reports
    // the width the parent really offers; the inner one is pinned to exactly
    // one page and clipped, so however wide the parent turns out to be, the
    // strip itself starts at the screen's left edge and cannot spill past its
    // right one.
    <View onLayout={handleStripLayout}>
      <View style={[styles.strip, { width: pageWidth }]}>
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
          // Pinned so the strip does not grow with the scaled slides, plus a
          // little slack so an active card at full scale is not flush against
          // the strip's own edges.
          style={{ height: promoCardHeight(cardWidth) + Spacing.sm }}
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
    </View>
  );
}

const styles = StyleSheet.create({
  strip: {
    // Pinned to the screen's left edge and clipped to one page, so a parent
    // that hands down more width than the screen has cannot push the cards
    // sideways or let them run off the right.
    alignSelf: 'flex-start',
    overflow: 'hidden',
  },
});
