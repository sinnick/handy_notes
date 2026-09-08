import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { space, useTheme } from '../theme';
import { DottedRule } from './DottedRule';

/** Mono, tracked label followed by a dotted leader — a ledger-style section head. */
export function SectionLabel({ children, count }: { children: string; count?: number }) {
  const { colors, type } = useTheme();
  return (
    <View style={styles.row} accessibilityRole="header">
      <Text style={[type.meta, { color: colors.textMuted }]}>{children.toUpperCase()}</Text>
      <DottedRule />
      {count !== undefined && <Text style={[type.meta, { color: colors.textMuted }]}>{count}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.md,
    paddingTop: space.xl,
    paddingBottom: space.md,
  },
});
