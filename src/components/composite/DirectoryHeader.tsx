import React, { useEffect, useId, useRef, useState } from 'react';
import { ColorSchemeMode, getResolvedColorScheme, readColorScheme, setColorScheme, syncColorScheme } from '../../colorScheme';

export interface DirectoryHeaderProps {
  brandName?: string; browseLabel?: string; loginLabel?: string; registerLabel?: string; accountLabel?: string;
  logoutLabel?: string; adminLabel?: string; languageLabel?: string; languageOptionsLabel?: Record<string, string>;
  themeLabel?: string; systemLabel?: string; lightLabel?: string; darkLabel?: string; themeSystemText?: string; themeLightText?: string; themeDarkText?: string; navigationLabel?: string;
  nickname?: string | null; name?: string | null; avatar?: string | null; isAdmin?: boolean; authenticated?: boolean;
  onLogout?: () => void;
}

const currentPath = () => typeof window === 'undefined' ? '/' : window.location.pathname.replace(/\/$/, '') || '/';

export const DirectoryHeader: React.FC<DirectoryHeaderProps> = ({
  brandName = '', browseLabel = '', loginLabel = '', registerLabel = '', accountLabel = '', logoutLabel = '', adminLabel = '',
  languageLabel = '', languageOptionsLabel = {}, themeLabel = '', systemLabel = '', lightLabel = '', darkLabel = '', themeSystemText = '', themeLightText = '', themeDarkText = '', navigationLabel = '',
  nickname, name, isAdmin = false, authenticated = false, onLogout,
}) => {
  const [themeMode, setThemeMode] = useState<ColorSchemeMode>(readColorScheme);
  const [resolvedTheme, setResolvedTheme] = useState(getResolvedColorScheme);
  const [themeOpen, setThemeOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [path, setPath] = useState(currentPath);
  const themeTriggerRef = useRef<HTMLButtonElement>(null);
  const accountTriggerRef = useRef<HTMLButtonElement>(null);
  const mobileTriggerRef = useRef<HTMLButtonElement>(null);
  const menuId = useId();
  const identity = nickname?.trim() || name?.trim() || accountLabel;
  const locales = Object.keys(languageOptionsLabel);
  const currentLocale = typeof window !== 'undefined' ? (window as any).G7Core?.locale?.current?.() || 'ko' : 'ko';
  const themeOptions: Array<[ColorSchemeMode, string]> = [['auto', systemLabel], ['light', lightLabel], ['dark', darkLabel]];

  useEffect(() => {
    const sync = () => { setPath(currentPath()); setThemeOpen(false); setAccountOpen(false); setMobileOpen(false); };
    window.addEventListener('popstate', sync);
    return () => window.removeEventListener('popstate', sync);
  }, []);

  useEffect(() => {
    const onPointerDown = (event: PointerEvent) => {
      if (!(event.target instanceof Element) || !event.target.closest('.gd-header')) {
        setThemeOpen(false); setAccountOpen(false); setMobileOpen(false);
      }
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      if (mobileOpen) { setMobileOpen(false); mobileTriggerRef.current?.focus(); }
      else if (themeOpen) { setThemeOpen(false); themeTriggerRef.current?.focus(); }
      else if (accountOpen) { setAccountOpen(false); accountTriggerRef.current?.focus(); }
    };
    document.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('keydown', onKeyDown);
    return () => { document.removeEventListener('pointerdown', onPointerDown); window.removeEventListener('keydown', onKeyDown); };
  }, [accountOpen, mobileOpen, themeOpen]);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const sync = () => { const mode = syncColorScheme(); setThemeMode(mode); setResolvedTheme(getResolvedColorScheme()); };
    sync();
    mediaQuery.addEventListener('change', sync); window.addEventListener('storage', sync);
    return () => { mediaQuery.removeEventListener('change', sync); window.removeEventListener('storage', sync); };
  }, []);

  const selectTheme = (mode: ColorSchemeMode, closeMobile = false) => {
    setThemeMode(mode); setColorScheme(mode); setResolvedTheme(getResolvedColorScheme()); setThemeOpen(false);
    if (closeMobile) setMobileOpen(false);
  };
  const changeLocale = async (locale: string) => { setAccountOpen(false); setMobileOpen(false); await (window as any).G7Core?.locale?.change?.(locale); };
  const closeMenus = () => { setThemeOpen(false); setAccountOpen(false); setMobileOpen(false); };
  const themeText = themeMode === 'auto' ? themeSystemText : themeMode === 'light' ? themeLightText : themeDarkText;
  const renderThemeOptions = (closeMobile = false) => themeOptions.map(([value, label]) => <button type="button" role="menuitemradio" aria-checked={themeMode === value} className={`gd-menu-item ${themeMode === value ? 'is-current' : ''}`} key={value} onClick={() => selectTheme(value, closeMobile)}>{label}</button>);
  const renderAccountItems = (mobile = false) => <>
    {isAdmin && <a href="/admin" className={mobile ? 'gd-mobile-menu-link' : 'gd-menu-item'} role={!mobile ? 'menuitem' : undefined} onClick={closeMenus}>{adminLabel}</a>}
    <a href="/account" className={mobile ? 'gd-mobile-menu-link' : 'gd-menu-item'} role={!mobile ? 'menuitem' : undefined} onClick={closeMenus}>{accountLabel}</a>
    {locales.length > 0 && <div className={mobile ? 'gd-mobile-language' : 'gd-language'}>
      <span className="gd-menu-section-label">{languageLabel}</span>
      {locales.map(locale => <button type="button" className={`${mobile ? 'gd-mobile-menu-link' : 'gd-menu-item'} ${currentLocale === locale ? 'is-current' : ''}`} role={!mobile ? 'menuitemradio' : undefined} aria-checked={!mobile ? currentLocale === locale : undefined} aria-pressed={mobile ? currentLocale === locale : undefined} key={locale} onClick={() => changeLocale(locale)}>{languageOptionsLabel[locale]}</button>)}
    </div>}
    <button type="button" className={mobile ? 'gd-mobile-menu-link' : 'gd-menu-item'} role={!mobile ? 'menuitem' : undefined} onClick={() => { closeMenus(); onLogout?.(); }}>{logoutLabel}</button>
  </>;

  return <header className="gd-header"><div className="gd-container gd-header-inner">
    <a href="/directory" className="gd-brand" aria-label={brandName}><span className="gd-brand-name">{brandName}</span></a>
    <div className="gd-header-actions">
      <nav className="gd-header-nav" aria-label={navigationLabel || brandName}><a href="/directory" aria-current={path === '/directory' ? 'page' : undefined}>{browseLabel}</a></nav>
      <div className="gd-theme gd-theme-menu-wrapper">
        <button ref={themeTriggerRef} type="button" className="gd-button gd-theme-trigger" aria-label={themeText} aria-expanded={themeOpen} aria-haspopup="menu" aria-controls={`${menuId}-theme`} onClick={() => { setThemeOpen(value => !value); setAccountOpen(false); }}>{themeText}</button>
        {themeOpen && <div id={`${menuId}-theme`} className="gd-theme-menu" role="menu" aria-label={themeLabel}>{renderThemeOptions()}</div>}
      </div>
      {authenticated ? <div className="gd-account gd-account-menu-wrapper">
        <button ref={accountTriggerRef} type="button" className="gd-button gd-account-trigger" aria-label={identity} aria-expanded={accountOpen} aria-haspopup="menu" aria-controls={`${menuId}-account`} onClick={() => { setAccountOpen(value => !value); setThemeOpen(false); }}>{identity}<span aria-hidden="true">⌄</span></button>
        {accountOpen && <div id={`${menuId}-account`} className="gd-account-menu" role="menu" aria-label={identity}>{renderAccountItems()}</div>}
      </div> : <div className="gd-auth"><a href="/login">{loginLabel}</a><a href="/register" className="gd-auth-register">{registerLabel}</a></div>}
    </div>
    <div className="gd-mobile-menu-wrapper">
      <button ref={mobileTriggerRef} type="button" className="gd-button gd-mobile-trigger" aria-label={navigationLabel || brandName} aria-expanded={mobileOpen} aria-controls={`${menuId}-mobile`} onClick={() => { setMobileOpen(value => !value); setThemeOpen(false); setAccountOpen(false); }}><span aria-hidden="true">☰</span></button>
      {mobileOpen && <div id={`${menuId}-mobile`} className="gd-mobile-menu" aria-label={navigationLabel || brandName}>
        <nav className="gd-mobile-nav" aria-label={navigationLabel || brandName}><a className="gd-mobile-menu-link" href="/directory" aria-current={path === '/directory' ? 'page' : undefined} onClick={closeMenus}>{browseLabel}</a></nav>
        <div className="gd-mobile-section"><span className="gd-menu-section-label">{themeLabel}</span><div className="gd-mobile-theme-options" role="menu" aria-label={themeLabel}>{renderThemeOptions(true)}</div></div>
        {authenticated ? <div className="gd-mobile-section"><span className="gd-mobile-identity">{identity}</span>{renderAccountItems(true)}</div> : <div className="gd-mobile-section gd-mobile-auth-links"><a className="gd-mobile-menu-link" href="/login" onClick={closeMenus}>{loginLabel}</a><a className="gd-mobile-menu-link gd-auth-register" href="/register" onClick={closeMenus}>{registerLabel}</a></div>}
      </div>}
    </div>
  </div></header>;
};
