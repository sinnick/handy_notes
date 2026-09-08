import type { NoteColor } from '../theme';

export type Note = {
  id: string;
  title: string;
  body: string;
  color: NoteColor;
  pinned: boolean;
  createdAt: number;
  updatedAt: number;
};
