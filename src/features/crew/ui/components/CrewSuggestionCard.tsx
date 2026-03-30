import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppText, Avatar } from '@/shared/ui';
import { colors, horizontalScale, moderate, radii, spacing, verticalScale } from '@/shared/theme';
import type { CrewSuggestionCardProps } from '@/shared/types';
import { getInitials } from '@/shared/utils';

export function CrewSuggestionCard({ member, onAddPress }: CrewSuggestionCardProps) {
  return (
    <View style={styles.suggestionCard}>
      <Avatar
        initials={getInitials(member.displayName, member.username)}
        size="md"
        backgroundColor={colors.primary}
        borderColor={colors.primary}
        textColor={colors.white}
      />
      <View style={styles.requestInfo}>
        <AppText variant="label">{member.displayName || member.username || 'Unknown'}</AppText>
        <AppText variant="captionSm" color={colors.textSecondary}>
          @{member.username || 'user'}
        </AppText>
      </View>
      <TouchableOpacity style={styles.addSuggestionButton} onPress={() => onAddPress(member.id)}>
        <Ionicons name="person-add" size={moderate(16)} color={colors.white} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  suggestionCard: {
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
  addSuggestionButton: {
    width: horizontalScale(36),
    height: verticalScale(36),
    borderRadius: moderate(18),
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: spacing[2],
  },
});
