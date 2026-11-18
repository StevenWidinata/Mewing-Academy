import { useState, type FormEvent } from 'react';
import { RESET_CANCELLED_KEY, checkPin, hasRecoveryCode, makeRecoveryCode, setRecoveryCode } from '../state/parentLock';
import { useSettings } from '../state/settings';

const T = {
  missingTitle: { en: '🔑 Create your recovery code', id: '🔑 Buat kode pemulihan' },
  missingText: {
    en: 'Without it, a forgotten PIN can only be reset after a 24-hour wait. Make one now and keep it away from your child.',
    id: 'Tanpa kode ini, PIN yang terlupa hanya bisa direset setelah menunggu 24 jam. Buat sekarang dan simpan jauh dari anak.',
  },
  haveTitle: { en: '🔑 Recovery code', id: '🔑 Kode pemulihan' },
  haveText: {
    en: 'Lost the code? Make a new one; the old code stops working.',
    id: 'Kodenya hilang? Buat yang baru; kode lama tidak berlaku lagi.',
  },
  make: { en: 'Make a new code', id: 'Buat kode baru' },
  newCode: { en: 'Write this down or take a photo. It is shown only once:', id: 'Tulis atau foto kode ini. Hanya ditampilkan sekali:' },
  wrongPin: { en: 'Wrong PIN.', id: 'PIN salah.' },
  cancelled: {
    en: '⚠️ Someone asked to reset the PIN on {at}. Because you entered the PIN, the reset was cancelled.',
    id: '⚠️ Ada yang meminta reset PIN pada {at}. Karena kamu memasukkan PIN, reset itu dibatalkan.',
  },
};

/** Dashboard card: make (or replace) the PIN recovery code, and report a cancelled reset request. */
export function RecoveryCodeCard() {
  const { settings } = useSettings();
  const L = settings.lang;
  const [have, setHave] = useState(hasRecoveryCode);
  const [pin, setPin] = useState('');
  const [code, setCode] = useState('');
  const [msg, setMsg] = useState('');
  const [cancelledAt] = useState(() => {
    const v = Number(sessionStorage.getItem(RESET_CANCELLED_KEY));
    return v > 0 ? v : null;
  });

  const make = async (e: FormEvent) => {
    e.preventDefault();
    if (!(await checkPin(pin))) return setMsg(T.wrongPin[L]);
    const fresh = makeRecoveryCode();
    await setRecoveryCode(fresh);
    setCode(fresh);
    setHave(true);
    setPin('');
    setMsg('');
  };

  return (
    <div className={`card${have ? '' : ' danger-zone'}`} style={{ display: 'grid', gap: '0.6rem', marginBottom: '1rem' }}>
      {cancelledAt != null && (
        <p role="status" className="chip" style={{ fontFamily: 'var(--font-read)', margin: 0 }}>
          {T.cancelled[L].replace('{at}', new Date(cancelledAt).toLocaleString(L === 'en' ? 'en-GB' : 'id-ID', { dateStyle: 'medium', timeStyle: 'short' }))}
        </p>
      )}
      <strong style={{ fontFamily: 'var(--font-read)' }}>{have ? T.haveTitle[L] : T.missingTitle[L]}</strong>
      <p style={{ fontFamily: 'var(--font-read)', margin: 0 }}>{have ? T.haveText[L] : T.missingText[L]}</p>
      {code ? (
        <>
          <p style={{ fontFamily: 'var(--font-read)', margin: 0 }}>{T.newCode[L]}</p>
          <p className="recovery-code">{code}</p>
        </>
      ) : (
        <form onSubmit={make} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-end', flexWrap: 'wrap' }}>
          <label style={{ fontFamily: 'var(--font-read)', fontWeight: 700, display: 'grid', gap: 4 }}>
            PIN
            <input
              inputMode="numeric"
              type="password"
              maxLength={4}
              autoComplete="off"
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
              style={{ width: 110, textAlign: 'center', letterSpacing: '0.3em' }}
            />
          </label>
          <button type="submit" className="btn btn--secondary" disabled={pin.length !== 4}>{T.make[L]}</button>
          {msg && <span role="status" className="chip" style={{ fontFamily: 'var(--font-read)' }}>{msg}</span>}
        </form>
      )}
    </div>
  );
}
