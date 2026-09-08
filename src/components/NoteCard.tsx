import * as Haptics from 'expo-haptics';
import { Pin } from 'lucide-react-native';
import React from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { formatRelativeDay } from '../lib/date';
import type { Note } from '../store/types';
import { radius, space, type, useTheme } from '../theme';

export const CARD_PADDING = space.lg;
export const CARD_BODY_MAX_LINES = 8;
const CARD_TITLE_MAX_LINES = 2;

type Props = {
  note: Note;
  onPress: (note: Note) => void;
  onTogglePin: (note: Note) => void;
};

export const NoteCard = React.memo(function NoteCard({ note, onPress, onTogglePin }: Props) {
  const { noteTone } = useTheme();
  const tone = noteTone(note.color);
  const hasTitle = note.title.trim().length > 0;
  const hasBody = note.body.trim().length > 0;

  const handleLongPress = () => {
    if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    onTogglePin(note);
  };

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${hasTitle ? note.title : 'Untitled note'}${note.pinned ? ', pinned' : ''}`}
      accessibilityHint="Opens the note. Hold to pin or unpin."
      onPress={() => onPress(note)}
      onLongPress={handleLongPress}
      delayLongPress={350}
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: tone.bg,
          borderColor: tone.hairline,
          transform: [{ scale: pressed ? 0.98 : 1 }],
        },
      ]}
    >
      {(hasTitle || note.pinned) && (
        <View style={styles.head}>
          <Text style={[type.cardTitle, styles.title, { color: tone.fg }]} numberOfLines={CARD_TITLE_MAX_LINES}>
            {hasTitle ? note.title : ''}
          </Text>
          {note.pinned && (
            <View style={styles.pin}>
              <Pin size={14} strokeWidth={1.5} color={tone.fg} fill={tone.fg} />
            </View>
          )}
        </View>
      )}
      {hasBody ? (
        <Text style={[type.cardBody, { color: tone.fgSecondary }]} numberOfLines={CARD_BODY_MAX_LINES}>
          {previewText(note.body)}
        </Text>
      ) : !hasTitle ? (
        <Text style={[type.cardBody, { color: tone.fgMuted }]}>Empty note</Text>
      ) : null}
      <Text style={[type.meta, styles.meta, { color: tone.fgMuted }]}>{formatRelativeDay(note.updatedAt)}</Text>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.lg,
    borderWidth: 1,
    padding: CARD_PADDING,
    gap: space.sm,
  },
  head: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: space.sm,
  },
  title: { flex: 1 },
  pin: {
    width: 20,
    height: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: -space.xs,
  },
  meta: { marginTop: space.xs },
});

/** Card previews collapse blank lines so the line clamp spends its lines on words. */
export function previewText(body: string): string {
  return body.trim().replace(/[ \t]*\n(?:[ \t]*\n)+/g, '\n');
}
