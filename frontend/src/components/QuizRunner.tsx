import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { Question } from '../../../shared/types';
import { questionToSpeech, speak } from '../lib/speak';
import { useQuiz } from '../lib/useQuiz';
import type { SessionMode } from '../lib/sessions';
import { useSettings } from '../state/settings';
import { BossBar, BossSprite, ComboPop } from './Boss';
import { bossState, tauntFor } from '../lib/boss';
import { hasNumberLabels } from '../vision/fingers';
import type { VisionStatus } from '../vision/useVision';
import { AnswerModeHint } from './AnswerModeHint';
import { QuizProgress } from './QuizProgress';
import { CameraStage } from './CameraStage';
import { ChoiceGrid } from './ChoiceGrid';
import { Confetti } from './Confetti';
import { MewyBuddy } from './MewyBuddy';
import { SpeakButton } from './SpeakButton';
import { SpriteScene } from './Sprite';

interface Props {
  questions: Question[];
  onFinish?: (correct: number, total: number) => void;
  renderDone: (correct: number, total: number, restart: () => void) => ReactNode;
  /** Show a boss with an HP bar that right answers knock down. */
  boss?: boolean;
  /** How this round is saved in the play history. */
  mode?: SessionMode;
}

/** Plays a list of questions (camera, tap or keyboard). Shared by Hand Quiz and Daily Challenge. */
export function QuizRunner({ questions, onFinish, renderDone, boss = false, mode = 'quiz' }: Props) {
  const { tr, settings } = useSettings();
  const lang = settings.lang;
  const { state, current, pick, next, restart, total } = useQuiz(questions, onFinish, mode);
  const pickByHand = useCallback((i: number) => pick(i, true), [pick]);
  const pickByTap = useCallback((i: number) => pick(i), [pick]);
  const [hover, setHover] = useState<{ index: number | null; progress: number }>({ index: null, progress: 0 });
  const onHover = useCallback((index: number | null, progress: number) => setHover({ index, progress }), []);
  const [camStatus, setCamStatus] = useState<VisionStatus>('idle');
  const tapEnabled = camStatus !== 'running';
  const difficulties = useMemo(() => questions.map((q) => q.difficulty), [questions]);
  const fight = useMemo(() => bossState(difficulties, state.answers), [difficulties, state.answers]);

  // Keyboard: 1-4 or A-D also answer, for kids without a camera.
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (!tapEnabled || state.picked != null || state.done || (e.target as HTMLElement)?.tagName === 'INPUT') return;
      const map: Record<string, number> = { '1': 0, '2': 1, '3': 2, '4': 3, a: 0, b: 1, c: 2, d: 3 };
      const idx = map[e.key.toLowerCase()];
      if (idx != null && idx < current.choices.length) pick(idx);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [tapEnabled, state.picked, state.done, current, pick]);

  // Optional auto read-aloud of each new question.
  useEffect(() => {
    if (settings.autoRead && !state.done && current) speak(questionToSpeech(current, lang), lang);
  }, [settings.autoRead, state.done, current, lang]);

  if (state.done) {
    return (
      <section style={{ textAlign: 'center' }}>
        <Confetti fire={state.correctCount >= Math.ceil(total / 2) ? state.correctCount : 0} />
        {boss && (
          <div className="boss-result">
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end' }}>
              <BossSprite size={fight.bigBossBeaten ? 56 : 88} face={fight.bigBossBeaten ? 'hurt' : 'smug'} />
              {fight.phase === 2 && <BossSprite size={fight.defeated ? 36 : 56} face={fight.defeated ? 'hurt' : 'smug'} mini />}
            </div>
            <p style={{ fontFamily: 'var(--font-pixel)', fontSize: '0.8rem' }}>
              {!fight.bigBossBeaten
                ? lang === 'en' ? 'The boss got away... try again!' : 'Bosnya kabur... coba lagi!'
                : fight.phase === 2 && fight.defeated
                  ? lang === 'en' ? '🏆🏆 DOUBLE WIN! Both bosses defeated!' : '🏆🏆 MENANG GANDA! Dua bos dikalahkan!'
                  : fight.phase === 2
                    ? lang === 'en' ? '🏆 BOSS DEFEATED! (Mini Muddle ran away)' : '🏆 BOS DIKALAHKAN! (Bingung Kecil kabur)'
                    : lang === 'en' ? '🏆 BOSS DEFEATED!' : '🏆 BOS DIKALAHKAN!'}
            </p>
          </div>
        )}
        {renderDone(state.correctCount, total, restart)}
      </section>
    );
  }

  const revealed = state.picked != null;
  const mood = !revealed ? 'think' : state.picked === current.answer ? 'happy' : 'sad';
  const comboShake = revealed && state.picked === current.answer && state.streak >= 3 && !settings.reduceMotion;
  return (
    <section className={comboShake ? 'shake' : undefined}>
      <QuizProgress index={state.index} total={total} results={state.results} stars={state.correctCount} />

      {boss && (
        <BossBar
          state={fight}
          reaction={!revealed ? 'none' : state.picked === current.answer ? 'hit' : 'miss'}
          answerKey={state.answers.length}
          taunt={revealed ? tauntFor(state.answers[state.answers.length - 1]?.roll ?? 0)[lang] : undefined}
          lang={lang}
          reduceMotion={settings.reduceMotion}
        />
      )}
      <MewyBuddy mood={mood} />
      {revealed && state.picked === current.answer && <ComboPop streak={state.streak} />}
      <h2 style={{ textAlign: 'center' }}>
        {current.prompt[lang]} <SpeakButton text={questionToSpeech(current, lang)} small />
      </h2>
      {current.emoji && <div className="pixel-panel big-emoji">{current.emoji}</div>}
      {current.visual && (
        <div className="pixel-panel" style={{ margin: '1rem auto', maxWidth: 560 }}>
          <SpriteScene groups={current.visual} />
        </div>
      )}

      <div className="play-grid">
        <CameraStage
          choiceCount={current.choices.length}
          onConfirm={pickByHand}
          onHover={onHover}
          paused={revealed}
          numericChoices={hasNumberLabels(current.choices.map((c) => c.label[lang]))}
          onStatusChange={setCamStatus}
        />
        <div>
          <AnswerModeHint tapEnabled={tapEnabled} />
          <ChoiceGrid choices={current.choices} hovered={hover.index} holdProgress={hover.progress} picked={state.picked} answer={current.answer} onPick={pickByTap} tapEnabled={tapEnabled} />
          {revealed && (
            <div style={{ textAlign: 'center', marginTop: '1rem' }}>
              <p style={{ fontFamily: 'var(--font-read)', fontSize: '1.1rem' }}>
                {state.picked === current.answer ? `✅ ${tr('correct')}` : `❌ ${tr('notQuite')}`}
                {current.explain && ` — ${current.explain[lang]}`}
              </p>
              <button type="button" className="btn" onClick={next} autoFocus>{tr('next')}</button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
