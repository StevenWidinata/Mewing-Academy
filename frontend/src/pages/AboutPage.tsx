import { Link } from 'react-router-dom';
import type { Text } from '../../../shared/types';
import { Mewy } from '../components/Mewy';
import { useSettings } from '../state/settings';

const T = (en: string, id: string): Text => ({ en, id });

const HEAD = {
  title: T('Learn by playing!', 'Belajar sambil bermain!'),
  lead: T(
    'Mewing Academy turns school basics into games you play with your own hands. Count with your fingers, beat the boss, and learn something new every day.',
    'Mewing Academy mengubah pelajaran dasar menjadi permainan yang dimainkan dengan tanganmu sendiri. Berhitung dengan jari, kalahkan bos, dan pelajari hal baru setiap hari.',
  ),
  doTitle: T('What you can do', 'Apa yang bisa kamu lakukan'),
  whoTitle: T('Who it is for', 'Untuk siapa'),
  whoLead: T('Everyone is welcome! It was made first for kids aged 4 to 10, and also for:', 'Semua orang boleh main! Dibuat terutama untuk anak usia 4 sampai 10 tahun, dan juga untuk:'),
  whyTitle: T('Why games help you learn', 'Kenapa bermain membantu belajar'),
  safeTitle: T('Safe and private', 'Aman dan pribadi'),
  safe: T(
    'No sign-up, no ads, free forever. The camera runs only on this device; no video is sent or saved. Your stars are kept on this device too.',
    'Tanpa daftar, tanpa iklan, gratis selamanya. Kamera hanya berjalan di perangkat ini; video tidak dikirim atau disimpan. Bintangmu juga disimpan di perangkat ini.',
  ),
  ctaTitle: T('Ready to play?', 'Siap bermain?'),
  ctaPlay: T('Start playing', 'Mulai bermain'),
  ctaLearn: T('Open the lessons', 'Buka pelajaran'),
};

const DO: { to: string; emoji: string; title: Text; text: Text }[] = [
  { to: '/quiz', emoji: '✋', title: T('Beat the boss with your fingers', 'Kalahkan bos dengan jarimu'), text: T('Show 1 to 4 fingers to the camera to answer and knock out Muddle!', 'Tunjukkan 1 sampai 4 jari ke kamera untuk menjawab dan kalahkan Muddle!') },
  { to: '/lessons', emoji: '📚', title: T('Learn step by step', 'Belajar langkah demi langkah'), text: T('Short lessons with pictures, read-aloud and a quick check.', 'Pelajaran singkat dengan gambar, dibacakan, dan cek cepat.') },
  { to: '/memory', emoji: '🧠', title: T('Train your memory', 'Latih ingatanmu'), text: T('Look closely, remember, then answer.', 'Lihat baik-baik, ingat, lalu jawab.') },
  { to: '/tutor', emoji: '💬', title: T('Ask Mewy anything', 'Tanya Mewy apa saja'), text: T('How many legs does a spider have? Mewy knows!', 'Laba-laba kakinya berapa? Mewy tahu!') },
  { to: '/closet', emoji: '👕', title: T('Dress up Mewy', 'Dandani Mewy'), text: T('Win free hats, glasses and fur colors.', 'Dapatkan topi, kacamata, dan warna bulu gratis.') },
  { to: '/daily', emoji: '🔥', title: T('Keep your streak', 'Jaga hari beruntunmu'), text: T('Play a little every day for bonus stars.', 'Main sedikit setiap hari untuk bintang bonus.') },
];

const WHO: { emoji: string; title: Text; text: Text }[] = [
  { emoji: '🧒', title: T('Kids 4 to 10', 'Anak 4 sampai 10 tahun'), text: T('Big buttons, friendly words and no reading needed to start.', 'Tombol besar, kata-kata ramah, dan bisa mulai tanpa harus lancar membaca.') },
  { emoji: '👪', title: T('Parents', 'Orang tua'), text: T('A PIN-locked corner shows progress, strengths and what to practice next.', 'Pojok berkunci PIN menunjukkan progres, kekuatan, dan apa yang perlu dilatih.') },
  { emoji: '🍎', title: T('Teachers', 'Guru'), text: T('Use lessons and quizzes in class, one topic at a time.', 'Pakai pelajaran dan kuis di kelas, satu topik setiap kali.') },
  { emoji: '🌏', title: T('Language learners', 'Pelajar bahasa'), text: T('Switch between English and Indonesian any time.', 'Ganti antara bahasa Inggris dan Indonesia kapan saja.') },
  { emoji: '♿', title: T('Kids who need options', 'Anak yang butuh pilihan khusus'), text: T('High contrast, calm mode, big text, an easy-to-read font, read-aloud, and tapping when the camera cannot be used.', 'Kontras tinggi, mode tenang, teks besar, huruf mudah dibaca, dibacakan, dan bisa mengetuk saat kamera tidak bisa dipakai.') },
];

