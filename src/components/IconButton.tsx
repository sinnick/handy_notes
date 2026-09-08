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
  style?: StyleProp<ViewStyle>;
};

/**
 * 20px glyph, 1.5px stroke, in a 44px touch bound (the 32px visual bound
 * plus 6px of invisible padding on each side).
 */
export function IconButton({ icon: Icon, label, onPress, active = false, tone = 'default', style }: Props) {
  const { colors } = useTheme();
  const color = tone === 'danger' ? colors.danger : colors.text;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ selected: active }}
      onPress={onPress}
      hitSlop={6}
      style={({ pressed }) => [
        styles.bound,
        { backgroundColor: active || pressed ? colors.pressOverlay : 'transparent' },
        style,
      ]}
    >
      <Icon size={20} strokeWidth={1.5} color={color} fill={active ? color : 'none'} />
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
