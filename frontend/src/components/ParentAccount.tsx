import { useState, type FormEvent } from 'react';
import { resetProgress } from '../state/progress';
import { checkPin, isValidPin, setPin } from '../state/parentLock';
import { BREAK_CHOICES } from '../lib/breakTime';
import { useSettings } from '../state/settings';

const T = {
  title: { en: '⚙️ Grown-up settings', id: '⚙️ Pengaturan orang tua' },
  lock: { en: '🔒 Lock now', id: '🔒 Kunci sekarang' },
  changeTitle: { en: 'Change PIN', id: 'Ganti PIN' },
  current: { en: 'Current PIN', id: 'PIN sekarang' },
  newPin: { en: 'New PIN', id: 'PIN baru' },
  save: { en: 'Save new PIN', id: 'Simpan PIN baru' },
  saved: { en: '✅ PIN changed.', id: '✅ PIN diganti.' },
  resetTitle: { en: 'Reset all progress', id: 'Hapus semua progres' },
  resetText: {
    en: 'Deletes ALL stars, the day streak, badges, unlocked outfits and the play history on this device. This cannot be undone. Enter your PIN and type RESET.',
    id: 'Menghapus SEMUA bintang, hari beruntun, lencana, baju yang terbuka, dan riwayat main di perangkat ini. Tidak bisa dibatalkan. Masukkan PIN dan ketik RESET.',
  },
  resetBtn: { en: 'Delete all progress', id: 'Hapus semua progres' },
  resetDone: { en: 'All progress was reset.', id: 'Semua progres sudah dihapus.' },
  wrongPin: { en: 'Wrong PIN.', id: 'PIN salah.' },
  breakTitle: { en: '⏰ Break reminder', id: '⏰ Pengingat istirahat' },
  breakText: {
    en: 'After this much play, Mewy asks for a 1-minute stretch break. Only time with the app open counts.',
    id: 'Setelah bermain selama ini, Mewy mengajak istirahat peregangan 1 menit. Hanya waktu saat aplikasi terbuka yang dihitung.',
  },
  breakOff: { en: 'Off', id: 'Mati' },
  mustBe4: { en: 'The new PIN must be 4 digits.', id: 'PIN baru harus 4 angka.' },
};

const pinField = {
  inputMode: 'numeric' as const,
  maxLength: 4,
  type: 'password',
  autoComplete: 'off',
  style: { width: 110, textAlign: 'center' as const, letterSpacing: '0.3em' },
};
const digits = (v: string) => v.replace(/\D/g, '').slice(0, 4);

/** Lock, change PIN and the (deliberately hard to reach) full reset. */
export function ParentAccount({ onLock }: { onLock: () => void }) {
  const { settings, set } = useSettings();
  const L = settings.lang;
  const [cur, setCur] = useState('');
  const [next, setNext] = useState('');
  const [msg, setMsg] = useState('');
  const [rPin, setRPin] = useState('');
  const [rWord, setRWord] = useState('');
  const [rMsg, setRMsg] = useState('');

  const change = async (e: FormEvent) => {
    e.preventDefault();
    if (!(await checkPin(cur))) return setMsg(T.wrongPin[L]);
    if (!isValidPin(next)) return setMsg(T.mustBe4[L]);
    await setPin(next);
    setCur('');
    setNext('');
    setMsg(T.saved[L]);
  };

  const reset = async (e: FormEvent) => {
    e.preventDefault();
    if (rWord.trim().toUpperCase() !== 'RESET') return;
    if (!(await checkPin(rPin))) return setRMsg(T.wrongPin[L]);
    resetProgress();
    setRPin('');
    setRWord('');
    setRMsg(T.resetDone[L]);
  };

  const label = { fontFamily: 'var(--font-read)', fontWeight: 700, display: 'grid', gap: 4 } as const;

  return (
    <div className="card" style={{ display: 'grid', gap: '1.25rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
        <h2 style={{ fontSize: '0.9rem', margin: 0 }}>{T.title[L]}</h2>
        <button type="button" className="btn btn--ghost" onClick={onLock}>{T.lock[L]}</button>
      </div>

      <div style={{ display: 'grid', gap: '0.5rem' }}>
        <strong style={{ fontFamily: 'var(--font-read)' }}>{T.breakTitle[L]}</strong>
        <p style={{ fontFamily: 'var(--font-read)', margin: 0 }}>{T.breakText[L]}</p>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }} role="group" aria-label={T.breakTitle[L]}>
          {BREAK_CHOICES.map((m) => {
            const active = settings.breakMinutes === m;
            return (
              <button
                key={m}
                type="button"
                className="btn"
                aria-pressed={active}
                onClick={() => set('breakMinutes', m)}
                style={{ background: active ? 'var(--yellow)' : 'var(--btn-ghost)', color: active ? 'var(--ink)' : 'var(--btn-ghost-text)', fontSize: '0.65rem' }}
              >
                {m === 0 ? T.breakOff[L] : `${m} min`}
              </button>
            );
          })}
        </div>
      </div>

      <form onSubmit={change} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-end', flexWrap: 'wrap' }}>
        <strong style={{ fontFamily: 'var(--font-read)', flexBasis: '100%' }}>{T.changeTitle[L]}</strong>
        <label style={label}>
          {T.current[L]}
          <input {...pinField} value={cur} onChange={(e) => setCur(digits(e.target.value))} />
        </label>
        <label style={label}>
          {T.newPin[L]}
          <input {...pinField} value={next} onChange={(e) => setNext(digits(e.target.value))} />
        </label>
        <button type="submit" className="btn btn--secondary">{T.save[L]}</button>
        {msg && <span role="status" className="chip" style={{ fontFamily: 'var(--font-read)' }}>{msg}</span>}
      </form>

      <form onSubmit={reset} className="danger-zone">
        <strong style={{ fontFamily: 'var(--font-read)' }}>⚠️ {T.resetTitle[L]}</strong>
        <p style={{ fontFamily: 'var(--font-read)', margin: 0 }}>{T.resetText[L]}</p>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-end', flexWrap: 'wrap' }}>
          <label style={label}>
            PIN
            <input {...pinField} value={rPin} onChange={(e) => setRPin(digits(e.target.value))} />
          </label>
          <label style={label}>
            RESET
            <input value={rWord} onChange={(e) => setRWord(e.target.value)} autoComplete="off" style={{ width: 120 }} />
          </label>
          <button type="submit" className="btn" style={{ background: 'var(--red)', color: '#fff' }} disabled={rWord.trim().toUpperCase() !== 'RESET' || rPin.length !== 4}>
            {T.resetBtn[L]}
          </button>
        </div>
        {rMsg && <span role="status" className="chip" style={{ fontFamily: 'var(--font-read)', justifySelf: 'start' }}>{rMsg}</span>}
      </form>
    </div>
  );
}
