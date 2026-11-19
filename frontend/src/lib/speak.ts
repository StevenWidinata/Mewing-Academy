import type { Lang, Question } from '../../../shared/types';

// Read-aloud with the browser's built-in speech engine (no extra libraries).
export const canSpeak = typeof window !== 'undefined' && 'speechSynthesis' in window;

const EMOJI = /\p{Extended_Pictographic}/gu;

export type SpeechRate = 'slow' | 'normal' | 'fast';
export const SPEECH_RATES: SpeechRate[] = ['slow', 'normal', 'fast'];
const RATE: Record<SpeechRate, number> = { slow: 0.7, normal: 0.9, fast: 1.15 };
// From the "Read-aloud speed" setting (set by SettingsProvider).
let rate = RATE.normal;

export function setSpeechRate(r: SpeechRate) {
  rate = RATE[r] ?? RATE.normal;
}

export function speak(text: string, lang: Lang) {
  if (!canSpeak) return;
  const synth = window.speechSynthesis;
  synth.cancel();
  const u = new SpeechSynthesisUtterance(text.replace(EMOJI, ''));
  u.lang = lang === 'id' ? 'id-ID' : 'en-US';
  u.rate = rate;
  const voice = synth.getVoices().find((v) => v.lang.toLowerCase().startsWith(lang));
  if (voice) u.voice = voice;
  synth.speak(u);
}

export function questionToSpeech(q: Question, lang: Lang): string {
  const letters = ['A', 'B', 'C', 'D'];
  return `${q.prompt[lang]} ... ${q.choices.map((c, i) => `${letters[i]}: ${c.label[lang]}`).join('. ')}`;
}
