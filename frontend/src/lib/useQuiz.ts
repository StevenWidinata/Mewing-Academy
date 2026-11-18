import { useCallback, useEffect, useRef, useState } from 'react';
import type { Question } from '../../../shared/types';
import { recordAnswer, recordSession, trackMistake } from '../state/progress';
import type { Answer } from './boss';
import { buildSession, type SessionMode } from './sessions';
import { sfx } from './sound';
import { useSettings } from '../state/settings';

export interface QuizState {
  index: number;
  picked: number | null;
  correctCount: number;
  done: boolean;
  /** Right answers in a row (combo meter). */
  streak: number;
  /** One entry per answered question: true = right. */
  results: boolean[];
  /** Same order as results, with answer time and a saved random roll (boss damage/taunts). */
  answers: Answer[];
  /** The choice picked for each answered question (for the round recap). */
  picks: number[];
}

const START: QuizState = { index: 0, picked: null, correctCount: 0, done: false, streak: 0, results: [], answers: [], picks: [] };

/**
 * Side effects (saving progress, sounds, onFinish) run in the event handler,
 * never inside a setState updater: React StrictMode calls updaters twice,
 * which used to count every answer twice in dev.
 */
export function useQuiz(questions: Question[], onFinish?: (correct: number, total: number) => void, mode: SessionMode = 'quiz') {
  const { settings } = useSettings();
  const [state, setState] = useState<QuizState>(START);

  const current = questions[state.index];

  // When the current question appeared, to measure how fast it was answered.
  const shownAt = useRef(0);
  useEffect(() => {
    shownAt.current = performance.now();
  }, [state.index, state.done]);

  const pick = useCallback(
    (choice: number, byHand = false) => {
      if (state.picked != null || state.done) return;
      const q = questions[state.index];
      const correct = choice === q.answer;
      recordAnswer(q.topic, correct, byHand);
      trackMistake(q, correct);
      if (correct) sfx.correct(settings.sound);
      else sfx.wrong(settings.sound);
      setState({
        ...state,
        picked: choice,
        correctCount: state.correctCount + (correct ? 1 : 0),
        streak: correct ? state.streak + 1 : 0,
        results: [...state.results, correct],
        answers: [...state.answers, { correct, ms: performance.now() - shownAt.current, roll: Math.random(), byHand }],
        picks: [...state.picks, choice],
      });
    },
    [questions, settings.sound, state],
  );

  const next = useCallback(() => {
    if (state.done) return;
    if (state.index >= questions.length - 1) {
      sfx.star(settings.sound);
      recordSession(
        buildSession(
          mode,
          questions.map((q, i) => ({ topic: q.topic, difficulty: q.difficulty, correct: !!state.answers[i]?.correct, byHand: !!state.answers[i]?.byHand })),
        ),
      );
      onFinish?.(state.correctCount, questions.length);
      setState({ ...state, done: true });
    } else {
      setState({ ...state, index: state.index + 1, picked: null });
    }
  }, [questions, onFinish, settings.sound, state, mode]);

  const restart = useCallback(() => setState(START), []);

  return { state, current, pick, next, restart, total: questions.length };
}
