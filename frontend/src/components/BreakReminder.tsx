import { useEffect, useRef, useState } from 'react';
import { BREAK_SECONDS, endBreak, tick, useOnBreak } from '../lib/breakTime';
import { speak } from '../lib/speak';
import { sfx } from '../lib/sound';
import { useSettings } from '../state/settings';
import { Mewy } from './Mewy';

const STRETCHES = [
  { emoji: '🙆', en: 'Stand up and reach for the sky!', id: 'Berdiri dan raih langit!' },
  { emoji: '🤸', en: 'Bend down and touch your toes.', id: 'Membungkuk dan sentuh jari kakimu.' },
  { emoji: '👀', en: 'Look far away and blink 10 times.', id: 'Lihat jauh dan berkedip 10 kali.' },
  { emoji: '🖐️', en: 'Wiggle your fingers and shake your hands!', id: 'Goyangkan jari dan kibaskan tanganmu!' },
];
const TICK_MS = 5000;

/** Counts play time and shows Mewy's stretch break when the grown-up's limit is reached. */
export function BreakReminder() {
  const { tr, settings } = useSettings();
  const onBreak = useOnBreak();
  const minutes = settings.breakMinutes;

  // Count only while the page is visible.
  useEffect(() => {
    if (minutes <= 0) return;
    const id = window.setInterval(() => {
      if (document.visibilityState === 'visible') tick(TICK_MS, minutes);
    }, TICK_MS);
    return () => window.clearInterval(id);
  }, [minutes]);

  if (!onBreak) return null;
  return <BreakOverlay lang={settings.lang} sound={settings.sound} autoRead={settings.autoRead} doneLabel={tr('breakBack')} title={tr('breakTitle')} />;
}

function BreakOverlay({ lang, sound, autoRead, doneLabel, title }: { lang: 'en' | 'id'; sound: boolean; autoRead: boolean; doneLabel: string; title: string }) {
  const [left, setLeft] = useState(BREAK_SECONDS);
  const button = useRef<HTMLButtonElement | null>(null);
  const step = STRETCHES[Math.min(STRETCHES.length - 1, Math.floor(((BREAK_SECONDS - left) / BREAK_SECONDS) * STRETCHES.length))];

  useEffect(() => {
    sfx.star(sound);
    const id = window.setInterval(() => setLeft((s) => Math.max(0, s - 1)), 1000);
    return () => window.clearInterval(id);
  }, [sound]);

  useEffect(() => {
    if (autoRead) speak(step[lang], lang);
  }, [step, lang, autoRead]);

  useEffect(() => {
    if (left === 0) button.current?.focus();
  }, [left]);

  return (
    <div className="break" role="dialog" aria-modal="true" aria-labelledby="break-title">
      <div className="card break__card">
        <Mewy size={96} mood="happy" />
        <h2 id="break-title" className="break__title">🧘 {title}</h2>
        <div className="break__emoji pop" key={step.emoji} aria-hidden="true">{step.emoji}</div>
        <p className="break__step" aria-live="polite">{step[lang]}</p>
        <div className="break__bar" aria-hidden="true">
          <span style={{ width: `${((BREAK_SECONDS - left) / BREAK_SECONDS) * 100}%` }} />
        </div>
        <button ref={button} type="button" className="btn" disabled={left > 0} onClick={endBreak}>
          {left > 0 ? `⏳ ${left}s` : `▶ ${doneLabel}`}
        </button>
      </div>
    </div>
  );
}
