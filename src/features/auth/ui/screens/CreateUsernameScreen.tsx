import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuthFormStore } from '@/features/auth/data/store/authForm.store';
import { useAuthStore } from '@/features/auth/data/store/auth.store';
import { Screen, AppText, ScreenHeader, Input, AuthHeader, PatternBackground } from '@/shared/ui';
import { colors, spacing, radii, sizes } from '@/shared/constants/theme';
import { createUsernameScreenStrings, loginScreenStrings } from '@/features/auth/strings';
import { AuthHeaderVariant } from '@/shared/utils/enum';
import type { CreateUsernameScreenProps } from '@/shared/types';

export default function CreateUsernameScreen({ navigation }: CreateUsernameScreenProps) {
  const { username, setUsername } = useAuthFormStore();
  const setToken = useAuthStore((s) => s.setToken);
  const setIsAuthenticated = useAuthStore((s) => s.setIsAuthenticated);
  const isAvailable = username.length > 0;

  const handleStartBattle = () => {
    setToken('signed-in');
    setIsAuthenticated(true);
  };

  return (
    <Screen padding={0}>
      <PatternBackground text={loginScreenStrings.backgroundPattern.watermarkText} />
      <View style={styles.content}>
        <ScreenHeader onBack={() => navigation.goBack()} />

        <AuthHeader
          variant={AuthHeaderVariant.Left}
          style={styles.authHeader}
          title={createUsernameScreenStrings.authHeader.screenTitle}
          subtitle={createUsernameScreenStrings.authHeader.screenSubtitle}
        />

        <View style={styles.inputContainer}>
          <Input
            label={createUsernameScreenStrings.form.usernameLabel}
            value={username}
            onChangeText={setUsername}
            placeholder={createUsernameScreenStrings.form.usernamePlaceholder}
            autoCapitalize="none"
            leftComponent={
              <Ionicons name="person-outline" size={sizes.icon20} color={colors.textSecondary} />
            }
            rightComponent={
              isAvailable ? (
                <View style={styles.checkIcon}>
                  <Ionicons name="checkmark" size={sizes.icon16} color={colors.white} />
                </View>
              ) : undefined
            }
            showSuccessBorder={isAvailable}
            containerStyle={styles.inputWrapperContainer}
          />
          {isAvailable ? (
            <AppText variant="helper" color={colors.success} style={styles.availableText}>
              {createUsernameScreenStrings.form.availabilitySuccess}
            </AppText>
          ) : null}
        </View>

        <TouchableOpacity style={styles.startButton} onPress={handleStartBattle}>
          <AppText variant="buttonLg" color={colors.white}>
            {createUsernameScreenStrings.primaryCta.startBattle}
          </AppText>
          <AppText variant="body1">{createUsernameScreenStrings.primaryCta.decorativeSwordEmoji}</AppText>
        </TouchableOpacity>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingHorizontal: spacing[5],
  },
  authHeader: {
    marginBottom: spacing[6],
  },
  inputContainer: {
    marginBottom: spacing[6],
    gap: spacing[2],
  },
  inputWrapperContainer: {},
  checkIcon: {
    width: sizes.checkIcon,
    height: sizes.checkIcon,
    borderRadius: radii.iconBadge,
    backgroundColor: colors.success,
    justifyContent: 'center',
    alignItems: 'center',
  },
  availableText: {
    marginTop: spacing[1],
  },
  startButton: {
    flexDirection: 'row',
    backgroundColor: colors.primary,
    paddingVertical: spacing[4],
    borderRadius: radii.lg,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[2],
  },
});
