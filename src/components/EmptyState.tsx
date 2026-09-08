import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { space, type, useTheme } from '../theme';

export function EmptyState() {
  const { colors } = useTheme();
  return (
    <View style={styles.wrap}>
      <Text style={[type.title, { color: colors.text }]}>Nothing at hand yet</Text>
      <Text style={[type.body, styles.copy, { color: colors.textMuted }]}>
        Keep the few things you type out ten times a week. The wifi password. Your plate number. The address you keep
        spelling.
      </Text>
      <Text style={[type.meta, { color: colors.textMuted }]}>TAP “NEW NOTE” TO START</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingTop: space.xxxl * 2,
    paddingHorizontal: space.sm,
    gap: space.md,
    maxWidth: 360,
  },
  copy: { marginBottom: space.sm },
});
