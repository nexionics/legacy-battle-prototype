export { spacing, radii, fontSizes, lineHeights, shadows, zIndex } from './tokens';
export {
  theme,
  colors,
  Colors,
  colorScheme,
  screenHeight,
  screenWidth,
  horizontalScale,
  verticalScale,
  moderate,
  scaleText,
  scaleLayout,
  RPH,
  RPW,
  FontFamily,
  Sizes,
} from './theme';
export type { Theme } from './theme';
export { useTheme } from './useTheme';
export {
  DARK_COLORS,
  LIGHT_COLORS,
  getThemeColors,
  type ThemeColors,
  type ThemeMode,
} from './colors';

/** Aliases for screens that use COLORS/SIZES. */
export { colors as COLORS, Sizes as SIZES } from './theme';
