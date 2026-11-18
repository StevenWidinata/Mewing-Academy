import { useState, type FormEvent } from 'react';
import {
  RESET_CANCELLED_KEY,
  RESET_WAIT_MS,
  cancelReset,
  checkChallenge,
  checkPin,
  checkRecoveryCode,
  clearFailures,
  clearPin,
  hasPin,
  isValidPin,
  lockoutLeft,
  makeChallenge,
  makeRecoveryCode,
  noteFailure,
  requestReset,
  resetReady,
  resetRequestedAt,
  setPin,
  setRecoveryCode,
  unlock,
} from '../state/parentLock';
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
  codeTitle: { en: 'Your recovery code', id: 'Kode pemulihanmu' },
  codeText: {
    en: 'If you ever forget the PIN, this code lets you make a new one. Write it down or take a photo, and keep it away from your child. It is shown only once.',
    id: 'Kalau lupa PIN, kode ini dipakai untuk membuat PIN baru. Tulis atau foto, dan simpan jauh dari anak. Kode ini hanya ditampilkan sekali.',
  },
  codeSaved: { en: 'I saved the code', id: 'Aku sudah menyimpan kodenya' },
  continue: { en: 'Continue', id: 'Lanjut' },
  enterTitle: { en: 'Enter the parent PIN', id: 'Masukkan PIN orang tua' },
  enter: { en: 'Open', id: 'Buka' },
  mustBe4: { en: 'The PIN must be exactly 4 digits.', id: 'PIN harus tepat 4 angka.' },
  noMatch: { en: "The two PINs don't match.", id: 'Kedua PIN tidak sama.' },
  wrong: { en: 'Wrong PIN. Try again.', id: 'PIN salah. Coba lagi.' },
  wait: { en: 'Too many tries. Please wait {s} seconds.', id: 'Terlalu banyak percobaan. Tunggu {s} detik.' },
  forgot: { en: 'Forgot the PIN?', id: 'Lupa PIN?' },
  forgotText: {
    en: 'Enter the recovery code you got when the PIN was made. Stars and progress stay safe.',
    id: 'Masukkan kode pemulihan yang didapat saat PIN dibuat. Bintang dan progres tetap aman.',
  },
  codeLabel: { en: 'Recovery code', id: 'Kode pemulihan' },
  codeBtn: { en: 'Use code', id: 'Pakai kode' },
  codeWrong: { en: "That code doesn't match.", id: 'Kode tidak cocok.' },
  lostCode: { en: 'I lost the code too', id: 'Kodenya juga hilang' },
  challengeText: {
    en: 'Grown-ups only: solve both sums (a calculator is fine). Then the PIN is removed after a 24-hour wait, and a notice is shown here so other grown-ups can see it.',
    id: 'Khusus orang dewasa: jawab kedua soal (boleh pakai kalkulator). Setelah itu PIN dihapus setelah menunggu 24 jam, dan pemberitahuan tampil di sini agar orang dewasa lain bisa melihatnya.',
  },
  challengeBtn: { en: 'Request PIN reset', id: 'Minta reset PIN' },
  challengeWrong: { en: 'Not quite. Here are 2 new sums.', id: 'Belum tepat. Ini 2 soal baru.' },
  pending: {
    en: '⏳ A PIN reset was requested on {at}. The PIN will be removed after {until}. Not you? Enter the PIN to cancel it.',
    id: '⏳ Reset PIN diminta pada {at}. PIN akan dihapus setelah {until}. Bukan kamu? Masukkan PIN untuk membatalkannya.',
  },
  waitOver: { en: 'The 24-hour wait is over. Please make a new PIN.', id: 'Waktu tunggu 24 jam sudah lewat. Silakan buat PIN baru.' },
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

type Mode = 'create' | 'code' | 'enter' | 'forgot' | 'challenge';

