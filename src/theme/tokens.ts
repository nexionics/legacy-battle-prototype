export const colors = {
  primary: '#E53935',
  primaryDark: '#C62828',
  background: '#121212',
  surface: '#1E1E1E',
  card: '#1E1E1E',
  text: '#FFFFFF',
  textSecondary: '#9E9E9E',
  muted: '#666666',
  border: '#333333',
  inputBackground: '#2A2A2A',
  inputBorder: '#404040',
  success: '#4CAF50',
  warning: '#FFC107',
  error: '#F44336',
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
  overlay: 'rgba(0, 0, 0, 0.5)',
} as const;

export const spacing = {
  0: 0,
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 24,
  6: 32,
} as const;

export const radii = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 24,
} as const;

export const fontSizes = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 24,
  xxl: 32,
  xxxl: 40,
} as const;

export const lineHeights = {
  xs: 16,
  sm: 20,
  md: 24,
  lg: 26,
  xl: 32,
  xxl: 40,
  xxxl: 48,
} as const;

export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 3,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 6,
  },
} as const;

export const zIndex = {
  base: 0,
  above: 1,
  modal: 10,
  overlay: 20,
  toast: 30,
} as const;
