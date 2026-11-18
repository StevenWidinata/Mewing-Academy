import { describe, expect, it } from 'vitest';
import { getLessons, LESSONS, type LessonTopic } from '../../shared/lessons';
import { QUIZ_TOPICS } from '../../shared/questions';

const RICH = QUIZ_TOPICS as readonly LessonTopic[];

describe('lessons', () => {
  it('has at least 3 modules for every quiz topic, with bilingual content', () => {
    for (const topic of QUIZ_TOPICS) {
      const modules = getLessons(topic as LessonTopic);
      expect(modules.length, topic).toBeGreaterThanOrEqual(3);
      for (const m of modules) {
        expect(m.title.en.length).toBeGreaterThan(0);
        expect(m.title.id.length).toBeGreaterThan(0);
        expect(m.goal.en.length).toBeGreaterThan(0);
        expect(m.steps.length).toBeGreaterThanOrEqual(1);
        for (const s of m.steps) {
          expect(s.text.en.length).toBeGreaterThan(0);
          expect(s.text.id.length).toBeGreaterThan(0);
        }
      }
    }
  });

  it('every topic teaches step by step with visuals, mistakes and a quick check', () => {
    for (const topic of RICH) {
      for (const m of getLessons(topic)) {
        const where = `${topic}/${m.id}`;
        expect(m.steps.length, where).toBeGreaterThanOrEqual(2);
        for (const s of m.steps) expect(Boolean(s.visual?.length || s.emoji), `${where} step needs a picture`).toBe(true);
        expect(m.mistakes?.length ?? 0, where).toBeGreaterThanOrEqual(1);
        expect(m.mistakes!.length, where).toBeLessThanOrEqual(2);
        for (const x of m.mistakes!) for (const t of [x.wrong, x.right, x.why]) expect(t.en && t.id, where).toBeTruthy();
        const c = m.check!;
        expect(c, where).toBeDefined();
        expect(c.prompt.en && c.prompt.id, where).toBeTruthy();
        expect(c.choices.length, where).toBeGreaterThanOrEqual(2);
        expect(c.choices.length, where).toBeLessThanOrEqual(4);
        expect(c.answer, where).toBeGreaterThanOrEqual(0);
        expect(c.answer, where).toBeLessThan(c.choices.length);
        expect(m.tryIt?.figure, `${where} needs a "Try it yourself!" figure`).toBeTruthy();
        expect(m.tryIt!.prompt.en && m.tryIt!.prompt.id, where).toBeTruthy();
        const labels = c.choices.map((x) => x.en);
        expect(new Set(labels).size, `${where} duplicate choices`).toBe(labels.length);
      }
    }
  });

  it('covers exactly the six quiz topics', () => {
    expect(Object.keys(LESSONS).sort()).toEqual([...QUIZ_TOPICS].sort());
  });
});
