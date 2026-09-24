'use client';

import { useSyncExternalStore } from 'react';
import {
  getServerThemeSnapshot,
  getThemeSnapshot,
  setThemePreference,
  subscribeToTheme,
  type ThemePreference,
} from '@/src/utils/theme';

const options: { value: ThemePreference; label: string }[] = [
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
  { value: 'system', label: 'System' },
];

export function ThemeSwitcher() {
  const preference = useSyncExternalStore(
    subscribeToTheme,
    getThemeSnapshot,
    getServerThemeSnapshot,
  );

  return (
    <fieldset className='inline-flex w-fit shrink-0 gap-1 rounded-md border border-line bg-surface p-1'>
      <legend className='sr-only'>Color theme</legend>
      {options.map(({ value, label }) => (
        <label key={value} className='relative cursor-pointer'>
          <input
            type='radio'
            name='color-theme'
            value={value}
            checked={preference === value}
            disabled={preference === null}
            onChange={() => setThemePreference(value)}
            className='peer sr-only'
          />
          <span className='flex min-h-9 min-w-14 items-center justify-center rounded px-3 text-xs font-medium text-muted transition-colors hover:bg-subtle peer-checked:bg-primary peer-checked:text-on-primary peer-checked:hover:bg-primary-hover peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent peer-disabled:cursor-wait'>
            {label}
          </span>
        </label>
      ))}
    </fieldset>
  );
}
