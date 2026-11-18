import type { ComponentType } from 'react';
import type { FigureConfig, FigureId } from '../../../../shared/lessons';
import { Apples, Clock, Corners, Hopper, Pattern, TenFrame, Week } from './numbers';

/** Props every lesson figure gets: optional per-lesson settings (e.g. the target time). */
export interface FigureProps {
  config?: FigureConfig;
}

/** Interactive lesson figures by id; topics without one simply skip "Try it yourself!". */
export const FIGURES: Partial<Record<FigureId, ComponentType<FigureProps>>> = {
  tenframe: TenFrame,
  apples: Apples,
  hopper: Hopper,
  clock: Clock,
  week: Week,
  pattern: Pattern,
  corners: Corners,
};

export const hasFigure = (id: FigureId) => !!FIGURES[id];