/** Lock screen in front of the parent dashboard: create, enter or recover the PIN. */
export function ParentGate({ onUnlock }: { onUnlock: () => void }) {
  const { settings } = useSettings();
  const L = settings.lang;
  // A requested reset whose 24-hour wait is over: remove the PIN now.
  const [waitOver] = useState(() => {
    if (!resetReady()) return false;
    clearPin();
    return true;
  });
  const [mode, setMode] = useState<Mode>(() => (hasPin() ? 'enter' : 'create'));
  const [pin, setPinText] = useState('');
  const [pin2, setPin2] = useState('');
  const [code, setCode] = useState('');
  const [newCode, setNewCode] = useState('');
  const [saved, setSaved] = useState(false);
  const [sums, setSums] = useState(() => makeChallenge());
  const [answers, setAnswers] = useState(['', '']);
  const [pendingAt, setPendingAt] = useState(resetRequestedAt);
  const [error, setError] = useState(waitOver ? T.waitOver[L] : '');
  const [busy, setBusy] = useState(false);

  const digits = (v: string) => v.replace(/\D/g, '').slice(0, 4);
  const fmt = (ms: number) => new Date(ms).toLocaleString(L === 'en' ? 'en-GB' : 'id-ID', { dateStyle: 'medium', timeStyle: 'short' });
  const go = (m: Mode) => {
    setMode(m);
    setError('');
  };
  const done = () => {
    clearFailures();
    unlock();
    onUnlock();
  };
  const tooMany = () => {
    const wait = lockoutLeft();
    return wait ? T.wait[L].replace('{s}', String(Math.ceil(wait / 1000))) : '';
  };

  const create = async (e: FormEvent) => {
    e.preventDefault();
    if (!isValidPin(pin)) return setError(T.mustBe4[L]);
    if (pin !== pin2) return setError(T.noMatch[L]);
    setBusy(true);
    const fresh = makeRecoveryCode();
    await setPin(pin);
    await setRecoveryCode(fresh);
    cancelReset();
    setBusy(false);
    setNewCode(fresh);
    go('code');
  };

  const enter = async (e: FormEvent) => {
    e.preventDefault();
    const wait = tooMany();
    if (wait) return setError(wait);
    setBusy(true);
    const ok = await checkPin(pin);
    setBusy(false);
    if (ok) {
      if (resetRequestedAt() != null) {
        cancelReset();
        sessionStorage.setItem(RESET_CANCELLED_KEY, String(pendingAt ?? Date.now()));
      }
      return done();
    }
    noteFailure();
    setPinText('');
    setError(tooMany() || T.wrong[L]);
  };

  const submitCode = async (e: FormEvent) => {
    e.preventDefault();
    const wait = tooMany();
    if (wait) return setError(wait);
    setBusy(true);
    const ok = await checkRecoveryCode(code);
    setBusy(false);
    if (!ok) {
      noteFailure();
      return setError(tooMany() || T.codeWrong[L]);
    }
    clearFailures();
    clearPin();
    setCode('');
    setPinText('');
    setPin2('');
    setPendingAt(null);
    go('create');
  };

  const challenge = (e: FormEvent) => {
    e.preventDefault();
    if (!checkChallenge(sums, answers)) {
      setSums(makeChallenge());
      setAnswers(['', '']);
      return setError(T.challengeWrong[L]);
    }
    requestReset();
    setPendingAt(resetRequestedAt());
    setAnswers(['', '']);
    go('enter');
  };

  const card = { display: 'grid', gap: '0.75rem', justifyItems: 'center' } as const;
  const read = { fontFamily: 'var(--font-read)', margin: 0 } as const;

  return (
    <section style={{ maxWidth: 520, margin: '0 auto', textAlign: 'center' }}>
      <h1>{T.title[L]}</h1>
      <p style={{ fontFamily: 'var(--font-read)', fontSize: '1.05rem' }}>{T.why[L]}</p>

      {mode === 'enter' && pendingAt != null && (
        <p role="status" className="card" style={{ ...read, marginBottom: '1rem', textAlign: 'left' }}>
          {T.pending[L].replace('{at}', fmt(pendingAt)).replace('{until}', fmt(pendingAt + RESET_WAIT_MS))}
        </p>
      )}

      {mode === 'create' && (
        <form className="card" onSubmit={create} style={card}>
          <h2 style={{ fontSize: '0.85rem', margin: 0 }}>{T.createTitle[L]}</h2>
          <p style={read}>{T.createHint[L]}</p>
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

      {mode === 'code' && (
        <div className="card" style={card}>
          <h2 style={{ fontSize: '0.85rem', margin: 0 }}>🔑 {T.codeTitle[L]}</h2>
          <p style={read}>{T.codeText[L]}</p>
          <p className="recovery-code" style={{ justifySelf: 'center' }}>{newCode}</p>
          <label style={{ fontFamily: 'var(--font-read)', fontWeight: 700, display: 'flex', gap: 8, alignItems: 'center' }}>
            <input type="checkbox" checked={saved} onChange={(e) => setSaved(e.target.checked)} />
            {T.codeSaved[L]}
          </label>
          <button type="button" className="btn" disabled={!saved} onClick={done}>{T.continue[L]}</button>
        </div>
      )}

      {mode === 'enter' && (
        <form className="card" onSubmit={enter} style={card}>
          <label htmlFor="parent-pin" style={{ fontFamily: 'var(--font-pixel)', fontSize: '0.85rem' }}>{T.enterTitle[L]}</label>
          <input id="parent-pin" {...pinInputProps} autoComplete="off" value={pin} onChange={(e) => setPinText(digits(e.target.value))} autoFocus />
          <button type="submit" className="btn" disabled={busy}>{T.enter[L]}</button>
          {pendingAt == null && (
            <button type="button" className="btn btn--ghost" style={{ fontSize: '0.6rem' }} onClick={() => go('forgot')}>
              {T.forgot[L]}
            </button>
          )}
        </form>
      )}

      {mode === 'forgot' && (
        <form className="card" onSubmit={submitCode} style={card}>
          <p style={read}>{T.forgotText[L]}</p>
          <label style={{ fontFamily: 'var(--font-read)', fontWeight: 700 }}>
            {T.codeLabel[L]}
            <br />
            <input value={code} onChange={(e) => setCode(e.target.value)} autoComplete="off" placeholder="MEWY-XXXX-XXXX" style={{ width: 220, textAlign: 'center', textTransform: 'uppercase' }} autoFocus />
          </label>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            <button type="submit" className="btn" disabled={busy || code.trim().length < 8}>{T.codeBtn[L]}</button>
            <button type="button" className="btn btn--ghost" onClick={() => go('enter')}>{T.cancel[L]}</button>
          </div>
          <button type="button" className="btn btn--ghost" style={{ fontSize: '0.6rem' }} onClick={() => go('challenge')}>
            {T.lostCode[L]}
          </button>
        </form>
      )}

      {mode === 'challenge' && (
        <form className="card" onSubmit={challenge} style={card}>
          <p style={read}>{T.challengeText[L]}</p>
          {sums.map(([a, b], i) => (
            <label key={`${a}x${b}`} style={{ fontFamily: 'var(--font-read)', fontWeight: 700 }}>
              {a} × {b} =
              <input
                inputMode="numeric"
                value={answers[i]}
                onChange={(e) => setAnswers((list) => list.map((v, j) => (j === i ? e.target.value.replace(/\D/g, '').slice(0, 5) : v)))}
                autoComplete="off"
                style={{ width: 110, marginLeft: 8, textAlign: 'center' }}
              />
            </label>
          ))}
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            <button type="submit" className="btn" disabled={answers.some((a) => !a)}>{T.challengeBtn[L]}</button>
            <button type="button" className="btn btn--ghost" onClick={() => go('enter')}>{T.cancel[L]}</button>
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
