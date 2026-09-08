import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useTheme } from '../theme';

/**
 * A 1px dotted horizontal rule that renders the same on iOS, Android and web.
 * (iOS only honours borderStyle when all four borders are set, so we draw a
 * full dotted box and show a 1px slice of it.)
 */
export function DottedRule({ color }: { color?: string }) {
  const { colors } = useTheme();
  return (
    <View style={styles.window} pointerEvents="none">
      <View style={[styles.box, { borderColor: color ?? colors.hairline }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  window: { flex: 1, height: 1, overflow: 'hidden' },
  box: { height: 4, borderWidth: 1, borderStyle: 'dotted', borderRadius: 1 },
});
