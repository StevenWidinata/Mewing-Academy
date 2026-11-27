import { describe, expect, it } from 'vitest';
import { restoredDefaults, type Settings } from './settings';

const changed: Settings = {
  lang: 'id',
  theme: 'sunset',
  highContrast: true,
  reduceMotion: true,
  readableFont: true,
  textSize: 'xlarge',
  sound: false,
  sfxVolume: 0.2,
  autoRead: true,
  speechRate: 'fast',
  music: true,
  musicVolume: 1,
  pawCursor: false,
  mewyFur: 'calico',
  mewyItem: null,
  roundSize: 15,
  cameraTutorialDone: true,
  holdSpeed: 'slow',
  bossBattles: false,
  hints: false,
  colorLetters: true,
  confirmLeave: false,
  breakMinutes: 20,
};

describe('restoredDefaults', () => {
  it('resets the Settings page preferences', () => {
    expect(restoredDefaults(changed)).toMatchObject({
      theme: 'sky',
      highContrast: false,
      textSize: 'normal',
      sound: true,
      sfxVolume: 1,
      speechRate: 'normal',
      music: false,
      holdSpeed: 'normal',
      bossBattles: true,
      hints: true,
      colorLetters: false,
      confirmLeave: true,
    });
  });

  it('keeps the language, closet items, camera practice and parent settings', () => {
    expect(restoredDefaults(changed)).toMatchObject({ lang: 'id', mewyFur: 'calico', mewyItem: null, cameraTutorialDone: true, roundSize: 15, breakMinutes: 20 });
  });
});
