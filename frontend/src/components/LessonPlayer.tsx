import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import type { LessonModule } from '../../../shared/lessons';
import type { Text } from '../../../shared/types';
import { canSpeak, speak } from '../lib/speak';
import { sfx } from '../lib/sound';
import { useSettings } from '../state/settings';
import { MewyBuddy } from './MewyBuddy';
import { SpriteScene } from './Sprite';

type Page = { kind: 'step'; index: number } | { kind: 'mistakes' } | { kind: 'check' } | { kind: 'done' };

function pagesOf(m: LessonModule): Page[] {
  const pages: Page[] = m.steps.map((_, index) => ({ kind: 'step', index }));
  if (m.mistakes?.length) pages.push({ kind: 'mistakes' });
  if (m.check) pages.push({ kind: 'check' });
  pages.push({ kind: 'done' });
  return pages;
}

/** Text that "Read to me" says for a page. */
function speechFor(m: LessonModule, page: Page, L: 'en' | 'id'): string {
  if (page.kind === 'step') {
    const s = m.steps[page.index];
    return [(s.narration ?? s.text)[L], s.example?.[L]].filter(Boolean).join('. ');
  }
  if (page.kind === 'mistakes') {
    return (m.mistakes ?? []).map((x) => `${x.right[L]}. ${x.why[L]}`).join(' ');
  }
  if (page.kind === 'check' && m.check) {
    return `${m.check.prompt[L]} ... ${m.check.choices.map((c) => c[L]).join(', ')}`;
  }
  return '';
}

