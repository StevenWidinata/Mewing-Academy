import { useRef, type KeyboardEvent, type ReactNode } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { Lang } from '../../../shared/types';
import { SettingsHelp } from '../components/SettingsHelp';
import type { StringKey } from '../i18n/strings';
import { sfx } from '../lib/sound';
import { HOLD_MS, HOLD_SPEEDS } from '../state/holdSpeed';
import { useSettings, type TextSize, type ThemeId } from '../state/settings';

const THEMES: { id: ThemeId; name: { en: string; id: string }; swatch: string; ink: string }[] = [
  { id: 'purple', name: { en: 'Purple Night', id: 'Malam Ungu' }, swatch: 'linear-gradient(135deg,#3a2a7a,#883a7e)', ink: '#fdf6e3' },
  { id: 'sky', name: { en: 'Sky Blue', id: 'Langit Biru' }, swatch: 'linear-gradient(135deg,#7cc8f2,#c9f0ff)', ink: '#14304d' },
  { id: 'mint', name: { en: 'Mint Green', id: 'Hijau Mint' }, swatch: 'linear-gradient(135deg,#7fdca4,#dcf9e6)', ink: '#13402a' },
  { id: 'sunset', name: { en: 'Sunset Peach', id: 'Senja Persik' }, swatch: 'linear-gradient(135deg,#ffb38a,#ffe7c2)', ink: '#4a2318' },
];

const TABS = [
  { id: 'display', icon: '🖥️', label: 'tabDisplay' },
  { id: 'sound', icon: '🔊', label: 'tabSound' },
  { id: 'play', icon: '✋', label: 'tabPlay' },
  { id: 'help', icon: '❓', label: 'tabHelp' },
] as const satisfies readonly { id: string; icon: string; label: StringKey }[];
type TabId = (typeof TABS)[number]['id'];
const isTab = (v: string | null): v is TabId => TABS.some((t) => t.id === v);

/** One setting: name and a short "what does this do" line on the left, controls on the right. */
function Row({ label, desc, children }: { label: string; desc: string; children: ReactNode }) {
  return (
    <div className="pixel-panel settings-row">
      <div className="settings-row__text">
        <span className="settings-row__label">{label}</span>
        <small className="settings-row__desc">{desc}</small>
      </div>
      <div className="settings-row__controls">{children}</div>
    </div>
  );
}

function Toggle({ on, onToggle, labelOn, labelOff, label }: { on: boolean; onToggle: () => void; labelOn: string; labelOff: string; label: string }) {
  return (
    <button type="button" role="switch" aria-checked={on} aria-label={label} className="btn" onClick={onToggle} style={{ background: on ? 'var(--green)' : 'var(--btn-ghost)', color: on ? 'var(--ink)' : 'var(--btn-ghost-text)', fontSize: '0.7rem' }}>
      {on ? labelOn : labelOff}
    </button>
  );
}

/** A pick-one button inside a row (language, text size, hold speed...). */
function Choice({ active, onPick, children, fontSize = '0.7rem' }: { active: boolean; onPick: () => void; children: ReactNode; fontSize?: string }) {
  return (
    <button type="button" className="btn" aria-pressed={active} onClick={onPick} style={{ background: active ? 'var(--yellow)' : 'var(--btn-ghost)', color: active ? 'var(--ink)' : 'var(--btn-ghost-text)', fontSize }}>
      {children}
    </button>
  );
}

