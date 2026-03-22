import { Text } from 'react-native';
import { typography, type TypographyVariant } from '@/shared/theme';
import { useThemeColors } from '@/app/providers/ThemeProvider';
import type { AppTextProps } from '@/shared/types';

const DEFAULT_VARIANT: TypographyVariant = 'body1';

export type { AppTextProps };
export function AppText({
  variant = DEFAULT_VARIANT,
  color,
  style,
  allowFontScaling = true,
  ...rest
}: AppTextProps) {
  const colors = useThemeColors();
  const tokenStyle = typography[variant];

  return (
    <Text
      accessibilityRole="text"
      allowFontScaling={allowFontScaling}
      style={[{ color: color ?? colors.text }, tokenStyle, style]}
      {...rest}
    />
  );
}
