import { useRef, useState, type ChangeEvent, type ReactNode } from 'react';
import { applyBackup, backupFileName, makeBackup, parseBackup, type Backup } from '../state/backup';
import { useSettings } from '../state/settings';

function SaveRow({ label, desc, children }: { label: string; desc: string; children: ReactNode }) {
  return (
    <div className="pixel-panel settings-row">
      <div className="settings-row__text">
        <span className="settings-row__label">{label}</span>
        <small className="settings-row__desc">{desc}</small>
      </div>
      <div className="settings-row__controls">{children}</div>
    </div>
  );
}

/** The Save tab: download / load a progress backup, and restore default settings. */
export function SettingsSave() {
  const { settings, resetSettings, tr } = useSettings();
  const en = settings.lang === 'en';
  const fileInput = useRef<HTMLInputElement | null>(null);
  const [pending, setPending] = useState<Backup | null>(null);
  const [loadMsg, setLoadMsg] = useState<string | null>(null);
  const [confirmReset, setConfirmReset] = useState(false);
  const [resetDone, setResetDone] = useState(false);

  const download = () => {
    const blob = new Blob([JSON.stringify(makeBackup(localStorage), null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = backupFileName();
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const onFile = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = ''; // so the same file can be picked again
    if (!file) return;
    const backup = file.size < 2_000_000 ? parseBackup(await file.text()) : null;
    setPending(backup);
    setLoadMsg(backup ? null : tr('backupBadFile'));
  };

  const load = () => {
    if (!pending) return;
    applyBackup(localStorage, pending);
    location.reload();
  };

  const backupDate = pending?.exportedAt ? new Date(pending.exportedAt) : null;
  const dateText = backupDate && !Number.isNaN(backupDate.getTime()) ? backupDate.toLocaleDateString(en ? 'en-GB' : 'id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '';

  return (
    <>
      <SaveRow label={`⬇️ ${tr('backupDownload')}`} desc={tr('backupDownloadDesc')}>
        <button type="button" className="btn" onClick={download}>
          {tr('backupDownloadBtn')}
        </button>
      </SaveRow>

      <SaveRow label={`⬆️ ${tr('backupLoad')}`} desc={tr('backupLoadDesc')}>
        <input ref={fileInput} type="file" accept="application/json,.json" onChange={onFile} hidden />
        {!pending && (
          <button type="button" className="btn btn--secondary" onClick={() => fileInput.current?.click()}>
            {tr('backupLoadBtn')}
          </button>
        )}
      </SaveRow>
      {(pending || loadMsg) && (
        <div className="pixel-panel settings-confirm" role="alert">
          {pending ? (
            <>
              <p>
                {tr('backupConfirm')}
                {dateText && ` (${dateText})`}
              </p>
              <div className="settings-row__controls">
                <button type="button" className="btn" onClick={load}>
                  ✓ {tr('backupConfirmYes')}
                </button>
                <button type="button" className="btn btn--ghost" onClick={() => setPending(null)}>
                  {tr('cancel')}
                </button>
              </div>
            </>
          ) : (
            <p>⚠️ {loadMsg}</p>
          )}
        </div>
      )}

      <SaveRow label={`↺ ${tr('restoreDefaults')}`} desc={tr('restoreDefaultsDesc')}>
        {confirmReset ? (
          <>
            <button
              type="button"
              className="btn"
              onClick={() => {
                resetSettings();
                setConfirmReset(false);
                setResetDone(true);
              }}
            >
              ✓ {tr('restoreDefaultsYes')}
            </button>
            <button type="button" className="btn btn--ghost" onClick={() => setConfirmReset(false)}>
              {tr('cancel')}
            </button>
          </>
        ) : (
          <button
            type="button"
            className="btn btn--ghost"
            onClick={() => {
              setConfirmReset(true);
              setResetDone(false);
            }}
          >
            {tr('restoreDefaultsBtn')}
          </button>
        )}
      </SaveRow>
      <p aria-live="polite" className="settings-status">
        {resetDone ? `✅ ${tr('restoreDefaultsDone')}` : ''}
      </p>
    </>
  );
}
