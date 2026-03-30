import { Image, StyleSheet, View } from 'react-native';
import { AppText, Avatar, Button } from '@/shared/ui';
import { colors, horizontalScale, moderate, radii, spacing, verticalScale } from '@/shared/theme';
import type { CrewMemberCardProps } from '@/shared/types';
import { getInitials } from '@/shared/utils';

export function CrewMemberCard({
  member,
  presenceLabel,
  levelLabel,
  rivalryLabel,
  challengeLabel,
  onChallengePress,
}: CrewMemberCardProps) {
  const memberName = member.displayName || member.username || 'Unknown';

  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <View style={styles.memberInfoRow}>
          {member.avatarUrl ? (
            <Image source={{ uri: member.avatarUrl }} style={styles.avatarImage} />
          ) : (
            <Avatar
              initials={getInitials(member.displayName, member.username)}
              size="lg"
              backgroundColor={colors.card}
              borderColor={colors.inputBorder}
            />
          )}

          <View style={styles.memberTextColumn}>
            <AppText variant="h6">{memberName}</AppText>
            <View style={styles.presenceRow}>
              <View style={styles.presenceDot} />
              <AppText variant="captionSm" color={colors.success}>
                {presenceLabel}
              </AppText>
            </View>
          </View>
        </View>

        <View style={styles.metaColumn}>
          <AppText variant="captionSm" color={colors.textSecondary} style={styles.levelText}>
            {levelLabel}
          </AppText>
          {rivalryLabel ? (
            <View style={styles.rivalryBadge}>
              <View style={styles.rivalryDot} />
              <AppText variant="captionSm" color={colors.white}>
                {rivalryLabel}
              </AppText>
            </View>
          ) : (
            <View style={styles.badgePlaceholder} />
          )}
        </View>
      </View>

      <Button onPress={() => onChallengePress(member.id, memberName)} style={styles.challengeButton}>
        {challengeLabel}
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.background,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    padding: spacing[4],
    gap: spacing[4],
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  memberInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarImage: {
    width: horizontalScale(60),
    height: verticalScale(60),
    borderRadius: moderate(30),
  },
  memberTextColumn: {
    marginLeft: spacing[3],
    flex: 1,
    gap: spacing[1],
  },
  presenceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[1],
  },
  presenceDot: {
    width: horizontalScale(8),
    height: verticalScale(8),
    borderRadius: moderate(4),
    backgroundColor: colors.success,
  },
  metaColumn: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    minHeight: verticalScale(60),
    marginLeft: spacing[2],
  },
  levelText: {
    textAlign: 'right',
  },
  rivalryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[1],
    backgroundColor: '#2a1712',
    borderRadius: radii.pill,
    paddingHorizontal: spacing[2],
    paddingVertical: spacing[1],
  },
  rivalryDot: {
    width: horizontalScale(8),
    height: verticalScale(8),
    borderRadius: moderate(4),
    backgroundColor: '#ff7a00',
  },
  badgePlaceholder: {
    height: verticalScale(24),
  },
  challengeButton: {
    backgroundColor: colors.primary,
  },
});
