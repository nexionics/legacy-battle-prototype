import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { AppText } from '@/shared/ui';
import { useThemeColors } from '@/app/providers/ThemeProvider';
import { horizontalScale, moderate, verticalScale } from '@/shared/theme';
import type { LevelCardProps } from '@/shared/types';

export function LevelCard({ levelInfo, xp, ctaLabel, onCtaPress }: LevelCardProps) {
  const colors = useThemeColors();

  return (
    <LinearGradient colors={['#FF2D2D', colors.primaryDark]} style={styles.rankCard}>
      <View style={styles.rankHeader}>
        <AppText variant="label" style={{ color: colors.white }}>
          Legacy Rank
        </AppText>
        <AppText variant="h5" style={{ color: colors.white }}>
          {levelInfo.level}
        </AppText>
      </View>
      <View style={styles.rankProgressContainer}>
        <View style={[styles.rankProgressBar, { backgroundColor: 'rgba(255,255,255,0.92)' }]}>
          <View
            style={[
              styles.rankProgress,
              { width: `${levelInfo.progress}%`, backgroundColor: colors.primaryDark },
            ]}
          />
        </View>
      </View>
      <View style={styles.rankFooter}>
        <AppText variant="captionSm" style={[styles.rankXpText, { color: colors.white }]}>
          {xp.toLocaleString()} XP
        </AppText>
        <AppText
          variant="captionSm"
          style={[styles.rankNextText, { color: 'rgba(255,255,255,0.84)' }]}
        >
          {levelInfo.nextLevel}: {levelInfo.nextXp.toLocaleString()} XP
        </AppText>
      </View>

      <TouchableOpacity
        style={[styles.invitationBanner, { backgroundColor: 'rgba(0,0,0,0.72)' }]}
        onPress={onCtaPress}
      >
        <AppText variant="body2" style={[styles.invitationText, { color: colors.white }]}>
          {ctaLabel}
        </AppText>
        <Ionicons name="arrow-forward" size={moderate(16)} color={colors.white} />
      </TouchableOpacity>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  rankCard: {
    borderRadius: moderate(12),
    paddingHorizontal: horizontalScale(14),
    paddingVertical: verticalScale(14),
    marginBottom: verticalScale(16),
  },
  rankHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: verticalScale(12),
  },
  rankProgressContainer: {
    marginBottom: verticalScale(10),
  },
  rankProgressBar: {
    height: verticalScale(10),
    borderRadius: moderate(999),
    overflow: 'hidden',
  },
  rankProgress: {
    height: '100%',
    borderRadius: moderate(999),
  },
  rankFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: verticalScale(14),
  },
  rankXpText: {
    flex: 1,
  },
  rankNextText: {
    textAlign: 'right',
    flex: 1,
  },
  invitationBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: moderate(999),
    paddingHorizontal: horizontalScale(14),
    paddingVertical: verticalScale(10),
  },
  invitationText: {
    flex: 1,
    marginRight: horizontalScale(12),
  },
});
