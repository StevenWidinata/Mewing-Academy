import { useState } from 'react';
import { Link } from 'react-router-dom';
import type { Text } from '../../../shared/types';
import { BagStrip } from '../components/BagStrip';
import { Mewy } from '../components/Mewy';
import { StickerBook } from '../components/StickerBook';
import { MewyAge } from '../components/MewyAge';
import { stageFor } from '../lib/mewyStage';
import { BAG_ITEMS, type Bag, type BagKind } from '../lib/bag';
import { sfx } from '../lib/sound';
import { buy, useProgress } from '../state/progress';
import { FURS, ITEMS, canAfford, earnPath, isFurUnlocked, isItemUnlocked, missingFor, type ShopTier } from '../state/rewards';
import { useSettings } from '../state/settings';

const TIER: Record<ShopTier, Text> = {
  cheap: { en: 'Starter', id: 'Pemula' },
  medium: { en: 'Cool', id: 'Keren' },
  special: { en: '★ Special', id: '★ Spesial' },
};

/** Price chips: green when you have enough of that item, red when you need more. */
function Price({ price, bag }: { price: Bag; bag: Bag }) {
  const { settings } = useSettings();
  return (
    <span className="price">
      {(Object.entries(price) as [BagKind, number][]).map(([k, n]) => (
        <span key={k} className={`price__chip${(bag[k] ?? 0) >= n ? ' is-ok' : ''}`} title={BAG_ITEMS[k].name[settings.lang]}>
          {BAG_ITEMS[k].emoji} {Math.min(bag[k] ?? 0, n)}/{n}
        </span>
      ))}
    </span>
  );
}

interface CardProps {
  shopKey: string;
  picture: React.ReactNode;
  name: Text;
  tier?: ShopTier;
  price: Bag;
  owned: boolean;
  wearing: boolean;
  onWear: () => void;
}

/** One shop card: wear it if owned, buy it (with an "are you sure?" step), or see what is missing. */
function ShopCard({ shopKey, picture, name, tier, price, owned, wearing, onWear }: CardProps) {
  const { tr, settings } = useSettings();
  const { bag } = useProgress();
  const L = settings.lang;
  const [confirm, setConfirm] = useState(false);
  const affordable = canAfford(bag, price);
  const missing = Object.entries(missingFor(bag, price)) as [BagKind, number][];
  const free = Object.keys(price).length === 0;

  const doBuy = () => {
    if (buy(shopKey)) {
      sfx.star(settings.sound);
      onWear();
    }
    setConfirm(false);
  };

  return (
    <div className={`shop-card${owned ? ' is-owned' : ''}${wearing ? ' is-wearing' : ''}`}>
      {tier && <span className={`shop-card__tier shop-card__tier--${tier}`}>{TIER[tier][L]}</span>}
      <div className="shop-card__pic">{picture}</div>
      <div className="shop-card__name">{name[L]}</div>
      {owned || free ? (
        <button type="button" className={`btn ${wearing ? '' : 'btn--ghost'} shop-card__btn`} aria-pressed={wearing} onClick={onWear}>
          {wearing ? `✓ ${tr('shopWearing')}` : tr('shopWear')}
        </button>
      ) : confirm ? (
        <div className="shop-card__confirm" role="group" aria-label={tr('shopSure')}>
          <span>{tr('shopSure')}</span>
          <Price price={price} bag={bag} />
          <div className="shop-card__row">
            <button type="button" className="btn shop-card__btn" onClick={doBuy}>{tr('shopYes')}</button>
            <button type="button" className="btn btn--ghost shop-card__btn" onClick={() => setConfirm(false)}>{tr('shopNotNow')}</button>
          </div>
        </div>
      ) : (
        <>
          <Price price={price} bag={bag} />
          {affordable ? (
            <button type="button" className="btn shop-card__btn" onClick={() => setConfirm(true)}>🛍️ {tr('shopBuy')}</button>
          ) : (
            <div className="shop-card__need">
              {missing.map(([k, n]) => (
                <Link key={k} to={earnPath(k)} className="shop-card__earn">
                  {tr('shopNeed')} {n} {BAG_ITEMS[k].emoji} ▶
                </Link>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export function ClosetPage() {
  const { settings, set, tr } = useSettings();
  const progress = useProgress();
  const L = settings.lang;
  const tiers: ShopTier[] = ['cheap', 'medium', 'special'];

  return (
    <section>
      <h1>👕 {tr('navCloset')}</h1>
      <p style={{ fontFamily: 'var(--font-read)' }}>{tr('shopIntro')}</p>

      <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', alignItems: 'flex-start' }}>
        <div className="hero" style={{ flex: '0 0 220px' }}>
          <Mewy size={160} mood="happy" stage={stageFor(progress.bestStreak).id} />
          <p style={{ fontFamily: 'var(--font-read)', margin: '0.5rem 0 0' }}>⭐ {progress.stars}</p>
          <MewyAge showMewy={false} />
        </div>

        <div style={{ flex: '1 1 320px', display: 'grid', gap: '1.5rem', minWidth: 0 }}>
          <BagStrip />

          <div className="card">
            <h2 style={{ fontSize: '0.95rem' }}>{tr('closetItems')}</h2>
            <button
              type="button"
              className="btn btn--ghost"
              aria-pressed={settings.mewyItem === null}
              onClick={() => set('mewyItem', null)}
              style={{ fontSize: '0.6rem', marginBottom: '0.75rem', outline: settings.mewyItem === null ? '4px solid var(--accent)' : undefined }}
            >
              ✖ {tr('closetNone')}
            </button>
            {tiers.map((tier) => (
              <div key={tier} className="shop-grid">
                {ITEMS.filter((it) => it.tier === tier).map((it) => (
                  <ShopCard
                    key={it.id}
                    shopKey={`item:${it.id}`}
                    picture={<Mewy size={52} item={it.id} title={it.name[L]} />}
                    name={it.name}
                    tier={tier}
                    price={it.price}
                    owned={isItemUnlocked(progress, it.id)}
                    wearing={settings.mewyItem === it.id}
                    onWear={() => set('mewyItem', it.id)}
                  />
                ))}
              </div>
            ))}
          </div>

          <div className="card">
            <h2 style={{ fontSize: '0.95rem' }}>{tr('closetFur')}</h2>
            <div className="shop-grid">
              {FURS.map((f) => (
                <ShopCard
                  key={f.id}
                  shopKey={`fur:${f.id}`}
                  picture={<Mewy size={52} fur={f.id} item={null} title={f.name[L]} />}
                  name={f.name}
                  price={f.price}
                  owned={isFurUnlocked(progress, f.id)}
                  wearing={settings.mewyFur === f.id}
                  onWear={() => set('mewyFur', f.id)}
                />
              ))}
            </div>
          </div>

          <StickerBook />
        </div>
      </div>
    </section>
  );
}
