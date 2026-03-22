import { View, StyleSheet, ScrollView } from 'react-native';
import { Controller } from 'react-hook-form';
import { Ionicons } from '@expo/vector-icons';
import {
  Screen,
  Input,
  AuthHeader,
  PatternBackground,
  AuthOrGoogleFooter,
  Button,
} from '@/shared/ui';
import { colors, spacing, sizes } from '@/shared/constants/theme';
import type { EmailLoginScreenProps } from '@/shared/types';
import { AuthHeaderVariant } from '@/shared/utils/enum';
import type { UseLoginReturn } from '../../hooks/useLogin.types';

export type EmailLoginViewProps = EmailLoginScreenProps & UseLoginReturn;

export function EmailLoginScreen({
  navigation: _navigation,
  control,
  onSubmit,
  errors,
  isValid,
  isSubmitting,
  onBeforeBack,
  onGooglePress,
  onFooterLinkPress,
  loginScreenStrings,
  signUpScreenStrings,
}: EmailLoginViewProps) {
  return (
    <Screen padding={0}>
      <PatternBackground text={loginScreenStrings.backgroundPattern.watermarkText} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <AuthHeader
          variant={AuthHeaderVariant.Left}
          canGoBack
          showTitleHand
          onBeforeBack={onBeforeBack}
          title={loginScreenStrings.emailLoginScreen.title}
          subtitle={loginScreenStrings.emailLoginScreen.subtitle}
        />

        <View style={styles.form}>
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholder={loginScreenStrings.emailLoginForm.emailPlaceholder}
                keyboardType="email-address"
                autoCapitalize="none"
                editable={!isSubmitting}
                error={errors.email?.message}
                leftComponent={
                  <Ionicons name="mail-outline" size={sizes.icon20} color={colors.textSecondary} />
                }
                containerStyle={styles.inputContainer}
              />
            )}
          />

          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholder={loginScreenStrings.emailLoginForm.passwordPlaceholder}
                isPassword
                editable={!isSubmitting}
                error={errors.password?.message}
                containerStyle={styles.inputContainer}
              />
            )}
          />

          <Button
            variant="primary"
            loading={isSubmitting}
            disabled={!isValid || isSubmitting}
            onPress={onSubmit}
            style={styles.submitButton}
          >
            {loginScreenStrings.emailLoginForm.submitLogIn}
          </Button>

          <AuthOrGoogleFooter
            orLabel={signUpScreenStrings.divider.or}
            googleButtonLabel={signUpScreenStrings.social.continueWithGoogle}
            footerLeadText={loginScreenStrings.emailLoginForm.footerLeadNoAccount}
            footerLinkLabel={loginScreenStrings.emailLoginForm.navigateToSignUp}
            onGooglePress={onGooglePress}
            onFooterLinkPress={onFooterLinkPress}
          />
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: spacing[5],
    paddingTop: spacing[4],
    paddingBottom: spacing[6],
  },
  form: {
    gap: spacing[3],
  },
  inputContainer: {
    gap: spacing[2],
  },
  submitButton: {
    marginTop: spacing[2],
  },
});
