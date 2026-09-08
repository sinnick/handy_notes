import { Check } from 'lucide-react-native';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { NOTE_COLORS, noteColors, radius, space, type NoteColor, useTheme } from '../theme';

type Props = {
  value: NoteColor;
  onChange: (color: NoteColor) => void;
  /** Colour of the selection ring; pass the foreground of whatever the row sits on. */
  ringColor: string;
};

/**
 * A row of paint chips. The selected chip gets a ring plus a check glyph, so
 * the state never relies on colour alone. The ring is pre-reserved (drawn
 * transparent when idle) so selecting never shifts layout.
 */
export function ColorSwatches({ value, onChange, ringColor }: Props) {
  const { noteTone } = useTheme();
  return (
    <View style={styles.row} accessibilityRole="radiogroup">
      {NOTE_COLORS.map((c) => {
        const selected = c === value;
        const tone = noteTone(c);
        return (
          <Pressable
            key={c}
            accessibilityRole="radio"
            accessibilityLabel={noteColors[c].label}
            accessibilityState={{ selected }}
            onPress={() => onChange(c)}
            style={({ pressed }) => [styles.bound, { opacity: pressed ? 0.7 : 1 }]}
          >
            <View style={[styles.ring, { borderColor: selected ? ringColor : 'transparent' }]}>
              <View style={[styles.chip, { backgroundColor: tone.bg, borderColor: tone.hairline }]}>
                {selected && <Check size={14} strokeWidth={2} color={tone.fg} />}
              </View>
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: space.xs },
  bound: { width: 40, height: 44, alignItems: 'center', justifyContent: 'center' },
  ring: {
    width: 36,
    height: 36,
    borderRadius: radius.pill,
    borderWidth: 2,
    padding: 2,
  },
  chip: {
    flex: 1,
    borderRadius: radius.pill,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
