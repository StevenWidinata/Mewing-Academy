import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { TOPICS, type Difficulty, type Lang, type TopicId } from '../../../shared/types';
import { ColumnChart, LineChart } from '../components/charts/charts';
import { ParentAccount } from '../components/ParentAccount';
import { ParentGate } from '../components/ParentGate';
import { RecoveryCodeCard } from '../components/RecoveryCodeCard';
import { activityByDay, buildInsights, summarizeTopic, topicHistory, type Insight, type Standing, type TopicSummary } from '../lib/insights';
import { isUnlocked, lock } from '../state/parentLock';
import { today, useProgress } from '../state/progress';
import { badgeFor, topicTitle } from '../state/rewards';
import { useSettings } from '../state/settings';

const ALL_TOPICS: TopicId[] = [...TOPICS.map((t) => t.id), 'memory'];
const LEVEL: Record<Difficulty, { en: string; id: string }> = {
  1: { en: 'Easy', id: 'Mudah' },
  2: { en: 'Medium', id: 'Sedang' },
  3: { en: 'Hard', id: 'Sulit' },
};
// Identity is never color alone: every standing has an icon and a word.
const STANDING: Record<Standing, { icon: string; en: string; id: string; cls: string }> = {
  strong: { icon: '💪', en: 'Strong', id: 'Kuat', cls: 'tag--good' },
  ok: { icon: '👍', en: 'Doing fine', id: 'Cukup baik', cls: 'tag--ok' },
  weak: { icon: '🎯', en: 'Needs practice', id: 'Perlu latihan', cls: 'tag--focus' },
  new: { icon: '🌱', en: 'Just started', id: 'Baru mulai', cls: 'tag--new' },
};
const TREND = {
  up: { en: '↑ improving', id: '↑ membaik' },
  down: { en: '↓ dropping', id: '↓ menurun' },
  flat: { en: '→ steady', id: '→ stabil' },
};
const KIND_ICON: Record<Insight['kind'], string> = { focus: '🎯', strength: '💪', habit: '🗓️' };

const fmtDay = (iso: string, lang: Lang, opts: Intl.DateTimeFormatOptions) =>
  new Date(`${iso.slice(0, 10)}T12:00:00`).toLocaleDateString(lang === 'en' ? 'en-GB' : 'id-ID', opts);
const p100 = (x: number) => Math.round(x * 100);

export function ParentsPage() {
  const [open, setOpen] = useState(isUnlocked);
  if (!open) return <ParentGate onUnlock={() => setOpen(true)} />;
  return (
    <Dashboard
      onLock={() => {
        lock();
        setOpen(false);
      }}
    />
  );
}

