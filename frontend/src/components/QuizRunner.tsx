import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { Question } from '../../../shared/types';
import { questionToSpeech, speak } from '../lib/speak';
import { useQuiz } from '../lib/useQuiz';
import type { SessionMode } from '../lib/sessions';
import { useSettings } from '../state/settings';
import { BossBar, BossPortrait, ComboPop } from './Boss';
import { bossState } from '../lib/boss';
import { BOSSES, bossTaunt, pickBoss, pickSecondBoss, readLastBoss, saveLastBoss } from '../lib/bosses';
import { earnSticker } from '../state/progress';
import { hasNumberLabels } from '../vision/fingers';
import type { VisionStatus } from '../vision/useVision';
import { AnswerModeHint } from './AnswerModeHint';
import { QuizProgress } from './QuizProgress';
import { RoundRecap } from './RoundRecap';
import { WhyPanel } from './WhyPanel';
import { LeaveRoundGuard } from './LeaveRoundGuard';
import { HINTS_PER_ROUND, pickHiddenChoice } from '../lib/hint';
import { LootBanner } from './BagStrip';
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
  // 💡 Hint: crosses out one wrong answer, HINTS_PER_ROUND times a round.
  const [hintsLeft, setHintsLeft] = useState(HINTS_PER_ROUND);
  const [hint, setHint] = useState<{ index: number; choice: number } | null>(null);
  const hiddenChoice = hint && hint.index === state.index ? hint.choice : null;
  const pickByHand = useCallback((i: number) => i !== hiddenChoice && pick(i, true), [pick, hiddenChoice]);
  const pickByTap = useCallback((i: number) => i !== hiddenChoice && pick(i), [pick, hiddenChoice]);
  const takeHint = () => {
    const choice = pickHiddenChoice(current, Math.random());
    if (choice == null || hintsLeft <= 0) return;
    setHint({ index: state.index, choice });
    setHintsLeft((n) => n - 1);
  };
  const restartRound = useCallback(() => {
    setHintsLeft(HINTS_PER_ROUND);
    setHint(null);
    restart();
  }, [restart]);
  const [hover, setHover] = useState<{ index: number | null; progress: number }>({ index: null, progress: 0 });
  const onHover = useCallback((index: number | null, progress: number) => setHover({ index, progress }), []);
  const [camStatus, setCamStatus] = useState<VisionStatus>('idle');
  const tapEnabled = camStatus !== 'running';
  const difficulties = useMemo(() => questions.map((q) => q.difficulty), [questions]);
  const fight = useMemo(() => bossState(difficulties, state.answers), [difficulties, state.answers]);
  // A random boss each round (never the same twice in a row) and a different face boss for phase 2.
  const [bossIds] = useState(() => {
    const main = pickBoss(readLastBoss());
    return { main, second: pickSecondBoss(main) };
  });
  useEffect(() => {
    if (boss) saveLastBoss(bossIds.main);
  }, [boss, bossIds.main]);
  const mainBoss = BOSSES[bossIds.main];
  const secondBoss = BOSSES[bossIds.second];

  // Sticker book: beating the boss (and both bosses) at the end of a round.
  useEffect(() => {
    if (!boss || !state.done) return;
    if (fight.bigBossBeaten) earnSticker('boss-ko');
    if (fight.phase === 2 && fight.defeated) earnSticker('double-win');
  }, [boss, state.done, fight]);

  // Keyboard: 1-4 or A-D also answer, for kids without a camera.
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (!tapEnabled || state.picked != null || state.done || (e.target as HTMLElement)?.tagName === 'INPUT') return;
      const map: Record<string, number> = { '1': 0, '2': 1, '3': 2, '4': 3, a: 0, b: 1, c: 2, d: 3 };
      const idx = map[e.key.toLowerCase()];
      if (idx != null && idx < current.choices.length && idx !== hiddenChoice) pick(idx);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [tapEnabled, state.picked, state.done, current, pick, hiddenChoice]);

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
              <BossPortrait boss={mainBoss} width={fight.bigBossBeaten ? 72 : 96} face={fight.bigBossBeaten ? 'hurt' : 'smug'} ko={fight.bigBossBeaten} />
              {fight.phase === 2 && <BossPortrait boss={secondBoss} width={fight.defeated ? 56 : 72} face={fight.defeated ? 'hurt' : 'smug'} ko={fight.defeated} />}
            </div>
            <p style={{ fontFamily: 'var(--font-pixel)', fontSize: '0.8rem' }}>
              {!fight.bigBossBeaten
                ? lang === 'en' ? `${mainBoss.name.en} got away... try again!` : `${mainBoss.name.id} kabur... coba lagi!`
                : fight.phase === 2 && fight.defeated
                  ? lang === 'en'
                    ? `🏆🏆 DOUBLE WIN! ${mainBoss.name.en} and ${secondBoss.name.en} defeated!`
                    : `🏆🏆 MENANG GANDA! ${mainBoss.name.id} dan ${secondBoss.name.id} dikalahkan!`
                  : fight.phase === 2
                    ? lang === 'en'
                      ? `🏆 ${mainBoss.name.en} DEFEATED! (${secondBoss.name.en} ran away)`
                      : `🏆 ${mainBoss.name.id} DIKALAHKAN! (${secondBoss.name.id} kabur)`
                    : lang === 'en' ? `🏆 ${mainBoss.name.en} DEFEATED!` : `🏆 ${mainBoss.name.id} DIKALAHKAN!`}
            </p>
            {fight.bigBossBeaten && <p className="chip" style={{ fontFamily: 'var(--font-read)' }}>💬 {(fight.phase === 2 && fight.defeated ? secondBoss : mainBoss).ko[lang]}</p>}
          </div>
        )}
        <LootBanner loot={state.loot} />
        {renderDone(state.correctCount, total, restartRound)}
        <RoundRecap questions={questions} picks={state.picks} showFix={mode !== 'review'} />
      </section>
    );
  }

  const revealed = state.picked != null;
  const mood = !revealed ? 'think' : state.picked === current.answer ? 'happy' : 'sad';
  const comboShake = revealed && state.picked === current.answer && state.streak >= 3 && !settings.reduceMotion;
  return (
    <section className={comboShake ? 'shake' : undefined}>
      <LeaveRoundGuard active={state.answers.length > 0} />
      <QuizProgress index={state.index} total={total} results={state.results} stars={state.correctCount} />

      {boss && (
        <BossBar
          state={fight}
          main={mainBoss}
          second={secondBoss}
          reaction={!revealed ? 'none' : state.picked === current.answer ? 'hit' : 'miss'}
          answerKey={state.answers.length}
          taunt={revealed ? bossTaunt(fight.phase === 2 ? secondBoss : mainBoss, state.answers[state.answers.length - 1]?.roll ?? 0)[lang] : undefined}
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
          blockedChoice={hiddenChoice}
          onHover={onHover}
          paused={revealed}
          numericChoices={hasNumberLabels(current.choices.map((c) => c.label[lang]))}
          onStatusChange={setCamStatus}
        />
        <div>
          <AnswerModeHint tapEnabled={tapEnabled} />
          <ChoiceGrid choices={current.choices} hovered={hover.index} holdProgress={hover.progress} picked={state.picked} answer={current.answer} onPick={pickByTap} tapEnabled={tapEnabled} hiddenChoice={hiddenChoice} />
          {settings.hints && !revealed && current.choices.length > 2 && (
            <div style={{ textAlign: 'center', marginTop: '0.8rem' }}>
              <button type="button" className="btn btn--ghost hint-btn" onClick={takeHint} disabled={hintsLeft <= 0 || hiddenChoice != null}>
                💡 {tr('hint')} × {hintsLeft}
              </button>
            </div>
          )}
          {revealed && (
            <div style={{ textAlign: 'center', marginTop: '1rem' }}>
              <p style={{ fontFamily: 'var(--font-read)', fontSize: '1.1rem' }}>
                {state.picked === current.answer ? `✅ ${tr('correct')}` : `❌ ${tr('notQuite')}`}
                {current.explain && ` — ${current.explain[lang]}`}
              </p>
              <WhyPanel key={state.index} question={current} wrong={state.picked !== current.answer} />
              <button type="button" className="btn" onClick={next} autoFocus>{tr('next')}</button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
