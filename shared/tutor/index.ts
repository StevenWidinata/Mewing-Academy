import type { Lang, TutorReply } from '../types';
import { FALLBACK, PRIVACY } from './facts';
import { matchIntent } from './match';

export { levenshtein, matchIntent, tokenize } from './match';

/**
 * Kid-safe tutor: a small NLP pipeline (normalise -> tokenise -> fuzzy keyword
 * matching -> intent) plus a tiny arithmetic solver. Deterministic and offline
 * on purpose: every answer is pre-written and age-appropriate. A real LLM can
 * replace `matchIntent` later behind the same TutorReply shape.
 */

export const MAX_MESSAGE_LENGTH = 300;

const PRIVACY_RE =
  /\b(address|phone|password|where i live|my school|alamat|nomor (hp|telepon|telpon)|kata sandi|sandi|rumahku|sekolahku)\b/i;

const NUMBER_WORDS: Record<string, string> = { plus: '+', tambah: '+', minus: '-', kurang: '-', times: '*', kali: '*', x: '*', '×': '*', bagi: '/', ':': '/', '÷': '/' };
const MATH_RE = /(-?\d{1,6})\s*(\+|-|\*|\/|x|×|÷|:|plus|minus|times|tambah|kurang|kali|bagi)\s*(-?\d{1,6})/i;

function solveMath(text: string, lang: Lang): string | null {
  const m = text.match(MATH_RE);
  if (!m) return null;
  const a = Number(m[1]);
  const b = Number(m[3]);
  const op = NUMBER_WORDS[m[2].toLowerCase()] ?? m[2];
  if (op === '/' && b === 0) {
    return lang === 'en'
      ? 'We cannot share things into 0 groups, so dividing by 0 does not work!'
      : 'Kita tidak bisa membagi ke 0 kelompok, jadi tidak bisa dibagi 0!';
  }
  const result = op === '+' ? a + b : op === '-' ? a - b : op === '*' ? a * b : a / b;
  const shown = Number.isInteger(result) ? String(result) : result.toFixed(1);
  const sym = op === '*' ? '×' : op === '/' ? '÷' : op;
  let tip = '';
  if (op === '+' && a >= 0 && b >= 0 && result <= 10) {
    tip = lang === 'en' ? ` Picture it: ${'🍎'.repeat(a)} + ${'🍎'.repeat(b)}` : ` Bayangkan: ${'🍎'.repeat(a)} + ${'🍎'.repeat(b)}`;
  }
  return lang === 'en' ? `${a} ${sym} ${b} = ${shown}!${tip}` : `${a} ${sym} ${b} = ${shown}!${tip}`;
}

export function tutorReply(message: string, lang: Lang): TutorReply {
  const text = message.slice(0, MAX_MESSAGE_LENGTH);
  if (PRIVACY_RE.test(text)) return { reply: PRIVACY[lang], intent: 'privacy', confidence: 1 };
  const math = solveMath(text, lang);
  if (math) return { reply: math, intent: 'math', confidence: 1 };
  const { intent, confidence } = matchIntent(text);
  if (!intent) return { reply: FALLBACK[lang], intent: 'unknown', confidence: 0 };
  return { reply: intent.reply[lang], intent: intent.id, confidence };
}
