import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getLessons, type LessonTopic } from '../../../shared/lessons';
import { isQuizTopic } from '../../../shared/questions';
import { TOPICS } from '../../../shared/types';
import { LessonPlayer } from '../components/LessonPlayer';
import { TopicIcon } from '../components/TopicIcon';
import { useSettings } from '../state/settings';

export function LessonDetailPage() {
  const { tr, settings } = useSettings();
  const { topic } = useParams();
  const [open, setOpen] = useState<number | null>(null);
  const [done, setDone] = useState<Set<string>>(() => new Set());
  const L = settings.lang;

  if (!topic || !isQuizTopic(topic)) {
    return (
      <section>
        <p style={{ fontFamily: 'var(--font-read)' }}>{L === 'en' ? 'Lesson not found.' : 'Pelajaran tidak ditemukan.'}</p>
        <Link to="/lessons" className="btn">{tr('back')}</Link>
      </section>
    );
  }

  const meta = TOPICS.find((t) => t.id === topic)!;
  const modules = getLessons(topic as LessonTopic);
  const markDone = (i: number) => setDone((s) => new Set(s).add(modules[i].id));
  const close = () => {
    if (open != null) markDone(open);
    setOpen(null);
    window.scrollTo({ top: 0 });
  };

  return (
    <section>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
        <TopicIcon emoji={meta.emoji} size={48} />
        <h1 style={{ margin: 0, minWidth: 0, overflowWrap: 'anywhere' }}>{meta.title[L]}</h1>
      </div>

      {open != null ? (
        <LessonPlayer
          key={modules[open].id}
          module={modules[open]}
          topic={topic}
          onExit={close}
          onNext={
            open + 1 < modules.length
              ? () => {
                  markDone(open);
                  setOpen(open + 1);
                  window.scrollTo({ top: 0 });
                }
              : undefined
          }
        />
      ) : (
        <>
          <p style={{ fontFamily: 'var(--font-read)' }}>{tr('lessonPick')}</p>
          <div className="lesson-road">
            {modules.map((m, i) => (
              <button
                key={m.id}
                type="button"
                className="card card--link lesson-step lesson-road__item"
                style={{ animationDelay: `${i * 0.08}s` }}
                onClick={() => {
                  setOpen(i);
                  window.scrollTo({ top: 0 });
                }}
              >
                <span className="lesson-badge">{done.has(m.id) ? '✓' : i + 1}</span>
                <span className="lesson-road__text">
                  <span className="lesson-road__title">{m.title[L]}</span>
                  <span className="lesson-road__goal">🎯 {m.goal[L]}</span>
                  <span className="lesson-road__meta">
                    {m.steps.length} {m.steps.length === 1 ? tr('lessonStep').toLowerCase() : tr('lessonSteps')}
                    {m.check ? ` · 🧠 ${tr('lessonCheck')}` : ''}
                  </span>
                </span>
                <span className="lesson-road__go" aria-hidden="true">▶</span>
              </button>
            ))}
          </div>

          <div className="card" style={{ textAlign: 'center', background: 'var(--panel-glow)', marginTop: '1.5rem' }}>
            <p style={{ fontFamily: 'var(--font-read)', fontSize: '1.1rem', margin: '0 0 1rem' }}>
              {L === 'en' ? 'Ready? Now practice what you learned!' : 'Siap? Sekarang latih yang sudah kamu pelajari!'}
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to={`/quiz?topic=${topic}`} className="btn">✋ {tr('navQuiz')}</Link>
              <Link to="/lessons" className="btn btn--ghost">{tr('back')}</Link>
            </div>
          </div>
        </>
      )}
    </section>
  );
}
