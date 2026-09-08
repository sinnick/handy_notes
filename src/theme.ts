import { useColorScheme } from 'react-native';

/**
 * Design tokens for Handy Notes.
 *
 * Every colour, size, space and radius in the app comes from here.
 * Spacing is a 4px grid. Radii live in the 8–24px range.
 */

export const space = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
} as const;

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  pill: 999,
} as const;

export const fonts = {
  sans: 'Geist_400Regular',
  sansMedium: 'Geist_500Medium',
  mono: 'GeistMono_400Regular',
  monoMedium: 'GeistMono_500Medium',
} as const;

export const type = {
  display: { fontFamily: fonts.sans, fontSize: 36, lineHeight: 40, letterSpacing: -0.5 },
  title: { fontFamily: fonts.sansMedium, fontSize: 24, lineHeight: 30 },
  cardTitle: { fontFamily: fonts.sansMedium, fontSize: 16, lineHeight: 22 },
  body: { fontFamily: fonts.sans, fontSize: 16, lineHeight: 24 },
  cardBody: { fontFamily: fonts.sans, fontSize: 14, lineHeight: 20 },
  label: { fontFamily: fonts.sansMedium, fontSize: 14, lineHeight: 20 },
  meta: { fontFamily: fonts.mono, fontSize: 12, lineHeight: 16, letterSpacing: 0.6 },
} as const;

/** The seven paper colours a note can wear. Order is the order shown in the picker. */
export const NOTE_COLORS = ['paper', 'butter', 'peach', 'mint', 'sky', 'lilac', 'rose'] as const;
export type NoteColor = (typeof NOTE_COLORS)[number];

export const noteColors: Record<NoteColor, { label: string; light: string; dark: string }> = {
  paper: { label: 'Paper', light: '#FCFAF6', dark: '#26241F' },
  butter: { label: 'Butter', light: '#FBECB2', dark: '#3F3717' },
  peach: { label: 'Peach', light: '#F9D5C2', dark: '#432B1F' },
  mint: { label: 'Mint', light: '#D2EBD9', dark: '#1E3628' },
  sky: { label: 'Sky', light: '#D3E4F8', dark: '#1F2E44' },
  lilac: { label: 'Lilac', light: '#E4DAF6', dark: '#302844' },
  rose: { label: 'Rose', light: '#F8D6E0', dark: '#422632' },
};

const light = {
  bg: '#F5F1EA',
  surface: '#FCFAF6',
  hairline: '#E4DED3',
  hairlineOnNote: 'rgba(20, 20, 20, 0.10)',
  text: '#141414',
  textSecondary: 'rgba(20, 20, 20, 0.72)',
  textMuted: '#6A645A',
  accent: '#2E62D9',
  accentSoft: '#DCE6FA',
  danger: '#C4453C',
  dangerSoft: '#F8DAD6',
  pressOverlay: 'rgba(20, 20, 20, 0.06)',
  inverse: '#141414',
  onInverse: '#F5F1EA',
};

const dark: typeof light = {
  bg: '#141414',
  surface: '#1E1D1B',
  hairline: '#2E2C29',
  hairlineOnNote: 'rgba(255, 255, 255, 0.10)',
  text: '#F3EFE8',
  textSecondary: 'rgba(243, 239, 232, 0.76)',
  textMuted: '#A39D92',
  accent: '#7B9FF2',
  accentSoft: '#1F2C4A',
  danger: '#E8776E',
  dangerSoft: '#40211E',
  pressOverlay: 'rgba(255, 255, 255, 0.08)',
  inverse: '#F3EFE8',
  onInverse: '#141414',
};

export type Colors = typeof light;
export type Scheme = 'light' | 'dark';

export function useTheme() {
  const scheme: Scheme = useColorScheme() === 'dark' ? 'dark' : 'light';
  const colors = scheme === 'dark' ? dark : light;
  const noteBg = (c: NoteColor) => noteColors[c][scheme];
  return { scheme, isDark: scheme === 'dark', colors, noteBg };
}