function Dashboard({ onLock }: { onLock: () => void }) {
  const { settings } = useSettings();
  const L = settings.lang;
  const progress = useProgress();
  const sessions = progress.sessions;
  const now = today();

  const summaries = useMemo<TopicSummary[]>(
    () => ALL_TOPICS.filter((t) => progress.byTopic[t]?.total).map((t) => summarizeTopic(t, progress.byTopic[t]!, sessions)),
    [progress.byTopic, sessions],
  );
  const daysSincePlay = progress.lastPlayed ? Math.round((Date.parse(now) - Date.parse(progress.lastPlayed)) / 86_400_000) : null;
  const insights = useMemo(
    () => buildInsights(summaries, sessions, (t) => ({ en: topicTitle(t, 'en'), id: topicTitle(t, 'id') }), daysSincePlay),
    [summaries, sessions, daysSincePlay],
  );
  const days = useMemo(() => activityByDay(sessions, now, 14), [sessions, now]);

  // Topic for the accuracy chart: the weakest one by default, else the most played.
  const played = summaries.filter((s) => topicHistory(sessions, s.topic).length > 0);
  const defaultTopic =
    [...played].sort((a, b) => (a.standing === 'weak' ? -1 : 0) - (b.standing === 'weak' ? -1 : 0) || b.total - a.total)[0]?.topic ?? null;
  const [picked, setPicked] = useState<TopicId | null>(null);
  const chartTopic = picked && played.some((s) => s.topic === picked) ? picked : defaultTopic;
  const history = chartTopic ? topicHistory(sessions, chartTopic) : [];

  const answered = summaries.reduce((n, s) => n + s.total, 0);
  const right = summaries.reduce((n, s) => n + s.correct, 0);
  const weekRounds = days.slice(-7).reduce((n, d) => n + d.sessions, 0);
  const handTotal = sessions.reduce((n, s) => n + s.total, 0);
  const byHand = sessions.reduce((n, s) => n + s.byHand, 0);

  const tile = (icon: string, value: string | number, label: string) => (
    <div className="card stat-tile">
      <span aria-hidden="true">{icon}</span>
      <strong>{value}</strong>
      <span>{label}</span>
    </div>
  );

  return (
    <section className="dashboard">
      <h1>👪 {L === 'en' ? 'Parents & Teachers' : 'Orang Tua & Guru'}</h1>
      <p className="dashboard__intro">
        {L === 'en'
          ? 'A summary of everything your child has played on this device: how much, how well, and what to practise next.'
          : 'Ringkasan semua yang dimainkan anak di perangkat ini: seberapa sering, seberapa baik, dan apa yang perlu dilatih.'}
      </p>

      <div className="stat-row">
        {tile('📝', answered, L === 'en' ? 'Questions answered' : 'Soal dijawab')}
        {tile('🎯', answered ? `${p100(right / answered)}%` : '–', L === 'en' ? 'Overall accuracy' : 'Akurasi total')}
        {tile('🔥', progress.streak, L === 'en' ? 'Day streak' : 'Hari beruntun')}
        {tile('🎮', weekRounds, L === 'en' ? 'Rounds this week' : 'Ronde minggu ini')}
        {tile('✋', handTotal ? `${p100(byHand / handTotal)}%` : '–', L === 'en' ? 'Answered by hand' : 'Dijawab dengan tangan')}
      </div>

      {answered === 0 ? (
        <div className="card">
          <p style={{ fontFamily: 'var(--font-read)', margin: 0 }}>
            {L === 'en'
              ? 'Nothing played yet. After a few rounds of the Hand Quiz, Daily Challenge or Memory game, charts and tips will appear here.'
              : 'Belum ada yang dimainkan. Setelah beberapa ronde Kuis Tangan, Tantangan Harian, atau Ingatan, grafik dan saran akan muncul di sini.'}
          </p>
        </div>
      ) : (
        <>
          <h2 className="dashboard__h2">💡 {L === 'en' ? 'What to do next' : 'Apa yang perlu dilakukan'}</h2>
          {insights.length === 0 ? (
            <p className="card" style={{ fontFamily: 'var(--font-read)' }}>
              {L === 'en' ? 'Keep playing a little: tips appear once a topic has 5+ answers.' : 'Terus bermain sedikit lagi: saran muncul setelah satu topik punya 5+ jawaban.'}
            </p>
          ) : (
            <div className="insight-grid">
              {insights.map((it, i) => (
                <article key={i} className={`card insight insight--${it.kind}`}>
                  <h3>
                    <span aria-hidden="true">{KIND_ICON[it.kind]}</span> {it.title[L]}
                  </h3>
                  <p>{it.text[L]}</p>
                  <div className="insight__actions">
                    {it.actions.map((a) => (
                      <Link key={a.to} to={a.to} className="btn btn--ghost">
                        {a.label[L]}
                      </Link>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          )}

          <div className="dashboard__charts">
            <div className="card">
              <h2 className="dashboard__h2">📅 {L === 'en' ? 'Questions answered, last 14 days' : 'Soal dijawab, 14 hari terakhir'}</h2>
              <ColumnChart
                summary={L === 'en' ? 'Questions answered per day for the last 14 days' : 'Soal dijawab per hari selama 14 hari terakhir'}
                tableCaption={L === 'en' ? 'Show as table' : 'Tampilkan sebagai tabel'}
                tableHead={L === 'en' ? ['Day', 'Rounds', 'Questions', 'Right'] : ['Hari', 'Ronde', 'Soal', 'Benar']}
                data={days.map((d) => ({
                  label: fmtDay(d.date, L, { day: 'numeric' }),
                  value: d.questions,
                  tip: (
                    <>
                      <strong>{fmtDay(d.date, L, { weekday: 'short', day: 'numeric', month: 'short' })}</strong>
                      <br />
                      {d.sessions} {L === 'en' ? 'rounds' : 'ronde'} · {d.questions} {L === 'en' ? 'questions' : 'soal'}
                      {d.questions ? ` · ${p100(d.correct / d.questions)}% ${L === 'en' ? 'right' : 'benar'}` : ''}
                    </>
                  ),
                  row: [fmtDay(d.date, L, { weekday: 'short', day: 'numeric', month: 'short' }), d.sessions, d.questions, d.correct],
                }))}
              />
            </div>

            <div className="card">
              <div className="dashboard__charthead">
                <h2 className="dashboard__h2">📈 {L === 'en' ? 'Accuracy per round' : 'Akurasi per ronde'}</h2>
                {played.length > 0 && (
                  <label className="dashboard__select">
                    <span className="sr-only">{L === 'en' ? 'Topic' : 'Topik'}</span>
                    <select value={chartTopic ?? ''} onChange={(e) => setPicked(e.target.value as TopicId)}>
                      {played.map((s) => (
                        <option key={s.topic} value={s.topic}>
                          {topicTitle(s.topic, L)}
                        </option>
                      ))}
                    </select>
                  </label>
                )}
              </div>
              {history.length === 0 ? (
                <p style={{ fontFamily: 'var(--font-read)' }}>{L === 'en' ? 'No rounds recorded yet.' : 'Belum ada ronde tercatat.'}</p>
              ) : (
                <LineChart
                  summary={`${chartTopic ? topicTitle(chartTopic, L) : ''}: ${history.map((h) => `${p100(h.accuracy)}%`).join(', ')}`}
                  tableCaption={L === 'en' ? 'Show as table' : 'Tampilkan sebagai tabel'}
                  tableHead={L === 'en' ? ['Round', 'Date', 'Level', 'Right', 'Accuracy'] : ['Ronde', 'Tanggal', 'Tingkat', 'Benar', 'Akurasi']}
                  data={history.map((h, i) => ({
                    label: `#${i + 1}`,
                    value: h.accuracy * 100,
                    tip: (
                      <>
                        <strong>
                          #{i + 1} · {fmtDay(h.at, L, { day: 'numeric', month: 'short' })}
                        </strong>
                        <br />
                        {h.correct}/{h.total} ({p100(h.accuracy)}%){h.difficulty ? ` · ${LEVEL[h.difficulty][L]}` : ''}
                      </>
                    ),
                    row: [`#${i + 1}`, fmtDay(h.at, L, { day: 'numeric', month: 'short' }), h.difficulty ? LEVEL[h.difficulty][L] : '–', `${h.correct}/${h.total}`, `${p100(h.accuracy)}%`],
                  }))}
                />
              )}
            </div>
          </div>

          <div className="card">
            <h2 className="dashboard__h2">🧭 {L === 'en' ? 'Strengths & weak spots' : 'Kekuatan & yang perlu dilatih'}</h2>
            <ul className="topic-list">
              {[...summaries]
                .sort((a, b) => b.accuracy - a.accuracy)
                .map((s) => {
                  const st = STANDING[s.standing];
                  const badge = badgeFor(s.correct);
                  return (
                    <li key={s.topic} className="topic-row">
                      <span className="topic-row__name">
                        {badge?.emoji ?? '▫️'} {topicTitle(s.topic, L)}
                      </span>
                      <span className="topic-row__bar" aria-hidden="true">
                        <span style={{ width: `${p100(s.accuracy)}%` }} />
                      </span>
                      <span className="topic-row__num">
                        {p100(s.accuracy)}% <small>({s.correct}/{s.total})</small>
                      </span>
                      <span className={`tag ${st.cls}`}>
                        {st.icon} {st[L]}
                      </span>
                      <span className="topic-row__meta">
                        {[s.trend ? TREND[s.trend][L] : null, s.clearedLevel ? `✔ ${LEVEL[s.clearedLevel][L]}` : null].filter(Boolean).join(' · ')}
                      </span>
                    </li>
                  );
                })}
            </ul>
            {ALL_TOPICS.some((t) => !progress.byTopic[t]) && (
              <p style={{ fontFamily: 'var(--font-read)', fontSize: '0.85rem', marginBottom: 0 }}>
                {L === 'en' ? 'Not tried yet: ' : 'Belum dicoba: '}
                {ALL_TOPICS.filter((t) => !progress.byTopic[t])
                  .map((t) => topicTitle(t, L))
                  .join(', ')}
              </p>
            )}
          </div>
        </>
      )}

      <RecoveryCodeCard />
      <ParentAccount onLock={onLock} />

      <p className="chip" style={{ fontFamily: 'var(--font-read)', fontSize: '0.85rem' }}>
        🔒 {L === 'en' ? 'All progress is stored only on this device. Nothing is uploaded.' : 'Semua progres hanya disimpan di perangkat ini. Tidak ada yang diunggah.'}
      </p>
    </section>
  );
}
