/**
 * Grown-up lock for the Parent & Teacher corner: a 4-digit PIN, stored only
 * as a salted SHA-256 hash in this browser. Everything in the app lives on
 * this device, so this keeps curious kids out; it is not protection against
 * an adult with access to the browser's storage.
 */

const PIN_KEY = 'mewing.parentPin.v1';
const UNLOCK_KEY = 'mewing.parentUnlocked';
const FAILS_KEY = 'mewing.parentFails';

export const MAX_TRIES = 5;
export const LOCKOUT_MS = 30_000;

interface StoredPin {
  salt: string;
  hash: string;
}

export const isValidPin = (pin: string) => /^\d{4}$/.test(pin);

const toHex = (buf: ArrayBuffer) => [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('');

export async function hashPin(pin: string, salt: string): Promise<string> {
  const data = new TextEncoder().encode(`${salt}:${pin}`);
  return toHex(await crypto.subtle.digest('SHA-256', data));
}

function readPin(): StoredPin | null {
  try {
    const raw = localStorage.getItem(PIN_KEY);
    const v = raw ? (JSON.parse(raw) as Partial<StoredPin>) : null;
    return v?.salt && v.hash ? { salt: v.salt, hash: v.hash } : null;
  } catch {
    return null;
  }
}

export const hasPin = () => readPin() !== null;

export async function setPin(pin: string): Promise<void> {
  if (!isValidPin(pin)) throw new Error('PIN must be 4 digits');
  const salt = toHex(crypto.getRandomValues(new Uint8Array(16)).buffer);
  localStorage.setItem(PIN_KEY, JSON.stringify({ salt, hash: await hashPin(pin, salt) }));
}

export async function checkPin(pin: string): Promise<boolean> {
  const stored = readPin();
  if (!stored || !isValidPin(pin)) return false;
  return (await hashPin(pin, stored.salt)) === stored.hash;
}

/** Forgot PIN: removes only the PIN. Progress is untouched. */
export function clearPin() {
  localStorage.removeItem(PIN_KEY);
  lock();
}

// ---- unlocked for this browser tab session ----
export const isUnlocked = () => {
  try {
    return sessionStorage.getItem(UNLOCK_KEY) === '1' && hasPin();
  } catch {
    return false;
  }
};
export const unlock = () => sessionStorage.setItem(UNLOCK_KEY, '1');
export const lock = () => sessionStorage.removeItem(UNLOCK_KEY);

// ---- slow down guessing: 5 wrong tries -> wait 30 s ----
interface Fails {
  count: number;
  until: number;
}
function readFails(): Fails {
  try {
    return { count: 0, until: 0, ...(JSON.parse(sessionStorage.getItem(FAILS_KEY) ?? '{}') as Partial<Fails>) };
  } catch {
    return { count: 0, until: 0 };
  }
}

/** Milliseconds left before another try is allowed (0 = try now). */
export const lockoutLeft = (now = Date.now()) => Math.max(0, readFails().until - now);

export function noteFailure(now = Date.now()) {
  const f = readFails();
  const count = f.count + 1;
  const next = count >= MAX_TRIES ? { count: 0, until: now + LOCKOUT_MS } : { count, until: f.until };
  sessionStorage.setItem(FAILS_KEY, JSON.stringify(next));
}

export const clearFailures = () => sessionStorage.removeItem(FAILS_KEY);
