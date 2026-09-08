import { Plus } from 'lucide-react-native';
import React, { useCallback, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { EmptyState } from '../components/EmptyState';
import { MasonryGrid } from '../components/MasonryGrid';
import { SectionLabel } from '../components/SectionLabel';
import { useNotes } from '../store/NotesContext';
import type { Note } from '../store/types';
import { radius, space, type, useTheme } from '../theme';
import { CONTENT_MAX_WIDTH } from './layout';
import { NoteEditor } from './NoteEditor';

const FAB_HEIGHT = 48;

export function HomeScreen() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const { hydrated, notes, pinned, others, createNote, togglePin } = useNotes();

  const [editing, setEditing] = useState<{ id: string; isNew: boolean } | null>(null);

  const openNote = useCallback((note: Note) => setEditing({ id: note.id, isNew: false }), []);
  const handleTogglePin = useCallback((note: Note) => togglePin(note.id), [togglePin]);
  const newNote = useCallback(() => {
    const note = createNote();
    setEditing({ id: note.id, isNew: true });
  }, [createNote]);
  const closeEditor = useCallback(() => setEditing(null), []);

  const contentWidth = Math.min(width, CONTENT_MAX_WIDTH) - space.lg * 2;
  const isEmpty = hydrated && notes.length === 0;

  const summary = !hydrated
    ? ''
    : notes.length === 0
      ? 'NOTHING SAVED YET'
      : `${notes.length} ${notes.length === 1 ? 'NOTE' : 'NOTES'}${pinned.length ? ` · ${pinned.length} PINNED` : ''}`;

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: colors.bg }]} edges={['top', 'left', 'right']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + FAB_HEIGHT + space.xl * 2 },
        ]}
        contentInsetAdjustmentBehavior="never"
      >
        <View style={styles.header}>
          <Text style={[type.display, { color: colors.text }]} accessibilityRole="header">
            Handy notes
          </Text>
          <Text style={[type.meta, { color: colors.textMuted }]}>{summary}</Text>
        </View>

        {isEmpty && <EmptyState />}

        {pinned.length > 0 && (
          <>
            <SectionLabel count={pinned.length}>Pinned</SectionLabel>
            <MasonryGrid notes={pinned} width={contentWidth} onPressNote={openNote} onTogglePin={handleTogglePin} />
          </>
        )}

        {others.length > 0 && (
          <>
            {pinned.length > 0 ? <SectionLabel count={others.length}>Notes</SectionLabel> : <View style={styles.gap} />}
            <MasonryGrid notes={others} width={contentWidth} onPressNote={openNote} onTogglePin={handleTogglePin} />
          </>
        )}
      </ScrollView>

      {hydrated && (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="New note"
          onPress={newNote}
          style={({ pressed }) => [
            styles.fab,
            {
              backgroundColor: colors.inverse,
              bottom: insets.bottom + space.lg,
              right: Math.max(space.lg, (width - CONTENT_MAX_WIDTH) / 2 + space.lg),
              opacity: pressed ? 0.8 : 1,
            },
          ]}
        >
          <Plus size={20} strokeWidth={1.5} color={colors.onInverse} />
          <Text style={[type.label, { color: colors.onInverse }]}>New note</Text>
        </Pressable>
      )}

      <NoteEditor noteId={editing?.id ?? null} isNew={editing?.isNew ?? false} onClose={closeEditor} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  scroll: { flex: 1 },
  content: {
    paddingHorizontal: space.lg,
    alignSelf: 'center',
    width: '100%',
    maxWidth: CONTENT_MAX_WIDTH,
  },
  header: {
    paddingTop: space.xl,
    paddingBottom: space.sm,
    gap: space.sm,
  },
  gap: { height: space.xl },
  fab: {
    position: 'absolute',
    height: FAB_HEIGHT,
    paddingLeft: space.lg,
    paddingRight: space.xl,
    borderRadius: radius.pill,
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
    shadowColor: '#141414',
    shadowOpacity: 0.12,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
});
