import { Pin, Trash2, X } from 'lucide-react-native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ColorSwatches } from '../components/ColorSwatches';
import { IconButton } from '../components/IconButton';
import { formatRelativeDay, formatTime } from '../lib/date';
import { useNotes } from '../store/NotesContext';
import { CONTENT_MAX_WIDTH } from './layout';
import { space, type, useTheme } from '../theme';

type Props = {
  /** Id of the note being edited, or null when the editor is closed. */
  noteId: string | null;
  /** True when the note was just created, so the body gets focus straight away. */
  isNew: boolean;
  onClose: () => void;
};

export function NoteEditor({ noteId, isNew, onClose }: Props) {
  const visible = noteId !== null;
  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
      statusBarTranslucent={false}
    >
      {noteId !== null && <EditorBody noteId={noteId} isNew={isNew} onClose={onClose} />}
    </Modal>
  );
}

function confirmDelete(onConfirm: () => void) {
  if (Platform.OS === 'web') {
    // RN's Alert is not implemented on web.
    if (typeof window !== 'undefined' && window.confirm('Delete this note? This cannot be undone.')) onConfirm();
    return;
  }
  Alert.alert('Delete this note?', 'This cannot be undone.', [
    { text: 'Keep', style: 'cancel' },
    { text: 'Delete', style: 'destructive', onPress: onConfirm },
  ]);
}

function EditorBody({ noteId, isNew, onClose }: { noteId: string; isNew: boolean; onClose: () => void }) {
  const { colors, noteBg, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const { getNote, updateNote, setColor, togglePin, deleteNote } = useNotes();
  const note = getNote(noteId);

  const [title, setTitle] = useState(note?.title ?? '');
  const [body, setBody] = useState(note?.body ?? '');
  const bodyRef = useRef<TextInput>(null);

  useEffect(() => {
    if (!isNew) return;
    const t = setTimeout(() => bodyRef.current?.focus(), Platform.OS === 'ios' ? 450 : 200);
    return () => clearTimeout(t);
  }, [isNew]);

  const onChangeTitle = useCallback(
    (value: string) => {
      setTitle(value);
      updateNote(noteId, { title: value });
    },
    [noteId, updateNote],
  );

  const onChangeBody = useCallback(
    (value: string) => {
      setBody(value);
      updateNote(noteId, { body: value });
    },
    [noteId, updateNote],
  );

  const handleClose = useCallback(() => {
    if (title.trim() === '' && body.trim() === '') deleteNote(noteId);
    onClose();
  }, [title, body, noteId, deleteNote, onClose]);

  if (!note) return null;

  const bg = noteBg(note.color);
  // Only the full-screen presentation (Android, web) sits under the status bar.
  const topInset = Platform.OS === 'ios' ? space.md : insets.top + space.sm;
  const horizontal = Math.max(space.lg, (width - CONTENT_MAX_WIDTH) / 2);

  return (
    <KeyboardAvoidingView
      style={[styles.root, { backgroundColor: bg }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={[styles.toolbar, { paddingTop: topInset, paddingHorizontal: horizontal - space.sm }]}>
        <IconButton icon={X} label="Close" onPress={handleClose} />
        <View style={styles.toolbarRight}>
          <IconButton
            icon={Pin}
            label={note.pinned ? 'Unpin note' : 'Pin note'}
            active={note.pinned}
            onPress={() => togglePin(noteId)}
          />
          <IconButton
            icon={Trash2}
            label="Delete note"
            tone="danger"
            onPress={() =>
              confirmDelete(() => {
                deleteNote(noteId);
                onClose();
              })
            }
          />
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.content, { paddingHorizontal: horizontal }]}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="interactive"
      >
        <TextInput
          value={title}
          onChangeText={onChangeTitle}
          placeholder="Title"
          placeholderTextColor={colors.textMuted}
          style={[type.title, styles.input, { color: colors.text }]}
          returnKeyType="next"
          submitBehavior="blurAndSubmit"
          onSubmitEditing={() => bodyRef.current?.focus()}
          accessibilityLabel="Title"
          maxLength={120}
        />
        <TextInput
          ref={bodyRef}
          value={body}
          onChangeText={onChangeBody}
          placeholder="Something you’ll need again…"
          placeholderTextColor={colors.textMuted}
          style={[type.body, styles.input, styles.bodyInput, { color: colors.text }]}
          multiline
          textAlignVertical="top"
          scrollEnabled={false}
          accessibilityLabel="Note body"
        />
      </ScrollView>

      <View
        style={[
          styles.footer,
          {
            paddingHorizontal: horizontal,
            paddingBottom: Math.max(insets.bottom, space.md),
            borderTopColor: colors.hairlineOnNote,
            backgroundColor: isDark ? 'rgba(20,20,20,0.24)' : 'rgba(255,255,255,0.32)',
          },
        ]}
      >
        <Text style={[type.meta, { color: colors.textMuted }]}>
          EDITED {formatRelativeDay(note.updatedAt)} · {formatTime(note.updatedAt)}
        </Text>
        <ColorSwatches value={note.color} onChange={(c) => setColor(noteId, c)} />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  toolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: space.sm,
  },
  toolbarRight: { flexDirection: 'row', gap: space.sm },
  scroll: { flex: 1 },
  content: { paddingTop: space.sm, paddingBottom: space.xl, gap: space.md },
  input: {
    padding: 0,
    margin: 0,
    // On web the caret is the focus indicator; the browser's outline box would frame the whole page.
    ...(Platform.OS === 'web' ? { outlineWidth: 0 } : null),
  },
  bodyInput: { minHeight: 240 },
  footer: {
    paddingTop: space.md,
    gap: space.sm,
    borderTopWidth: 1,
  },
});
