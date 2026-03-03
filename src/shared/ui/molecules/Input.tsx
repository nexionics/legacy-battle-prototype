import React from 'react';
import { View, TextInput, TextInputProps, StyleSheet } from 'react-native';
import { colors, spacing, radii, fontSizes } from '@/shared/theme';
import { AppText } from '../atoms';

type InputProps = TextInputProps & {
  label?: string;
  error?: string;
};

export function Input({ label, error, style, ...rest }: InputProps) {
  return (
    <View style={styles.container}>
      {label ? (
        <AppText variant="label" color={colors.textSecondary}>
          {label}
        </AppText>
      ) : null}
      <TextInput
        style={[styles.input, error ? styles.inputError : null, style]}
        placeholderTextColor={colors.muted}
        {...rest}
      />
      {error ? (
        <AppText variant="error" color={colors.error}>
          {error}
        </AppText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing[2],
  },
  input: {
    backgroundColor: colors.inputBackground,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[4],
    color: colors.text,
    fontSize: fontSizes.md,
  },
  inputError: {
    borderColor: colors.error,
  },
});
