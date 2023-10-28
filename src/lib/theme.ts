import { BrowserStorageKey, Theme } from "../constants.ts";

/**
 * Checks whether a value is a valid theme identifier.
 *
 * @param val {string | null | undefined } The value you want to check
 */
export const isValidTheme = (val?: string | null) => {
  return Object.values(Theme).includes(val as Theme);
};

/**
 * Persist the theme to browser storage.
 *
 * @param theme {Theme} The theme identifier you want to persist
 */
export const saveTheme = (theme: Theme) =>
  localStorage.setItem(BrowserStorageKey.THEME, theme);

/**
 * Retrieve the theme from browser storage, or return `null` if none exists.
 */
export const loadTheme = (): string | null =>
  localStorage.getItem(BrowserStorageKey.THEME);

/**
 * Get the theme that the user's operating system or user agent claims that they prefer.
 *
 * Reference:
 * - https://getbootstrap.com/docs/5.3/customize/color-modes/#javascript
 * - https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-color-scheme
 * - https://developer.mozilla.org/en-US/docs/Web/API/Window/matchMedia
 */
export const getProgrammaticThemePreference = (): Theme | null => {
  const queryPrefersDark = "(prefers-color-scheme: dark)";
  const queryPrefersLight = "(prefers-color-scheme: light)";
  const prefersDark = window.matchMedia(queryPrefersDark);
  const prefersLight = window.matchMedia(queryPrefersLight);
  return prefersDark ? Theme.Dark : prefersLight ? Theme.Light : null;
};

/**
 * Get a theme we think the user will like.
 */
export const getInitialTheme = (): Theme => {
  let theme = null;

  // Lower priority: Check the operating system and/or user agent.
  const preferredTheme = getProgrammaticThemePreference();
  if (isValidTheme(preferredTheme)) {
    theme = preferredTheme as Theme;
  }

  // Higher priority: Check what the user used on previous visits.
  const savedTheme = loadTheme();
  if (isValidTheme(savedTheme)) {
    theme = savedTheme as Theme;
  }

  // Fallback: If we didn't get a theme preference or saved theme, default to dark.
  if (theme === null) {
    theme = Theme.Dark;
  }

  return theme;
};
