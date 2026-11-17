import { useCallback, useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { sfx } from '../lib/sound';
import { useProgress } from '../state/progress';
import { useSettings } from '../state/settings';
import { FunBackground } from './FunBackground';
import { useCardTilt } from './useCardTilt';
import { useMusic } from '../lib/useMusic';
import { MusicButton, PawTrail } from './FunExtras';
import { WatcherMewy } from './WatcherMewy';
import { Mewy } from './Mewy';
import { RewardToast } from './RewardToast';
import { TitleScreen } from './TitleScreen';
import { MobileMenu, NavBar } from './NavBar';

const STARTED_KEY = 'mewing.started';

export function Layout() {
  const { tr, settings, set } = useSettings();
  const { stars } = useProgress();
  useCardTilt();
  useMusic();
  const [started, setStarted] = useState(() => sessionStorage.getItem(STARTED_KEY) === '1');
  const start = useCallback(() => {
    sessionStorage.setItem(STARTED_KEY, '1');
    sfx.star(settings.sound);
    setStarted(true);
  }, [settings.sound]);

  if (!started) return <TitleScreen onStart={start} />;

  return (
    <>
    <FunBackground />
    <div className="app-shell" style={{ maxWidth: 1100, margin: '0 auto', padding: '1rem' }}>
      <a href="#main" className="btn skip-link">{tr('skipToContent')}</a>

      <header className="site-header">
        <NavLink to="/" className="site-header__brand">
          <Mewy size={56} />
          <span>
            <span className="site-header__name">{tr('appName')}</span>
            <span className="chip site-header__tagline">{tr('tagline')}</span>
          </span>
        </NavLink>

        <div className="site-header__tools">
          <MusicButton />
          <span className="pixel-panel site-header__stars" aria-label={`${stars} ${tr('progressTotal')}`}>
            ⭐ {stars}
          </span>
          <button
            type="button"
            className="btn btn--secondary site-header__lang"
            onClick={() => set('lang', settings.lang === 'en' ? 'id' : 'en')}
            aria-label={tr('settingsLang')}
          >
            {settings.lang === 'en' ? '🇬🇧 EN' : '🇮🇩 ID'}
          </button>
          <MobileMenu />
        </div>
      </header>

      <NavBar />

      <main id="main" tabIndex={-1}>
        <Outlet />
      </main>
      <RewardToast />
      <WatcherMewy />
      <PawTrail />

      <footer className="site-footer">
        <p><span className="chip">{tr('cameraPrivacy')}</span></p>
        <p>
          <span className="chip"><NavLink to="/parents">👪 {tr('navParents')}</NavLink></span>
        </p>
        <p><span className="chip">Mewing Academy · 2026</span></p>
      </footer>
    </div>
    </>
  );
}
