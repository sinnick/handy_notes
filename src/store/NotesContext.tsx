import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useRef } from 'react';
import { newId } from '../lib/id';
import { NOTE_COLORS, type NoteColor } from '../theme';
import type { Note } from './types';

const STORAGE_KEY = 'handy-notes/v1';
const SAVE_DEBOUNCE_MS = 250;

type State = { hydrated: boolean; notes: Note[] };

type Action =
  | { type: 'hydrate'; notes: Note[] }
  | { type: 'add'; note: Note }
  | { type: 'update'; id: string; patch: Partial<Pick<Note, 'title' | 'body' | 'color' | 'pinned'>>; touch: boolean }
  | { type: 'remove'; id: string };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'hydrate':
      return { hydrated: true, notes: action.notes };
    case 'add':
      return { ...state, notes: [action.note, ...state.notes] };
    case 'update':
      return {
        ...state,
        notes: state.notes.map((n) =>
          n.id === action.id ? { ...n, ...action.patch, updatedAt: action.touch ? Date.now() : n.updatedAt } : n,
        ),
      };
    case 'remove':
      return { ...state, notes: state.notes.filter((n) => n.id !== action.id) };
  }
}

function isNoteColor(value: unknown): value is NoteColor {
  return typeof value === 'string' && (NOTE_COLORS as readonly string[]).includes(value);
}

/** Defensive parse: never let a bad payload wipe the app on launch. */
function parseNotes(raw: string | null): Note[] {
  if (!raw) return [];
  try {
    const data: unknown = JSON.parse(raw);
    if (!Array.isArray(data)) return [];
    return data.flatMap((n: any): Note[] => {
      if (!n || typeof n.id !== 'string') return [];
      return [
        {
          id: n.id,
          title: typeof n.title === 'string' ? n.title : '',
          body: typeof n.body === 'string' ? n.body : '',
          color: isNoteColor(n.color) ? n.color : 'paper',
          pinned: Boolean(n.pinned),
          createdAt: typeof n.createdAt === 'number' ? n.createdAt : Date.now(),
          updatedAt: typeof n.updatedAt === 'number' ? n.updatedAt : Date.now(),
        },
      ];
    });
  } catch {
    return [];
  }
}

function welcomeNote(): Note {
  const now = Date.now();
  return {
    id: newId(),
    title: 'How this works',
    body:
      'Keep the few things you look up every day: the wifi password, your plate number, the address you keep spelling out.\n\nTap a note to edit it.\nHold a note to pin or unpin it.\nPick a colour from inside the editor.',
    color: 'butter',
    pinned: true,
    createdAt: now,
    updatedAt: now,
  };
}

export type NotesApi = {
  hydrated: boolean;
  notes: Note[];
  pinned: Note[];
  others: Note[];
  getNote: (id: string) => Note | undefined;
  createNote: (init?: Partial<Pick<Note, 'color' | 'pinned'>>) => Note;
  updateNote: (id: string, patch: Partial<Pick<Note, 'title' | 'body'>>) => void;
  setColor: (id: string, color: NoteColor) => void;
  togglePin: (id: string) => void;
  deleteNote: (id: string) => void;
};

const NotesContext = createContext<NotesApi | null>(null);

export function NotesProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, { hydrated: false, notes: [] });
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      let notes: Note[] = [];
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        notes = raw === null ? [welcomeNote()] : parseNotes(raw);
      } catch {
        notes = [];
      }
      if (!cancelled) dispatch({ type: 'hydrate', notes });
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!state.hydrated) return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state.notes)).catch(() => {
        /* Persistence is best-effort; the in-memory state is still correct. */
      });
    }, SAVE_DEBOUNCE_MS);
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, [state.hydrated, state.notes]);

  const notesRef = useRef(state.notes);
  notesRef.current = state.notes;

  const createNote = useCallback<NotesApi['createNote']>((init) => {
    const now = Date.now();
    const note: Note = {
      id: newId(),
      title: '',
      body: '',
      color: init?.color ?? 'paper',
      pinned: init?.pinned ?? false,
      createdAt: now,
      updatedAt: now,
    };
    dispatch({ type: 'add', note });
    return note;
  }, []);

  const updateNote = useCallback<NotesApi['updateNote']>((id, patch) => {
    dispatch({ type: 'update', id, patch, touch: true });
  }, []);

  const setColor = useCallback<NotesApi['setColor']>((id, color) => {
    dispatch({ type: 'update', id, patch: { color }, touch: false });
  }, []);

  const togglePin = useCallback<NotesApi['togglePin']>((id) => {
    const current = notesRef.current.find((n) => n.id === id);
    if (!current) return;
    dispatch({ type: 'update', id, patch: { pinned: !current.pinned }, touch: false });
  }, []);

  const deleteNote = useCallback<NotesApi['deleteNote']>((id) => {
    dispatch({ type: 'remove', id });
  }, []);

  const value = useMemo<NotesApi>(() => {
    const byRecency = (a: Note, b: Note) => b.updatedAt - a.updatedAt;
    const pinned = state.notes.filter((n) => n.pinned).sort(byRecency);
    const others = state.notes.filter((n) => !n.pinned).sort(byRecency);
    return {
      hydrated: state.hydrated,
      notes: state.notes,
      pinned,
      others,
      getNote: (id) => state.notes.find((n) => n.id === id),
      createNote,
      updateNote,
      setColor,
      togglePin,
      deleteNote,
    };
  }, [state, createNote, updateNote, setColor, togglePin, deleteNote]);

  return <NotesContext.Provider value={value}>{children}</NotesContext.Provider>;
}

export function useNotes(): NotesApi {
  const ctx = useContext(NotesContext);
  if (!ctx) throw new Error('useNotes must be used inside <NotesProvider>');
  return ctx;
}
