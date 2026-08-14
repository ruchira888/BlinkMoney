/**
 * The empty and error states, sharing one layout.
 *
 * They are the same shape -- icon, headline, explanation, optional action --
 * and differ only in tone and whether there is something to retry. Splitting
 * them into two components would guarantee they drift apart visually.
 */

import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { PressableScale } from '@/components/ui/pressable-scale';
import { Radius, Spacing, Typography, type ThemePalette } from '@/constants/theme';

type Props = {
  tone: 'empty' | 'error';
  title: string;
  description: string;
  colors: ThemePalette;
  /** Omit to render an informational state with no action. */
  onRetry?: () => void;
  retryLabel?: string;
  /** Matches the height of the content being replaced, so the page does not
   *  jump as it moves between states. */
  minHeight?: number;
};

export function StateMessage({
  tone,
  title,
  description,
  colors,
  onRetry,
  retryLabel = 'Try again',
  minHeight,
}: Props) {
  const isError = tone === 'error';
  const accent = isError ? colors.danger : colors.textFaint;

  return (
    <View
      accessibilityRole={isError ? 'alert' : 'text'}
      style={[
        styles.container,
        {
          minHeight,
          backgroundColor: colors.surface,
          borderColor: colors.border,
        },
      ]}
    >
      <View style={[styles.iconWell, { backgroundColor: colors.surfaceSunken }]}>
        <Ionicons
          name={isError ? 'cloud-offline-outline' : 'sparkles-outline'}
          size={26}
          color={accent}
        />
      </View>

      <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
      <Text style={[styles.description, { color: colors.textMuted }]}>{description}</Text>

      {onRetry ? (
        <PressableScale
          accessibilityRole="button"
          accessibilityLabel={retryLabel}
          onPress={onRetry}
          style={[styles.retry, { backgroundColor: colors.accent }]}
        >
          <Ionicons name="refresh" size={17} color={colors.onAccent} />
          <Text style={[styles.retryText, { color: colors.onAccent }]}>{retryLabel}</Text>
        </PressableScale>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: Radius.xl,
    borderWidth: StyleSheet.hairlineWidth,
    padding: Spacing.xxl,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
  },
  iconWell: {
    width: 52,
    height: 52,
    borderRadius: Radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xs,
  },
  title: {
    ...Typography.subheading,
    textAlign: 'center',
  },
  description: {
    ...Typography.body,
    textAlign: 'center',
  },
  retry: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    borderRadius: Radius.pill,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    marginTop: Spacing.md,
  },
  retryText: {
    ...Typography.bodyStrong,
  },
});
