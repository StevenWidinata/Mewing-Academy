import { describe, expect, it } from 'vitest';
import { applyBackup, backupFileName, makeBackup, parseBackup, type Store } from './backup';

function memoryStore(init: Record<string, string> = {}): Store & { map: Map<string, string> } {
  const map = new Map(Object.entries(init));
  return { map, getItem: (k) => map.get(k) ?? null, setItem: (k, v) => void map.set(k, v) };
}

const PROGRESS = JSON.stringify({ stars: 42, stickers: ['boss-ko'] });
const SETTINGS = JSON.stringify({ lang: 'id', theme: 'mint', roundSize: 15, breakMinutes: 0 });

const device = () =>
  memoryStore({
    'mewing.progress.v1': PROGRESS,
    'mewing.settings.v1': SETTINGS,
    'mewing.started': '1',
    'mewing.parentPin.v1': 'secret-hash',
    'mewing.parentRecovery.v1': 'code',
    'mewing.parentUnlocked': '1',
    'mewing.breakClock': '{"played":100}',
  });

describe('backup', () => {
  it('round-trips progress and settings through a file', () => {
    const from = device();
    const file = JSON.stringify(makeBackup(from, new Date('2026-11-20T10:00:00Z')));
    const backup = parseBackup(file);
    expect(backup).not.toBeNull();
    const to = memoryStore();
    applyBackup(to, backup!);
    expect(JSON.parse(to.getItem('mewing.progress.v1')!)).toEqual({ stars: 42, stickers: ['boss-ko'] });
    expect(JSON.parse(to.getItem('mewing.settings.v1')!)).toMatchObject({ lang: 'id', theme: 'mint' });
    expect(to.getItem('mewing.started')).toBe('1');
  });

  it('never exports parent keys or the break clock', () => {
    const data = makeBackup(device()).data as Record<string, string>;
    expect(Object.keys(data).sort()).toEqual(['mewing.progress.v1', 'mewing.settings.v1', 'mewing.started']);
  });

  it('ignores parent keys smuggled into a file', () => {
    const file = JSON.stringify({ app: 'mewing-academy', version: 1, exportedAt: '', data: { 'mewing.progress.v1': PROGRESS, 'mewing.parentPin.v1': 'hacked', 'mewing.parentUnlocked': '1' } });
    const to = memoryStore({ 'mewing.parentPin.v1': 'real' });
    applyBackup(to, parseBackup(file)!);
    expect(to.getItem('mewing.parentPin.v1')).toBe('real');
    expect(to.getItem('mewing.parentUnlocked')).toBeNull();
  });

  it("keeps this device's parent-set round size and break reminder", () => {
    const file = JSON.stringify(makeBackup(device()));
    const to = memoryStore({ 'mewing.settings.v1': JSON.stringify({ lang: 'en', roundSize: 5, breakMinutes: 20 }) });
    applyBackup(to, parseBackup(file)!);
    expect(JSON.parse(to.getItem('mewing.settings.v1')!)).toMatchObject({ lang: 'id', roundSize: 5, breakMinutes: 20 });
  });

  it('drops parent settings from a backup when this device has none yet', () => {
    const to = memoryStore();
    applyBackup(to, parseBackup(JSON.stringify(makeBackup(device())))!);
    const settings = JSON.parse(to.getItem('mewing.settings.v1')!);
    expect(settings).not.toHaveProperty('roundSize');
    expect(settings).not.toHaveProperty('breakMinutes');
  });

  it('rejects files that are not a Mewing Academy backup', () => {
    expect(parseBackup('not json')).toBeNull();
    expect(parseBackup('[]')).toBeNull();
    expect(parseBackup(JSON.stringify({ app: 'other-game', version: 1, data: { 'mewing.progress.v1': PROGRESS } }))).toBeNull();
    expect(parseBackup(JSON.stringify({ app: 'mewing-academy', version: 2, data: { 'mewing.progress.v1': PROGRESS } }))).toBeNull();
    expect(parseBackup(JSON.stringify({ app: 'mewing-academy', version: 1, data: {} }))).toBeNull();
    expect(parseBackup(JSON.stringify({ app: 'mewing-academy', version: 1, data: { 'mewing.progress.v1': '{broken' } }))).toBeNull();
  });

  it('names the file by date', () => {
    expect(backupFileName(new Date(2026, 10, 20, 23, 30))).toBe('mewing-academy-backup-2026-11-20.json');
    expect(backupFileName(new Date(2026, 0, 5, 0, 5))).toBe('mewing-academy-backup-2026-01-05.json');
  });
});
