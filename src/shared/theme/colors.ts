/**
 * Single source of truth for app colors. Use with ThemeContext so that
 * COLORS.primary etc. automatically reflect dark/light mode via useAppTheme().colors.
 */

export type ThemeColors = {
  primary: string;
  primaryDark: string;
  secondary: string;
  background: string;
  backgroundLight: string;
  card: string;
  cardBorder: string;
  text: string;
  textSecondary: string;
  textMuted: string;
  muted: string;
  red: string;
  gray: string;
  success: string;
  warning: string;
  error: string;
  white: string;
  black: string;
  transparent: string;
  overlay: string;
  inputBackground: string;
  inputBorder: string;
};

export const DARK_COLORS: ThemeColors = {
  primary: '#E53935',
  primaryDark: '#C62828',
  secondary: '#1B2B1B',
  background: '#121212',
  backgroundLight: '#1E1E1E',
  card: '#1E1E1E',
  cardBorder: '#333333',
  text: '#FFFFFF',
  textSecondary: '#9E9E9E',
  textMuted: '#666666',
  muted: '#666666',
  red: '#F44336',
  gray: '#666666',
  success: '#4CAF50',
  warning: '#FFC107',
  error: '#F44336',
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
  overlay: 'rgba(0, 0, 0, 0.5)',
  inputBackground: '#2A2A2A',
  inputBorder: '#404040',
};

export const LIGHT_COLORS: ThemeColors = {
  primary: '#E53935',
  primaryDark: '#C62828',
  secondary: '#1B2B1B',
  background: '#F5F5F5',
  backgroundLight: '#FFFFFF',
  card: '#FFFFFF',
  cardBorder: '#E0E0E0',
  text: '#1A1A1A',
  textSecondary: '#666666',
  textMuted: '#999999',
  muted: '#999999',
  red: '#F44336',
  gray: '#999999',
  success: '#4CAF50',
  warning: '#FFC107',
  error: '#F44336',
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
  overlay: 'rgba(0, 0, 0, 0.3)',
  inputBackground: '#F0F0F0',
  inputBorder: '#D0D0D0',
};

export type ThemeMode = 'dark' | 'light';

export function getThemeColors(mode: ThemeMode): ThemeColors {
  return mode === 'dark' ? DARK_COLORS : LIGHT_COLORS;
}
