import { INTENTS, type Intent } from './facts';

/** Normalise -> tokenise -> fuzzy keyword matching -> intent. */

export function tokenize(text: string): string[] {
  return text.toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g, '').match(/\p{L}+/gu) ?? [];
}

/** Classic edit distance, used so "elefant" still matches "elephant". */
export function levenshtein(a: string, b: string): number {
  const dp = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    let prev = dp[0];
    dp[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const tmp = dp[j];
      dp[j] = Math.min(dp[j] + 1, dp[j - 1] + 1, prev + (a[i - 1] === b[j - 1] ? 0 : 1));
      prev = tmp;
    }
  }
  return dp[b.length];
}

const wordMatches = (word: string, kw: string) => {
  if (word === kw) return true;
  if (kw.length < 5 || word.length < 4) return false;
  return levenshtein(word, kw) <= (kw.length >= 7 ? 2 : 1);
};

// "what", "can", "do", "apa", "bisa" are weak words: they only win when nothing specific matched.
const WEAK = new Set(['what', 'can', 'do', 'apa', 'bisa']);

export function matchIntent(text: string): { intent: Intent | null; confidence: number } {
  const words = tokenize(text);
  if (!words.length) return { intent: null, confidence: 0 };
  let best: Intent | null = null;
  let bestScore = 0;
  for (const intent of INTENTS) {
    let score = 0;
    for (const w of words) {
      const kw = intent.keywords.find((k) => wordMatches(w, k));
      if (kw) score += WEAK.has(kw) ? 0.3 : 1;
    }
    if (score > bestScore) {
      bestScore = score;
      best = intent;
    }
  }
  if (bestScore < 0.5) return { intent: null, confidence: 0 };
  return { intent: best, confidence: Math.min(1, 0.5 + bestScore / 4) };
}
