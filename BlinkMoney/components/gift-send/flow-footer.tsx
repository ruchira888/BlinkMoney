/**
 * Pinned footer for the send flow: step dots plus the forward action.
 *
 * Shared by all four steps so the button never shifts position between them --
 * a CTA that moves as you advance makes a short flow feel unsteady.
 *
 * It carries its own bottom safe-area inset because Android edge-to-edge would
 * otherwise put the gesture bar over the button.
 */

import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { PressableScale } from '@/components/ui/pressable-scale';
import { Radius, Spacing, Typography, elevation, type ColorSchemeName, type ThemePalette } from '@/constants/theme';

export const FLOW_STEPS = 4;

type Props = {
  label: string;
  colors: ThemePalette;
  scheme: ColorSchemeName;
  /** 1-indexed. Omit on the final screen, which is not a step. */
  step?: number;
  disabled?: boolean;
  onPress: () => void;
};

export function FlowFooter({ label, colors, scheme, step, disabled = false, onPress }: Props) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.wrapper,
        {
          paddingBottom: Math.max(insets.bottom, Spacing.md),
          backgroundColor: colors.background,
          borderTopColor: colors.border,
        },
      ]}
    >
      {step ? (
        <View style={styles.steps} accessibilityLabel={`Step ${step} of ${FLOW_STEPS}`}>
          {Array.from({ length: FLOW_STEPS }, (_, index) => (
            <View
              key={index}
              style={[
                styles.step,
                {
                  backgroundColor: index < step ? colors.accent : colors.dotIdle,
                  width: index === step - 1 ? Spacing.xxl : Spacing.sm,
                },
              ]}
            />
          ))}
        </View>
      ) : null}

      <PressableScale
        accessibilityRole="button"
        accessibilityLabel={label}
        accessibilityState={{ disabled }}
        disabled={disabled}
        onPress={onPress}
        haptic
        style={[
          styles.button,
          { backgroundColor: disabled ? colors.surfaceSunken : colors.accent },
          !disabled && elevation(scheme, 2),
        ]}
      >
        <Text
          style={[styles.label, { color: disabled ? colors.textFaint : colors.onAccent }]}
          numberOfLines={1}
        >
          {label}
        </Text>
      </PressableScale>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.md,
    borderTopWidth: StyleSheet.hairlineWidth,
    gap: Spacing.md,
  },
  steps: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
  },
  step: {
    height: Spacing.sm,
    borderRadius: Radius.pill,
  },
  button: {
    height: 54,
    borderRadius: Radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    ...Typography.subheading,
  },
});
