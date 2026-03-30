import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { AppText, Avatar } from '@/shared/ui';
import { colors, horizontalScale, spacing } from '@/shared/theme';
import type { CrewMemberTileProps } from '@/shared/types';
import { getInitials } from '@/shared/utils';

export function CrewMemberTile({ member }: CrewMemberTileProps) {
  return (
    <TouchableOpacity style={styles.crewItem}>
      <View style={styles.crewAvatarContainer}>
        <Avatar
          initials={getInitials(member.displayName, member.username)}
          size="lg"
          backgroundColor={colors.card}
          borderColor={colors.primary}
        />
      </View>
      <AppText variant="captionSm" style={styles.crewName} numberOfLines={1}>
        {member.displayName || member.username}
      </AppText>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  crewItem: {
    alignItems: 'center',
    width: horizontalScale(80),
  },
  crewAvatarContainer: {
    marginBottom: spacing[2],
  },
  crewName: {
    textAlign: 'center',
  },
});
