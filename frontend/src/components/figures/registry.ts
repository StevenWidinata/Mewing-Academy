import type { ComponentType } from 'react';
import type { FigureConfig, FigureId } from '../../../../shared/lessons';
import { Apples, Clock, Corners, Hopper, Pattern, TenFrame, Week } from './numbers';
import { BodyMap, Faces, Legs, Letters, Mixer, Planets, Plate, Seesaw, Vehicles, Weather } from './world';

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
  mixer: Mixer,
  legs: Legs,
  letters: Letters,
  plate: Plate,
  bodymap: BodyMap,
  weather: Weather,
  vehicles: Vehicles,
  seesaw: Seesaw,
  faces: Faces,
  planets: Planets,
};

export const hasFigure = (id: FigureId) => !!FIGURES[id];
