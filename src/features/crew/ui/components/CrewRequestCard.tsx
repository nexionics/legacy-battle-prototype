import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppText, Avatar } from '@/shared/ui';
import { colors, horizontalScale, moderate, radii, spacing, verticalScale } from '@/shared/theme';
import type { CrewRequestCardProps } from '@/shared/types';
import { getInitials } from '@/shared/utils';

export function CrewRequestCard({
  request,
  onAcceptPress,
  onDeclinePress,
}: CrewRequestCardProps) {
  return (
    <View style={styles.requestCard}>
      <Avatar
        initials={getInitials(request.sender?.displayName ?? null, request.sender?.username ?? null)}
        size="md"
        backgroundColor={colors.primary}
        borderColor={colors.primary}
        textColor={colors.white}
      />
      <View style={styles.requestInfo}>
        <AppText variant="label">
          {request.sender?.displayName || request.sender?.username || 'Unknown'}
        </AppText>
        <AppText variant="captionSm" color={colors.textSecondary}>
          @{request.sender?.username || 'user'}
        </AppText>
      </View>
      <TouchableOpacity style={styles.acceptButton} onPress={() => onAcceptPress(request.id)}>
        <Ionicons name="checkmark" size={moderate(18)} color={colors.white} />
      </TouchableOpacity>
      <TouchableOpacity style={styles.rejectButton} onPress={() => onDeclinePress(request.id)}>
        <Ionicons name="close" size={moderate(18)} color={colors.white} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  requestCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: radii.lg,
    padding: spacing[4],
    marginBottom: spacing[2],
  },
  requestInfo: {
    flex: 1,
    marginLeft: spacing[4],
  },
  acceptButton: {
    width: horizontalScale(36),
    height: verticalScale(36),
    borderRadius: moderate(18),
    backgroundColor: colors.success,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: spacing[2],
  },
  rejectButton: {
    width: horizontalScale(36),
    height: verticalScale(36),
    borderRadius: moderate(18),
    backgroundColor: '#ef4444',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: spacing[2],
  },
});
