import React from 'react';
import { Text, TextStyle, TextProps } from 'react-native';
import { colors, fontSizes, lineHeights } from '../../theme';

type Variant = 'h1' | 'h2' | 'h3' | 'body' | 'caption' | 'label';

type AppTextProps = TextProps & {
  variant?: Variant;
  color?: string;
};

const variantStyles: Record<Variant, TextStyle> = {
  h1: { fontSize: fontSizes.xxl, lineHeight: lineHeights.xxl, fontWeight: 'bold' },
  h2: { fontSize: fontSizes.xl, lineHeight: lineHeights.xl, fontWeight: 'bold' },
  h3: { fontSize: fontSizes.lg, lineHeight: lineHeights.lg, fontWeight: '600' },
  body: { fontSize: fontSizes.md, lineHeight: lineHeights.md, fontWeight: '400' },
  caption: { fontSize: fontSizes.xs, lineHeight: lineHeights.xs, fontWeight: '400' },
  label: { fontSize: fontSizes.sm, lineHeight: lineHeights.sm, fontWeight: '600' },
};

export function AppText({ variant = 'body', color, style, ...rest }: AppTextProps) {
  return (
    <Text
      style={[{ color: color ?? colors.text }, variantStyles[variant], style]}
      {...rest}
    />
  );
}
