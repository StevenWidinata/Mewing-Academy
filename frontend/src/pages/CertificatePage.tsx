import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import type { TopicId } from '../../../shared/types';
import { Mewy } from '../components/Mewy';
import { useProgress } from '../state/progress';
import { BADGES, correctIn, topicTitle } from '../state/rewards';
import { useSettings } from '../state/settings';

const NAME_KEY = 'mewing.certName';
const GOLD = BADGES.find((b) => b.tier === 'gold')!;

function savedName(): string {
  try {
    return localStorage.getItem(NAME_KEY) ?? '';
  } catch {
    return '';
  }
}

/** Printable certificate for a topic with the gold badge. */
export function CertificatePage() {
  const { tr, settings } = useSettings();
  const { topic = '' } = useParams();
  const progress = useProgress();
  const [name, setName] = useState(savedName);
  const [printedOn] = useState(() => new Date());
  const L = settings.lang;
  const title = topicTitle(topic, L);
  const correct = correctIn(progress, topic as TopicId);
  const earned = correct >= GOLD.need;

  const changeName = (v: string) => {
    setName(v);
    try {
      localStorage.setItem(NAME_KEY, v);
    } catch {
      /* private mode: the name just is not remembered */
    }
  };

  const date = printedOn.toLocaleDateString(L === 'en' ? 'en-GB' : 'id-ID', { day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <section>
      <h1>📜 {tr('certTitle')}</h1>
      {!earned ? (
        <div className="card">
          <p style={{ fontFamily: 'var(--font-read)', fontSize: '1.1rem', marginTop: 0 }}>
            🥇 {tr('certNotYet').replace('{n}', String(GOLD.need - correct)).replace('{topic}', title)}
          </p>
          <Link to="/progress" className="btn btn--ghost">{tr('certBack')}</Link>
        </div>
      ) : (
        <>
          <div className="cert-tools">
            <label className="cert-tools__name">
              <span>{tr('certNameLabel')}</span>
              <input type="text" value={name} maxLength={40} placeholder={tr('certNamePlaceholder')} onChange={(e) => changeName(e.target.value)} />
            </label>
            <button type="button" className="btn" onClick={() => window.print()}>
              🖨️ {tr('certPrint')}
            </button>
            <Link to="/progress" className="btn btn--ghost">{tr('certBack')}</Link>
          </div>

          <article className="certificate" aria-label={tr('certTitle')}>
            <div className="certificate__inner">
              <div className="certificate__medal" aria-hidden="true">🥇</div>
              <h2 className="certificate__title">{tr('certTitle')}</h2>
              <p className="certificate__line">{tr('certGivenTo')}</p>
              <p className="certificate__name">{name.trim() || '__________'}</p>
              <p className="certificate__line">{tr('certFor').replace('{topic}', title).replace('{n}', String(correct))}</p>
              <div className="certificate__foot">
                <span className="certificate__date">{date}</span>
                <span className="certificate__sign">
                  <Mewy size={56} mood="happy" />
                  <span>{tr('certSign')}</span>
                </span>
              </div>
              <p className="certificate__brand">{tr('appName')}</p>
            </div>
          </article>
        </>
      )}
    </section>
  );
}
