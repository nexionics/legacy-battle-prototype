import { moderateScale } from 'react-native-size-matters';

const scale = (n: number, factor = 0.5) => moderateScale(n, factor);

export const spacing = {
  0: 0,
  1: scale(4),
  2: scale(8),
  3: scale(12),
  4: scale(16),
  5: scale(24),
  6: scale(32),
} as const;

export const radii = {
  sm: scale(4),
  md: scale(8),
  lg: scale(12),
  xl: scale(24),
} as const;

export const fontSizes = {
  xs: scale(12, 0.5),
  sm: scale(14, 0.5),
  md: scale(16, 0.7),
  lg: scale(18),
  xl: scale(24, 0.4),
  xxl: scale(32, 0.4),
  xxxl: scale(40, 0.5),
} as const;

export const lineHeights = {
  xs: scale(16),
  sm: scale(20),
  md: scale(24),
  lg: scale(26),
  xl: scale(32),
  xxl: scale(40),
  xxxl: scale(48),
} as const;

const shadowOffset = (h: number) => ({ width: 0, height: scale(h) });
const shadowRadius = (r: number) => scale(r);

export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: shadowOffset(1),
    shadowOpacity: 0.18,
    shadowRadius: shadowRadius(1),
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: shadowOffset(2),
    shadowOpacity: 0.25,
    shadowRadius: shadowRadius(3.84),
    elevation: 3,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: shadowOffset(4),
    shadowOpacity: 0.3,
    shadowRadius: shadowRadius(4.65),
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
