import { useState, type FormEvent } from 'react';
import { checkPin, clearFailures, clearPin, hasPin, isValidPin, lockoutLeft, noteFailure, setPin, unlock } from '../state/parentLock';
import { useSettings } from '../state/settings';

const T = {
  title: { en: '👪 Parents & Teachers', id: '👪 Orang Tua & Guru' },
  why: {
    en: "See how your child is learning: what they practise, where they shine and where they need help. Kids can't open this page.",
    id: 'Lihat cara anak belajar: apa yang dilatih, di mana mereka hebat, dan di mana butuh bantuan. Anak tidak bisa membuka halaman ini.',
  },
  createTitle: { en: 'Create a 4-digit parent PIN', id: 'Buat PIN orang tua 4 angka' },
  createHint: { en: "Pick a PIN your child doesn't know.", id: 'Pilih PIN yang tidak diketahui anak.' },
  pin: { en: 'PIN', id: 'PIN' },
  again: { en: 'Type it again', id: 'Ketik lagi' },
  create: { en: 'Save PIN', id: 'Simpan PIN' },
  enterTitle: { en: 'Enter the parent PIN', id: 'Masukkan PIN orang tua' },
  enter: { en: 'Open', id: 'Buka' },
  mustBe4: { en: 'The PIN must be exactly 4 digits.', id: 'PIN harus tepat 4 angka.' },
  noMatch: { en: "The two PINs don't match.", id: 'Kedua PIN tidak sama.' },
  wrong: { en: 'Wrong PIN. Try again.', id: 'PIN salah. Coba lagi.' },
  wait: { en: 'Too many tries. Please wait {s} seconds.', id: 'Terlalu banyak percobaan. Tunggu {s} detik.' },
  forgot: { en: 'Forgot the PIN?', id: 'Lupa PIN?' },
  forgotText: {
    en: 'This removes the PIN only. Your child\'s stars and progress stay safe. Type RESET to continue, then create a new PIN.',
    id: 'Ini hanya menghapus PIN. Bintang dan progres anak tetap aman. Ketik RESET untuk lanjut, lalu buat PIN baru.',
  },
  forgotBtn: { en: 'Remove PIN', id: 'Hapus PIN' },
  cancel: { en: 'Cancel', id: 'Batal' },
  local: {
    en: '🔒 The PIN and all progress stay on this device only.',
    id: '🔒 PIN dan semua progres hanya tersimpan di perangkat ini.',
  },
};

const pinInputProps = {
  inputMode: 'numeric' as const,
  pattern: '[0-9]*',
  maxLength: 4,
  type: 'password',
  style: { width: 140, textAlign: 'center' as const, fontSize: '1.4rem', letterSpacing: '0.4em' },
};

/** Lock screen in front of the parent dashboard: create, enter or reset the PIN. */
export function ParentGate({ onUnlock }: { onUnlock: () => void }) {
  const { settings } = useSettings();
  const L = settings.lang;
  const [mode, setMode] = useState<'create' | 'enter' | 'forgot'>(() => (hasPin() ? 'enter' : 'create'));
  const [pin, setPinText] = useState('');
  const [pin2, setPin2] = useState('');
  const [word, setWord] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const digits = (v: string) => v.replace(/\D/g, '').slice(0, 4);
  const done = () => {
    clearFailures();
    unlock();
    onUnlock();
  };

  const create = async (e: FormEvent) => {
    e.preventDefault();
    if (!isValidPin(pin)) return setError(T.mustBe4[L]);
    if (pin !== pin2) return setError(T.noMatch[L]);
    setBusy(true);
    await setPin(pin);
    setBusy(false);
    done();
  };

  const enter = async (e: FormEvent) => {
    e.preventDefault();
    const wait = lockoutLeft();
    if (wait) return setError(T.wait[L].replace('{s}', String(Math.ceil(wait / 1000))));
    setBusy(true);
    const ok = await checkPin(pin);
    setBusy(false);
    if (ok) return done();
    noteFailure();
    setPinText('');
    const after = lockoutLeft();
    setError(after ? T.wait[L].replace('{s}', String(Math.ceil(after / 1000))) : T.wrong[L]);
  };

  const forgot = (e: FormEvent) => {
    e.preventDefault();
    if (word.trim().toUpperCase() !== 'RESET') return;
    clearPin();
    setWord('');
    setPinText('');
    setError('');
    setMode('create');
  };

  return (
    <section style={{ maxWidth: 520, margin: '0 auto', textAlign: 'center' }}>
      <h1>{T.title[L]}</h1>
      <p style={{ fontFamily: 'var(--font-read)', fontSize: '1.05rem' }}>{T.why[L]}</p>

      {mode === 'create' && (
        <form className="card" onSubmit={create} style={{ display: 'grid', gap: '0.75rem', justifyItems: 'center' }}>
          <h2 style={{ fontSize: '0.85rem', margin: 0 }}>{T.createTitle[L]}</h2>
          <p style={{ fontFamily: 'var(--font-read)', margin: 0 }}>{T.createHint[L]}</p>
          <label style={{ fontFamily: 'var(--font-read)', fontWeight: 700 }}>
            {T.pin[L]}
            <br />
            <input {...pinInputProps} autoComplete="new-password" value={pin} onChange={(e) => setPinText(digits(e.target.value))} autoFocus />
          </label>
          <label style={{ fontFamily: 'var(--font-read)', fontWeight: 700 }}>
            {T.again[L]}
            <br />
            <input {...pinInputProps} autoComplete="new-password" value={pin2} onChange={(e) => setPin2(digits(e.target.value))} />
          </label>
          <button type="submit" className="btn" disabled={busy}>{T.create[L]}</button>
        </form>
      )}

      {mode === 'enter' && (
        <form className="card" onSubmit={enter} style={{ display: 'grid', gap: '0.75rem', justifyItems: 'center' }}>
          <label htmlFor="parent-pin" style={{ fontFamily: 'var(--font-pixel)', fontSize: '0.85rem' }}>{T.enterTitle[L]}</label>
          <input id="parent-pin" {...pinInputProps} autoComplete="off" value={pin} onChange={(e) => setPinText(digits(e.target.value))} autoFocus />
          <button type="submit" className="btn" disabled={busy}>{T.enter[L]}</button>
          <button type="button" className="btn btn--ghost" style={{ fontSize: '0.6rem' }} onClick={() => { setMode('forgot'); setError(''); }}>
            {T.forgot[L]}
          </button>
        </form>
      )}

      {mode === 'forgot' && (
        <form className="card" onSubmit={forgot} style={{ display: 'grid', gap: '0.75rem', justifyItems: 'center' }}>
          <p style={{ fontFamily: 'var(--font-read)', margin: 0 }}>{T.forgotText[L]}</p>
          <input aria-label="RESET" value={word} onChange={(e) => setWord(e.target.value)} autoComplete="off" style={{ width: 160, textAlign: 'center' }} />
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button type="submit" className="btn" disabled={word.trim().toUpperCase() !== 'RESET'}>{T.forgotBtn[L]}</button>
            <button type="button" className="btn btn--ghost" onClick={() => setMode('enter')}>{T.cancel[L]}</button>
          </div>
        </form>
      )}

      {error && (
        <p role="alert" className="chip" style={{ fontFamily: 'var(--font-read)', marginTop: '0.75rem' }}>
          {error}
        </p>
      )}
      <p style={{ fontFamily: 'var(--font-read)', fontSize: '0.85rem', marginTop: '1rem' }}>{T.local[L]}</p>
    </section>
  );
}
