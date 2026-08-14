/**
 * A soft pool of light behind the envelope.
 *
 * Drawn as an SVG radial gradient rather than a rounded View: a View with a
 * border radius has a hard edge, which on a near-black screen reads as a
 * visible dark green disc rather than as light. It fades fully to transparent
 * so nothing about it is edged.
 */
import { StyleSheet, View } from 'react-native';
import Svg, { Circle, Defs, RadialGradient, Stop } from 'react-native-svg';

export function RadialPool({ size = 360, opacity = 1 }: { size?: number; opacity?: number }) {
  return (
    <View style={[StyleSheet.absoluteFill, s.wrap]} pointerEvents="none">
      <Svg width={size} height={size} style={{ opacity }}>
        <Defs>
          <RadialGradient id="pool" cx="50%" cy="50%" r="50%">
            <Stop offset="0" stopColor="#1F7A28" stopOpacity={0.2} />
            <Stop offset="0.55" stopColor="#12351A" stopOpacity={0.12} />
            <Stop offset="1" stopColor="#050705" stopOpacity={0} />
          </RadialGradient>
        </Defs>
        <Circle cx={size / 2} cy={size / 2} r={size / 2} fill="url(#pool)" />
      </Svg>
    </View>
  );
}

const s = StyleSheet.create({
  wrap: { alignItems: 'center', justifyContent: 'center' },
});
