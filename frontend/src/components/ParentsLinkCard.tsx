import { Link } from 'react-router-dom';
import { useSettings } from '../state/settings';

/** Points grown-ups to the PIN-locked dashboard (and reset, which lives there). */
export function ParentsLinkCard() {
  const { settings, tr } = useSettings();
  const en = settings.lang === 'en';
  return (
    <div className="card" style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
      <span style={{ fontSize: '2rem' }} aria-hidden="true">👪</span>
      <p style={{ fontFamily: 'var(--font-read)', margin: 0, flex: '1 1 220px' }}>
        {en
          ? 'Grown-ups: see charts, strengths and what to practise next in the Parents & Teachers corner.'
          : 'Orang tua: lihat grafik, kekuatan, dan apa yang perlu dilatih di pojok Orang Tua & Guru.'}
      </p>
      <Link to="/parents" className="btn btn--secondary">{tr('navParents')}</Link>
    </div>
  );
}