/** Game-style tab bar: click, or use the arrow / Home / End keys. */
function SettingsTabs({ active, onChange }: { active: TabId; onChange: (id: TabId) => void }) {
  const { tr } = useSettings();
  const refs = useRef<Partial<Record<TabId, HTMLButtonElement | null>>>({});
  const onKey = (e: KeyboardEvent) => {
    const i = TABS.findIndex((t) => t.id === active);
    const next = e.key === 'ArrowRight' ? i + 1 : e.key === 'ArrowLeft' ? i - 1 : e.key === 'Home' ? 0 : e.key === 'End' ? TABS.length - 1 : null;
    if (next == null) return;
    e.preventDefault();
    const id = TABS[(next + TABS.length) % TABS.length].id;
    onChange(id);
    refs.current[id]?.focus();
  };
  return (
    <div role="tablist" aria-label="Settings" className="settings-tabs" onKeyDown={onKey}>
      {TABS.map((t) => (
        <button
          key={t.id}
          ref={(el) => {
            refs.current[t.id] = el;
          }}
          type="button"
          role="tab"
          id={`settings-tab-${t.id}`}
          aria-selected={active === t.id}
          aria-controls={`settings-panel-${t.id}`}
          tabIndex={active === t.id ? 0 : -1}
          className={`btn settings-tab${active === t.id ? ' is-active' : ''}`}
          onClick={() => onChange(t.id)}
        >
          <span aria-hidden="true">{t.icon}</span> {tr(t.label)}
        </button>
      ))}
    </div>
  );
}

function DisplayTab() {
  const { settings, set, tr } = useSettings();
  const sizes: TextSize[] = ['normal', 'large', 'xlarge'];
  const onOff = { labelOn: tr('on'), labelOff: tr('off') };
  return (
    <>
      <Row label={tr('settingsLang')} desc={tr('settingsLangDesc')}>
        {(['en', 'id'] as Lang[]).map((l) => (
          <Choice key={l} active={settings.lang === l} onPick={() => set('lang', l)}>
            {l === 'en' ? '🇬🇧 English' : '🇮🇩 Indonesia'}
          </Choice>
        ))}
      </Row>
      <Row label={tr('settingsTheme')} desc={tr('settingsThemeDesc')}>
        {THEMES.map((th) => {
          const active = settings.theme === th.id;
          return (
            <button
              key={th.id}
              type="button"
              className="btn"
              aria-pressed={active}
              onClick={() => set('theme', th.id)}
              style={{ background: th.swatch, color: th.ink, fontSize: '0.6rem', outline: active ? '4px solid var(--accent)' : undefined, outlineOffset: 2 }}
            >
              {active ? '✓ ' : ''}
              {th.name[settings.lang]}
            </button>
          );
        })}
      </Row>
      <Row label={tr('settingsTextSize')} desc={tr('settingsTextSizeDesc')}>
        {sizes.map((s) => (
          <Choice key={s} active={settings.textSize === s} onPick={() => set('textSize', s)} fontSize={s === 'normal' ? '0.7rem' : s === 'large' ? '0.85rem' : '1rem'}>
            A
          </Choice>
        ))}
      </Row>
      <Row label={tr('settingsHighContrast')} desc={tr('settingsHighContrastDesc')}>
        <Toggle on={settings.highContrast} onToggle={() => set('highContrast', !settings.highContrast)} label={tr('settingsHighContrast')} {...onOff} />
      </Row>
      <Row label={tr('settingsReadable')} desc={tr('settingsReadableDesc')}>
        <Toggle on={settings.readableFont} onToggle={() => set('readableFont', !settings.readableFont)} label={tr('settingsReadable')} {...onOff} />
      </Row>
      <Row label={tr('settingsReduceMotion')} desc={tr('settingsReduceMotionDesc')}>
        <Toggle on={settings.reduceMotion} onToggle={() => set('reduceMotion', !settings.reduceMotion)} label={tr('settingsReduceMotion')} {...onOff} />
      </Row>
      <Row label={`🐾 ${tr('settingsPaw')}`} desc={tr('settingsPawDesc')}>
        <Toggle on={settings.pawCursor} onToggle={() => set('pawCursor', !settings.pawCursor)} label={tr('settingsPaw')} {...onOff} />
      </Row>
    </>
  );
}

