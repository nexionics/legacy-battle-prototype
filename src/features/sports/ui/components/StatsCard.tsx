import React from 'react';
import { View, StyleSheet } from 'react-native';
import { AppText } from '@/shared/ui';
import { colors, spacing, fontSizes, radii } from '@/shared/theme';

export type StatsCardProps = {
  xp: number;
  walletBalance: number;
};

export function StatsCard({ xp, walletBalance }: StatsCardProps) {
  const xpDisplay = `${xp.toLocaleString()} XP`;
  const bcDisplay = `${Number(walletBalance).toLocaleString()} BC`;

  return (
    <View style={styles.statsCard}>
      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <AppText variant="label" style={styles.statLabel}>
            Total XP
          </AppText>
          <AppText variant="h4" style={styles.statValue}>
            {xpDisplay}
          </AppText>
        </View>
        <View style={styles.statItem}>
          <AppText variant="label" style={styles.statLabel}>
            Battle Coins
          </AppText>
          <AppText variant="h4" style={styles.statValue}>
            {bcDisplay}
          </AppText>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  statsCard: {
    backgroundColor: colors.primary,
    borderRadius: radii.lg,
    padding: spacing[4],
    marginBottom: spacing[4],
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {},
  statLabel: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: fontSizes.xs,
  },
  statValue: {
    color: colors.white,
    fontSize: fontSizes.xl,
    fontWeight: 'bold',
  },
});
