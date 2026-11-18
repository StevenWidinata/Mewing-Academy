import { STICKERS } from '../lib/stickers';
import { useProgress } from '../state/progress';
import { useSettings } from '../state/settings';

/** Closet section: every sticker, earned ones in color, locked ones with how to earn them. */
export function StickerBook() {
  const { tr, settings } = useSettings();
  const { stickers } = useProgress();
  const L = settings.lang;
  return (
    <div className="card">
      <h2 style={{ fontSize: '0.95rem' }}>
        📒 {tr('stickerBook')} <span className="chip" style={{ fontFamily: 'var(--font-read)', fontSize: '0.85rem' }}>{stickers.length} / {STICKERS.length}</span>
      </h2>
      <ul className="stickers">
        {STICKERS.map((s) => {
          const got = stickers.includes(s.id);
          return (
            <li key={s.id} className={`sticker${got ? ' is-got' : ''}`}>
              <span className="sticker__emoji" aria-hidden="true">{got ? s.emoji : '❔'}</span>
              <span className="sticker__name">{s.name[L]}</span>
              <span className="sticker__how">{got ? `✅ ${tr('stickerGot')}` : s.how[L]}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
