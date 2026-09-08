import { X } from 'lucide-react-native';
import React from 'react';
import { Modal, Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { IconButton } from '../components/IconButton';
import { Segmented } from '../components/Segmented';
import { useSettings, type Layout, type TextSize, type ThemePref } from '../store/SettingsContext';
import { radius, space, useTheme } from '../theme';
import { CONTENT_MAX_WIDTH } from './layout';

const LAYOUT_OPTIONS = [
  { value: 'list', label: 'List' },
  { value: 'grid', label: '2 columns' },
  { value: 'dense', label: '3 columns' },
] as const satisfies readonly { value: Layout; label: string }[];

const TEXT_OPTIONS = [
  { value: 'small', label: 'Small' },
  { value: 'regular', label: 'Regular' },
  { value: 'large', label: 'Large' },
] as const satisfies readonly { value: TextSize; label: string }[];

const THEME_OPTIONS = [
  { value: 'system', label: 'System' },
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
] as const satisfies readonly { value: ThemePref; label: string }[];

type Props = { visible: boolean; onClose: () => void };

/** Bottom sheet with the three app-wide preferences. Changes apply instantly and persist. */
export function SettingsSheet({ visible, onClose }: Props) {
  const { colors, type } = useTheme();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const { settings, setSetting } = useSettings();

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose} statusBarTranslucent>
      <View style={styles.root}>
        <Pressable accessibilityLabel="Close settings" style={styles.scrim} onPress={onClose} />
        <View
          style={[
            styles.sheet,
            {
              backgroundColor: colors.surface,
              borderColor: colors.hairline,
              paddingBottom: Math.max(insets.bottom, space.lg) + space.sm,
              maxWidth: CONTENT_MAX_WIDTH,
              width: Math.min(width, CONTENT_MAX_WIDTH),
            },
          ]}
        >
          <View style={styles.head}>
            <Text style={[type.title, { color: colors.text }]} accessibilityRole="header">
              Settings
            </Text>
            <IconButton icon={X} label="Close settings" onPress={onClose} />
          </View>

          <Segmented label="Layout" value={settings.layout} options={LAYOUT_OPTIONS} onChange={(v) => setSetting('layout', v)} />
          <Segmented label="Text size" value={settings.textSize} options={TEXT_OPTIONS} onChange={(v) => setSetting('textSize', v)} />
          <Segmented label="Theme" value={settings.theme} options={THEME_OPTIONS} onChange={(v) => setSetting('theme', v)} />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, justifyContent: 'flex-end', alignItems: 'center' },
  scrim: { position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, backgroundColor: 'rgba(2, 11, 12, 0.40)' },
  sheet: {
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    borderWidth: 1,
    paddingHorizontal: space.lg,
    paddingTop: space.md,
    gap: space.xl,
  },
  head: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: -space.sm,
  },
});
