import { View, StyleSheet, Alert, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/features/auth/ui/hooks/useAuth';
import { useAuthFormStore } from '@/features/auth/data/store/authForm.store';
import {
  Screen,
  Input,
  AuthHeader,
  PatternBackground,
  AuthOrGoogleFooter,
  Button,
} from '@/shared/ui';
import { colors, spacing, sizes } from '@/shared/constants/theme';
import { authStrings, loginScreenStrings, signUpScreenStrings } from '@/features/auth/strings';
import type { EmailLoginScreenProps } from '@/shared/types';
import { AuthHeaderVariant } from '@/shared/utils/enum';

export default function EmailLoginScreen({ navigation }: EmailLoginScreenProps) {
  const { signIn } = useAuth();
  const {
    loginEmail,
    loginPassword,
    loginLoading,
    setLoginEmail,
    setLoginPassword,
    setLoginLoading,
    resetLoginForm,
  } = useAuthFormStore();

  const handleEmailLogin = async () => {
    if (!loginEmail || !loginPassword) {
      Alert.alert(
        loginScreenStrings.alerts.missingCredentialsTitle,
        loginScreenStrings.alerts.missingCredentialsMessage,
      );
      return;
    }

    setLoginLoading(true);
    const { error } = await signIn({ email: loginEmail, password: loginPassword });
    setLoginLoading(false);

    if (error) {
      Alert.alert(loginScreenStrings.alerts.loginFailedTitle, error);
    }
  };

  const handleGoogleLogin = () => {
    Alert.alert(authStrings.comingSoon.alertTitle, authStrings.comingSoon.loginMessage('Google'));
  };

  return (
    <Screen padding={0}>
      <PatternBackground text={loginScreenStrings.backgroundPattern.watermarkText} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <AuthHeader
          variant={AuthHeaderVariant.Left}
          canGoBack
          showTitleHand
          onBeforeBack={resetLoginForm}
          title={loginScreenStrings.emailLoginScreen.title}
          subtitle={loginScreenStrings.emailLoginScreen.subtitle}
        />

        <View style={styles.form}>
          <Input
            value={loginEmail}
            onChangeText={setLoginEmail}
            placeholder={loginScreenStrings.emailLoginForm.emailPlaceholder}
            keyboardType="email-address"
            autoCapitalize="none"
            editable={!loginLoading}
            leftComponent={
              <Ionicons name="mail-outline" size={sizes.icon20} color={colors.textSecondary} />
            }
            containerStyle={styles.inputContainer}
          />

          <Input
            value={loginPassword}
            onChangeText={setLoginPassword}
            placeholder={loginScreenStrings.emailLoginForm.passwordPlaceholder}
            secureTextEntry
            editable={!loginLoading}
            leftComponent={
              <Ionicons
                name="lock-closed-outline"
                size={sizes.icon20}
                color={colors.textSecondary}
              />
            }
            containerStyle={styles.inputContainer}
          />

          <Button
            variant="primary"
            loading={loginLoading}
            disabled={loginLoading}
            onPress={handleEmailLogin}
            style={styles.submitButton}
          >
            {loginScreenStrings.emailLoginForm.submitLogIn}
          </Button>

          <AuthOrGoogleFooter
            orLabel={signUpScreenStrings.divider.or}
            googleButtonLabel={signUpScreenStrings.social.continueWithGoogle}
            footerLeadText={loginScreenStrings.emailLoginForm.footerLeadNoAccount}
            footerLinkLabel={loginScreenStrings.emailLoginForm.navigateToSignUp}
            onGooglePress={handleGoogleLogin}
            onFooterLinkPress={() => navigation.navigate('SignUp')}
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
