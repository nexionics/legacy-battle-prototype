import React, { useRef, useCallback } from 'react';
import { TouchableOpacity, ActivityIndicator, StyleSheet, ViewStyle, Insets } from 'react-native';
import { colors, spacing, radii } from '../../theme';
import { AppText } from '../atoms';

type Variant = 'primary' | 'secondary' | 'ghost';

type ButtonProps = {
  variant?: Variant;
  loading?: boolean;
  disabled?: boolean;
  onPress: () => void;
  children: React.ReactNode;
  style?: ViewStyle;
  hitSlop?: Insets | number;
};

const DEFAULT_HIT_SLOP: Insets = { top: 8, bottom: 8, left: 8, right: 8 };

export function Button({
  variant = 'primary',
  loading = false,
  disabled = false,
  onPress,
  children,
  style,
  hitSlop = DEFAULT_HIT_SLOP,
}: ButtonProps) {
  const isDisabled = disabled || loading;
  const pressing = useRef(false);

  const handlePress = useCallback(() => {
    if (pressing.current) return;
    pressing.current = true;
    onPress();
    setTimeout(() => {
      pressing.current = false;
    }, 400);
  }, [onPress]);

  return (
    <TouchableOpacity
      style={[styles.base, variantStyles[variant], isDisabled && styles.disabled, style]}
      onPress={handlePress}
      disabled={isDisabled}
      activeOpacity={0.8}
      hitSlop={hitSlop}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'ghost' ? colors.primary : colors.white} />
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
