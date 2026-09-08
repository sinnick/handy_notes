import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { radius, space, useTheme } from '../theme';

export type SegmentOption<T extends string> = { value: T; label: string };

type Props<T extends string> = {
  label: string;
  value: T;
  options: readonly SegmentOption<T>[];
  onChange: (value: T) => void;
};

/**
 * A pill track with one solid thumb. The thumb is the brand's Deep Indigo,
 * and every option keeps the same size whether selected or not, so switching
 * never shifts the layout.
 */
export function Segmented<T extends string>({ label, value, options, onChange }: Props<T>) {
  const { colors, type } = useTheme();
  return (
    <View style={styles.wrap}>
      <Text style={[type.label, { color: colors.textMuted }]}>{label}</Text>
      <View
        style={[styles.track, { backgroundColor: colors.pressOverlay }]}
        accessibilityRole="radiogroup"
        accessibilityLabel={label}
      >
        {options.map((opt) => {
          const selected = opt.value === value;
          return (
            <Pressable
              key={opt.value}
              accessibilityRole="radio"
              accessibilityState={{ selected }}
              onPress={() => onChange(opt.value)}
              style={({ pressed }) => [
                styles.segment,
                { backgroundColor: selected ? colors.inverse : pressed ? colors.pressOverlay : 'transparent' },
              ]}
            >
              <Text style={[type.label, { color: selected ? colors.onInverse : colors.text }]} numberOfLines={1}>
                {opt.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: space.sm },
  track: {
    flexDirection: 'row',
    padding: space.xs,
    borderRadius: radius.pill,
    gap: space.xs,
  },
  segment: {
    flex: 1,
    height: 40,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: space.sm,
  },
});
