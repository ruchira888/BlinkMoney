/**
 * A restrained growth line. No axes, no grid, no labels inside the plot --
 * the numbers around it carry the detail, this only carries the shape.
 */
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Defs, LinearGradient, Path, Stop } from 'react-native-svg';

import { C } from './theme';

export function InvestmentChart({
  series,
  height = 96,
}: {
  series: readonly number[];
  height?: number;
}) {
  // Measured rather than assumed, so the line spans whatever width the card
  // gives it on any device.
  const [width, setWidth] = useState(0);

  const pad = 4;
  const w = Math.max(0, width - pad * 2);
  const h = height - pad * 2;

  const points = series.map((v, i) => {
    const x = pad + (series.length === 1 ? 0 : (i / (series.length - 1)) * w);
    const y = pad + (1 - v) * h;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });

  const line = points.length ? `M${points.join(' L')}` : '';
  const area = points.length
    ? `${line} L${(pad + w).toFixed(1)},${(pad + h).toFixed(1)} L${pad},${(pad + h).toFixed(1)} Z`
    : '';

  return (
    <View style={[s.wrap, { height }]} onLayout={(e) => setWidth(e.nativeEvent.layout.width)}>
      {width > 0 ? (
        <Svg width={width} height={height}>
          <Defs>
            <LinearGradient id="fill" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor={C.greenBright} stopOpacity={0.28} />
              <Stop offset="1" stopColor={C.greenBright} stopOpacity={0} />
            </LinearGradient>
          </Defs>
          <Path d={area} fill="url(#fill)" />
          <Path
            d={line}
            fill="none"
            stroke={C.greenBright}
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      ) : null}
    </View>
  );
}

const s = StyleSheet.create({
  wrap: { alignSelf: 'stretch' },
});
