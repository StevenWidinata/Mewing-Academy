import { BAG_ITEMS, BAG_KINDS, type Bag } from '../lib/bag';
import { useProgress } from '../state/progress';
import { useSettings } from '../state/settings';

/** "🎒 My bag": every item the child has, with counts. */
export function BagStrip() {
  const { tr, settings } = useSettings();
  const { bag } = useProgress();
  const have = BAG_KINDS.filter((k) => (bag[k] ?? 0) > 0);
  return (
    <div className="card bag">
      <h2 className="bag__title">🎒 {tr('bagTitle')}</h2>
      {have.length === 0 ? (
        <p className="bag__empty">{tr('bagEmpty')}</p>
      ) : (
        <ul className="bag__list">
          {have.map((k) => (
            <li key={k} className="bag__item" title={BAG_ITEMS[k].name[settings.lang]}>
              <span aria-hidden="true">{BAG_ITEMS[k].emoji}</span>
              <span className="bag__count">×{bag[k]}</span>
              <span className="sr-only">{BAG_ITEMS[k].name[settings.lang]}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/** End-of-round "You got +2 🧮 Calculator!" banner. */
export function LootBanner({ loot }: { loot: Bag | null }) {
  const { tr, settings } = useSettings();
  const items = (Object.entries(loot ?? {}) as [keyof typeof BAG_ITEMS, number][]).filter(([, n]) => n > 0);
  if (!items.length) return null;
  return (
    <div className="loot pop" role="status">
      <span className="loot__label">🎁 {tr('lootTitle')}</span>
      {items.map(([k, n]) => (
        <span key={k} className="loot__item">
          <span aria-hidden="true">{BAG_ITEMS[k].emoji}</span> +{n} {BAG_ITEMS[k].name[settings.lang]}
        </span>
      ))}
    </div>
  );
}
