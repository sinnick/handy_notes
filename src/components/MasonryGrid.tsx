import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import type { Note } from '../store/types';
import { space, type } from '../theme';
import { CARD_BODY_MAX_LINES, CARD_PADDING, NoteCard, previewText } from './NoteCard';

const COLUMN_GAP = space.md;

type Props = {
  notes: Note[];
  /** Full width available to the grid, in px. */
  width: number;
  onPressNote: (note: Note) => void;
  onTogglePin: (note: Note) => void;
};

/**
 * Two-column masonry. Notes are dealt greedily into whichever column is
 * currently shorter, using an estimate of each card's rendered height, so the
 * columns end at roughly the same place instead of one trailing far behind.
 */
export function MasonryGrid({ notes, width, onPressNote, onTogglePin }: Props) {
  const columnWidth = Math.max(0, (width - COLUMN_GAP) / 2);

  const columns = useMemo(() => {
    const cols: [Note[], Note[]] = [[], []];
    const heights = [0, 0];
    for (const note of notes) {
      const target = heights[0] <= heights[1] ? 0 : 1;
      cols[target].push(note);
      heights[target] += estimateCardHeight(note, columnWidth) + COLUMN_GAP;
    }
    return cols;
  }, [notes, columnWidth]);

  return (
    <View style={styles.row}>
      {columns.map((col, i) => (
        <View key={i} style={styles.column}>
          {col.map((note) => (
            <NoteCard key={note.id} note={note} onPress={onPressNote} onTogglePin={onTogglePin} />
          ))}
        </View>
      ))}
    </View>
  );
}

/** Rough line-wrapping estimate; exact values come from the type scale. */
function estimateCardHeight(note: Note, columnWidth: number): number {
  const inner = Math.max(1, columnWidth - CARD_PADDING * 2);
  const titleChars = Math.max(6, Math.floor(inner / (type.cardTitle.fontSize * 0.52)));
  const bodyChars = Math.max(6, Math.floor(inner / (type.cardBody.fontSize * 0.5)));

  const hasTitle = note.title.trim().length > 0;
  const titleLines = hasTitle ? Math.min(2, wrappedLines(note.title, titleChars)) : note.pinned ? 1 : 0;

  const bodyText = previewText(note.body);
  const bodyLines = bodyText.length > 0 ? Math.min(CARD_BODY_MAX_LINES, wrappedLines(bodyText, bodyChars)) : hasTitle ? 0 : 1;

  let height = CARD_PADDING * 2;
  if (titleLines > 0) height += titleLines * type.cardTitle.lineHeight + space.sm;
  if (bodyLines > 0) height += bodyLines * type.cardBody.lineHeight + space.sm;
  height += space.xs + type.meta.lineHeight;
  return height;
}

function wrappedLines(text: string, charsPerLine: number): number {
  return text.split('\n').reduce((sum, line) => sum + Math.max(1, Math.ceil(line.length / charsPerLine)), 0);
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: COLUMN_GAP },
  column: { flex: 1, gap: COLUMN_GAP },
});
