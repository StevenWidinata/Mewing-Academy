import { Link } from 'react-router-dom';
import { nextStep } from '../lib/nextStep';
import { today, useProgress } from '../state/progress';
import { useSettings } from '../state/settings';

/** Home: the one thing Mewy suggests doing next. */
export function NextStepCard() {
  const { tr, settings } = useSettings();
  const p = useProgress();
  const L = settings.lang;
  const step = nextStep({ byTopic: p.byTopic, lastDaily: p.lastDaily, mistakes: p.mistakes.length, levelStars: p.levelStars, today: today() });
  return (
    <Link to={step.to} className="card card--link next-step">
      <span className="next-step__label chip">👉 {tr('nextStepLabel')}</span>
      <span className="next-step__row">
        <span className="next-step__emoji tile-emoji" aria-hidden="true">{step.emoji}</span>
        <span className="next-step__text">
          <span className="next-step__title">{step.title[L]}</span>
          <span className="next-step__sub">{step.text[L]}</span>
        </span>
        <span className="btn next-step__go" aria-hidden="true">▶ {tr('nextStepGo')}</span>
      </span>
    </Link>
  );
}
