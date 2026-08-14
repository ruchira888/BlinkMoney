/**
 * The SIP projection card.
 *
 * The headline figure counts up to its new value rather than swapping, which
 * is the whole point of the control: it makes the effect of moving the slider
 * or stretching the horizon legible as a change in magnitude, not just a
 * different string.
 *
 * The projection itself is computed in lib/sip.ts. Nothing here knows the
 * compounding formula.
 */

import { useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { AmountSlider } from '@/components/home/amount-slider';
import { PressableScale } from '@/components/ui/pressable-scale';
import { SegmentedControl, type SegmentOption } from '@/components/ui/segmented-control';
import { AnimatedRupees } from '@/components/ui/animated-rupees';
import { Radius, Spacing, Typography, elevation, type ColorSchemeName, type ThemePalette } from '@/constants/theme';
import { FREQUENCIES, HORIZONS, formatRupees, projectSip, type Frequency } from '@/lib/sip';

const MIN_AMOUNT = 20;
const MAX_AMOUNT = 2000;
const AMOUNT_STEP = 10;

const FREQUENCY_OPTIONS: SegmentOption<Frequency>[] = FREQUENCIES.map((value) => ({
  value,
  label: value,
}));

const HORIZON_OPTIONS: SegmentOption<string>[] = HORIZONS.map((horizon) => ({
  value: horizon.label,
  label: horizon.label,
}));

type Props = {
  colors: ThemePalette;
  scheme: ColorSchemeName;
  onExplain?: () => void;
};

export function SipCalculator({ colors, scheme, onExplain }: Props) {
  const [amount, setAmount] = useState(100);
  const [frequency, setFrequency] = useState<Frequency>('Daily');
  const [horizonLabel, setHorizonLabel] = useState(HORIZONS[0].label);

  const horizon = useMemo(
    () => HORIZONS.find((item) => item.label === horizonLabel) ?? HORIZONS[0],
    [horizonLabel]
  );

  const projection = useMemo(
    () => projectSip(amount, frequency, horizon.years),
    [amount, frequency, horizon.years]
  );

  return (
    <View style={styles.wrapper}>
      <Text style={[styles.heading, { color: colors.text }]}>SIP Calculator</Text>

      <View
        style={[
          styles.card,
          { backgroundColor: colors.surface, borderColor: colors.border },
          elevation(scheme, 2),
        ]}
      >
        <View style={[styles.result, { backgroundColor: colors.surfaceSunken }]}>
          <Text style={[styles.prompt, { color: colors.textMuted }]}>
            <Text style={{ color: colors.accentInk }}>{formatRupees(amount)}</Text>{' '}
            {frequency.toLowerCase()} for {horizon.label.toLowerCase()} could grow to
          </Text>

          <AnimatedRupees value={projection.futureValue} style={[styles.resultValue, { color: colors.accentInk }]} />

          <Text style={[styles.breakdown, { color: colors.textFaint }]}>
            {formatRupees(projection.invested)} invested · {formatRupees(projection.gain)} returns
          </Text>
        </View>

        <AmountSlider
          value={amount}
          min={MIN_AMOUNT}
          max={MAX_AMOUNT}
          step={AMOUNT_STEP}
          onChange={setAmount}
          colors={colors}
          accessibilityLabel={`Amount per ${frequency === 'Daily' ? 'day' : 'month'}`}
        />

        <SegmentedControl
          options={FREQUENCY_OPTIONS}
          value={frequency}
          onChange={setFrequency}
          colors={colors}
          accessibilityLabel="Contribution frequency"
        />

        <SegmentedControl
          options={HORIZON_OPTIONS}
          value={horizonLabel}
          onChange={setHorizonLabel}
          colors={colors}
          accessibilityLabel="Investment horizon"
        />

        <PressableScale
          accessibilityRole="link"
          accessibilityLabel="How is this calculated?"
          onPress={onExplain}
          style={styles.explain}
        >
          <Text style={[styles.explainText, { color: colors.accentInk }]}>
            How is it calculated?
          </Text>
        </PressableScale>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: Spacing.xl,
  },
  heading: {
    ...Typography.heading,
    marginBottom: Spacing.md,
  },
  card: {
    borderRadius: Radius.xxl,
    borderWidth: StyleSheet.hairlineWidth,
    padding: Spacing.xl,
    gap: Spacing.lg,
  },
  result: {
    borderRadius: Radius.lg,
    paddingVertical: Spacing.xl,
    paddingHorizontal: Spacing.lg,
    alignItems: 'center',
    gap: Spacing.sm,
  },
  prompt: {
    ...Typography.body,
    textAlign: 'center',
  },
  resultValue: {
    ...Typography.display,
  },
  breakdown: {
    ...Typography.caption,
    textAlign: 'center',
  },
  explain: {
    alignSelf: 'center',
    paddingVertical: Spacing.xs,
  },
  explainText: {
    ...Typography.caption,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
});
