import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppText } from '@/shared/ui';
import { useThemeColors } from '@/app/providers/ThemeProvider';
import { horizontalScale, moderate, verticalScale } from '@/shared/theme';
import type { WalletCardProps } from '@/shared/types';

export function WalletCard({ walletBalance, actionLabel, onPress }: WalletCardProps) {
  const colors = useThemeColors();

  return (
    <View
      style={[
        styles.bcCard,
        { backgroundColor: colors.white, borderBottomColor: colors.cardBorder },
      ]}
    >
      <View style={styles.bcLeft}>
        <AppText variant="label" style={[styles.bcLabel, { color: colors.textSecondary }]}>
          Total Bc
        </AppText>
        <AppText variant="h3" style={{ color: colors.black }}>
          {Number(walletBalance).toLocaleString()} BC
        </AppText>
      </View>
      <View style={styles.bcRight}>
        <TouchableOpacity onPress={onPress}>
          <Ionicons name="eye-outline" size={moderate(18)} color={colors.textSecondary} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.viewMoreButton} onPress={onPress}>
          <AppText variant="captionLg" style={{ color: colors.textSecondary }}>
            {actionLabel}
          </AppText>
          <Ionicons name="arrow-forward" size={moderate(13)} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bcCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: moderate(12),
    paddingHorizontal: horizontalScale(14),
    paddingVertical: verticalScale(14),
    marginBottom: verticalScale(16),
    borderBottomWidth: verticalScale(4),
  },
  bcLeft: {},
  bcLabel: {
    marginBottom: verticalScale(4),
  },
  bcRight: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    minHeight: verticalScale(48),
  },
  viewMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: horizontalScale(6),
  },
});
