import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { Lang } from '../../../shared/types';
import { t, type StringKey } from '../i18n/strings';
import type { FurId, ItemId } from './rewards';
import { BREAK_CHOICES, type BreakMinutes } from '../lib/breakTime';
import { HOLD_SPEEDS, type HoldSpeed } from './holdSpeed';
import { ROUND_SIZES, type RoundSize } from './roundSize';
import { setSfxVolume } from '../lib/sound';

export type ThemeId = 'purple' | 'sky' | 'mint' | 'sunset';
export type TextSize = 'normal' | 'large' | 'xlarge';

export interface Settings {
  lang: Lang;
  theme: ThemeId;
  highContrast: boolean;
  reduceMotion: boolean;
  readableFont: boolean;
  textSize: TextSize;
  sound: boolean;
  /** Sound effects volume, 0..1. */
  sfxVolume: number;
  autoRead: boolean;
  /** 8-bit background music (off by default). */
  music: boolean;
  /** 0..1 */
  musicVolume: number;
  /** Pixel paw cursor with paw-print trail. */
  pawCursor: boolean;
  mewyFur: FurId;
  mewyItem: ItemId | null;
  /** Questions per Hand Quiz round. */
  roundSize: RoundSize;
  /** The first-time "show 1, 2, 3, 4 fingers" camera practice was finished or skipped. */
  cameraTutorialDone: boolean;
  /** How long to hold fingers still before the answer counts. */
  holdSpeed: HoldSpeed;
  /** Parent-set stretch break after this many minutes of play (0 = off). */
  breakMinutes: BreakMinutes;
}

const DEFAULTS: Settings = {
  lang: 'en',
  theme: 'purple',
  highContrast: false,
  reduceMotion: false,
  readableFont: false,
  textSize: 'normal',
  sound: true,
  sfxVolume: 1,
  autoRead: false,
  music: false,
  musicVolume: 0.4,
  pawCursor: true,
  mewyFur: 'yellow',
  mewyItem: null,
  roundSize: 5,
  cameraTutorialDone: false,
  holdSpeed: 'normal',
  breakMinutes: 0,
};

const KEY = 'mewing.settings.v1';

/** A stored 0..1 volume, or the default if it is missing or broken. */
function volume(v: unknown, fallback: number): number {
  return typeof v === 'number' && Number.isFinite(v) ? Math.min(1, Math.max(0, v)) : fallback;
}

function load(): Settings {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      // fingerMode was removed (count mode only); drop it from old saves.
      const { fingerMode: _removed, ...saved } = JSON.parse(raw) as Partial<Settings> & { fingerMode?: unknown };
      const merged = { ...DEFAULTS, ...saved };
      if (!ROUND_SIZES.includes(merged.roundSize)) merged.roundSize = DEFAULTS.roundSize;
      if (!HOLD_SPEEDS.includes(merged.holdSpeed)) merged.holdSpeed = DEFAULTS.holdSpeed;
      if (!BREAK_CHOICES.includes(merged.breakMinutes)) merged.breakMinutes = DEFAULTS.breakMinutes;
      merged.sfxVolume = volume(merged.sfxVolume, DEFAULTS.sfxVolume);
      return merged;
    }
  } catch {
    /* ignore corrupt storage */
  }
  // Respect the OS "reduce motion" preference on first visit.
  const prefersReduced = typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;
  return { ...DEFAULTS, reduceMotion: prefersReduced };
}

interface Ctx {
  settings: Settings;
  set: <K extends keyof Settings>(key: K, value: Settings[K]) => void;
  tr: (key: StringKey) => string;
}

const SettingsContext = createContext<Ctx | null>(null);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings>(load);

  const set = useCallback<Ctx['set']>((key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  }, []);

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(settings));
    const root = document.documentElement;
    root.lang = settings.lang;
    root.dataset.theme = settings.theme;
    root.dataset.contrast = settings.highContrast ? 'high' : 'normal';
    root.dataset.motion = settings.reduceMotion ? 'reduced' : 'full';
    root.dataset.font = settings.readableFont ? 'readable' : 'pixel';
    root.dataset.textSize = settings.textSize;
    setSfxVolume(settings.sfxVolume);
  }, [settings]);

  const tr = useCallback((key: StringKey) => t(key, settings.lang), [settings.lang]);

  const value = useMemo<Ctx>(() => ({ settings, set, tr }), [settings, set, tr]);
  return <SettingsContext value={value}>{children}</SettingsContext>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useSettings(): Ctx {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be used inside SettingsProvider');
  return ctx;
}
