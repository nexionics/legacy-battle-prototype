import { View, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppText } from '@/shared/ui';
import { horizontalScale, moderate, verticalScale } from '@/shared/theme';
import { useThemeColors } from '@/app/providers/ThemeProvider';
import { useProfileStore } from '../../data/store/profile.store';
import type { ProfileHeaderProps } from '@/shared/types';

export function ProfileHeader({
  displayName,
  username,
  email,
  avatarUrl: initialAvatarUrl,
  onBackPress,
  onSettingsPress,
}: ProfileHeaderProps) {
  const colors = useThemeColors();
  const avatarVersion = useProfileStore((s) => s.avatarVersion);
  const avatarUrl = initialAvatarUrl ? `${initialAvatarUrl}?v=${avatarVersion}` : null;
  const avatarInitials = (displayName || username || email || 'U').substring(0, 2).toUpperCase();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={[styles.iconButton, styles.leftButton, { backgroundColor: colors.primary }]}
          onPress={onBackPress}
        >
          <Ionicons name="arrow-back" size={moderate(18)} color={colors.white} />
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <AppText variant="h4" style={{ color: colors.white }}>
            Profile
          </AppText>
          <Ionicons name="person-outline" size={moderate(16)} color={colors.primary} />
        </View>

        <TouchableOpacity
          style={[styles.iconButton, { backgroundColor: colors.primary }]}
          onPress={onSettingsPress}
        >
          <Ionicons name="settings-outline" size={moderate(18)} color={colors.white} />
        </TouchableOpacity>
      </View>

      <View style={styles.profileSection}>
        <View style={styles.avatarContainer}>
          <View
            style={[
              styles.avatar,
              { backgroundColor: colors.white, borderColor: 'rgba(255,255,255,0.16)' },
            ]}
          >
            {avatarUrl ? (
              <Image source={{ uri: avatarUrl }} style={styles.avatarImage} />
            ) : (
              <AppText variant="h2" style={{ color: colors.primaryDark }}>
                {avatarInitials}
              </AppText>
            )}
          </View>
        </View>

        <AppText variant="h4" style={[styles.username, { color: colors.white }]}>
          {displayName || username || 'User'}
        </AppText>
        <AppText variant="body2" style={[styles.email, { color: 'rgba(255,255,255,0.72)' }]}>
          {email}
        </AppText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: verticalScale(6),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: verticalScale(24),
  },
  headerCenter: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: horizontalScale(6),
  },
  leftButton: {
    marginRight: horizontalScale(12),
  },
  iconButton: {
    width: horizontalScale(36),
    height: verticalScale(36),
    borderRadius: moderate(18),
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileSection: {
    alignItems: 'center',
  },
  avatarContainer: {
    marginBottom: verticalScale(14),
  },
  avatar: {
    width: horizontalScale(88),
    height: verticalScale(88),
    borderRadius: moderate(44),
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: moderate(3),
  },
  username: {
    marginBottom: verticalScale(4),
  },
  email: {
    opacity: 0.9,
  },
  avatarImage: {
    width: horizontalScale(82),
    height: verticalScale(82),
    borderRadius: moderate(41),
  },
});
