export type ThemePreference = 'light' | 'dark' | 'system';

const storageKey = 'job-application-tracker-theme';
const themeChangeEvent = 'tracker-theme-change';
const darkModeQuery = '(prefers-color-scheme: dark)';

function parseTheme(value: string | null | undefined): ThemePreference {
  return value === 'light' || value === 'dark' ? value : 'system';
}

export function getThemeSnapshot(): ThemePreference {
  return parseTheme(document.documentElement.dataset.themePreference);
}

export function getServerThemeSnapshot(): null {
  return null;
}

function applyTheme(preference: ThemePreference) {
  const isDark = preference === 'dark'
    || (preference === 'system' && window.matchMedia(darkModeQuery).matches);

  document.documentElement.dataset.theme = isDark ? 'dark' : 'light';
  document.documentElement.dataset.themePreference = preference;
}

export function setThemePreference(preference: ThemePreference) {
  try {
    window.localStorage.setItem(storageKey, preference);
  } catch {
  }
  applyTheme(preference);
  window.dispatchEvent(new Event(themeChangeEvent));
}

export function subscribeToTheme(onChange: () => void) {
  const media = window.matchMedia(darkModeQuery);
  const onSystemChange = () => applyTheme(getThemeSnapshot());
  const onStorageChange = (event: StorageEvent) => {
    if (event.key !== storageKey && event.key !== null) return;
    applyTheme(parseTheme(event.newValue));
    onChange();
  };

  onSystemChange();
  media.addEventListener('change', onSystemChange);
  window.addEventListener('storage', onStorageChange);
  window.addEventListener(themeChangeEvent, onChange);

  return () => {
    media.removeEventListener('change', onSystemChange);
    window.removeEventListener('storage', onStorageChange);
    window.removeEventListener(themeChangeEvent, onChange);
  };
}

export const themeInitializationScript = `(() => {
  let preference = 'system';
  try {
    const saved = localStorage.getItem('${storageKey}');
    if (saved === 'light' || saved === 'dark') preference = saved;
  } catch {}
  const dark = preference === 'dark' ||
    (preference === 'system' && matchMedia('${darkModeQuery}').matches);
  document.documentElement.dataset.theme = dark ? 'dark' : 'light';
  document.documentElement.dataset.themePreference = preference;
})();`;
