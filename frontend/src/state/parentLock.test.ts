import { beforeEach, describe, expect, it } from 'vitest';

// Minimal Web Storage for the node test environment.
class MemoryStorage {
  private m = new Map<string, string>();
  getItem(k: string) {
    return this.m.has(k) ? this.m.get(k)! : null;
  }
  setItem(k: string, v: string) {
    this.m.set(k, String(v));
  }
  removeItem(k: string) {
    this.m.delete(k);
  }
  clear() {
    this.m.clear();
  }
}
Object.assign(globalThis, { localStorage: new MemoryStorage(), sessionStorage: new MemoryStorage() });

const lockMod = await import('./parentLock');
const { LOCKOUT_MS, MAX_TRIES, checkPin, clearPin, hasPin, isUnlocked, isValidPin, lockoutLeft, noteFailure, setPin, unlock } = lockMod;

beforeEach(() => {
  localStorage.clear();
  sessionStorage.clear();
});

describe('parent PIN', () => {
  it('accepts exactly 4 digits', () => {
    expect(isValidPin('0420')).toBe(true);
    expect(isValidPin('123')).toBe(false);
    expect(isValidPin('12a4')).toBe(false);
    expect(isValidPin('12345')).toBe(false);
  });

  it('stores only a salted hash and checks it', async () => {
    await setPin('2580');
    expect(hasPin()).toBe(true);
    expect(localStorage.getItem('mewing.parentPin.v1')).not.toContain('2580');
    expect(await checkPin('2580')).toBe(true);
    expect(await checkPin('0000')).toBe(false);
  });

  it('uses a fresh salt each time', async () => {
    await setPin('1111');
    const a = localStorage.getItem('mewing.parentPin.v1');
    await setPin('1111');
    expect(localStorage.getItem('mewing.parentPin.v1')).not.toBe(a);
  });

  it('forgot PIN removes the PIN and locks', async () => {
    await setPin('1234');
    unlock();
    expect(isUnlocked()).toBe(true);
    clearPin();
    expect(hasPin()).toBe(false);
    expect(isUnlocked()).toBe(false);
  });

  it('waits 30 s after 5 wrong tries', () => {
    const now = 1_000_000;
    for (let i = 0; i < MAX_TRIES - 1; i++) noteFailure(now);
    expect(lockoutLeft(now)).toBe(0);
    noteFailure(now);
    expect(lockoutLeft(now)).toBe(LOCKOUT_MS);
    expect(lockoutLeft(now + LOCKOUT_MS)).toBe(0);
  });
});
