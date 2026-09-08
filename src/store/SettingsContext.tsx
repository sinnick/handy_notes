import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'handy-notes/settings/v1';

export const LAYOUTS = ['list', 'grid', 'dense'] as const;
export type Layout = (typeof LAYOUTS)[number];

export const TEXT_SIZES = ['small', 'regular', 'large'] as const;
export type TextSize = (typeof TEXT_SIZES)[number];

export const THEME_PREFS = ['system', 'light', 'dark'] as const;
export type ThemePref = (typeof THEME_PREFS)[number];

export type Settings = {
  layout: Layout;
  textSize: TextSize;
  theme: ThemePref;
};

export const DEFAULT_SETTINGS: Settings = { layout: 'grid', textSize: 'regular', theme: 'system' };

/** How many masonry columns each layout uses. */
export const LAYOUT_COLUMNS: Record<Layout, number> = { list: 1, grid: 2, dense: 3 };

type SettingsApi = {
  hydrated: boolean;
  settings: Settings;
  setSetting: <K extends keyof Settings>(key: K, value: Settings[K]) => void;
};

const SettingsContext = createContext<SettingsApi>({
  hydrated: false,
  settings: DEFAULT_SETTINGS,
  setSetting: () => {},
});

function pick<T extends string>(allowed: readonly T[], value: unknown, fallback: T): T {
  return typeof value === 'string' && (allowed as readonly string[]).includes(value) ? (value as T) : fallback;
}

function parseSettings(raw: string | null): Settings {
  if (!raw) return DEFAULT_SETTINGS;
  try {
    const data: any = JSON.parse(raw);
    return {
      layout: pick(LAYOUTS, data?.layout, DEFAULT_SETTINGS.layout),
      textSize: pick(TEXT_SIZES, data?.textSize, DEFAULT_SETTINGS.textSize),
      theme: pick(THEME_PREFS, data?.theme, DEFAULT_SETTINGS.theme),
    };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [hydrated, setHydrated] = useState(false);
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);

  useEffect(() => {
    let cancelled = false;
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => {
        if (!cancelled) setSettings(parseSettings(raw));
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setHydrated(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const setSetting = useCallback<SettingsApi['setSetting']>((key, value) => {
    setSettings((prev) => {
      const next = { ...prev, [key]: value };
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next)).catch(() => {});
      return next;
    });
  }, []);

  const value = useMemo(() => ({ hydrated, settings, setSetting }), [hydrated, settings, setSetting]);
  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettings(): SettingsApi {
  return useContext(SettingsContext);
}
