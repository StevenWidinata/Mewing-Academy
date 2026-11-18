import { Link } from 'react-router-dom';
import { Mewy } from '../components/Mewy';
import { StickerBook } from '../components/StickerBook';
import { FURS, ITEM_UNLOCK, ITEMS, correctIn, isFurUnlocked, isItemUnlocked, topicTitle } from '../state/rewards';
import { useProgress } from '../state/progress';
import { useSettings } from '../state/settings';

/** Small progress bar under a locked reward. */
function MiniBar({ have, need }: { have: number; need: number }) {
  return (
    <span className="mini-bar" aria-hidden="true">
      <span style={{ width: `${Math.min(100, (have / need) * 100)}%` }} />
    </span>
  );
}

export function ClosetPage() {
  const { settings, set, tr } = useSettings();
  const progress = useProgress();
  const L = settings.lang;

  return (
    <section>
      <h1>👕 {tr('navCloset')}</h1>
      <p style={{ fontFamily: 'var(--font-read)' }}>
        {L === 'en'
          ? 'Answer questions to unlock FREE outfits and fur colors for Mewy! Tap a 🔒 to go and earn it.'
          : 'Jawab soal untuk membuka baju dan warna bulu GRATIS untuk Mewy! Ketuk 🔒 untuk mulai mengumpulkannya.'}
      </p>

      <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', alignItems: 'flex-start' }}>
        <div className="hero" style={{ flex: '0 0 220px' }}>
          <Mewy size={170} mood="happy" />
          <p style={{ fontFamily: 'var(--font-read)', margin: '0.5rem 0 0' }}>⭐ {progress.stars}</p>
        </div>

        <div style={{ flex: '1 1 320px', display: 'grid', gap: '1.5rem' }}>
          <div className="card">
            <h2 style={{ fontSize: '0.95rem' }}>{tr('closetItems')}</h2>
            <div className="closet-grid">
              <button
                type="button"
                className="btn btn--ghost closet-tile"
                aria-pressed={settings.mewyItem === null}
                onClick={() => set('mewyItem', null)}
                style={{ outline: settings.mewyItem === null ? '4px solid var(--accent)' : undefined }}
              >
                ✖ {tr('closetNone')}
              </button>
              {ITEMS.map((it) => {
                const open = isItemUnlocked(progress, it.id);
                const active = settings.mewyItem === it.id;
                if (!open) {
                  const have = Math.min(ITEM_UNLOCK, correctIn(progress, it.topic));
                  const topic = topicTitle(it.topic, L);
                  const to = it.topic === 'memory' ? '/memory' : `/quiz?topic=${it.topic}`;
                  const how = L === 'en' ? `${have}/${ITEM_UNLOCK} ✔ in ${topic}` : `${have}/${ITEM_UNLOCK} ✔ di ${topic}`;
                  return (
                    <Link
                      key={it.id}
                      to={to}
                      className="btn btn--ghost closet-tile closet-tile--locked"
                      aria-label={`${it.name[L]}, ${tr('closetLocked')}: ${how}. ${tr('closetPlay')}`}
                    >
                      <div style={{ fontSize: '1.6rem' }}>🔒</div>
                      <div>{it.name[L]}</div>
                      <MiniBar have={have} need={ITEM_UNLOCK} />
                      <div className="closet-how">{how}</div>
                      <div className="closet-go">▶ {tr('closetPlay')}</div>
                    </Link>
                  );
                }
                return (
                  <button
                    key={it.id}
                    type="button"
                    className="btn closet-tile"
                    aria-pressed={active}
                    onClick={() => set('mewyItem', it.id)}
                    style={{ outline: active ? '4px solid var(--accent)' : undefined }}
                  >
                    <div style={{ fontSize: '1.6rem' }}>{it.emoji}</div>
                    <div>{it.name[L]}</div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="card">
            <h2 style={{ fontSize: '0.95rem' }}>{tr('closetFur')}</h2>
            <div className="closet-grid">
              {FURS.map((f) => {
                const open = isFurUnlocked(progress, f.id);
                const active = settings.mewyFur === f.id;
                if (!open) {
                  const how = `${L === 'en' ? 'Earn' : 'Kumpulkan'} ⭐ ${f.stars}`;
                  return (
                    <Link
                      key={f.id}
                      to="/daily"
                      className="btn btn--ghost closet-tile closet-tile--locked"
                      aria-label={`${f.name[L]}, ${tr('closetLocked')}: ${how} (${progress.stars}/${f.stars}). ${tr('closetPlay')}`}
                    >
                      <span className="closet-fur-locked">
                        <Mewy size={44} fur={f.id} item={null} title={f.name[L]} />
                        <span aria-hidden="true">🔒</span>
                      </span>
                      <div>{f.name[L]}</div>
                      <MiniBar have={progress.stars} need={f.stars} />
                      <div className="closet-how">
                        {how} ({progress.stars}/{f.stars})
                      </div>
                      <div className="closet-go">▶ {tr('navDaily')}</div>
                    </Link>
                  );
                }
                return (
                  <button
                    key={f.id}
                    type="button"
                    className="btn btn--ghost closet-tile"
                    aria-pressed={active}
                    onClick={() => set('mewyFur', f.id)}
                    style={{ outline: active ? '4px solid var(--accent)' : undefined }}
                  >
                    <Mewy size={44} fur={f.id} item={null} title={f.name[L]} />
                    <div>{f.name[L]}</div>
                  </button>
                );
              })}
            </div>
          </div>

          <StickerBook />
        </div>
      </div>
    </section>
  );
}
