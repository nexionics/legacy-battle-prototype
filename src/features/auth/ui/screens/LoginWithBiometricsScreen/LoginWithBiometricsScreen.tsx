import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Controller } from 'react-hook-form';
import { Ionicons } from '@expo/vector-icons';
import { Screen, Input, Button, AppText, KeyboardAwareScroll, ActionPromptModal } from '@/shared/ui';
import { colors, spacing, sizes } from '@/shared/constants/theme';
import type { LoginWithBiometricsScreenProps } from '@/shared/types';
import type { UseLoginWithBiometricsReturn } from '../../hooks/hooks.types';

export type LoginWithBiometricsViewProps = LoginWithBiometricsScreenProps &
  UseLoginWithBiometricsReturn;

export function LoginWithBiometricsScreen({
  passwordRef,
  displayName,
  accountEmail,
  control,
  onSubmit,
  errors,
  isValid,
  isSubmitting,
  biometricBusy,
  onBiometricLoginPress,
  onForgotPasswordPress,
  onNotYouPress,
  notYouPromptVisible,
  onNotYouPromptConfirm,
  onNotYouPromptCancel,
  loginScreenStrings,
}: LoginWithBiometricsViewProps) {
  const s = loginScreenStrings.loginWithBiometricsScreen;

  return (
    <Screen padding={spacing[5]}>
      <KeyboardAwareScroll contentContainerStyle={styles.container}>
        <View style={styles.topRow}>
          <TouchableOpacity
            onPress={onNotYouPress}
            disabled={isSubmitting || biometricBusy}
            accessibilityRole="button"
            accessibilityLabel={s.notYou}
          >
            <AppText variant="body2" color={colors.primary} style={styles.notYouTop}>
              {`Not ${displayName} ?`}
            </AppText>
          </TouchableOpacity>
        </View>

        <View style={styles.hero}>
          <AppText variant="h4" style={styles.title}>
            {`${s.title}, ${displayName}`}
          </AppText>
          <AppText variant="body2" color={colors.textSecondary} style={styles.subtitle}>
            {s.subtitle}
          </AppText>
          {accountEmail ? (
            <AppText variant="body2" color={colors.textSecondary} style={styles.email}>
              {accountEmail}
            </AppText>
          ) : null}
        </View>

        <View style={styles.form}>
          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                ref={passwordRef}
                label={s.passwordPlaceholder}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholder={s.passwordPlaceholder}
                isPassword
                editable={!isSubmitting && !biometricBusy}
                error={errors.password?.message}
                containerStyle={styles.inputContainer}
              />
            )}
          />

          <TouchableOpacity
            onPress={onForgotPasswordPress}
            disabled={isSubmitting || biometricBusy}
            accessibilityRole="button"
            accessibilityLabel={s.forgotPassword}
          >
            <AppText variant="body2" color={colors.primary} style={styles.forgotLink}>
              {s.forgotPassword}
            </AppText>
          </TouchableOpacity>
        </View>

        <View style={styles.bottomActions}>
          <Button
            variant="primary"
            loading={isSubmitting}
            disabled={!isValid || isSubmitting || biometricBusy}
            onPress={onSubmit}
            style={styles.primaryButton}
          >
            {s.submitLogIn}
          </Button>

          <TouchableOpacity
            onPress={onBiometricLoginPress}
            disabled={isSubmitting || biometricBusy}
            accessibilityRole="button"
            accessibilityLabel={s.loginWithBiometrics}
          >
            <View style={styles.biometricLinkRow}>
              <Ionicons name="finger-print-outline" size={sizes.icon20} color={colors.primary} />
              <AppText variant="body1" color={colors.primary} style={styles.biometricText}>
                {s.loginWithBiometrics}
              </AppText>
            </View>
          </TouchableOpacity>
        </View>
      </KeyboardAwareScroll>

      <ActionPromptModal
        visible={notYouPromptVisible}
        title={s.notYouSignOutTitle}
        message={s.notYouSignOutMessage}
        confirmLabel={s.notYouSignOutConfirm}
        cancelLabel={s.notYouSignOutCancel}
        onConfirm={onNotYouPromptConfirm}
        onCancel={onNotYouPromptCancel}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
    marginVertical: spacing[5],
  },
  backButton: {
    padding: spacing[1],
  },
  hero: {
    alignItems: 'flex-start',
    marginBottom: spacing[5],
    gap: spacing[2],
  },
  title: {
    textAlign: 'left',
  },
  subtitle: {
    textAlign: 'left',
  },
  email: {
    textAlign: 'left',
  },
  form: {
    gap: spacing[3],
  },
  inputContainer: {
    gap: spacing[2],
  },
  forgotLink: {
    textAlign: 'left',
    paddingVertical: spacing[1],
  },
  bottomActions: {
    marginTop: 'auto',
    gap: spacing[5],
    paddingBottom: spacing[5],
  },
  primaryButton: {
    marginTop: spacing[1],
  },
  biometricLinkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[2],
  },
  biometricText: {
    textDecorationLine: 'underline',
  },
  notYouTop: {
    textDecorationLine: 'underline',
  },
});
