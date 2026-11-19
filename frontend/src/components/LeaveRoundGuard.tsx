import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useBlocker } from 'react-router-dom';
import { useSettings } from '../state/settings';
import { Mewy } from './Mewy';

/**
 * "Leave this round?" while a quiz round is half done (when the setting is on):
 * a pixel pop-up for links inside the site, and the browser's own warning when
 * the tab is closed or reloaded.
 */
export function LeaveRoundGuard({ active }: { active: boolean }) {
  const { settings, tr } = useSettings();
  const guard = settings.confirmLeave && active;
  const blocker = useBlocker(guard);
  const stayRef = useRef<HTMLButtonElement | null>(null);
  const blocked = blocker.state === 'blocked';

  useEffect(() => {
    if (!guard) return;
    const onUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      // Older browsers need returnValue set to show the warning.
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', onUnload);
    return () => window.removeEventListener('beforeunload', onUnload);
  }, [guard]);

  useEffect(() => {
    if (!blocked) return;
    stayRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') blocker.reset?.();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [blocked, blocker]);

  if (!blocked) return null;
  // Portal: a transformed page wrapper would otherwise trap the fixed overlay.
  return createPortal(
    <div className="break" role="alertdialog" aria-modal="true" aria-labelledby="leave-title" aria-describedby="leave-text">
      <div className="card break__card">
        <Mewy size={88} mood="sad" />
        <h2 id="leave-title" className="break__title">🚪 {tr('leaveTitle')}</h2>
        <p id="leave-text" className="leave__text">{tr('leaveText')}</p>
        <div className="leave__actions">
          <button ref={stayRef} type="button" className="btn" onClick={() => blocker.reset?.()}>
            ▶ {tr('leaveStay')}
          </button>
          <button type="button" className="btn btn--ghost" onClick={() => blocker.proceed?.()}>
            {tr('leaveGo')}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
