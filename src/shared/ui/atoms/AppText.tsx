import { colors, fontSizes, lineHeights, FontFamily } from '@/shared/theme';
import { Text, TextStyle, TextProps } from 'react-native';

type Variant = 'h1' | 'h2' | 'h3' | 'body' | 'caption' | 'label';

type AppTextProps = TextProps & {
  variant?: Variant;
  color?: string;
};

const variantStyles: Record<Variant, TextStyle> = {
  h1: {
    fontFamily: FontFamily.montserratBold,
    fontSize: fontSizes.xxl,
    lineHeight: lineHeights.xxl,
  },
  h2: {
    fontFamily: FontFamily.montserratBold,
    fontSize: fontSizes.xl,
    lineHeight: lineHeights.xl,
  },
  h3: {
    fontFamily: FontFamily.montserratSemiBold,
    fontSize: fontSizes.lg,
    lineHeight: lineHeights.lg,
  },
  body: {
    fontFamily: FontFamily.montserratRegular,
    fontSize: fontSizes.md,
    lineHeight: lineHeights.md,
  },
  caption: {
    fontFamily: FontFamily.montserratRegular,
    fontSize: fontSizes.xs,
    lineHeight: lineHeights.xs,
  },
  label: {
    fontFamily: FontFamily.montserratSemiBold,
    fontSize: fontSizes.sm,
    lineHeight: lineHeights.sm,
  },
};

export function AppText({
  variant = 'body',
  color,
  style,
  allowFontScaling = true,
  ...rest
}: AppTextProps) {
  return (
    <Text
      accessibilityRole="text"
      allowFontScaling={allowFontScaling}
      style={[{ color: color ?? colors.text }, variantStyles[variant], style]}
      {...rest}
    />
  );
}
