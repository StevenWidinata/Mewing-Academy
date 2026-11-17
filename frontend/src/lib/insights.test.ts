import { describe, expect, it } from 'vitest';
import type { Difficulty, TopicId } from '../../../shared/types';
import { activityByDay, buildInsights, summarizeTopic, topicHistory } from './insights';
import type { SessionLog } from './sessions';

const s = (at: string, topic: TopicId, correct: number, total: number, difficulty: Difficulty | null = 1, byHand = 0): SessionLog => ({
  at: `${at}T10:00:00.000Z`,
  mode: 'quiz',
  difficulty,
  correct,
  total,
  byHand,
  topics: { [topic]: { correct, total } },
});
const name = (t: TopicId) => ({ en: t, id: t });

describe('activityByDay', () => {
  it('fills every day of the window, oldest first', () => {
    const days = activityByDay([s('2026-11-10', 'math', 3, 5), s('2026-11-10', 'math', 4, 5), s('2026-11-01', 'math', 1, 5)], '2026-11-12', 3);
    expect(days.map((d) => d.date)).toEqual(['2026-11-10', '2026-11-11', '2026-11-12']);
    expect(days[0]).toEqual({ date: '2026-11-10', sessions: 2, questions: 10, correct: 7 });
    expect(days[1].sessions).toBe(0);
  });
});

describe('topicHistory', () => {
  it('keeps only sessions with that topic', () => {
    const h = topicHistory([s('2026-11-01', 'math', 2, 4), s('2026-11-02', 'colors', 5, 5)], 'math');
    expect(h).toHaveLength(1);
    expect(h[0].accuracy).toBe(0.5);
  });
});

describe('summarizeTopic', () => {
  it('calls a topic new until it has enough answers', () => {
    expect(summarizeTopic('math', { correct: 3, total: 4 }, []).standing).toBe('new');
  });

  it('spots a downward trend even when the total looks fine', () => {
    const hist = [s('2026-11-01', 'math', 5, 5), s('2026-11-02', 'math', 5, 5), s('2026-11-03', 'math', 2, 5, 2), s('2026-11-04', 'math', 2, 5, 2), s('2026-11-05', 'math', 2, 5, 2)];
    const sum = summarizeTopic('math', { correct: 16, total: 25 }, hist);
    expect(sum.trend).toBe('down');
    expect(sum.standing).toBe('weak');
    expect(sum.highestLevel).toBe(2);
  });

  it('marks strong topics and the best level cleared', () => {
    const hist = [s('2026-11-01', 'colors', 5, 5, 1), s('2026-11-02', 'colors', 9, 10, 2)];
    const sum = summarizeTopic('colors', { correct: 14, total: 15 }, hist);
    expect(sum.standing).toBe('strong');
    expect(sum.clearedLevel).toBe(2);
  });
});

describe('buildInsights', () => {
  it('suggests practice for weak topics and a next level for strong ones', () => {
    const weak = summarizeTopic('math', { correct: 2, total: 10 }, [s('2026-11-01', 'math', 2, 10)]);
    const strong = summarizeTopic('colors', { correct: 10, total: 10 }, [s('2026-11-01', 'colors', 10, 10, 1)]);
    const out = buildInsights([weak, strong], [], name, 0);
    expect(out[0]).toMatchObject({ kind: 'focus', topic: 'math' });
    expect(out[0].actions.map((a) => a.to)).toEqual(['/lessons/math', '/quiz?topic=math']);
    expect(out[1]).toMatchObject({ kind: 'strength', topic: 'colors' });
    expect(out[1].text.en).toContain('Medium');
  });

  it('nudges after a few days off and when the camera is rarely used', () => {
    const sessions = [s('2026-11-01', 'math', 10, 20, 1, 2)];
    const kinds = buildInsights([], sessions, name, 5).map((i) => i.title.en);
    expect(kinds).toEqual(['No play for 5 days', 'Mostly tapping']);
  });
});
