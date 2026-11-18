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
const { RESET_WAIT_MS, cancelReset, checkChallenge, checkRecoveryCode, hasRecoveryCode, makeChallenge, makeRecoveryCode, requestReset, resetReady, resetRequestedAt, setRecoveryCode } = lockMod;

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

describe('PIN recovery (kids cannot reset it)', () => {
  it('makes readable codes without look-alike characters', () => {
    for (let i = 0; i < 50; i++) expect(makeRecoveryCode()).toMatch(/^MEWY-[A-HJKMNP-Z2-9]{4}-[A-HJKMNP-Z2-9]{4}$/);
  });

  it('checks the code, ignoring case, spaces, dashes and the prefix', async () => {
    await setRecoveryCode('MEWY-4K7Q-9TZP');
    expect(hasRecoveryCode()).toBe(true);
    expect(await checkRecoveryCode('mewy 4k7q 9tzp')).toBe(true);
    expect(await checkRecoveryCode('4K7Q9TZP')).toBe(true);
    expect(await checkRecoveryCode('MEWY-4K7Q-9TZX')).toBe(false);
    expect(await checkRecoveryCode('RESET')).toBe(false);
  });

  it('stores only a hash of the code', async () => {
    await setRecoveryCode('MEWY-4K7Q-9TZP');
    const raw = localStorage.getItem('mewing.parentRecovery.v1') ?? '';
    expect(raw).toContain('hash');
    expect(raw).not.toContain('4K7Q');
  });

  it('grown-up sums are 2-digit multiplications', () => {
    const sums = makeChallenge(() => 0.5);
    for (const [a, b] of sums) {
      expect(a).toBeGreaterThanOrEqual(12);
      expect(b).toBeLessThanOrEqual(98);
    }
    expect(checkChallenge([[47, 38], [12, 15]], ['1786', '180'])).toBe(true);
    expect(checkChallenge([[47, 38], [12, 15]], ['1786', '181'])).toBe(false);
  });

  it('removes the PIN only after the 24-hour wait, and can be cancelled', async () => {
    await setPin('1234');
    const t = 5_000_000;
    requestReset(t);
    expect(resetRequestedAt()).toBe(t);
    expect(resetReady(t + RESET_WAIT_MS - 1)).toBe(false);
    expect(resetReady(t + RESET_WAIT_MS)).toBe(true);
    cancelReset();
    expect(resetReady(t + RESET_WAIT_MS)).toBe(false);
  });

  it('clearing the PIN also clears the code and any reset request', async () => {
    await setPin('1234');
    await setRecoveryCode('MEWY-4K7Q-9TZP');
    requestReset(1);
    clearPin();
    expect(hasRecoveryCode()).toBe(false);
    expect(resetRequestedAt()).toBeNull();
  });
});
