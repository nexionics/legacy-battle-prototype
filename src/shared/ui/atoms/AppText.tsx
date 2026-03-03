import type { TextProps } from 'react-native';
import { Text } from 'react-native';
import {
  colors,
  typography,
  type TypographyVariant,
} from '@/shared/theme';

export interface AppTextProps extends Omit<TextProps, 'style'> {
  variant?: TypographyVariant;
  /** Text color (e.g. colors.text, colors.textMuted). Defaults to colors.text. */
  color?: string;
  style?: TextProps['style'];
}

const DEFAULT_VARIANT: TypographyVariant = 'body1';

export function AppText({
  variant = DEFAULT_VARIANT,
  color,
  style,
  allowFontScaling = true,
  ...rest
}: AppTextProps) {
  const tokenStyle = typography[variant];

  return (
    <Text
      accessibilityRole="text"
      allowFontScaling={allowFontScaling}
      style={[
        { color: color ?? colors.text },
        tokenStyle,
        style,
      ]}
      {...rest}
    />
  );
}
