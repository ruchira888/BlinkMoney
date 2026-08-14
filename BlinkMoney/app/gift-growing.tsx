/**
 * After the reveal: the gift is already working.
 *
 * The growth figure is computed from the gift amount rather than hardcoded, so
 * the total, the gain and the percentage can never contradict each other --
 * which is exactly the sort of thing nobody notices until a screenshot of it
 * is on the internet.
 */

import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PressableScale } from '@/components/ui/pressable-scale';
import { GROWTH_RATE, findReceivedGift } from '@/constants/received-gifts';
import { Radius, Spacing, Typography, elevation } from '@/constants/theme';
import { useTheme } from '@/providers/theme-provider';

/** Two decimals here, unlike the rest of the app: this screen is about a gain
 *  of a few paise, and rounding it to rupees would show it as zero. */
const money = (value: number) =>
  `₹${value.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export default function GiftGrowingScreen() {
  const { colors, scheme, isDark } = useTheme();
  const { id } = useLocalSearchParams<{ id?: string }>();

  const gift = findReceivedGift(id);
  const invested = gift?.amount ?? 0;
  const gain = invested * GROWTH_RATE;
  const total = invested + gain;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]} edges={['top']}>
      {/* Rule 2: style only, no backgroundColor. */}
      <StatusBar style={isDark ? 'light' : 'dark'} />

      <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <View style={[styles.sprout, { backgroundColor: colors.accentWash }]}>
          <Ionicons name="leaf" size={30} color={colors.accentInk} />
        </View>

        <Text style={[styles.headline, { color: colors.text }]}>Your first seed is growing</Text>

        <View
          style={[
            styles.panel,
            { backgroundColor: colors.surface, borderColor: colors.accent },
            elevation(scheme, 2),
          ]}
        >
          <Text style={[styles.panelLabel, { color: colors.textMuted }]}>Total portfolio</Text>
          <Text style={[styles.total, { color: colors.accentInk }]}>{money(total)}</Text>
          <Text style={[styles.gain, { color: colors.accentInk }]}>
            +{money(gain)} ({(GROWTH_RATE * 100).toFixed(2)}%) today
          </Text>
        </View>

        <Text style={[styles.line, { color: colors.textMuted }]}>
          You didn’t start from zero.{'\n'}Someone believed in you.
        </Text>
      </ScrollView>

      <View style={styles.footer}>
        <PressableScale
          accessibilityRole="button"
          accessibilityLabel="Explore BlinkMoney"
          onPress={() => router.replace('/')}
          haptic
          style={[styles.cta, { backgroundColor: colors.accent }, elevation(scheme, 2)]}
        >
          <Text style={[styles.ctaText, { color: colors.onAccent }]}>Explore BlinkMoney</Text>
          <Ionicons name="arrow-forward" size={18} color={colors.onAccent} />
        </PressableScale>

        <PressableScale
          accessibilityRole="button"
          accessibilityLabel="View all gifts"
          onPress={() => router.replace('/gift-received')}
          style={[styles.secondary, { borderColor: colors.border }]}
        >
          <Text style={[styles.secondaryText, { color: colors.text }]}>View all gifts</Text>
        </PressableScale>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  body: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.xxl,
    gap: Spacing.xl,
  },
  sprout: {
    width: 72,
    height: 72,
    borderRadius: Radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headline: { ...Typography.title, textAlign: 'center' },
  panel: {
    alignSelf: 'stretch',
    alignItems: 'center',
    borderRadius: Radius.xl,
    borderWidth: StyleSheet.hairlineWidth,
    paddingVertical: Spacing.xxl,
    gap: Spacing.xs,
  },
  panelLabel: { ...Typography.caption },
  total: { ...Typography.display },
  gain: { ...Typography.caption },
  line: { ...Typography.body, textAlign: 'center' },
  footer: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.xxl,
    gap: Spacing.md,
  },
  cta: {
    height: 54,
    borderRadius: Radius.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
  },
  ctaText: { ...Typography.subheading },
  secondary: {
    height: 54,
    borderRadius: Radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryText: { ...Typography.bodyStrong },
});
