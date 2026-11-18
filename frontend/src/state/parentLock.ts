/**
 * Grown-up lock for the Parent & Teacher corner: a 4-digit PIN, stored only
 * as a salted SHA-256 hash in this browser. Everything in the app lives on
 * this device, so this keeps curious kids out; it is not protection against
 * an adult with access to the browser's storage.
 */

const PIN_KEY = 'mewing.parentPin.v1';
const UNLOCK_KEY = 'mewing.parentUnlocked';
const FAILS_KEY = 'mewing.parentFails';
const RECOVERY_KEY = 'mewing.parentRecovery.v1';
const RESET_KEY = 'mewing.parentResetAt';

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

/** Removes the PIN (and its recovery code). Progress is untouched. */
export function clearPin() {
  localStorage.removeItem(PIN_KEY);
  localStorage.removeItem(RECOVERY_KEY);
  localStorage.removeItem(RESET_KEY);
  lock();
}

// ---- recovery code: shown once when the PIN is made, needed to reset it ----
// No look-alike characters (0/O, 1/I/L).
const CODE_CHARS = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';

/** A code like MEWY-4K7Q-9TZP (8 random characters). */
export function makeRecoveryCode(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(8));
  const chars = [...bytes].map((b) => CODE_CHARS[b % CODE_CHARS.length]).join('');
  return `MEWY-${chars.slice(0, 4)}-${chars.slice(4)}`;
}

/** Ignores case, spaces and dashes, and the MEWY prefix is optional. */
const normalizeCode = (code: string) => code.toUpperCase().replace(/[^A-Z0-9]/g, '').replace(/^MEWY/, '');

export async function setRecoveryCode(code: string): Promise<void> {
  const salt = toHex(crypto.getRandomValues(new Uint8Array(16)).buffer);
  localStorage.setItem(RECOVERY_KEY, JSON.stringify({ salt, hash: await hashPin(normalizeCode(code), salt) }));
}

export const hasRecoveryCode = () => {
  try {
    return !!localStorage.getItem(RECOVERY_KEY);
  } catch {
    return false;
  }
};

export async function checkRecoveryCode(code: string): Promise<boolean> {
  try {
    const raw = localStorage.getItem(RECOVERY_KEY);
    const stored = raw ? (JSON.parse(raw) as Partial<StoredPin>) : null;
    if (!stored?.salt || !stored.hash || normalizeCode(code).length !== 8) return false;
    return (await hashPin(normalizeCode(code), stored.salt)) === stored.hash;
  } catch {
    return false;
  }
}

// ---- lost the code too: grown-up sums, then a 24-hour wait anyone can see ----
export const RESET_WAIT_MS = 24 * 60 * 60 * 1000;
/** Session flag read by the dashboard: a pending PIN reset was cancelled by entering the PIN. */
export const RESET_CANCELLED_KEY = 'mewing.parentResetCancelled';

/** Two 2-digit multiplications: easy with a calculator for a grown-up, very hard for young kids. */
export function makeChallenge(rng: () => number = Math.random): [number, number][] {
  const two = () => 12 + Math.floor(rng() * 87); // 12..98
  return [
    [two(), two()],
    [two(), two()],
  ];
}

export const checkChallenge = (sums: [number, number][], answers: string[]) =>
  sums.every(([a, b], i) => Number(answers[i]?.trim()) === a * b);

export function requestReset(now = Date.now()) {
  localStorage.setItem(RESET_KEY, String(now));
}

/** When a PIN reset was asked for (ms), or null. */
export function resetRequestedAt(): number | null {
  try {
    const v = Number(localStorage.getItem(RESET_KEY));
    return v > 0 ? v : null;
  } catch {
    return null;
  }
}

export const cancelReset = () => localStorage.removeItem(RESET_KEY);

/** True once the 24-hour wait is over (then the PIN may be removed). */
export function resetReady(now = Date.now()): boolean {
  const at = resetRequestedAt();
  return at != null && now - at >= RESET_WAIT_MS;
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
