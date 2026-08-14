/**
 * Renders the promo area for whichever state the data is in.
 *
 * Rule 10 lives here: loading, empty, error-with-retry and success each get a
 * real treatment. The switch is exhaustive over PromoState's discriminant, so
 * adding a fifth state to the union makes this file fail to compile rather
 * than silently render nothing.
 *
 * Every branch reserves the same height as a real card, so moving between
 * states never shifts the content below it.
 */

import { StyleSheet, View } from 'react-native';

import { PromoCarousel } from '@/components/home/promo-carousel';
import { PROMO_CARD_HEIGHT } from '@/components/home/promo-card';
import { Skeleton } from '@/components/ui/skeleton';
import { StateMessage } from '@/components/ui/state-message';
import type { Promo } from '@/constants/promos';
import { Radius, Spacing, type ThemePalette } from '@/constants/theme';
import type { PromoState } from '@/hooks/use-promos';

type Props = {
  state: PromoState;
  retry: () => void;
  colors: ThemePalette;
  onSelect?: (promo: Promo) => void;
  onActiveChange?: (index: number) => void;
};

export function PromoSection({ state, retry, colors, onSelect, onActiveChange }: Props) {
  switch (state.status) {
    case 'loading':
      return (
        <View style={styles.gutter}>
          <Skeleton height={PROMO_CARD_HEIGHT} radius={Radius.xl} colors={colors} />
          <View style={styles.dotRow}>
            <Skeleton width={28} height={8} radius={Radius.pill} colors={colors} />
            <Skeleton width={8} height={8} radius={Radius.pill} colors={colors} />
            <Skeleton width={8} height={8} radius={Radius.pill} colors={colors} />
          </View>
        </View>
      );

    case 'empty':
      return (
        <View style={styles.gutter}>
          <StateMessage
            tone="empty"
            title="No offers right now"
            description="New ways to grow your money land here often. Check back shortly."
            colors={colors}
            minHeight={PROMO_CARD_HEIGHT}
          />
        </View>
      );

    case 'error':
      return (
        <View style={styles.gutter}>
          <StateMessage
            tone="error"
            title="Couldn’t load offers"
            description={state.message}
            colors={colors}
            onRetry={retry}
            minHeight={PROMO_CARD_HEIGHT}
          />
        </View>
      );

    case 'success':
      // Full-bleed on purpose: the carousel pages a window-width slide and
      // applies the gutter to the card inside it, so it must not be padded here.
      return (
        <PromoCarousel
          promos={state.promos}
          colors={colors}
          onSelect={onSelect}
          onActiveChange={onActiveChange}
        />
      );
  }
}

const styles = StyleSheet.create({
  gutter: {
    paddingHorizontal: Spacing.xl,
  },
  dotRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    height: Spacing.xxxl,
  },
});
