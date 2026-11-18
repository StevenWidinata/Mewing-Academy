import { nextStage, stageFor } from '../lib/mewyStage';
import { useProgress } from '../state/progress';
import { useSettings } from '../state/settings';
import { Mewy } from './Mewy';

/** "Mewy's age": the current stage and how far to the next one. */
export function MewyAge({ showMewy = true }: { showMewy?: boolean }) {
  const { tr, settings } = useSettings();
  const { bestStreak, streak } = useProgress();
  const L = settings.lang;
  const stage = stageFor(bestStreak);
  const next = nextStage(bestStreak);
  const from = stage.min;
  const pct = next ? Math.round(((bestStreak - from) / (next.min - from)) * 100) : 100;
  return (
    <div className="mewy-age">
      {showMewy && <Mewy size={72} mood="happy" stage={stage.id} />}
      <div className="mewy-age__body">
        <strong className="mewy-age__name">
          {stage.emoji} {stage.name[L]}
        </strong>
        <span className="mini-bar mewy-age__bar" aria-hidden="true">
          <span style={{ width: `${pct}%` }} />
        </span>
        <span className="mewy-age__next">
          {next
            ? tr('mewyAgeNext')
                .replace('{stage}', `${next.emoji} ${next.name[L]}`)
                .replace('{n}', String(next.min))
                .replace('{b}', String(bestStreak))
                .replace('{c}', String(streak))
            : tr('mewyAgeTop')}
        </span>
      </div>
    </div>
  );
}
