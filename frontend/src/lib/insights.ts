import type { Difficulty, Text, TopicId } from '../../../shared/types';
import type { SessionLog } from './sessions';

/**
 * Turns the play history into things a parent can act on: activity per day,
 * accuracy over time per topic, strengths / weak spots, and plain-language
 * tips. Pure (no storage, no Date.now inside) so it is unit tested.
 */

export const MIN_ANSWERS = 5; // below this a topic is "just started", not judged
export const STRONG_AT = 0.8;
export const WEAK_BELOW = 0.6;
const TREND_STEP = 0.15; // a 15-point change counts as a real trend

export const pct = (correct: number, total: number) => (total ? correct / total : 0);
const dayKey = (iso: string) => iso.slice(0, 10);

export interface DayActivity {
  date: string; // YYYY-MM-DD
  sessions: number;
  questions: number;
  correct: number;
}

/** One entry per day for the last `days` days ending at `today` (YYYY-MM-DD). */
export function activityByDay(sessions: SessionLog[], today: string, days = 14): DayActivity[] {
  const out: DayActivity[] = [];
  const end = new Date(`${today}T00:00:00Z`);
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(end);
    d.setUTCDate(end.getUTCDate() - i);
    out.push({ date: d.toISOString().slice(0, 10), sessions: 0, questions: 0, correct: 0 });
  }
  const byDate = new Map(out.map((d) => [d.date, d]));
  for (const s of sessions) {
    const d = byDate.get(dayKey(s.at));
    if (!d) continue;
    d.sessions += 1;
    d.questions += s.total;
    d.correct += s.correct;
  }
  return out;
}

export interface TopicPoint {
  at: string;
  correct: number;
  total: number;
  accuracy: number;
  difficulty: Difficulty | null;
}

/** Accuracy of one topic in every session that included it, oldest first. */
export function topicHistory(sessions: SessionLog[], topic: TopicId): TopicPoint[] {
  return sessions
    .filter((s) => s.topics[topic]?.total)
    .map((s) => {
      const t = s.topics[topic]!;
      return { at: s.at, correct: t.correct, total: t.total, accuracy: pct(t.correct, t.total), difficulty: s.difficulty };
    });
}

export type Standing = 'strong' | 'ok' | 'weak' | 'new';
export type Trend = 'up' | 'down' | 'flat' | null;

export interface TopicSummary {
  topic: TopicId;
  correct: number;
  total: number;
  accuracy: number;
  standing: Standing;
  trend: Trend;
  /** Accuracy of the last 3 sessions vs the ones before (null if not enough data). */
  recent: number | null;
  earlier: number | null;
  /** Highest level played in a session of this topic, and the best level cleared (>= 80%). */
  highestLevel: Difficulty | null;
  clearedLevel: Difficulty | null;
}

const sum = (pts: TopicPoint[]) => pts.reduce((a, p) => ({ c: a.c + p.correct, t: a.t + p.total }), { c: 0, t: 0 });

export function summarizeTopic(topic: TopicId, totals: { correct: number; total: number }, sessions: SessionLog[]): TopicSummary {
  const hist = topicHistory(sessions, topic);
  const accuracy = pct(totals.correct, totals.total);
  let recent: number | null = null;
  let earlier: number | null = null;
  let trend: Trend = null;
  if (hist.length >= 4) {
    const r = sum(hist.slice(-3));
    const e = sum(hist.slice(0, -3));
    recent = pct(r.c, r.t);
    earlier = pct(e.c, e.t);
    trend = recent - earlier >= TREND_STEP ? 'up' : earlier - recent >= TREND_STEP ? 'down' : 'flat';
  }
  const levels = hist.map((h) => h.difficulty).filter((d): d is Difficulty => d != null);
  const highestLevel = levels.length ? (Math.max(...levels) as Difficulty) : null;
  const cleared = hist.filter((h) => h.difficulty != null && h.total >= 3 && h.accuracy >= STRONG_AT).map((h) => h.difficulty!);
  const clearedLevel = cleared.length ? (Math.max(...cleared) as Difficulty) : null;
  const standing: Standing =
    totals.total < MIN_ANSWERS ? 'new' : accuracy >= STRONG_AT && trend !== 'down' ? 'strong' : accuracy < WEAK_BELOW || trend === 'down' ? 'weak' : 'ok';
  return { topic, correct: totals.correct, total: totals.total, accuracy, standing, trend, recent, earlier, highestLevel, clearedLevel };
}

export interface Insight {
  kind: 'focus' | 'strength' | 'habit';
  topic?: TopicId;
  title: Text;
  text: Text;
  actions: { to: string; label: Text }[];
}

const LEVEL_NAME: Record<Difficulty, Text> = {
  1: { en: 'Easy', id: 'Mudah' },
  2: { en: 'Medium', id: 'Sedang' },
  3: { en: 'Hard', id: 'Sulit' },
};
const p100 = (x: number) => `${Math.round(x * 100)}%`;

/**
 * Rule-based analysis and what to do next. `name` gives a topic's display
 * name in a language; `daysSincePlay` is null if never played.
 */
