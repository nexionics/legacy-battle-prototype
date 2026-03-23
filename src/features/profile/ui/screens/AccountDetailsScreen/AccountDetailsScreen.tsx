import { View, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColors } from '@/app/providers/ThemeProvider';
import { spacing, sizes, borderWidths } from '@/shared/theme';
import { Screen, ScreenHeader } from '@/shared/ui';
import type { AccountDetailsScreenProps } from '@/shared/types';
import type { UseAccountDetailsScreenReturn } from '../../hooks/useAccountDetailsScreen';
import { ActivityIndicator } from 'react-native';
import { InfoRow } from '../../components/InfoRow';
import { profileScreenLayout } from '../../theme/profileScreenLayout';

export type AccountDetailsScreenViewProps = AccountDetailsScreenProps &
  UseAccountDetailsScreenReturn;

export function AccountDetailsScreen({
  displayName,
  email,
  avatarUrl,
  updateAvatarPending,
  handleEditAvatar,
  accountDetailsScreenStrings,
  onBack,
  onEditUsername,
  onEditEmail,
}: AccountDetailsScreenViewProps) {
  const colors = useThemeColors();

  return (
    <Screen padding={spacing[4]}>
      <ScreenHeader title={accountDetailsScreenStrings.headerTitle} onBack={onBack} />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.avatarContainer}>
          <View
            style={[
              styles.avatarWrapper,
              {
                width: profileScreenLayout.avatarWidth,
                height: profileScreenLayout.avatarHeight,
              },
            ]}
          >
            {avatarUrl ? (
              <Image
                source={{ uri: avatarUrl }}
                style={[
                  styles.avatarBase,
                  {
                    width: profileScreenLayout.avatarWidth,
                    height: profileScreenLayout.avatarHeight,
                    borderRadius: profileScreenLayout.avatarBorderRadius,
                    borderColor: colors.error,
                  },
                ]}
              />
            ) : (
              <View
                style={[
                  styles.avatarBase,
                  styles.avatarPlaceholder,
                  {
                    width: profileScreenLayout.avatarWidth,
                    height: profileScreenLayout.avatarHeight,
                    borderRadius: profileScreenLayout.avatarBorderRadius,
                    backgroundColor: colors.card,
                    borderColor: colors.error,
                  },
                ]}
              >
                <Ionicons name="person" size={sizes.icon24} color={colors.textSecondary} />
              </View>
            )}
            <TouchableOpacity
              style={[
                styles.editBadge,
                {
                  backgroundColor: colors.primary,
                  borderColor: colors.background,
                  width: profileScreenLayout.editBadgeWidth,
                  height: profileScreenLayout.editBadgeHeight,
                  borderRadius: profileScreenLayout.editBadgeBorderRadius,
                  bottom: profileScreenLayout.editBadgeBottom,
                  right: profileScreenLayout.editBadgeRight,
                },
              ]}
              onPress={handleEditAvatar}
              disabled={updateAvatarPending}
            >
              {updateAvatarPending ? (
                <ActivityIndicator size="small" color={colors.white} />
              ) : (
                <Ionicons name="camera" size={sizes.icon16} color={colors.white} />
              )}
            </TouchableOpacity>
          </View>
        </View>

        <View style={[styles.infoContainer, { maxWidth: profileScreenLayout.infoContentMaxWidth }]}>
          <InfoRow
            icon="person-outline"
            label={accountDetailsScreenStrings.usernameLabel}
            value={displayName}
            onEdit={onEditUsername}
          />
          <View style={[styles.divider, { backgroundColor: colors.inputBorder }]} />
          <InfoRow
            icon="mail-outline"
            label={accountDetailsScreenStrings.emailLabel}
            value={email}
            onEdit={onEditEmail}
          />
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingTop: spacing[6],
    alignItems: 'flex-start',
    width: '100%',
    paddingHorizontal: spacing[4],
  },
  avatarContainer: {
    marginBottom: spacing[5],
  },
  avatarWrapper: {
    position: 'relative',
  },
  avatarBase: {
    borderWidth: borderWidths.hairline,
  },
  avatarPlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  editBadge: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: borderWidths.thick,
  },
  infoContainer: {
    width: '100%',
  },
  divider: {
    height: borderWidths.hairline,
    width: '100%',
    opacity: 0.5,
  },
});
