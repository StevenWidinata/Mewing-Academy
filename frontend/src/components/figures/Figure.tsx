import type { FigureConfig, FigureId } from '../../../../shared/lessons';
import { FIGURES } from './registry';

/** Renders a lesson figure by id (nothing if it is not available). */
export function Figure({ id, config }: { id: FigureId; config?: FigureConfig }) {
  const Comp = FIGURES[id];
  return Comp ? (
    <div className="figure">
      <Comp config={config} />
    </div>
  ) : null;
}
