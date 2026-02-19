import { colors, spacing, radii, fontSizes, lineHeights, shadows, zIndex } from './tokens';

export const theme = {
  colors,
  spacing,
  radii,
  fontSizes,
  lineHeights,
  shadows,
  zIndex,
} as const;

export type Theme = typeof theme;
