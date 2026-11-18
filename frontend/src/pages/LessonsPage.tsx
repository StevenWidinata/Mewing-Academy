import { WorldMap } from '../components/WorldMap';
import { useSettings } from '../state/settings';

export function LessonsPage() {
  const { tr, settings } = useSettings();
  const en = settings.lang === 'en';
  return (
    <section>
      <h1>🗺️ {tr('navLessons')}</h1>
      <p style={{ fontFamily: 'var(--font-read)' }}>
        {en
          ? 'Pick an island to learn, then play the Hand Quiz to practice! Get 5 right answers in a topic to plant your flag 🚩.'
          : 'Pilih pulau untuk belajar, lalu main Kuis Tangan untuk berlatih! Dapatkan 5 jawaban benar di satu topik untuk menancapkan bendera 🚩.'}
      </p>
      <WorldMap />
      <p className="chip" style={{ fontFamily: 'var(--font-read)', marginTop: '0.5rem' }}>
        {settings.lang === 'en'
          ? '★★★ Score 80% or more in a quiz round to earn the Easy, Medium and Hard stars of an island!'
          : '★★★ Dapatkan nilai 80% atau lebih dalam satu ronde kuis untuk bintang Mudah, Sedang, dan Sulit di setiap pulau!'}
      </p>
    </section>
  );
}
