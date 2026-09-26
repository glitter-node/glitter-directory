export type ColorSchemeMode = 'auto' | 'light' | 'dark';
const KEY = 'g7_color_scheme';
const modes: ColorSchemeMode[] = ['auto', 'light', 'dark'];
const DARK_MEDIA_QUERY = '(prefers-color-scheme: dark)';

const syncGlobalTheme = (mode: ColorSchemeMode): void => {
  try { (window as any).G7Core?.state?.setGlobal?.({ theme: mode }); } catch { /* G7Core may not be ready during module bootstrap. */ }
};

export const readColorScheme = (): ColorSchemeMode => {
  if (typeof window === 'undefined') return 'auto';
  try { const value = window.localStorage.getItem(KEY); return value && modes.includes(value as ColorSchemeMode) ? value as ColorSchemeMode : 'auto'; } catch { return 'auto'; }
};
export const applyColorScheme = (mode: ColorSchemeMode): void => {
  if (typeof document === 'undefined') return;
  const dark = mode === 'dark' || (mode === 'auto' && window.matchMedia(DARK_MEDIA_QUERY).matches);
  document.documentElement.dataset.theme = dark ? 'dark' : 'light';
  document.documentElement.classList.toggle('dark', dark);
};
export const syncColorScheme = (): ColorSchemeMode => {
  const mode = readColorScheme();
  applyColorScheme(mode);
  syncGlobalTheme(mode);
  return mode;
};
export const setColorScheme = (mode: ColorSchemeMode): void => {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(KEY, mode);
  applyColorScheme(mode);
  syncGlobalTheme(mode);
};
export const getResolvedColorScheme = (): 'light' | 'dark' => {
  const mode = readColorScheme();
  return mode === 'dark' || (mode === 'auto' && typeof window !== 'undefined' && window.matchMedia(DARK_MEDIA_QUERY).matches) ? 'dark' : 'light';
};
export const initializeColorScheme = (): void => {
  if (typeof window === 'undefined') return;
  const sync = () => syncColorScheme();
  sync();
  window.matchMedia(DARK_MEDIA_QUERY).addEventListener('change', sync);
  window.addEventListener('storage', sync);
};
