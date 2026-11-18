import { useSyncExternalStore } from 'react';

/**
 * Break reminder clock: counts only time the app is visible, survives page
 * reloads within the visit (sessionStorage), and tells the camera to ignore
 * answers while the stretch break is on screen.
 */

export const BREAK_CHOICES = [0, 15, 20, 30] as const;
export type BreakMinutes = (typeof BREAK_CHOICES)[number];
/** How long the stretch break lasts before "I'm back!" unlocks. */
export const BREAK_SECONDS = 60;

const KEY = 'mewing.breakClock';

function readMs(): number {
  try {
    return Number(sessionStorage.getItem(KEY)) || 0;
  } catch {
    return 0;
  }
}

let playedMs = readMs();
let onBreak = false;
const listeners = new Set<() => void>();
const notify = () => listeners.forEach((l) => l());

function save() {
  try {
    sessionStorage.setItem(KEY, String(Math.round(playedMs)));
  } catch {
    /* private mode: keep it in memory */
  }
}

/** Pure: is a break due after `ms` of play with a limit of `minutes` (0 = off)? */
export const breakDue = (ms: number, minutes: number) => minutes > 0 && ms >= minutes * 60_000;

/** Adds visible play time; starts the break when it is due. */
export function tick(ms: number, minutes: number) {
  if (onBreak || minutes <= 0) return;
  playedMs += ms;
  save();
  if (breakDue(playedMs, minutes)) {
    onBreak = true;
    notify();
  }
}

export function endBreak() {
  onBreak = false;
  playedMs = 0;
  save();
  notify();
}

/** Read by the camera loop: answers do not count during a break. */
export const isOnBreak = () => onBreak;

const subscribe = (cb: () => void) => {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
};

export function useOnBreak(): boolean {
  return useSyncExternalStore(subscribe, () => onBreak);
}
