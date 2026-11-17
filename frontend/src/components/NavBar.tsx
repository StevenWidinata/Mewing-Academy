import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import type { StringKey } from '../i18n/strings';
import { useSettings } from '../state/settings';

interface Item {
  to: string;
  key: StringKey;
  icon: string;
}
interface Group {
  id: 'play' | 'learn' | 'me';
  key: StringKey;
  icon: string;
  items: Item[];
}

const HOME: Item = { to: '/', key: 'navHome', icon: '🏠' };
const GROWNUPS: Item = { to: '/parents', key: 'navParents', icon: '👪' };
const NAV_GROUPS: Group[] = [
  {
    id: 'play',
    key: 'navGroupPlay',
    icon: '🎮',
    items: [
      { to: '/quiz', key: 'navQuiz', icon: '✋' },
      { to: '/memory', key: 'navMemory', icon: '🧠' },
      { to: '/daily', key: 'navDaily', icon: '📅' },
    ],
  },
  {
    id: 'learn',
    key: 'navGroupLearn',
    icon: '📚',
    items: [
      { to: '/lessons', key: 'navLessons', icon: '🗺️' },
      { to: '/tutor', key: 'navTutor', icon: '💬' },
      { to: '/how-ai', key: 'navHowAi', icon: '🤖' },
      { to: '/about', key: 'navAbout', icon: 'ℹ️' },
    ],
  },
  {
    id: 'me',
    key: 'navGroupMe',
    icon: '😺',
    items: [
      { to: '/closet', key: 'navCloset', icon: '👕' },
      { to: '/progress', key: 'navProgress', icon: '⭐' },
      { to: '/settings', key: 'navSettings', icon: '⚙️' },
    ],
  },
];

const inGroup = (g: Group, path: string) => g.items.some((i) => path === i.to || path.startsWith(`${i.to}/`));

/** Moves focus between menu links with the arrow keys. */
function arrowKeys(e: KeyboardEvent<HTMLElement>) {
  if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
  const links = [...e.currentTarget.querySelectorAll<HTMLElement>('a')];
  const i = links.indexOf(document.activeElement as HTMLElement);
  const next = e.key === 'ArrowDown' ? (i + 1) % links.length : (i - 1 + links.length) % links.length;
  links[next]?.focus();
  e.preventDefault();
}

/** Desktop: one balanced bar with three dropdown groups. */
export function NavBar() {
  const { tr } = useSettings();
  const location = useLocation();
  const { pathname } = location;
  // The menu remembers the navigation it was opened on (location.key changes
  // on every navigation, even /quiz -> /quiz?topic=x), so navigating closes it.
  const [openAt, setOpenAt] = useState<{ id: Group['id']; nav: string } | null>(null);
  const open = openAt?.nav === location.key ? openAt.id : null;
  const setOpen = (id: Group['id'] | null) => setOpenAt(id ? { id, nav: location.key } : null);
  const barRef = useRef<HTMLElement | null>(null);

  // Close on outside click and Escape.
  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!barRef.current?.contains(e.target as Node)) setOpenAt(null);
    };
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'Escape') {
        document.getElementById(`nav-btn-${open}`)?.focus();
        setOpenAt(null);
      }
    };
    document.addEventListener('pointerdown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const openAndFocus = (id: Group['id']) => {
    setOpen(id);
    requestAnimationFrame(() => document.querySelector<HTMLElement>(`#nav-menu-${id} a`)?.focus());
  };

  return (
    <nav ref={barRef} aria-label="Main" className="navbar">
      <NavLink to={HOME.to} end className={({ isActive }) => `navbar__item${isActive ? ' is-active' : ''}`}>
        <span aria-hidden="true">{HOME.icon}</span> {tr(HOME.key)}
      </NavLink>

      {NAV_GROUPS.map((g) => {
        const isOpen = open === g.id;
        return (
          <div key={g.id} className="navbar__group">
            <button
              id={`nav-btn-${g.id}`}
              type="button"
              className={`navbar__item${inGroup(g, pathname) ? ' is-active' : ''}${isOpen ? ' is-open' : ''}`}
              aria-expanded={isOpen}
              aria-controls={`nav-menu-${g.id}`}
              onClick={() => setOpen(isOpen ? null : g.id)}
              onKeyDown={(e) => {
                if (e.key === 'ArrowDown') {
                  e.preventDefault();
                  openAndFocus(g.id);
                }
              }}
            >
              <span aria-hidden="true">{g.icon}</span> {tr(g.key)} <span aria-hidden="true" className="navbar__caret" />
            </button>
            {isOpen && (
              <ul id={`nav-menu-${g.id}`} className="navbar__menu" onKeyDown={arrowKeys}>
                {g.items.map((i) => (
                  <li key={i.to}>
                    <NavLink to={i.to} onClick={() => setOpenAt(null)} className={({ isActive }) => `navbar__link${isActive ? ' is-active' : ''}`}>
                      <span aria-hidden="true">{i.icon}</span> {tr(i.key)}
                    </NavLink>
                  </li>
                ))}
              </ul>
            )}
          </div>
        );
      })}

      <NavLink to={GROWNUPS.to} className={({ isActive }) => `navbar__item navbar__item--grownups${isActive ? ' is-active' : ''}`}>
        <span aria-hidden="true">{GROWNUPS.icon}</span> {tr(GROWNUPS.key)}
      </NavLink>
    </nav>
  );
}

