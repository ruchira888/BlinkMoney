/**
 * The envelope's paper, drawn as inline SVG.
 *
 * These are pure artwork -- no animation, no state. Each piece is rendered
 * into its own absolutely positioned layer by GiftEnvelope so that ordinary
 * React Native z-index still governs paint order between them; nothing here
 * relies on ordering *within* a single SVG, which has no z-index at all.
 *
 * Shapes and colours follow assets/images/envelope.png (cream paper, dark red
 * wax) rather than reusing the file itself: a flattened photograph cannot be
 * hinged apart into a flap, a pocket and a letter.
 */
import Svg, { Circle, ClipPath, Defs, G, Path, Rect } from 'react-native-svg';

import { ENVELOPE_PALETTE, GEOMETRY } from './envelope.tokens';

const { width: W, height: H, flapHeight: FLAP_H } = GEOMETRY;

// Where the pocket's side creases meet. Slightly above centre, matching the
// proportions of the reference photograph.
const CREASE_APEX = Math.round(H * 0.58);

const CORNER = 8;

export type EnvelopePalette = (typeof ENVELOPE_PALETTE)['light'];

/**
 * The rear wall of the envelope. Sits behind everything, including the letter,
 * so the letter never appears to escape through the back.
 */
export function EnvelopeBackPanel({ palette }: { palette: EnvelopePalette }) {
  return (
    <Svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
      <Rect
        x={0.5}
        y={0.5}
        width={W - 1}
        height={H - 1}
        rx={CORNER}
        fill={palette.paperShade}
        stroke={palette.paperEdge}
        strokeWidth={1}
      />
    </Svg>
  );
}

/**
 * The front pocket: the folded panels the letter slides up out of. Drawn as
 * the two side triangles and the bottom panel of a real envelope back, so the
 * letter is occluded from the mouth downward as it rises.
 */
export function EnvelopeFrontPocket({ palette }: { palette: EnvelopePalette }) {
  return (
    <Svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
      <Defs>
        {/* Keeps the triangles from spilling past the rounded corners. */}
        <ClipPath id="pocket-clip">
          <Rect x={0} y={0} width={W} height={H} rx={CORNER} />
        </ClipPath>
      </Defs>
      <G clipPath="url(#pocket-clip)">
        <Rect x={0} y={0} width={W} height={H} fill={palette.paper} />
        <Path d={`M0 0 L${W / 2} ${CREASE_APEX} L0 ${H} Z`} fill={palette.paperShade} />
        <Path d={`M${W} 0 L${W / 2} ${CREASE_APEX} L${W} ${H} Z`} fill={palette.paperShade} />
        <Path d={`M0 ${H} L${W / 2} ${CREASE_APEX} L${W} ${H} Z`} fill={palette.paper} />
        <Path
          d={`M0 ${H} L${W / 2} ${CREASE_APEX} L${W} ${H}`}
          fill="none"
          stroke={palette.crease}
          strokeWidth={1}
        />
      </G>
      <Rect
        x={0.5}
        y={0.5}
        width={W - 1}
        height={H - 1}
        rx={CORNER}
        fill="none"
        stroke={palette.paperEdge}
        strokeWidth={1}
      />
    </Svg>
  );
}

// The flap outline: a downward-pointing triangle whose top corners match the
// envelope's own rounded corners.
const FLAP_PATH =
  `M0 ${CORNER} A${CORNER} ${CORNER} 0 0 1 ${CORNER} 0 ` +
  `L${W - CORNER} 0 A${CORNER} ${CORNER} 0 0 1 ${W} ${CORNER} ` +
  `L${W / 2} ${FLAP_H} Z`;

/**
 * The flap seen from outside, while it is still sealed. This is the face that
 * is turned toward the viewer for the first quarter of the open.
 */
export function EnvelopeFlapFace({ palette }: { palette: EnvelopePalette }) {
  return (
    <Svg width={W} height={FLAP_H} viewBox={`0 0 ${W} ${FLAP_H}`}>
      <Path d={FLAP_PATH} fill={palette.paper} stroke={palette.paperEdge} strokeWidth={1} />
      {/* A soft crease down the spine of the flap, as on the reference. */}
      <Path
        d={`M${W / 2} 6 L${W / 2} ${FLAP_H - 4}`}
        stroke={palette.crease}
        strokeWidth={0.75}
        opacity={0.5}
      />
    </Svg>
  );
}

/**
 * The flap seen from inside, once it has turned past edge-on: the lining.
 *
 * The lining colour is deliberately nothing like the paper. This is the detail
 * that makes the hinge read as a physical fold rather than a rotating
 * rectangle, and it is what flat envelope illustrations usually omit.
 *
 * Drawn in the same box as the face and swapped for it at the edge-on frame,
 * because React Native has no backface-visibility to do it automatically.
 */
export function EnvelopeFlapLining({ palette }: { palette: EnvelopePalette }) {
  // Inset triangle, so a thin rim of paper edge still shows around the lining.
  const inset =
    `M5 ${CORNER + 3} L${W - 5} ${CORNER + 3} L${W / 2} ${FLAP_H - 7} Z`;

  return (
    <Svg width={W} height={FLAP_H} viewBox={`0 0 ${W} ${FLAP_H}`}>
      <Path d={FLAP_PATH} fill={palette.paper} stroke={palette.paperEdge} strokeWidth={1} />
      <Path d={inset} fill={palette.lining} />
      {/* Shading along one half so the lining is not a flat block of colour. */}
      <Path
        d={`M5 ${CORNER + 3} L${W / 2} ${CORNER + 3} L${W / 2} ${FLAP_H - 7} Z`}
        fill={palette.liningShade}
        opacity={0.55}
      />
    </Svg>
  );
}

/**
 * The wax seal holding the flap down. Breaks (fades) inside the opening beat
 * so it is never seen floating away from the flap it was holding.
 *
 * Deliberately unmarked -- a plain pressed disc with an embossed ring, no
 * glyph or motif. On a screen this small any device inside the seal reads as
 * clip art, and the point of the seal is the material, not a picture.
 */
export function EnvelopeWaxSeal({ palette, size = 44 }: { palette: EnvelopePalette; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 44 44">
      <Circle cx={22} cy={22} r={18} fill={palette.wax} />
      {/* Slightly darker rim, as wax pools thicker where it was pressed. */}
      <Circle cx={22} cy={22} r={18} fill="none" stroke={palette.waxShade} strokeWidth={1.4} />
      <Circle cx={22} cy={22} r={12.5} fill="none" stroke={palette.waxShade} strokeWidth={1} opacity={0.7} />
      {/* A single soft highlight so the disc is not flat. */}
      <Circle cx={17} cy={16.5} r={6} fill="#FFFFFF" opacity={0.07} />
    </Svg>
  );
}

/**
 * The letter itself -- just the paper. Its readable content is rendered as
 * real text on top by GiftEnvelope, so it stays selectable and scales with the
 * user's font size.
 */
export function EnvelopeLetterCard({ palette }: { palette: EnvelopePalette }) {
  const { letterWidth: LW, letterHeight: LH } = GEOMETRY;

  return (
    <Svg width={LW} height={LH} viewBox={`0 0 ${LW} ${LH}`}>
      <Rect
        x={0.5}
        y={0.5}
        width={LW - 1}
        height={LH - 1}
        rx={6}
        fill={palette.letter}
        stroke={palette.letterEdge}
        strokeWidth={1}
      />
    </Svg>
  );
}