export function LessonPlayer({
  module: m,
  topic,
  onExit,
  onNext,
}: {
  module: LessonModule;
  topic: string;
  onExit: () => void;
  /** Opens the next module; absent on the last one. */
  onNext?: () => void;
}) {
  const { tr, settings } = useSettings();
  const L = settings.lang;
  const pages = useMemo(() => pagesOf(m), [m]);
  const [at, setAt] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const page = pages[at];
  // The last page is the "done" screen; dots show only the real pages.
  const total = pages.length - 1;
  const checkPassed = !m.check || picked === m.check.answer;

  useEffect(() => {
    if (settings.autoRead && page.kind !== 'done') speak(speechFor(m, page, L), L);
  }, [at, settings.autoRead, L, m, page]);

  useEffect(() => () => window.speechSynthesis?.cancel(), []);

  const go = (d: number) => setAt((x) => Math.max(0, Math.min(pages.length - 1, x + d)));

  const choose = (i: number) => {
    if (!m.check || picked === m.check.answer) return;
    setPicked(i);
    if (i === m.check.answer) sfx.correct(settings.sound);
    else sfx.wrong(settings.sound);
  };

  const pageLabel = (p: Page): string =>
    p.kind === 'step' ? `${tr('lessonStep')} ${p.index + 1}` : p.kind === 'mistakes' ? tr('lessonMistakes') : tr('lessonCheck');

  return (
    <div className="card lesson-player">
      <div className="lesson-player__top">
        <button type="button" className="btn btn--ghost lesson-player__exit" onClick={onExit} aria-label={tr('lessonAll')}>
          ✖
        </button>
        <h2 className="lesson-player__title">{m.title[L]}</h2>
      </div>

      {page.kind !== 'done' && (
        <>
          <p className="lesson-player__count chip">
            {page.kind === 'step' ? `${tr('lessonStep')} ${page.index + 1} ${tr('lessonOf')} ${m.steps.length}` : pageLabel(page)}
          </p>
          <ol className="lesson-dots" aria-label={`${at + 1} / ${total}`}>
            {pages.slice(0, total).map((p, i) => (
              <li key={i} className={i < at ? 'is-done' : i === at ? 'is-now' : undefined} aria-current={i === at ? 'step' : undefined}>
                <span className="sr-only">{pageLabel(p)}</span>
              </li>
            ))}
          </ol>
        </>
      )}

      <div className="lesson-player__body" key={at}>
        {page.kind === 'step' && <StepView module={m} index={page.index} />}

        {page.kind === 'mistakes' && (
          <div>
            <h3 className="lesson-player__h">⚠️ {tr('lessonMistakes')}</h3>
            <div className="lesson-mistakes">
              {(m.mistakes ?? []).map((x, i) => (
                <div key={i} className="lesson-mistake">
                  <p className="lesson-mistake__wrong">❌ {x.wrong[L]}</p>
                  <p className="lesson-mistake__right">✅ {x.right[L]}</p>
                  <p className="lesson-mistake__why">💡 {x.why[L]}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {page.kind === 'check' && m.check && (
          <div>
            <h3 className="lesson-player__h">🧠 {tr('lessonCheck')}</h3>
            <p className="lesson-player__text">{m.check.prompt[L]}</p>
            <div className="lesson-check">
              {m.check.choices.map((c, i) => {
                const state = picked === i ? (i === m.check!.answer ? 'right' : 'wrong') : picked === m.check!.answer && i === m.check!.answer ? 'right' : '';
                return (
                  <button
                    key={i}
                    type="button"
                    className={`btn btn--ghost lesson-check__choice ${state ? `is-${state}` : ''}`}
                    aria-pressed={picked === i}
                    disabled={checkPassed && picked !== null}
                    onClick={() => choose(i)}
                  >
                    {c[L]}
                  </button>
                );
              })}
            </div>
            <p className="lesson-player__feedback" aria-live="polite">
              {picked === null ? '' : picked === m.check.answer ? `🎉 ${tr('correct')}` : `🤔 ${tr('lessonTryAgain')}`}
            </p>
          </div>
        )}

        {page.kind === 'done' && (
          <div style={{ textAlign: 'center' }}>
            <MewyBuddy mood="happy" />
            <h3 className="lesson-player__h">🌟 {tr('lessonDone')}</h3>
            <div className="lesson-player__actions" style={{ justifyContent: 'center' }}>
              {onNext && (
                <button type="button" className="btn" onClick={onNext}>
                  ▶ {tr('lessonNext')}
                </button>
              )}
              <Link to={topic === 'memory' ? '/memory' : `/quiz?topic=${topic}`} className={onNext ? 'btn btn--secondary' : 'btn'}>
                ✋ {tr('lessonPractice')}
              </Link>
              <button type="button" className="btn btn--ghost" onClick={onExit}>
                {tr('lessonAll')}
              </button>
            </div>
          </div>
        )}
      </div>

      {page.kind !== 'done' && (
        <div className="lesson-player__actions">
          <button type="button" className="btn btn--ghost" onClick={() => go(-1)} disabled={at === 0}>
            ◀ {tr('back')}
          </button>
          {canSpeak && (
            <button type="button" className="btn btn--secondary" onClick={() => speak(speechFor(m, page, L), L)}>
              🔊 {tr('lessonReadToMe')}
            </button>
          )}
          <button type="button" className="btn" onClick={() => go(1)} disabled={page.kind === 'check' && !checkPassed}>
            {tr('next')} ▶
          </button>
        </div>
      )}
    </div>
  );
}

function StepView({ module: m, index }: { module: LessonModule; index: number }) {
  const { settings } = useSettings();
  const L = settings.lang;
  const s = m.steps[index];
  const t = (x?: Text) => x?.[L];
  return (
    <div>
      {index === 0 && <p className="lesson-player__goal">🎯 {m.goal[L]}</p>}
      {s.visual ? (
        <div className="lesson-player__visual pixel-panel">
          <SpriteScene groups={s.visual} size={56} />
        </div>
      ) : (
        s.emoji && (
          <div className="lesson-player__emoji pop" aria-hidden="true">
            {s.emoji}
          </div>
        )
      )}
      <p className="lesson-player__text">{t(s.text)}</p>
      {s.example && <p className="lesson-player__example">{t(s.example)}</p>}
    </div>
  );
}
