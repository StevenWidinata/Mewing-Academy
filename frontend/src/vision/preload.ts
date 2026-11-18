import { useEffect, useSyncExternalStore } from 'react';

/**
 * Downloads the hand model in the background as soon as a game page opens,
 * so turning the camera on is quick. Shares one download between pages and
 * the camera itself.
 */

export const HAND_MODEL_URL = `${import.meta.env.BASE_URL}models/hand_landmarker.task`;

export interface PreloadState {
  status: 'idle' | 'loading' | 'done' | 'error' | 'skipped';
  /** 0..1, or null when the size is unknown. */
  progress: number | null;
}

let state: PreloadState = { status: 'idle', progress: 0 };
let promise: Promise<Uint8Array | null> | null = null;
const listeners = new Set<() => void>();

function set(next: PreloadState) {
  state = next;
  listeners.forEach((l) => l());
}

/** The camera can never work here (no HTTPS / no camera API), or the user asked to save data. */
function shouldSkip(): boolean {
  if (typeof window === 'undefined' || !window.isSecureContext || !navigator.mediaDevices?.getUserMedia) return true;
  const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
  return !!conn?.saveData;
}

async function download(): Promise<Uint8Array | null> {
  set({ status: 'loading', progress: 0 });
  try {
    const res = await fetch(HAND_MODEL_URL);
    if (!res.ok || !res.body) throw new Error(`HTTP ${res.status}`);
    const total = Number(res.headers.get('content-length')) || 0;
    const reader = res.body.getReader();
    const chunks: Uint8Array[] = [];
    let loaded = 0;
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      chunks.push(value);
      loaded += value.length;
      set({ status: 'loading', progress: total ? Math.min(1, loaded / total) : null });
    }
    const bytes = new Uint8Array(loaded);
    let at = 0;
    for (const c of chunks) {
      bytes.set(c, at);
      at += c.length;
    }
    set({ status: 'done', progress: 1 });
    return bytes;
  } catch (err) {
    console.warn('[vision] model preload failed:', err);
    set({ status: 'error', progress: 0 });
    promise = null; // let the camera try again by itself
    return null;
  }
}

/** Starts (or joins) the download. Resolves to the model bytes, or null if unavailable. */
export function preloadHandModel(force = false): Promise<Uint8Array | null> {
  if (promise) return promise;
  if (!force && shouldSkip()) {
    if (state.status === 'idle') set({ status: 'skipped', progress: 0 });
    return Promise.resolve(null);
  }
  promise = download();
  return promise;
}

const subscribe = (cb: () => void) => {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
};

/** Starts the background download when the page opens and reports its progress. */
export function useHandModelPreload(): PreloadState {
  useEffect(() => {
    void preloadHandModel();
  }, []);
  return useSyncExternalStore(subscribe, () => state);
}
