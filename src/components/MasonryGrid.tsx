import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import type { Note } from '../store/types';
import { space, useTheme, type TypeScale } from '../theme';
import { CARD_BODY_MAX_LINES, CARD_PADDING, NoteCard, previewText } from './NoteCard';

const COLUMN_GAP = space.md;

type Props = {
  notes: Note[];
  /** Full width available to the grid, in px. */
  width: number;
  /** 1 for a list, 2 or 3 for a grid. */
  columns: number;
  onPressNote: (note: Note) => void;
  onTogglePin: (note: Note) => void;
};

/**
 * Masonry in N columns. Notes are dealt greedily into whichever column is
 * currently shortest, using an estimate of each card's rendered height, so the
 * columns end at roughly the same place instead of one trailing far behind.
 */
export function MasonryGrid({ notes, width, columns, onPressNote, onTogglePin }: Props) {
  const { type } = useTheme();
  const count = Math.max(1, Math.floor(columns));
  const columnWidth = Math.max(0, (width - COLUMN_GAP * (count - 1)) / count);

  const dealt = useMemo(() => {
    const cols: Note[][] = Array.from({ length: count }, () => []);
    const heights = new Array<number>(count).fill(0);
    for (const note of notes) {
      let target = 0;
      for (let i = 1; i < count; i++) if (heights[i] < heights[target]) target = i;
      cols[target].push(note);
      heights[target] += estimateCardHeight(note, columnWidth, type) + COLUMN_GAP;
    }
    return cols;
  }, [notes, columnWidth, count, type]);

  return (
    <View style={styles.row}>
      {dealt.map((col, i) => (
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
function estimateCardHeight(note: Note, columnWidth: number, type: TypeScale): number {
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
