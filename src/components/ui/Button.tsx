import React from 'react';
import {
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { AppText } from './AppText';
import { colors, spacing, radii } from '../../theme';

type Variant = 'primary' | 'secondary' | 'ghost';

type ButtonProps = {
  variant?: Variant;
  loading?: boolean;
  disabled?: boolean;
  onPress: () => void;
  children: React.ReactNode;
  style?: ViewStyle;
};

export function Button({
  variant = 'primary',
  loading = false,
  disabled = false,
  onPress,
  children,
  style,
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      style={[
        styles.base,
        variantStyles[variant],
        isDisabled && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'ghost' ? colors.primary : colors.white}
        />
      ) : typeof children === 'string' ? (
        <AppText
          variant="label"
          color={variant === 'ghost' ? colors.primary : colors.white}
          style={styles.text}
        >
          {children}
        </AppText>
      ) : (
        children
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing[4],
    borderRadius: radii.lg,
    gap: spacing[2],
  },
  disabled: {
    opacity: 0.7,
  },
  text: {
    fontWeight: 'bold',
  },
});

const variantStyles: Record<Variant, ViewStyle> = {
  primary: {
    backgroundColor: colors.primary,
  },
  secondary: {
    backgroundColor: colors.transparent,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  ghost: {
    backgroundColor: colors.transparent,
  },
};
