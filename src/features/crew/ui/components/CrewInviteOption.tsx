import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppText } from '@/shared/ui';
import { colors, horizontalScale, moderate, radii, spacing, verticalScale } from '@/shared/theme';
import type { CrewInviteOptionProps } from '@/shared/types';

export function CrewInviteOption({
  iconName,
  title,
  subtitle,
  onPress,
}: CrewInviteOptionProps) {
  return (
    <TouchableOpacity style={styles.inviteOption} onPress={onPress}>
      <View style={styles.inviteIconContainer}>
        <Ionicons
          name={iconName as keyof typeof Ionicons.glyphMap}
          size={moderate(24)}
          color={colors.primary}
        />
      </View>
      <View style={styles.inviteTextContainer}>
        <AppText variant="label">{title}</AppText>
        <AppText variant="captionSm" color={colors.textSecondary} style={styles.inviteCaption}>
          {subtitle}
        </AppText>
      </View>
      <Ionicons name="chevron-forward" size={moderate(20)} color={colors.textSecondary} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  inviteOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: radii.lg,
    padding: spacing[4],
    marginBottom: spacing[2],
  },
  inviteIconContainer: {
    width: horizontalScale(48),
    height: verticalScale(48),
    borderRadius: moderate(24),
    backgroundColor: colors.inputBackground,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inviteTextContainer: {
    flex: 1,
    marginLeft: spacing[4],
  },
  inviteCaption: {
    marginTop: spacing[1],
  },
});
