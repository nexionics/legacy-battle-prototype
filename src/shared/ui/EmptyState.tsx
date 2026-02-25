import React from 'react';
import { View, StyleSheet } from 'react-native';
import { AppText } from './AppText';
import { colors, spacing } from '../theme';

type EmptyStateProps = {
  title: string;
  message?: string;
  children?: React.ReactNode;
};

export function EmptyState({ title, message, children }: EmptyStateProps) {
  return (
    <View style={styles.container}>
      <AppText variant="h3" style={styles.title}>{title}</AppText>
      {message ? <AppText style={styles.message}>{message}</AppText> : null}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacing[5],
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: colors.text,
    marginBottom: spacing[2],
    textAlign: 'center',
  },
  message: {
    color: colors.textSecondary,
    textAlign: 'center',
  },
});
