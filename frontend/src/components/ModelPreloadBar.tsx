import { useState } from 'react';
import { useSettings } from '../state/settings';
import { useHandModelPreload } from '../vision/preload';
import { Mewy } from './Mewy';

const TIPS = [
  { en: 'Tip: hold your hand up like a high-five, about one big step from the camera.', id: 'Tips: angkat tanganmu seperti tos, kira-kira satu langkah besar dari kamera.' },
  { en: 'Tip: good light helps Mewy see your fingers. Face a window or a lamp!', id: 'Tips: cahaya terang membantu Mewy melihat jarimu. Hadap ke jendela atau lampu!' },
  { en: 'Tip: tuck your thumb in and count with your other fingers.', id: 'Tips: lipat jempolmu dan berhitung dengan jari lainnya.' },
];

/** "Getting the camera AI ready... 45%" while the hand model downloads in the background. */
export function ModelPreloadBar() {
  const { tr, settings } = useSettings();
  const pre = useHandModelPreload();
  // One tip per visit, picked once.
  const [tipIndex] = useState(() => Math.floor(Math.random() * TIPS.length));
  if (pre.status === 'idle' || pre.status === 'skipped' || pre.status === 'error') return null;
  const done = pre.status === 'done';
  const pct = pre.progress == null ? null : Math.round(pre.progress * 100);
  const tip = TIPS[tipIndex][settings.lang];
  return (
    <div className="card preload" role="status" aria-live="polite">
      <Mewy size={40} mood={done ? 'happy' : 'think'} />
      <div className="preload__body">
        <p className="preload__title">{done ? `✅ ${tr('preloadDone')}` : `🧠 ${tr('preloadLoading')}${pct != null ? ` ${pct}%` : ''}`}</p>
        {!done && (
          <span className="preload__bar" aria-hidden="true">
            <span className={pct == null ? 'is-unknown' : undefined} style={pct != null ? { width: `${pct}%` } : undefined} />
          </span>
        )}
        <p className="preload__tip">{tip}</p>
      </div>
    </div>
  );
}
