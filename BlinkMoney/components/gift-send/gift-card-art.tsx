/**
 * The gift card: just the artwork asset.
 *
 * Everything the card says -- title, tagline, motif -- is baked into the png,
 * so this only sizes and rounds it. The drawn gradient, blooms, confetti and
 * type that used to live here are gone.
 *
 * expo-image rather than RN's Image: it is already a dependency and it caches
 * decoded bitmaps, which matters when three of these are mounted at once in
 * the carousel.
 */

import { Image } from 'expo-image';
import { memo } from 'react';
import { StyleSheet, View } from 'react-native';

import type { GiftCardDesign } from '@/constants/gift-cards';
import { Radius } from '@/constants/theme';

type Props = {
  design: GiftCardDesign;
  width: number;
  height: number;
};

function GiftCardArtComponent({ design, width, height }: Props) {
  return (
    <View style={[styles.card, { width, height }]}>
      <Image
        source={design.image}
        style={StyleSheet.absoluteFill}
        contentFit="cover"
        accessible
        accessibilityLabel={`${design.title}. ${design.tagline}`}
        // The assets are a fixed set that ship in the bundle, so there is
        // nothing to fade in from.
        transition={0}
      />
    </View>
  );
}

export const GiftCardArt = memo(GiftCardArtComponent);

const styles = StyleSheet.create({
  card: {
    borderRadius: Radius.xxl,
    overflow: 'hidden',
  },
});
