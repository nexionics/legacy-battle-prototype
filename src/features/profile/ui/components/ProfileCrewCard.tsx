import { View, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppText } from '@/shared/ui';
import { useThemeColors } from '@/app/providers/ThemeProvider';
import { horizontalScale, moderate, verticalScale } from '@/shared/theme';
import type { ProfileCrewCardProps } from '@/shared/types';
import { getInitials } from '@/shared/utils';

const AVATAR_OFFSET = 18;

export function ProfileCrewCard({
  title,
  crewCount,
  emptyHint,
  crewPreviewMembers,
  buttonLabel,
  onPress,
}: ProfileCrewCardProps) {
  const colors = useThemeColors();

  const visibleSlots = crewCount > 0 ? Math.min(4, crewCount) : 0;
  const showOverflowBadge = crewCount > 4;

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: colors.backgroundLight, borderColor: colors.cardBorder },
      ]}
    >
      <View style={styles.headerRow}>
        <Ionicons name="people-outline" size={moderate(16)} color={colors.textSecondary} />
        <AppText variant="captionLg" style={{ color: colors.textSecondary }}>
          {title}
        </AppText>
      </View>

      {crewCount === 0 ? (
        <View style={styles.emptyRow}>
          <Ionicons name="people-outline" size={moderate(22)} color={colors.textMuted} />
          <AppText variant="body2" style={[styles.emptyHint, { color: colors.textSecondary }]}>
            {emptyHint}
          </AppText>
        </View>
      ) : (
        <View style={styles.previewRow}>
          {Array.from({ length: visibleSlots }, (_, index) => {
            const isOverflowSlot = showOverflowBadge && index === 3;
            const left = horizontalScale(index * AVATAR_OFFSET);
            const member = crewPreviewMembers[index];

            return (
              <View
                key={index}
                style={[
                  styles.avatarShell,
                  {
                    left,
                    backgroundColor: colors.card,
                    borderColor: colors.backgroundLight,
                    zIndex: visibleSlots - index,
                  },
                ]}
              >
                {isOverflowSlot ? (
                  <AppText variant="captionSm" style={{ color: colors.text }}>
                    +{crewCount - 3}
                  </AppText>
                ) : member?.avatarUrl ? (
                  <Image source={{ uri: member.avatarUrl }} style={styles.avatarImage} />
                ) : member ? (
                  <AppText variant="captionSm" style={{ color: colors.text }} numberOfLines={1}>
                    {getInitials(member.displayName, member.username) || '?'}
                  </AppText>
                ) : (
                  <Ionicons name="person" size={moderate(14)} color={colors.textSecondary} />
                )}
              </View>
            );
          })}
        </View>
      )}

      <TouchableOpacity
        style={[styles.button, { backgroundColor: colors.primary }]}
        onPress={onPress}
      >
        <AppText variant="buttonMd" style={{ color: colors.white }}>
          {buttonLabel}
        </AppText>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: moderate(12),
    paddingHorizontal: horizontalScale(14),
    paddingVertical: verticalScale(14),
    marginBottom: verticalScale(16),
    borderWidth: 1,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: horizontalScale(6),
  },
  emptyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: horizontalScale(10),
    marginTop: verticalScale(14),
    marginBottom: verticalScale(16),
    paddingVertical: verticalScale(4),
  },
  emptyHint: {
    flex: 1,
    lineHeight: verticalScale(20),
  },
  previewRow: {
    height: verticalScale(34),
    marginTop: verticalScale(14),
    marginBottom: verticalScale(16),
  },
  avatarShell: {
    position: 'absolute',
    width: horizontalScale(30),
    height: verticalScale(30),
    borderRadius: moderate(15),
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  button: {
    borderRadius: moderate(999),
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: verticalScale(10),
  },
});
