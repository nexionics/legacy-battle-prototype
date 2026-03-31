import React from 'react';
import { View, StyleSheet } from 'react-native';
import { AppText } from '@/shared/ui';
import { horizontalScale, moderate, verticalScale } from '@/shared/theme';
import { useThemeColors } from '@/app/providers/ThemeProvider';
import type { StatsGridProps } from '@/shared/types';

export function StatsGrid({ items }: StatsGridProps) {
  const colors = useThemeColors();

  return (
    <View style={styles.statsRow}>
      {items.map((item) => (
        <View
          key={item.label}
          style={[styles.statBox, { backgroundColor: colors.backgroundLight, borderColor: colors.cardBorder }]}
        >
          <AppText variant="captionSm" style={[styles.statLabel, { color: colors.textSecondary }]}>
            {item.label}
          </AppText>
          <AppText
            variant="h6"
            style={[styles.statValue, { color: item.accentColor ?? colors.white }]}
            numberOfLines={1}
          >
            {item.value}
          </AppText>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  statsRow: {
    flexDirection: 'row',
    marginTop: verticalScale(22),
    gap: horizontalScale(10),
  },
  statBox: {
    flex: 1,
    borderRadius: moderate(10),
    paddingHorizontal: horizontalScale(10),
    paddingVertical: verticalScale(12),
    borderWidth: 1,
  },
  statValue: {
    marginTop: verticalScale(4),
  },
  statLabel: {
    opacity: 0.9,
  },
});
