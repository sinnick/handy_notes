# Handy Notes

A small Expo / React Native app for the handful of notes you want within arm's reach: the wifi password, your plate number, the address you keep spelling out.

- Notes can be **pinned**. Pinned notes sit in their own section at the top.
- Notes can be **coloured** with one of seven paper tones. Every colour has a light and a dark variant.
- The home screen is a **two-column masonry grid**, in the spirit of Apple Notes' gallery view. Cards are dealt into whichever column is shorter so the columns stay even.
- Everything is stored on the device with AsyncStorage. There is no account and no network.

## Using it

- Tap **New note** to create one. The editor autosaves as you type; closing an empty note discards it.
- Tap a card to edit it.
- Hold a card to pin or unpin it. Inside the editor, the pin button does the same.
- Pick a colour from the swatch row at the bottom of the editor.
- The trash button deletes the note after a confirmation.

## Running

```sh
npm install
npm start          # Expo dev server; scan the QR code with Expo Go
npm run ios        # iOS simulator
npm run android    # Android emulator
npm run web        # browser
```

Type-check with:

```sh
npx tsc --noEmit
```

## Layout of the code

```
App.tsx                      fonts, providers, root view
src/theme.ts                 design tokens: colours, note palette, type scale, spacing, radii
src/store/NotesContext.tsx   notes state + AsyncStorage persistence
src/screens/HomeScreen.tsx   header, pinned/notes sections, new-note button
src/screens/NoteEditor.tsx   full-screen editor modal
src/components/              NoteCard, MasonryGrid, ColorSwatches, SectionLabel, IconButton, EmptyState
src/lib/                     id and date helpers
```

Fonts are Rubik and DM Mono via `@expo-google-fonts`. Icons are `lucide-react-native`.
