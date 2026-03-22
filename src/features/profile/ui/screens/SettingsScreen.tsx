import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColors } from '@/app/providers/ThemeProvider';
import { spacing, radii } from '@/shared/theme';
import { AppText, Screen, ScreenHeader, SettingSection, SettingRow } from '@/shared/ui';
import type { SettingsScreenProps } from '@/shared/types';

export default function SettingsScreen({ navigation }: SettingsScreenProps) {
  const colors = useThemeColors();
  const [notifications, setNotifications] = React.useState({
    challenges: true,
    updates: true,
    system: false,
  });

  const toggleNotification = (key: keyof typeof notifications) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <Screen scroll padding={spacing[4]}>
      <ScreenHeader title="Settings" onBack={() => navigation.goBack()} style={styles.header} />

      <SettingSection title="ACCOUNT">
        <SettingRow
          icon="person-outline"
          title="Account Details"
          subtitle="Personal Information's"
          onPress={() => navigation.navigate('AccountDetails')}
          iconColor="#33A0FF"
          iconBgColor="#0088FF33"
        />
        <SettingRow
          icon="lock-closed-outline"
          title="Security & Privacy"
          subtitle="Private Details"
          onPress={() => {}}
          iconColor="#FF6B3D"
          iconBgColor="#FF6B3D33"
        />
      </SettingSection>

      <SettingSection
        icon="notifications-outline"
        title="Notifications"
        subtitle="Manage Your Notification Preferences"
      >
        <SettingRow
          icon="flash-outline"
          title="Challenge Details"
          subtitle="Personal Information's"
          showChevron={false}
          iconColor="#EF4444"
          iconBgColor="#EF444433"
          rightSlot={
            <TouchableOpacity onPress={() => toggleNotification('challenges')}>
              <View
                style={[
                  styles.switchTrack,
                  {
                    backgroundColor: notifications.challenges ? colors.primary : colors.black,
                  },
                ]}
              >
                <View
                  style={[
                    styles.switchThumb,
                    { transform: [{ translateX: notifications.challenges ? 20 : 0 }] },
                  ]}
                />
              </View>
            </TouchableOpacity>
          }
        />
        <SettingRow
          icon="card-outline"
          title="Bc Updates"
          subtitle="Personal Information's"
          showChevron={false}
          iconColor="#FDE047"
          iconBgColor="#FDE04733"
          rightSlot={
            <TouchableOpacity onPress={() => toggleNotification('updates')}>
              <View
                style={[
                  styles.switchTrack,
                  {
                    backgroundColor: notifications.updates ? colors.primary : colors.black,
                  },
                ]}
              >
                <View
                  style={[
                    styles.switchThumb,
                    { transform: [{ translateX: notifications.updates ? 20 : 0 }] },
                  ]}
                />
              </View>
            </TouchableOpacity>
          }
        />
        <SettingRow
          icon="settings-outline"
          title="System Updates"
          subtitle="Personal Information's"
          showChevron={false}
          iconColor="#94A3B8"
          iconBgColor="#94A3B833"
          rightSlot={
            <TouchableOpacity onPress={() => toggleNotification('system')}>
              <View
                style={[
                  styles.switchTrack,
                  { backgroundColor: notifications.system ? colors.primary : colors.black },
                ]}
              >
                <View
                  style={[
                    styles.switchThumb,
                    { transform: [{ translateX: notifications.system ? 20 : 0 }] },
                  ]}
                />
              </View>
            </TouchableOpacity>
          }
        />
      </SettingSection>

      <SettingSection
        icon="notifications-outline"
        title="Legal & Support"
        subtitle="Manage Your Notification Preferences"
      >
        <SettingRow
          icon="document-text-outline"
          title="Terms Of Service"
          subtitle="Personal Information's"
          onPress={() => {}}
          iconColor="#FFD3A3"
          iconBgColor="#FEEEE633"
        />
        <SettingRow
          icon="shield-checkmark-outline"
          title="Privacy & Policy"
          subtitle="Personal Information's"
          onPress={() => navigation.navigate('PrivacyPolicy')}
          iconColor="#FFD3A3"
          iconBgColor="#FEEEE633"
        />
        <SettingRow
          icon="mail-outline"
          title="Contact Us"
          subtitle="Personal Information's"
          onPress={() => navigation.navigate('ContactUs')}
          iconColor="#FFD3A3"
          iconBgColor="#FEEEE633"
        />
      </SettingSection>

      <View style={styles.footer}>
        <AppText variant="captionSm" style={[styles.versionText, { color: colors.textSecondary }]}>
          Version 1.0.0
        </AppText>

        <TouchableOpacity
          style={[
            styles.logoutButton,
            { backgroundColor: colors.error + '20', borderColor: colors.error + '40' },
          ]}
          onPress={() => {}}
        >
          <AppText variant="buttonMd" style={{ color: colors.error }}>
            Log Out
          </AppText>
          <Ionicons
            name="log-out-outline"
            size={20}
            color={colors.error}
            style={styles.logoutIcon}
          />
        </TouchableOpacity>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    marginBottom: spacing[4],
  },
  switchTrack: {
    width: 44,
    height: 24,
    borderRadius: 12,
    padding: 2,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#333',
  },
  switchThumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FFF',
  },
  footer: {
    marginTop: spacing[4],
    marginBottom: spacing[6],
    alignItems: 'center',
  },
  versionText: {
    marginBottom: spacing[4],
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingVertical: spacing[4],
    borderRadius: radii.xl,
    borderWidth: 1,
  },
  logoutIcon: {
    marginLeft: spacing[2],
  },
});
