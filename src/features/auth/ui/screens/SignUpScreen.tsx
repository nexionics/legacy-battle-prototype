import { View, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/features/auth/ui/hooks/useAuth';
import { useAuthFormStore } from '@/features/auth/data/store/authForm.store';
import {
  Screen,
  AppText,
  Input,
  AuthHeader,
  PatternBackground,
  AuthOrGoogleFooter,
  Button,
} from '@/shared/ui';
import { colors, spacing, fontSizes, fontWeights, sizes } from '@/shared/constants/theme';
import { authStrings, loginScreenStrings, signUpScreenStrings } from '@/features/auth/strings';
import { AuthHeaderVariant } from '@/shared/utils/enum';
import type { SignUpScreenProps } from '@/shared/types';

export default function SignUpScreen({ navigation }: SignUpScreenProps) {
  const { signUp } = useAuth();
  const {
    signUpEmail,
    signUpPassword,
    signUpConfirmPassword,
    showSignUpPassword,
    showSignUpConfirmPassword,
    signUpLoading,
    setSignUpEmail,
    setSignUpPassword,
    setSignUpConfirmPassword,
    setShowSignUpPassword,
    setShowSignUpConfirmPassword,
    setSignUpLoading,
  } = useAuthFormStore();

  const handleSignUp = async () => {
    if (!signUpEmail || !signUpPassword || !signUpConfirmPassword) {
      Alert.alert(
        signUpScreenStrings.alerts.missingFieldsTitle,
        signUpScreenStrings.alerts.missingFieldsMessage,
      );
      return;
    }

    if (signUpPassword !== signUpConfirmPassword) {
      Alert.alert(
        signUpScreenStrings.alerts.passwordMismatchTitle,
        signUpScreenStrings.alerts.passwordMismatchMessage,
      );
      return;
    }

    if (signUpPassword.length < 6) {
      Alert.alert(
        signUpScreenStrings.alerts.weakPasswordTitle,
        signUpScreenStrings.alerts.weakPasswordMessage,
      );
      return;
    }

    setSignUpLoading(true);
    const { error } = await signUp({ email: signUpEmail, password: signUpPassword });
    setSignUpLoading(false);

    if (error) {
      Alert.alert(signUpScreenStrings.alerts.signUpFailedTitle, error);
      return;
    }

    Alert.alert(
      signUpScreenStrings.alerts.accountCreatedTitle,
      signUpScreenStrings.alerts.accountCreatedMessage,
      [{ text: authStrings.alerts.actionConfirmOk, onPress: () => navigation.navigate('Login') }],
    );
  };

  const handleSocialSignUp = (provider: string) => {
    Alert.alert(authStrings.comingSoon.alertTitle, authStrings.comingSoon.signUpMessage(provider));
  };

  return (
    <Screen padding={0}>
      <PatternBackground text={loginScreenStrings.backgroundPattern.watermarkText} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <AuthHeader
          variant={AuthHeaderVariant.Left}
          canGoBack
          showTitleHand
          title={signUpScreenStrings.authHeader.welcomeTitle}
          subtitle={
            <AppText variant="body1" color={colors.textSecondary} style={styles.subtitle}>
              {signUpScreenStrings.authHeader.createAccountSubtitle}
            </AppText>
          }
        />

        <View style={styles.form}>
          <Input
            label={signUpScreenStrings.form.emailLabel}
            value={signUpEmail}
            onChangeText={setSignUpEmail}
            placeholder={signUpScreenStrings.form.emailPlaceholder}
            keyboardType="email-address"
            autoCapitalize="none"
            leftComponent={
              <Ionicons name="mail-outline" size={sizes.icon20} color={colors.textSecondary} />
            }
            containerStyle={styles.inputContainer}
          />

          <Input
            label={signUpScreenStrings.form.passwordLabel}
            value={signUpPassword}
            onChangeText={setSignUpPassword}
            placeholder={signUpScreenStrings.form.passwordPlaceholder}
            secureTextEntry={!showSignUpPassword}
            leftComponent={
              <Ionicons
                name="lock-closed-outline"
                size={sizes.icon20}
                color={colors.textSecondary}
              />
            }
            rightComponent={
              <TouchableOpacity onPress={() => setShowSignUpPassword(!showSignUpPassword)}>
                <Ionicons
                  name={showSignUpPassword ? 'eye-outline' : 'eye-off-outline'}
                  size={sizes.icon20}
                  color={colors.textSecondary}
                />
              </TouchableOpacity>
            }
            containerStyle={styles.inputContainer}
          />

          <Input
            label={signUpScreenStrings.form.confirmPasswordLabel}
            value={signUpConfirmPassword}
            onChangeText={setSignUpConfirmPassword}
            placeholder={signUpScreenStrings.form.passwordPlaceholder}
            secureTextEntry={!showSignUpConfirmPassword}
            leftComponent={
              <Ionicons
                name="lock-closed-outline"
                size={sizes.icon20}
                color={colors.textSecondary}
              />
            }
            rightComponent={
              <TouchableOpacity
                onPress={() => setShowSignUpConfirmPassword(!showSignUpConfirmPassword)}
              >
                <Ionicons
                  name={showSignUpConfirmPassword ? 'eye-outline' : 'eye-off-outline'}
                  size={sizes.icon20}
                  color={colors.textSecondary}
                />
              </TouchableOpacity>
            }
            containerStyle={styles.inputContainer}
          />

          <AppText variant="captionSm" color={colors.textSecondary} style={styles.termsText}>
            {signUpScreenStrings.legal.termsLeadIn}{' '}
            <AppText variant="captionSm" color={colors.primary} style={styles.termsLink}>
              {signUpScreenStrings.legal.termsWord}
            </AppText>{' '}
            {signUpScreenStrings.legal.termsConnector}{' '}
            <AppText variant="captionSm" color={colors.primary} style={styles.termsLink}>
              {signUpScreenStrings.legal.conditionsWord}
            </AppText>
          </AppText>

          <Button
            variant="primary"
            loading={signUpLoading}
            disabled={signUpLoading}
            onPress={handleSignUp}
            rightIcon={<Ionicons name="arrow-forward" size={sizes.icon20} color={colors.white} />}
          >
            {signUpScreenStrings.primaryCta.signUp}
          </Button>

          <AuthOrGoogleFooter
            orLabel={signUpScreenStrings.divider.or}
            googleButtonLabel={signUpScreenStrings.social.continueWithGoogle}
            footerLeadText={`${signUpScreenStrings.footer.hasAccountPrompt} `}
            footerLinkLabel={signUpScreenStrings.footer.logInCta}
            onGooglePress={() => handleSocialSignUp('Google')}
            onFooterLinkPress={() => navigation.navigate('EmailLogin')}
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
  subtitle: {
    fontSize: fontSizes.sm,
  },
  form: {
    gap: spacing[4],
  },
  inputContainer: {
    gap: spacing[2],
  },
  termsText: {
    fontSize: fontSizes.xs,
    textAlign: 'center',
  },
  termsLink: {
    color: colors.primary,
    textDecorationLine: 'underline',
  },
});