function SoundTab() {
  const { settings, set, tr } = useSettings();
  const onOff = { labelOn: tr('on'), labelOff: tr('off') };
  return (
    <>
      <Row label={tr('settingsSound')} desc={tr('settingsSoundDesc')}>
        <Toggle on={settings.sound} onToggle={() => set('sound', !settings.sound)} label={tr('settingsSound')} {...onOff} />
      </Row>
      <Row label={tr('settingsSfxVolume')} desc={tr('settingsSfxVolumeDesc')}>
        <input
          type="range"
          min={0}
          max={1}
          step={0.1}
          value={settings.sfxVolume}
          disabled={!settings.sound}
          aria-label={tr('settingsSfxVolume')}
          onChange={(e) => set('sfxVolume', Number(e.target.value))}
          onPointerUp={() => sfx.correct(settings.sound)}
          onKeyUp={() => sfx.tick(settings.sound)}
          style={{ padding: 0 }}
        />
      </Row>
      <Row label={`🎵 ${tr('settingsMusic')}`} desc={tr('settingsMusicDesc')}>
        <Toggle on={settings.music} onToggle={() => set('music', !settings.music)} label={tr('settingsMusic')} {...onOff} />
      </Row>
      <Row label={tr('settingsMusicVolume')} desc={tr('settingsMusicVolumeDesc')}>
        <input
          type="range"
          min={0}
          max={1}
          step={0.1}
          value={settings.musicVolume}
          aria-label={tr('settingsMusicVolume')}
          onChange={(e) => set('musicVolume', Number(e.target.value))}
          style={{ padding: 0 }}
        />
      </Row>
      <Row label={`🔊 ${tr('settingsAutoRead')}`} desc={tr('settingsAutoReadDesc')}>
        <Toggle on={settings.autoRead} onToggle={() => set('autoRead', !settings.autoRead)} label={tr('settingsAutoRead')} {...onOff} />
      </Row>
    </>
  );
}

function PlayTab() {
  const { settings, set, tr } = useSettings();
  return (
    <>
      <Row label={`✋ ${tr('settingsHoldSpeed')}`} desc={tr('settingsHoldSpeedDesc')}>
        {HOLD_SPEEDS.map((h) => (
          <Choice key={h} active={settings.holdSpeed === h} onPick={() => set('holdSpeed', h)} fontSize="0.65rem">
            {tr(h === 'slow' ? 'holdSlow' : h === 'normal' ? 'holdNormal' : 'holdFast')} · {(HOLD_MS[h] / 1000).toFixed(1)}s
          </Choice>
        ))}
      </Row>
      <Row label={`📷 ${tr('settingsCamTutorial')}`} desc={tr('settingsCamTutorialDesc')}>
        {settings.cameraTutorialDone ? (
          <button type="button" className="btn btn--ghost" onClick={() => set('cameraTutorialDone', false)}>
            {tr('settingsCamTutorialAgain')}
          </button>
        ) : (
          <span style={{ fontFamily: 'var(--font-read)' }}>{tr('settingsCamTutorialQueued')}</span>
        )}
      </Row>
    </>
  );
}

const PANELS: Record<TabId, () => ReactNode> = {
  display: DisplayTab,
  sound: SoundTab,
  play: PlayTab,
  help: SettingsHelp,
};

export function SettingsPage() {
  const { tr } = useSettings();
  const [params, setParams] = useSearchParams();
  const raw = params.get('tab');
  const tab: TabId = isTab(raw) ? raw : 'display';
  const Panel = PANELS[tab];
  return (
    <section className="settings">
      <h1>⚙️ {tr('navSettings')}</h1>
      <SettingsTabs active={tab} onChange={(id) => setParams({ tab: id }, { replace: true })} />
      <div role="tabpanel" id={`settings-panel-${tab}`} aria-labelledby={`settings-tab-${tab}`} className="settings-panel">
        <Panel />
      </div>
    </section>
  );
}
