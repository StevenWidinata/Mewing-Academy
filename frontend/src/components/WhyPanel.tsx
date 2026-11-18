import { useState } from 'react';
import { Link } from 'react-router-dom';
import type { Question, Text, TopicId } from '../../../shared/types';
import { useSettings } from '../state/settings';
import { LETTERS } from './ChoiceGrid';
import { SpriteScene } from './Sprite';

const T = (en: string, id: string): Text => ({ en, id });

/** One "how to think about it" tip per topic. */
const TIPS: Partial<Record<TopicId, Text>> = {
  counting: T('Touch each thing once as you count. The last number you say is how many.', 'Sentuh tiap benda sekali saat berhitung. Angka terakhir adalah jumlahnya.'),
  math: T('Plus puts groups together; minus takes some away. Count the apples below!', 'Tambah menggabungkan kelompok; kurang mengambil sebagian. Hitung apel di bawah!'),
  skipcount: T('Find the jump between two numbers, then make the same jump again.', 'Temukan loncatan antara dua angka, lalu loncat dengan jumlah yang sama lagi.'),
  time: T('The short hand shows the hour. The long hand on 12 means o’clock, on 6 means half past.', 'Jarum pendek menunjukkan jam. Jarum panjang di 12 artinya jam tepat, di 6 artinya setengah.'),
  patterns: T('Say the pattern out loud and find the part that repeats.', 'Ucapkan polanya keras-keras dan temukan bagian yang berulang.'),
  colors: T('Red, yellow and blue mix to make new colors.', 'Merah, kuning, dan biru bisa dicampur menjadi warna baru.'),
  shapes: T('Count the straight sides and the pointy corners.', 'Hitung sisi lurus dan sudut lancipnya.'),
  letters: T('Say the word slowly and listen to the very first sound.', 'Ucapkan katanya pelan-pelan dan dengarkan bunyi pertamanya.'),
  opposites: T('An opposite means the very different thing, like hot and cold.', 'Lawan kata artinya hal yang sangat berbeda, seperti panas dan dingin.'),
  animals: T('Think about where the animal lives, what it eats and how it moves.', 'Pikirkan di mana hewan itu tinggal, apa makanannya, dan bagaimana ia bergerak.'),
  food: T('Fruits grow from flowers and have seeds; vegetables are other plant parts.', 'Buah tumbuh dari bunga dan berbiji; sayur adalah bagian tanaman lainnya.'),
  body: T('Eyes see, ears hear, nose smells, tongue tastes, skin feels.', 'Mata melihat, telinga mendengar, hidung mencium, lidah mengecap, kulit meraba.'),
  feelings: T('Look at the face and think: how would I feel?', 'Lihat wajahnya dan pikirkan: bagaimana perasaanku?'),
  weather: T('Look at the sky and think about what you would wear.', 'Lihat langit dan pikirkan pakaian apa yang cocok.'),
  transport: T('Does it go on land, on water, or in the sky?', 'Apakah ia bergerak di darat, di air, atau di udara?'),
  space: T('The Sun is a star; 8 planets go around it, and the Moon goes around Earth.', 'Matahari adalah bintang; 8 planet mengelilinginya, dan Bulan mengelilingi Bumi.'),
  memory: T('Next time, say what you see out loud while you look: it helps you remember.', 'Lain kali, sebutkan yang kamu lihat keras-keras saat melihat: itu membantu mengingat.'),
};

/** For sums: "3 + 2" drawn as apples. */
function SumPicture({ prompt }: { prompt: string }) {
  const m = prompt.match(/(\d+)\s*([+\-−])\s*(\d+)/);
  if (!m) return null;
  const a = Number(m[1]);
  const b = Number(m[3]);
  if (a > 12 || b > 12) return null;
  const minus = m[2] !== '+';
  return (
    <p className="why__pic" aria-hidden="true">
      {minus ? (
        <>
          {'🍎'.repeat(Math.max(0, a - b))}
          <span className="why__gone">{'🍎'.repeat(Math.min(a, b))}</span>
        </>
      ) : (
        <>
          {'🍎'.repeat(a)} + {'🍏'.repeat(b)}
        </>
      )}
    </p>
  );
}

/** For number patterns: the jumps between the numbers. */
function JumpPicture({ prompt }: { prompt: string }) {
  const nums = (prompt.match(/\d+/g) ?? []).map(Number);
  if (nums.length < 3) return null;
  const step = nums[1] - nums[0];
  if (!step || nums.some((n, i) => i > 0 && n - nums[i - 1] !== step)) return null;
  return (
    <p className="why__jumps" aria-hidden="true">
      {nums.map((n, i) => (
        <span key={i}>
          {i > 0 && <small className="why__step">{step > 0 ? `+${step}` : step}</small>}
          <span className="why__num">{n}</span>
        </span>
      ))}
      <small className="why__step">{step > 0 ? `+${step}` : step}</small>
      <span className="why__num is-next">?</span>
    </p>
  );
}

/** "🔍 Why?" after a quiz answer: opens by itself after a wrong answer. */
export function WhyPanel({ question, wrong }: { question: Question; wrong: boolean }) {
  const { tr, settings } = useSettings();
  const L = settings.lang;
  const [open, setOpen] = useState(wrong);
  const good = question.choices[question.answer];
  const tip = TIPS[question.topic];
  const prompt = question.prompt.en;
  return (
    <div className="why">
      <button type="button" className="btn btn--ghost why__btn" aria-expanded={open} onClick={() => setOpen((v) => !v)}>
        🔍 {tr('whyBtn')}
      </button>
      {open && (
        <div className="why__panel">
          <p className="why__answer">
            ✅ {tr('recapRight')}: {LETTERS[question.answer]}. {good.label[L]}
          </p>
          {question.topic === 'math' && <SumPicture prompt={prompt} />}
          {(question.topic === 'skipcount' || question.topic === 'patterns' || question.topic === 'counting') && <JumpPicture prompt={prompt} />}
          {question.visual && !(question.topic === 'math' && /\d+\s*[+\-−]\s*\d+/.test(prompt)) && (
            <div className="why__visual">
              <SpriteScene groups={question.visual} size={32} />
            </div>
          )}
          {tip && <p className="why__tip">🧠 {tip[L]}</p>}
          {question.topic !== 'memory' && (
            <Link to={`/lessons/${question.topic}`} className="why__link">
              📚 {tr('whyLesson')}
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
