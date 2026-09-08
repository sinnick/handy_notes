import { useColorScheme } from 'react-native';
import { useSettings, type TextSize } from './store/SettingsContext';

/**
 * Design tokens for Handy Notes.
 *
 * Palette: Midnight Ocean, Deep Indigo, Health Blue, Cool Glacier, White,
 * Warm Stone and Light Sand. Every colour, size, space and radius in the app
 * comes from here. Spacing is a 4px grid. Radii live in the 8–24px range.
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
  sans: 'Rubik_400Regular',
  sansMedium: 'Rubik_500Medium',
  mono: 'DMMono_400Regular',
  monoMedium: 'DMMono_500Medium',
} as const;

const baseType = {
  display: { fontFamily: fonts.sans, fontSize: 36, lineHeight: 40, letterSpacing: -0.5 },
  title: { fontFamily: fonts.sansMedium, fontSize: 24, lineHeight: 30 },
  cardTitle: { fontFamily: fonts.sansMedium, fontSize: 16, lineHeight: 22 },
  body: { fontFamily: fonts.sans, fontSize: 16, lineHeight: 24 },
  cardBody: { fontFamily: fonts.sans, fontSize: 14, lineHeight: 20 },
  label: { fontFamily: fonts.sansMedium, fontSize: 14, lineHeight: 20 },
  meta: { fontFamily: fonts.mono, fontSize: 12, lineHeight: 16, letterSpacing: 0.6 },
} as const;

export type TypeScale = { [K in keyof typeof baseType]: (typeof baseType)[K] & { fontSize: number; lineHeight: number } };

/** Default scale, for the rare place that renders before settings exist. */
export const type: TypeScale = baseType;

const TEXT_SCALE: Record<TextSize, number> = { small: 0.9, regular: 1, large: 1.15 };

function scaleType(factor: number): TypeScale {
  const out: Record<string, unknown> = {};
  for (const [key, style] of Object.entries(baseType)) {
    out[key] = { ...style, fontSize: Math.round(style.fontSize * factor), lineHeight: Math.round(style.lineHeight * factor) };
  }
  return out as TypeScale;
}

const TYPE_BY_SIZE: Record<TextSize, TypeScale> = {
  small: scaleType(TEXT_SCALE.small),
  regular: baseType,
  large: scaleType(TEXT_SCALE.large),
};

/** Brand swatches, as named in the palette. */
export const brand = {
  midnightOcean: '#020B0C',
  deepIndigo: '#18245A',
  healthBlue: '#0069C4',
  royalBlue: '#003EA5',
  coolGlacier: '#54A6EF',
  glacierTint: '#7CB8F4',
  glacierPale: '#A0CAF0',
  white: '#FFFFFF',
  warmStone: '#F6F5F1',
  lightSand: '#F7F3EA',
} as const;

/** The seven colours a note can wear: vivid and clearly distinct. Order is the picker order. */
export const NOTE_COLORS = ['paper', 'butter', 'peach', 'mint', 'sky', 'lilac', 'rose'] as const;
export type NoteColor = (typeof NOTE_COLORS)[number];

/** Everything needed to draw text and chrome on top of a note's background. */
export type NoteTone = {
  bg: string;
  fg: string;
  fgSecondary: string;
  fgMuted: string;
  hairline: string;
  danger: string;
  /** Translucent wash used behind the editor footer and pressed icon buttons. */
  overlay: string;
};

const onLight = (bg: string, fgMuted = '#5F5B53'): NoteTone => ({
  bg,
  fg: brand.midnightOcean,
  fgSecondary: 'rgba(2, 11, 12, 0.74)',
  fgMuted,
  hairline: 'rgba(2, 11, 12, 0.10)',
  danger: '#C4453C',
  overlay: 'rgba(2, 11, 12, 0.06)',
});

const onDark = (bg: string, fgMuted = 'rgba(255, 255, 255, 0.72)'): NoteTone => ({
  bg,
  fg: brand.warmStone,
  fgSecondary: 'rgba(246, 245, 241, 0.80)',
  fgMuted,
  hairline: 'rgba(255, 255, 255, 0.12)',
  danger: '#FF9C93',
  overlay: 'rgba(255, 255, 255, 0.10)',
});

export const noteColors: Record<NoteColor, { label: string; light: NoteTone; dark: NoteTone }> = {
  paper: { label: 'Paper', light: onLight(brand.white), dark: onDark('#1A2430') },
  butter: { label: 'Butter', light: onLight('#FBE58F'), dark: onDark('#4A3E0F') },
  peach: { label: 'Peach', light: onLight('#FBC9A8'), dark: onDark('#4F2C18') },
  mint: { label: 'Mint', light: onLight('#BDE8C8'), dark: onDark('#173D27') },
  sky: { label: 'Sky', light: onLight('#BFDCF8'), dark: onDark('#16324F') },
  lilac: { label: 'Lilac', light: onLight('#DACBF6'), dark: onDark('#33264F') },
  rose: { label: 'Rose', light: onLight('#F9C5D3'), dark: onDark('#4E2233') },
};

export type Colors = {
  bg: string;
  surface: string;
  hairline: string;
  text: string;
  textSecondary: string;
  textMuted: string;
  accent: string;
  accentSoft: string;
  danger: string;
  dangerSoft: string;
  pressOverlay: string;
  inverse: string;
  onInverse: string;
};

const light: Colors = {
  bg: brand.lightSand,
  surface: brand.white,
  hairline: '#E3DDD0',
  text: brand.midnightOcean,
  textSecondary: 'rgba(2, 11, 12, 0.72)',
  textMuted: '#5A6472',
  accent: brand.healthBlue,
  accentSoft: '#DCEBFA',
  danger: '#C4453C',
  dangerSoft: '#F8DAD6',
  pressOverlay: 'rgba(2, 11, 12, 0.06)',
  inverse: brand.deepIndigo,
  onInverse: brand.white,
};

const dark: Colors = {
  bg: brand.midnightOcean,
  surface: '#0E1822',
  hairline: '#1C2837',
  text: brand.warmStone,
  textSecondary: 'rgba(246, 245, 241, 0.76)',
  textMuted: '#9AA6B5',
  accent: brand.coolGlacier,
  accentSoft: '#0D2540',
  danger: '#F08A80',
  dangerSoft: '#3A1F1C',
  pressOverlay: 'rgba(255, 255, 255, 0.08)',
  inverse: brand.glacierTint,
  onInverse: brand.midnightOcean,
};

export type Scheme = 'light' | 'dark';

export function useTheme() {
  const system = useColorScheme();
  const { settings } = useSettings();
  const scheme: Scheme = settings.theme === 'system' ? (system === 'dark' ? 'dark' : 'light') : settings.theme;
  const colors = scheme === 'dark' ? dark : light;
  const noteTone = (c: NoteColor): NoteTone => noteColors[c][scheme];
  return { scheme, isDark: scheme === 'dark', colors, noteTone, type: TYPE_BY_SIZE[settings.textSize] };
}