const WHY: { emoji: string; title: Text; text: Text }[] = [
  { emoji: '🎮', title: T('Play makes practice fun', 'Bermain bikin latihan seru'), text: T('When it feels like a game, you want to practice more, and practice is how brains grow.', 'Kalau terasa seperti permainan, kamu ingin latihan lebih banyak, dan latihan membuat otak tumbuh.') },
  { emoji: '⚡', title: T('You learn right away', 'Langsung tahu benar atau salah'), text: T('Every answer gets a quick reply, so mistakes turn into lessons straight away.', 'Setiap jawaban langsung dapat tanggapan, jadi kesalahan langsung jadi pelajaran.') },
  { emoji: '🖐️', title: T('Moving helps remembering', 'Bergerak membantu mengingat'), text: T('Using your hands and body while you think helps the ideas stick.', 'Memakai tangan dan tubuh sambil berpikir membantu ide lebih mudah diingat.') },
  { emoji: '⭐', title: T('Small wins build confidence', 'Kemenangan kecil menumbuhkan percaya diri'), text: T('Stars, badges and outfits show how far you have come.', 'Bintang, lencana, dan pakaian menunjukkan sejauh mana kamu sudah berkembang.') },
];

export function AboutPage() {
  const { settings } = useSettings();
  const L = settings.lang;
  return (
    <section className="about">
      <div className="hero about__hero">
        <div className="blink" style={{ display: 'inline-block' }}>
          <Mewy size={96} mood="happy" />
        </div>
        <h1 style={{ fontSize: '1.5rem' }}>{HEAD.title[L]}</h1>
        <p className="about__lead">{HEAD.lead[L]}</p>
      </div>

      <h2>{HEAD.doTitle[L]}</h2>
      <div className="about__grid">
        {DO.map((d) => (
          <Link key={d.to} to={d.to} className="card card--link about__card">
            <span className="about__emoji tile-emoji pop" aria-hidden="true">{d.emoji}</span>
            <span className="about__card-title">{d.title[L]}</span>
            <span className="about__card-text">{d.text[L]}</span>
          </Link>
        ))}
      </div>

      <h2>{HEAD.whoTitle[L]}</h2>
      <p className="about__text">{HEAD.whoLead[L]}</p>
      <div className="about__grid">
        {WHO.map((w) => (
          <div key={w.emoji} className="card about__card">
            <span className="about__emoji" aria-hidden="true">{w.emoji}</span>
            <span className="about__card-title">{w.title[L]}</span>
            <span className="about__card-text">{w.text[L]}</span>
          </div>
        ))}
      </div>

      <h2>{HEAD.whyTitle[L]}</h2>
      <div className="about__why">
        {WHY.map((w) => (
          <div key={w.emoji} className="about__why-item">
            <span className="about__why-emoji" aria-hidden="true">{w.emoji}</span>
            <div>
              <h3 className="about__card-title" style={{ margin: 0 }}>{w.title[L]}</h3>
              <p className="about__card-text" style={{ margin: '0.25rem 0 0' }}>{w.text[L]}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="card about__safe">
        <h2 style={{ fontSize: '0.95rem', marginTop: 0 }}>🔒 {HEAD.safeTitle[L]}</h2>
        <p className="about__text" style={{ margin: 0 }}>{HEAD.safe[L]}</p>
      </div>

      <div className="card about__cta">
        <h2 style={{ marginTop: 0 }}>{HEAD.ctaTitle[L]}</h2>
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/quiz" className="btn">▶ {HEAD.ctaPlay[L]}</Link>
          <Link to="/lessons" className="btn btn--secondary">📚 {HEAD.ctaLearn[L]}</Link>
        </div>
      </div>
    </section>
  );
}
