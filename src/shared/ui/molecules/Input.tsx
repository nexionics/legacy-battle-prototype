import React, { forwardRef } from 'react';
import { View, TextInput, StyleSheet, type TextInput as RNTextInput } from 'react-native';
import { colors, spacing, radii, fontSizes } from '@/shared/theme';
import { AppText } from '../atoms';
import type { InputProps } from '@/shared/types';

const InputComponent = (
  {
    label,
    error,
    required,
    leftComponent,
    rightComponent,
    containerStyle,
    wrapperStyle,
    inputTextStyle,
    showSuccessBorder,
    isFocused,
    style: _style,
    ...rest
  }: InputProps,
  ref: React.Ref<RNTextInput>
) => {
  const hasError = Boolean(error);
  const showSuccess = Boolean(showSuccessBorder && rest.value && rest.value.length > 0);

  const wrapperDynamic =
    hasError || showSuccess || isFocused
      ? [
          hasError && styles.wrapperError,
          showSuccess && styles.wrapperSuccess,
          isFocused && !hasError && !showSuccess && styles.wrapperFocused,
        ].filter(Boolean)
      : [];

  return (
    <View style={[styles.container, containerStyle]}>
      {label != null && label !== '' ? (
        <AppText variant="label" color={colors.textSecondary} style={styles.label}>
          {label}
          {required ? ' *' : ''}
        </AppText>
      ) : null}
      <View style={[styles.wrapper, ...wrapperDynamic, wrapperStyle]}>
        {leftComponent != null ? <View style={styles.slot}>{leftComponent}</View> : null}
        <TextInput
          ref={ref}
          style={[styles.input, inputTextStyle]}
          placeholderTextColor={colors.muted}
          {...rest}
        />
        {rightComponent != null ? <View style={styles.slot}>{rightComponent}</View> : null}
      </View>
      {hasError ? (
        <AppText variant="error" color={colors.error} style={styles.errorText}>
          {error}
        </AppText>
      ) : null}
    </View>
  );
};

export const Input = forwardRef<RNTextInput, InputProps>(InputComponent);

const styles = StyleSheet.create({
  container: {
    gap: spacing[2],
  },
  label: {
    marginBottom: 0,
  },
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.inputBackground,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    paddingHorizontal: spacing[4],
    gap: spacing[2],
  },
  wrapperError: {
    borderColor: colors.error,
  },
  wrapperSuccess: {
    borderColor: colors.success,
  },
  wrapperFocused: {
    borderColor: colors.primary,
  },
  slot: {},
  input: {
    flex: 1,
    color: colors.text,
    fontSize: fontSizes.md,
    paddingVertical: spacing[4],
  },
  errorText: {
    marginTop: 0,
  },
});