/** Phones: ☰ button that opens a full-screen menu with the same groups. */
export function MobileMenu() {
  const { tr } = useSettings();
  const location = useLocation();
  // Opened on one navigation; navigating anywhere (even the same page) closes it.
  const [openAt, setOpenAt] = useState<string | null>(null);
  const open = openAt === location.key;
  const setOpen = (v: boolean) => setOpenAt(v ? location.key : null);
  const burgerRef = useRef<HTMLButtonElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    panelRef.current?.querySelector<HTMLElement>('button, a')?.focus();
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'Escape') setOpenAt(null);
    };
    document.addEventListener('keydown', onKey);
    const burger = burgerRef.current;
    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener('keydown', onKey);
      burger?.focus();
    };
  }, [open]);

  const link = (i: Item) => (
    <NavLink key={i.to} to={i.to} end={i.to === '/'} onClick={() => setOpenAt(null)} className={({ isActive }) => `mobile-menu__link${isActive ? ' is-active' : ''}`}>
      <span aria-hidden="true">{i.icon}</span> {tr(i.key)}
    </NavLink>
  );

  return (
    <>
      <button
        ref={burgerRef}
        type="button"
        className="btn nav-burger"
        aria-label={tr('navMenu')}
        aria-expanded={open}
        aria-controls="mobile-menu"
        onClick={() => setOpen(true)}
      >
        ☰
      </button>
      {open && (
        <div id="mobile-menu" ref={panelRef} className="mobile-menu" role="dialog" aria-modal="true" aria-label={tr('navMenu')}>
          <div className="mobile-menu__top">
            <strong>{tr('navMenu')}</strong>
            <button type="button" className="btn btn--ghost" onClick={() => setOpen(false)} aria-label={tr('navClose')}>
              ✕
            </button>
          </div>
          <nav aria-label="Main">
            <div className="mobile-menu__row">{link(HOME)}</div>
            {NAV_GROUPS.map((g) => (
              <section key={g.id} className="mobile-menu__group" aria-labelledby={`mm-${g.id}`}>
                <h2 id={`mm-${g.id}`}>
                  <span aria-hidden="true">{g.icon}</span> {tr(g.key)}
                </h2>
                <div className="mobile-menu__grid">{g.items.map(link)}</div>
              </section>
            ))}
            <div className="mobile-menu__row">{link(GROWNUPS)}</div>
          </nav>
        </div>
      )}
    </>
  );
}
