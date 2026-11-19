/**
 * Save backup: copy a kid's progress to a file and load it back on another
 * device. Pure functions over a small storage interface so they are tested
 * without a browser.
 *
 * Safety: parent keys (PIN, recovery code, lock state) and the break clock are
 * never exported or imported, and loading a backup keeps the parent-set round
 * size and break reminder, so a file can't switch off grown-up settings.
 */

export const BACKUP_APP = 'mewing-academy';
export const BACKUP_VERSION = 1;

/** Everything a backup carries. Anything else in storage is left alone. */
export const BACKUP_KEYS = ['mewing.progress.v1', 'mewing.settings.v1', 'mewing.started', 'mewing.lastBoss'] as const;
export type BackupKey = (typeof BACKUP_KEYS)[number];

const SETTINGS_KEY: BackupKey = 'mewing.settings.v1';
/** Stored as JSON objects, so a backup must hold valid JSON objects for these. */
const JSON_KEYS: BackupKey[] = ['mewing.progress.v1', 'mewing.settings.v1'];
/** Settings a grown-up sets in the PIN-locked corner: a backup never changes them. */
const PARENT_SETTINGS = ['roundSize', 'breakMinutes'] as const;

export interface Backup {
  app: typeof BACKUP_APP;
  version: typeof BACKUP_VERSION;
  exportedAt: string;
  data: Partial<Record<BackupKey, string>>;
}

export interface Store {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}

const isKey = (k: string): k is BackupKey => (BACKUP_KEYS as readonly string[]).includes(k);

function jsonObject(text: string): Record<string, unknown> | null {
  try {
    const v: unknown = JSON.parse(text);
    return v && typeof v === 'object' && !Array.isArray(v) ? (v as Record<string, unknown>) : null;
  } catch {
    return null;
  }
}

export function makeBackup(store: Store, now: Date = new Date()): Backup {
  const data: Backup['data'] = {};
  for (const key of BACKUP_KEYS) {
    const value = store.getItem(key);
    if (value != null) data[key] = value;
  }
  return { app: BACKUP_APP, version: BACKUP_VERSION, exportedAt: now.toISOString(), data };
}

/** The file name for a backup made on this (local) day, e.g. mewing-academy-backup-2026-11-20.json. */
export function backupFileName(now: Date = new Date()): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${BACKUP_APP}-backup-${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}.json`;
}

/** Reads a backup file. Null if it isn't a Mewing Academy backup or is broken. */
export function parseBackup(text: string): Backup | null {
  const raw = jsonObject(text);
  if (!raw || raw.app !== BACKUP_APP || raw.version !== BACKUP_VERSION) return null;
  const rawData = raw.data;
  if (!rawData || typeof rawData !== 'object' || Array.isArray(rawData)) return null;
  const data: Backup['data'] = {};
  for (const [key, value] of Object.entries(rawData)) {
    if (!isKey(key) || typeof value !== 'string') continue; // drops parent keys and anything unknown
    if (JSON_KEYS.includes(key) && !jsonObject(value)) return null;
    data[key] = value;
  }
  if (!data['mewing.progress.v1']) return null;
  const exportedAt = typeof raw.exportedAt === 'string' ? raw.exportedAt : '';
  return { app: BACKUP_APP, version: BACKUP_VERSION, exportedAt, data };
}

/** Writes a parsed backup into storage, keeping this device's parent-set settings. */
export function applyBackup(store: Store, backup: Backup): void {
  for (const key of BACKUP_KEYS) {
    let value = backup.data[key];
    if (value == null) continue;
    if (key === SETTINGS_KEY) {
      const incoming = jsonObject(value) ?? {};
      const current = jsonObject(store.getItem(SETTINGS_KEY) ?? '') ?? {};
      for (const k of PARENT_SETTINGS) {
        if (k in current) incoming[k] = current[k];
        else delete incoming[k];
      }
      value = JSON.stringify(incoming);
    }
    store.setItem(key, value);
  }
}
