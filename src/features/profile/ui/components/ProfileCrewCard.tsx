import { View, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppText } from '@/shared/ui';
import { useThemeColors } from '@/app/providers/ThemeProvider';
import { horizontalScale, moderate, verticalScale } from '@/shared/theme';
import type { ProfileCrewCardProps } from '@/shared/types';

const PREVIEW_ITEMS = [0, 1, 2, 3];

export function ProfileCrewCard({
  title,
  crewCount,
  avatarUrl,
  avatarLabel,
  buttonLabel,
  onPress,
}: ProfileCrewCardProps) {
  const colors = useThemeColors();

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

      <View style={styles.previewRow}>
        {PREVIEW_ITEMS.map((item, index) => (
          <View
            key={item}
            style={[
              styles.avatarShell,
              {
                left: horizontalScale(index * 18),
                backgroundColor: colors.card,
                borderColor: colors.backgroundLight,
                zIndex: PREVIEW_ITEMS.length - index,
              },
            ]}
          >
            {avatarUrl && index === 0 ? (
              <Image source={{ uri: avatarUrl }} style={styles.avatarImage} />
            ) : (
              <AppText variant="captionSm" style={{ color: colors.text }}>
                {avatarLabel}
              </AppText>
            )}
          </View>
        ))}

        <View
          style={[styles.countBubble, { left: horizontalScale(72), backgroundColor: colors.white }]}
        >
          <AppText variant="captionSm" style={{ color: colors.black }}>
            +{crewCount}
          </AppText>
        </View>
      </View>

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
  countBubble: {
    position: 'absolute',
    width: horizontalScale(30),
    height: verticalScale(30),
    borderRadius: moderate(15),
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    borderRadius: moderate(999),
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: verticalScale(10),
  },
});
