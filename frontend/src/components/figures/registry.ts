import type { ComponentType } from 'react';
import type { FigureConfig, FigureId } from '../../../../shared/lessons';

/** Props every lesson figure gets: optional per-lesson settings (e.g. the target time). */
export interface FigureProps {
  config?: FigureConfig;
}

/** Interactive lesson figures by id; topics without one simply skip "Try it yourself!". */
export const FIGURES: Partial<Record<FigureId, ComponentType<FigureProps>>> = {};

export const hasFigure = (id: FigureId) => !!FIGURES[id];
