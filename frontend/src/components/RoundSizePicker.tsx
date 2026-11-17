import { ROUND_SIZES } from '../state/roundSize';
import { useSettings } from '../state/settings';

/** 5 / 10 / 15 questions per Hand Quiz round (remembered in settings). */
export function RoundSizePicker() {
  const { tr, settings, set } = useSettings();
  return (
    <div style={{ marginTop: '1.25rem' }}>
      <p id="round-size-label" style={{ fontFamily: 'var(--font-read)', fontWeight: 700, margin: '0 0 0.5rem' }}>
        {tr('roundSize')}
      </p>
      <div role="group" aria-labelledby="round-size-label" style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
        {ROUND_SIZES.map((n) => {
          const active = settings.roundSize === n;
          return (
            <button
              key={n}
              type="button"
              className="btn"
              aria-pressed={active}
              onClick={() => set('roundSize', n)}
              style={{ background: active ? 'var(--pink)' : 'var(--btn-ghost)', color: active ? 'var(--ink)' : 'var(--btn-ghost-text)', fontSize: '0.75rem', minWidth: 64 }}
            >
              {n}
            </button>
          );
        })}
      </div>
    </div>
  );
}
