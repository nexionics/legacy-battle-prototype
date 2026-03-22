import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppText } from '@/shared/ui';
import { colors as staticColors, spacing, fontSizes } from '@/shared/theme';
import { useNavigation } from '@react-navigation/native';
import { useThemeColors } from '@/app/providers/ThemeProvider';
import { getLevelInfo, getLevelNumber } from '@/features/profile/helpers/level';
import type { ProfileHeaderProps, RootStackParamList } from '@/shared/types';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

export function ProfileHeader({ displayName, username, email, xp }: ProfileHeaderProps) {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const colors = useThemeColors();
  const avatarInitials = (displayName || username || email || 'U').substring(0, 2).toUpperCase();

  const levelInfo = getLevelInfo(xp);
  const levelNumber = getLevelNumber(xp);

  return (
    <>
      <View style={styles.header}>
        <View style={styles.headerSide} />
        <View style={styles.headerCenter}>
          <AppText variant="h3" style={[styles.headerTitle, { color: colors.text }]}>
            Profile
          </AppText>
          <Ionicons name="person-outline" size={18} color={colors.primary} />
        </View>
        <TouchableOpacity
          style={[styles.notificationButton, { backgroundColor: colors.primary }]}
          onPress={() => navigation.navigate('Settings')}
        >
          <Ionicons name="settings-outline" size={20} color={colors.white} />
        </TouchableOpacity>
      </View>

      <View style={styles.profileSection}>
        <View style={styles.avatarContainer}>
          <View
            style={[
              styles.avatar,
              { backgroundColor: colors.card, borderColor: colors.inputBorder },
            ]}
          >
            <AppText variant="h1" style={[styles.avatarText, { color: colors.text }]}>
              {avatarInitials}
            </AppText>
          </View>
        </View>

        <AppText variant="h4" style={[styles.username, { color: colors.text }]}>
          {displayName || username || 'User'}
        </AppText>
        <AppText variant="body2" style={[styles.email, { color: colors.textSecondary }]}>
          {email}
        </AppText>

        <View style={[styles.levelBadgeContainer, { backgroundColor: colors.card }]}>
          <AppText variant="body1" style={styles.trophyIcon}>
            🏆
          </AppText>
          <AppText variant="label" style={[styles.levelBadgeText, { color: colors.success }]}>
            {levelInfo.level} Level {levelNumber}
          </AppText>
          <AppText variant="body2" style={[styles.levelXpText, { color: colors.textSecondary }]}>
            {' '}
            {xp.toLocaleString()} XP
          </AppText>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing[4],
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: staticColors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerSide: {
    width: 36,
  },
  headerCenter: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[1],
  },
  headerTitle: {
    fontSize: fontSizes.lg,
    fontWeight: 'bold',
  },
  notificationButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: spacing[4],
  },
  avatarContainer: {
    marginBottom: spacing[2],
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  username: {
    fontSize: fontSizes.lg,
    fontWeight: 'bold',
    marginBottom: spacing[1],
  },
  email: {
    fontSize: fontSizes.sm,
    marginBottom: spacing[2],
  },
  levelBadgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[2],
    borderRadius: 20,
  },
  trophyIcon: {
    fontSize: fontSizes.md,
    marginRight: spacing[1],
  },
  levelBadgeText: {
    fontSize: fontSizes.sm,
    fontWeight: '600',
  },
  levelXpText: {
    fontSize: fontSizes.sm,
  },
});
