/**
 * Shared primitives for the Gift a Seed screens.
 *
 * Every screen is assembled from these so the feature stays visually one
 * thing: same button weight, same card treatment, same hairlines.
 */
import { Ionicons } from '@expo/vector-icons';
import { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View, ViewStyle } from 'react-native';

import { C, RADIUS } from './theme';

/* ------------------------------------------------------------------ buttons */

export function PrimaryButton({
  label,
  onPress,
  icon = 'arrow-forward',
  style,
}: {
  label: string;
  onPress?: () => void;
  icon?: keyof typeof Ionicons.glyphMap | null;
  style?: ViewStyle;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      style={({ pressed }) => [s.primary, style, pressed && s.pressed]}
    >
      <Text style={s.primaryText}>{label}</Text>
      {icon ? <Ionicons name={icon} size={17} color={C.text} /> : null}
    </Pressable>
  );
}

export function SecondaryButton({
  label,
  onPress,
  icon,
  style,
}: {
  label: string;
  onPress?: () => void;
  icon?: keyof typeof Ionicons.glyphMap;
  style?: ViewStyle;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      style={({ pressed }) => [s.secondary, style, pressed && s.pressed]}
    >
      {icon ? <Ionicons name={icon} size={16} color={C.textMuted} /> : null}
      <Text style={s.secondaryText}>{label}</Text>
    </Pressable>
  );
}

/* -------------------------------------------------------------------- shell */

/** Screen header: back chevron, wordmark, profile. Matches the app's chrome. */
export function TopBar({ onBack }: { onBack?: () => void }) {
  return (
    <View style={s.topBar}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Go back"
        onPress={onBack}
        hitSlop={10}
        style={s.topIcon}
      >
        <Ionicons name="chevron-back" size={22} color={C.textMuted} />
      </Pressable>
      <Text style={s.wordmark}>BlinkMoney</Text>
      <View style={s.topIcon}>
        <Ionicons name="person-outline" size={19} color={C.textMuted} />
      </View>
    </View>
  );
}

export function ScreenTitle({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <View style={s.titleBlock}>
      <Text style={s.title}>{title}</Text>
      {subtitle ? <Text style={s.subtitle}>{subtitle}</Text> : null}
    </View>
  );
}

/* -------------------------------------------------------------------- cards */

export function Card({ children, style }: { children: ReactNode; style?: ViewStyle }) {
  return <View style={[s.card, style]}>{children}</View>;
}

/** A label/value row with an optional hairline above it. */
export function DataRow({
  label,
  value,
  divider = true,
  strong,
}: {
  label: string;
  value: string;
  divider?: boolean;
  strong?: boolean;
}) {
  return (
    <View style={[s.row, divider && s.rowDivider]}>
      <Text style={s.rowLabel}>{label}</Text>
      <Text style={[s.rowValue, strong && s.rowValueStrong]}>{value}</Text>
    </View>
  );
}

/** Icon + title + body, used for the trust/benefit lists. */
export function FeatureRow({
  icon,
  title,
  body,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  body: string;
}) {
  return (
    <View style={s.feature}>
      <View style={s.featureIcon}>
        <Ionicons name={icon} size={18} color={C.greenBright} />
      </View>
      <View style={s.featureText}>
        <Text style={s.featureTitle}>{title}</Text>
        <Text style={s.featureBody}>{body}</Text>
      </View>
    </View>
  );
}

/** Quiet reassurance line: lock icon + small muted text. */
export function Assurance({ text, icon = 'lock-closed-outline' }: { text: string; icon?: keyof typeof Ionicons.glyphMap }) {
  return (
    <View style={s.assurance}>
      <Ionicons name={icon} size={13} color={C.textFaint} />
      <Text style={s.assuranceText}>{text}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  primary: {
    height: 54,
    borderRadius: RADIUS.md,
    backgroundColor: C.green,
    borderWidth: 1,
    borderColor: C.greenBright,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 9,
  },
  primaryText: { color: C.text, fontSize: 16, fontWeight: '700' },
  secondary: {
    height: 50,
    borderRadius: RADIUS.md,
    backgroundColor: C.cardAlt,
    borderWidth: 1,
    borderColor: C.hairline,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  secondaryText: { color: C.text, fontSize: 15, fontWeight: '600' },
  pressed: { opacity: 0.85 },

  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    height: 46,
  },
  topIcon: { width: 30, height: 30, alignItems: 'center', justifyContent: 'center' },
  wordmark: { color: C.greenBright, fontSize: 15, fontWeight: '700', letterSpacing: 0.2 },

  titleBlock: { paddingHorizontal: 18, paddingTop: 10, paddingBottom: 4 },
  title: { color: C.text, fontFamily: 'serif', fontSize: 27, fontWeight: '700' },
  subtitle: { color: C.textMuted, fontSize: 13, marginTop: 5, lineHeight: 18 },

  card: {
    backgroundColor: C.card,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: C.hairline,
    padding: 14,
  },

  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 11 },
  rowDivider: { borderTopWidth: 1, borderTopColor: C.hairline },
  rowLabel: { color: C.textMuted, fontSize: 13 },
  rowValue: { color: C.text, fontSize: 14, fontWeight: '600' },
  rowValueStrong: { fontFamily: 'serif', fontSize: 17, fontWeight: '700' },

  feature: { flexDirection: 'row', gap: 12, alignItems: 'flex-start' },
  featureIcon: {
    width: 38,
    height: 38,
    borderRadius: RADIUS.sm,
    backgroundColor: C.greenDim,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureText: { flex: 1, gap: 2 },
  featureTitle: { color: C.text, fontSize: 14.5, fontWeight: '700' },
  featureBody: { color: C.textMuted, fontSize: 12.5, lineHeight: 17 },

  assurance: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 },
  assuranceText: { color: C.textFaint, fontSize: 11.5, textAlign: 'center' },
});
