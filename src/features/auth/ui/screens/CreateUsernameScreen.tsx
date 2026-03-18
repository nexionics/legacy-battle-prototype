import React from 'react';
import { View, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuthFormStore } from '@/features/auth/data/store/authForm.store';
import { Screen, AppText, ScreenHeader } from '@/shared/ui';
import { colors, spacing, radii, fontSizes, verticalScale, horizontalScale } from '@/shared/theme';
import type { CreateUsernameScreenProps } from '@/shared/types';

export default function CreateUsernameScreen({ navigation }: CreateUsernameScreenProps) {
  const { username, setUsername } = useAuthFormStore();
  const isAvailable = username.length > 0;

  return (
    <Screen>
      <View style={styles.content}>
        <ScreenHeader onBack={() => navigation.goBack()} />

        <View style={styles.logoContainer}>
          <View style={styles.logo}>
            <AppText variant="h3" color={colors.white}>LB</AppText>
          </View>
        </View>

        <View style={styles.titleContainer}>
          <AppText variant="h2">Create A Username</AppText>
          <AppText variant="body1" color={colors.textSecondary} style={styles.subtitle}>
            Enter A Username To Start Your Legacy
          </AppText>
        </View>

        <View style={styles.inputContainer}>
          <AppText variant="label" color={colors.textSecondary}>Enter Username</AppText>
          <View style={[styles.inputWrapper, isAvailable && styles.inputWrapperValid]}>
            <Ionicons name="person-outline" size={20} color={colors.textSecondary} />
            <TextInput
              style={styles.input}
              placeholder="Enter Username"
              placeholderTextColor={colors.muted}
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
            />
            {isAvailable ? (
              <View style={styles.checkIcon}>
                <Ionicons name="checkmark" size={16} color={colors.white} />
              </View>
            ) : null}
          </View>
          {isAvailable ? (
            <AppText variant="helper" color={colors.success} style={styles.availableText}>
              Username Is Available
            </AppText>
          ) : null}
        </View>

        <TouchableOpacity
          style={styles.startButton}
          onPress={() => navigation.navigate('MainTabs')}
        >
          <AppText variant="buttonLg" color={colors.white}>Start Battle</AppText>
          <AppText variant="body1">⚔</AppText>
        </TouchableOpacity>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingHorizontal: horizontalScale(24),
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: verticalScale(32),
  },
  logo: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleContainer: {
    marginBottom: verticalScale(32),
  },
  subtitle: {
    marginTop: verticalScale(8),
  },
  inputContainer: {
    marginBottom: verticalScale(32),
    gap: spacing[2],
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.inputBackground,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    paddingHorizontal: spacing[4],
    gap: spacing[2],
  },
  inputWrapperValid: {
    borderColor: colors.success,
  },
  input: {
    flex: 1,
    color: colors.text,
    fontSize: fontSizes.md,
    paddingVertical: spacing[4],
  },
  checkIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
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
    paddingVertical: verticalScale(16),
    borderRadius: radii.lg,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[2],
  },
});
