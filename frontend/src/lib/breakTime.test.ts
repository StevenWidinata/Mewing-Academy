import { describe, expect, it } from 'vitest';
import { breakDue, endBreak, isOnBreak, tick } from './breakTime';

describe('break reminder', () => {
  it('is due only when a limit is set and reached', () => {
    expect(breakDue(14 * 60_000, 15)).toBe(false);
    expect(breakDue(15 * 60_000, 15)).toBe(true);
    expect(breakDue(99 * 60_000, 0)).toBe(false);
  });

  it('starts a break after enough play and restarts the clock after it', () => {
    endBreak();
    tick(14 * 60_000, 15);
    expect(isOnBreak()).toBe(false);
    tick(60_000, 15);
    expect(isOnBreak()).toBe(true);
    tick(60_000, 15); // no counting during the break
    endBreak();
    expect(isOnBreak()).toBe(false);
    tick(60_000, 15);
    expect(isOnBreak()).toBe(false);
  });
});
