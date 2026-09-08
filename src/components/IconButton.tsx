import type { LucideIcon } from 'lucide-react-native';
import React from 'react';
import { Pressable, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import { radius, useTheme } from '../theme';

type Props = {
  icon: LucideIcon;
  label: string;
  onPress: () => void;
  /** Draws the glyph filled, for "on" toggles like pin. */
  active?: boolean;
  tone?: 'default' | 'danger';
  /** Override the glyph colour, e.g. when the button sits on a coloured note. */
  color?: string;
  /** Override the pressed/active wash, for the same reason. */
  overlay?: string;
  style?: StyleProp<ViewStyle>;
};

/**
 * 20px glyph, 1.5px stroke, in a 44px touch bound (the 32px visual bound
 * plus 6px of invisible padding on each side).
 */
export function IconButton({ icon: Icon, label, onPress, active = false, tone = 'default', color, overlay, style }: Props) {
  const { colors } = useTheme();
  const glyph = color ?? (tone === 'danger' ? colors.danger : colors.text);
  const wash = overlay ?? colors.pressOverlay;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ selected: active }}
      onPress={onPress}
      hitSlop={6}
      style={({ pressed }) => [styles.bound, { backgroundColor: active || pressed ? wash : 'transparent' }, style]}
    >
      <Icon size={20} strokeWidth={1.5} color={glyph} fill={active ? glyph : 'none'} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  bound: {
    width: 32,
    height: 32,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
