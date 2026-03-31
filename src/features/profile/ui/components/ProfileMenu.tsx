import { View, TouchableOpacity, Switch, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppText, MenuRow } from '@/shared/ui';
import { spacing, radii, horizontalScale, moderate } from '@/shared/theme';
import { useThemeColors } from '@/app/providers/ThemeProvider';
import type { ProfileMenuProps } from '@/shared/types';
import { profileMenuStrings } from '../../string';

function Badge({ count, variant = 'default' }: { count: number; variant?: 'default' | 'pending' }) {
  const colors = useThemeColors();
  return (
    <View
      style={[
        styles.menuBadge,
        { backgroundColor: variant === 'pending' ? colors.warning : colors.primary },
      ]}
    >
      <AppText variant="captionSm" style={{ color: colors.white }}>
        {count}
      </AppText>
    </View>
  );
}

export function ProfileMenu({
  crewCount,
  followingCount,
  themeMode,
  onToggleTheme,
  onAchievementsPress,
  onStatisticsPress,
  onCrewPress,
  onWalletPress,
  onNotificationsPress,
  onLogout,
  onHelpPress,
}: ProfileMenuProps) {
  const colors = useThemeColors();
  return (
    <>
      <View style={[styles.menuSection, { backgroundColor: colors.card }]}>
        <MenuRow
          icon="trophy-outline"
          label={profileMenuStrings.achievements}
          onPress={onAchievementsPress}
          rightSlot={<Badge count={12} />}
        />

        <MenuRow
          icon="stats-chart-outline"
          label={profileMenuStrings.statistics}
          onPress={onStatisticsPress}
        />

        <MenuRow
          icon="people-outline"
          label={profileMenuStrings.crew}
          onPress={onCrewPress}
          rightSlot={
            <>
              {followingCount > 0 && <Badge count={followingCount} variant="pending" />}
              <Badge count={crewCount} />
            </>
          }
        />

        <MenuRow icon="wallet-outline" label={profileMenuStrings.wallet} onPress={onWalletPress} />

        <MenuRow
          icon="notifications-outline"
          label={profileMenuStrings.notifications}
          onPress={onNotificationsPress}
        />

        <MenuRow
          icon="help-circle-outline"
          label={profileMenuStrings.helpAndSupport}
          onPress={onHelpPress}
        />

        <MenuRow
          icon={themeMode === 'dark' ? 'moon-outline' : 'sunny-outline'}
          label={themeMode === 'dark' ? profileMenuStrings.darkMode : profileMenuStrings.lightMode}
          showChevron={false}
          rightSlot={
            <Switch
              value={themeMode === 'light'}
              onValueChange={onToggleTheme}
              trackColor={{ false: colors.inputBorder, true: colors.primary }}
              thumbColor={colors.white}
            />
          }
        />
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
        <Ionicons name="log-out-outline" size={moderate(20)} color={colors.primary} />
        <AppText variant="buttonMd">
          {profileMenuStrings.logOut}
        </AppText>
      </TouchableOpacity>
    </>
  );
}

const styles = StyleSheet.create({
  menuSection: {
    borderRadius: radii.lg,
    marginBottom: spacing[4],
    overflow: 'hidden',
  },
  menuBadge: {
    borderRadius: radii.lg,
    paddingHorizontal: spacing[2],
    paddingVertical: spacing[1],
    minWidth: horizontalScale(28),
    alignItems: 'center',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[2],
    paddingVertical: spacing[4],
    marginBottom: spacing[6],
  },
});