export function buildInsights(
  summaries: TopicSummary[],
  sessions: SessionLog[],
  name: (t: TopicId) => Text,
  daysSincePlay: number | null,
): Insight[] {
  const out: Insight[] = [];
  const lesson = (t: TopicId) => (t === 'memory' ? '/memory' : `/lessons/${t}`);
  const quiz = (t: TopicId) => (t === 'memory' ? '/memory' : `/quiz?topic=${t}`);

  // Weak spots first, worst first (max 3 so the page stays readable).
  const weak = summaries.filter((s) => s.standing === 'weak').sort((a, b) => a.accuracy - b.accuracy).slice(0, 3);
  for (const s of weak) {
    const n = name(s.topic);
    const dropped = s.trend === 'down' && s.recent != null && s.earlier != null;
    const hard = s.highestLevel != null && s.highestLevel > 1;
    out.push({
      kind: 'focus',
      topic: s.topic,
      title: { en: `Needs practice: ${n.en}`, id: `Perlu latihan: ${n.id}` },
      text: dropped
        ? {
            en: `Accuracy dropped from ${p100(s.earlier!)} to ${p100(s.recent!)} in the last 3 rounds. ${hard ? `The jump to ${LEVEL_NAME[s.highestLevel!].en} may be too big: ` : ''}go back one level and play short 5-question rounds.`,
            id: `Akurasi turun dari ${p100(s.earlier!)} ke ${p100(s.recent!)} di 3 ronde terakhir. ${hard ? `Lompatan ke ${LEVEL_NAME[s.highestLevel!].id} mungkin terlalu besar: ` : ''}turunkan satu tingkat dan main ronde pendek 5 soal.`,
          }
        : {
            en: `${p100(s.accuracy)} right so far. Read the lesson together (it has common mistakes to watch for), then practise on Easy until it feels easy.`,
            id: `${p100(s.accuracy)} benar sejauh ini. Baca pelajarannya bersama (ada kesalahan umum yang perlu diwaspadai), lalu latihan di tingkat Mudah sampai terasa mudah.`,
          },
      actions: [
        ...(s.topic === 'memory' ? [] : [{ to: lesson(s.topic), label: { en: '📖 Open lesson', id: '📖 Buka pelajaran' } }]),
        { to: quiz(s.topic), label: { en: '✋ Practise', id: '✋ Latihan' } },
      ],
    });
  }

  // Strengths: celebrate, and suggest the next level.
  const strong = summaries.filter((s) => s.standing === 'strong').sort((a, b) => b.accuracy - a.accuracy).slice(0, 2);
  for (const s of strong) {
    const n = name(s.topic);
    const nextLevel = s.clearedLevel && s.clearedLevel < 3 ? ((s.clearedLevel + 1) as Difficulty) : null;
    out.push({
      kind: 'strength',
      topic: s.topic,
      title: { en: `Strong: ${n.en}`, id: `Kuat: ${n.id}` },
      text: nextLevel
        ? {
            en: `${p100(s.accuracy)} right. Ready for a challenge: try ${LEVEL_NAME[nextLevel].en}.`,
            id: `${p100(s.accuracy)} benar. Siap ditantang: coba tingkat ${LEVEL_NAME[nextLevel].id}.`,
          }
        : { en: `${p100(s.accuracy)} right. Great work, praise the effort!`, id: `${p100(s.accuracy)} benar. Hebat, puji usahanya!` },
      actions: [{ to: quiz(s.topic), label: { en: '⭐ Play again', id: '⭐ Main lagi' } }],
    });
  }

  // Habits: playing rhythm and camera use.
  if (daysSincePlay != null && daysSincePlay >= 3) {
    out.push({
      kind: 'habit',
      title: { en: `No play for ${daysSincePlay} days`, id: `Tidak bermain ${daysSincePlay} hari` },
      text: {
        en: 'Short and often beats long and rare. The Daily Challenge takes about 3 minutes.',
        id: 'Sebentar tapi sering lebih baik daripada lama tapi jarang. Tantangan Harian hanya sekitar 3 menit.',
      },
      actions: [{ to: '/daily', label: { en: '📅 Daily Challenge', id: '📅 Tantangan Harian' } }],
    });
  }
  const answered = sessions.reduce((a, s) => a + s.total, 0);
  const byHand = sessions.reduce((a, s) => a + s.byHand, 0);
  if (answered >= 20 && byHand / answered < 0.25) {
    out.push({
      kind: 'habit',
      title: { en: 'Mostly tapping', id: 'Kebanyakan mengetuk' },
      text: {
        en: `Only ${p100(byHand / answered)} of answers used the camera. Counting on fingers builds number sense, so try playing with the camera on.`,
        id: `Hanya ${p100(byHand / answered)} jawaban memakai kamera. Berhitung dengan jari melatih pemahaman angka, coba main dengan kamera menyala.`,
      },
      actions: [{ to: '/quiz', label: { en: '✋ Hand Quiz', id: '✋ Kuis Tangan' } }],
    });
  }
  return out;
}
