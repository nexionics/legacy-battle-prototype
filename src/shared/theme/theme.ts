import { Dimensions, Appearance } from 'react-native';
import {
  scale as horizontalScaleLib,
  verticalScale as verticalScaleLib,
  moderateScale,
} from 'react-native-size-matters';
import { getThemeColors } from './colors';
import { spacing, radii, fontSizes, lineHeights, shadows, zIndex } from './tokens';

/** Default (dark) palette. For theme-aware colors (auto dark/light), use useThemeColors() or useAppTheme().colors. */
export const colors = getThemeColors('dark');

/** Alias for consumers. Same as colors. */
export const Colors = colors;

/** Default (dark) theme. For theme-aware colors in components, use useAppTheme().colors or useThemeColors(). */
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

export const colorScheme = Appearance.getColorScheme();
export const screenHeight = Dimensions.get('window').height;
export const screenWidth = Dimensions.get('window').width;

export const horizontalScale = (size: number) => horizontalScaleLib(size);
export const verticalScale = (size: number) => verticalScaleLib(size);
export const moderate = (size: number, factor = 0.5) => moderateScale(size, factor);
export const scaleText = (size: number) => moderateScale(size, 0.3);
export const scaleLayout = (size: number) => moderateScale(size, 0.3);

export const RPH = (percentage: number) => (percentage / 100) * screenHeight;
export const RPW = (percentage: number) => (percentage / 100) * screenWidth;

export const FontFamily = {
  thin: 'Montserrat_100Thin',
  light: 'Montserrat_300Light',
  regular: 'Montserrat_400Regular',
  medium: 'Montserrat_500Medium',
  semiBold: 'Montserrat_600SemiBold',
  bold: 'Montserrat_700Bold',
};

export const Sizes = {
  font2: moderateScale(2),
  font4: moderateScale(4),
  font6: moderateScale(6),
  font8: moderateScale(8),
  font10: moderateScale(10),
  font11: moderateScale(11, 0.5),
  font12: moderateScale(12, 0.5),
  font14: moderateScale(14, 0.5),
  font16: moderateScale(16, 0.7),
  font18: moderateScale(18),
  font20: moderateScale(20, 0.4),
  font22: moderateScale(24, 0.4),
  font26: moderateScale(26, 0.5),
  font30: moderateScale(30, 0.4),
  font34: moderateScale(34, 0.4),
  font45: moderateScale(45, 0.5),
  font50: moderateScale(50, 0.5),
  font57: moderateScale(57, 0.5),
  borderRadius: moderateScale(12),
  base: moderateScale(8),
  small: moderateScale(12),
  font: moderateScale(14),
  medium: moderateScale(16),
  large: moderateScale(18),
  extraLarge: moderateScale(24),
  xxl: moderateScale(32),
  xxxl: moderateScale(40),
  padding: moderateScale(16),
  radius: moderateScale(12),
  radiusLarge: moderateScale(24),
} as const;
