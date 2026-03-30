import { ActivityIndicator, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppText, Avatar } from '@/shared/ui';
import { colors, horizontalScale, moderate, radii, spacing, verticalScale } from '@/shared/theme';
import type { CrewSearchResultCardProps } from '@/shared/types';
import { getInitials } from '@/shared/utils';

export function CrewSearchResultCard({
  result,
  onAddFriendPress,
  isSubmitting = false,
}: CrewSearchResultCardProps) {
  return (
    <View style={styles.resultItem}>
      <Avatar
        initials={getInitials(result.displayName, result.username)}
        size="md"
        backgroundColor={colors.primary}
        borderColor={colors.primary}
        textColor={colors.white}
      />
      <View style={styles.resultInfo}>
        <AppText variant="label">{result.displayName || result.username || 'Unknown'}</AppText>
        <AppText variant="captionSm" color={colors.textSecondary}>
          @{result.username || 'no-username'}
        </AppText>
      </View>

      {result.requestStatus === 'accepted' ? (
        <View style={[styles.actionButton, styles.actionButtonDone]}>
          <Ionicons name="checkmark" size={moderate(18)} color={colors.white} />
        </View>
      ) : result.requestStatus === 'pending' ? (
        <View style={[styles.actionButton, styles.actionButtonPending]}>
          <Ionicons name="time" size={moderate(18)} color={colors.white} />
        </View>
      ) : (
        <TouchableOpacity
          style={styles.actionButton}
          disabled={isSubmitting}
          onPress={() =>
            onAddFriendPress(result.id, result.displayName || result.username || 'User')
          }
        >
          {isSubmitting ? (
            <ActivityIndicator size="small" color={colors.white} />
          ) : (
            <Ionicons name="person-add" size={moderate(18)} color={colors.white} />
          )}
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: radii.lg,
    padding: spacing[4],
    marginTop: spacing[2],
  },
  resultInfo: {
    flex: 1,
    marginLeft: spacing[4],
  },
  actionButton: {
    width: horizontalScale(40),
    height: verticalScale(40),
    borderRadius: moderate(20),
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionButtonDone: {
    backgroundColor: colors.success,
  },
  actionButtonPending: {
    backgroundColor: colors.warning,
  },
});
