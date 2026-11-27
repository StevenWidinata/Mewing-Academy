import { useRegisterSW } from 'virtual:pwa-register/react';
import { useSettings } from '../state/settings';

/** Look for a new deploy this often while the app stays open. */
const CHECK_EVERY_MS = 60 * 60 * 1000;

/**
 * Registers the service worker. When a new version is deployed, a small bar
 * offers to update instead of silently showing the old cached site.
 */
export function UpdatePrompt() {
  const { tr } = useSettings();
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW(_url, reg) {
      if (reg) window.setInterval(() => void reg.update(), CHECK_EVERY_MS);
    },
  });

  if (!needRefresh) return null;
  return (
    <div className="update-bar card pop" role="status" aria-live="polite">
      <span className="update-bar__text">✨ {tr('updateReady')}</span>
      <div className="update-bar__actions">
        <button type="button" className="btn" onClick={() => void updateServiceWorker(true)}>
          {tr('updateNow')}
        </button>
        <button type="button" className="btn btn--ghost" onClick={() => setNeedRefresh(false)}>
          {tr('updateLater')}
        </button>
      </div>
    </div>
  );
}
