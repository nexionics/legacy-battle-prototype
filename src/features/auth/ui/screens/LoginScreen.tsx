import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import { useAuth } from '@/features/auth/ui/hooks/useAuth';
import { useAuthFormStore } from '@/features/auth/data/store/authForm.store';
import { Screen, AppText } from '@/shared/ui';
import { colors, spacing, fontSizes, radii } from '@/shared/theme';
import type { LoginScreenProps } from '@/shared/types';

export default function LoginScreen({ navigation }: LoginScreenProps) {
  const { signIn } = useAuth();
  const {
    showEmailLogin,
    loginEmail,
    loginPassword,
    loginLoading,
    setShowEmailLogin,
    setLoginEmail,
    setLoginPassword,
    setLoginLoading,
    resetLoginForm,
  } = useAuthFormStore();

  const handleEmailLogin = async () => {
    if (!loginEmail || !loginPassword) {
      Alert.alert('Missing Info', 'Please enter email and password');
      return;
    }

    setLoginLoading(true);
    const { error } = await signIn({ email: loginEmail, password: loginPassword });
    setLoginLoading(false);

    if (error) {
      Alert.alert('Login Failed', error);
    }
  };

  const handleSocialLogin = (provider: string) => {
    Alert.alert('Coming Soon', `${provider} login will be available in a future update.`);
  };

  return (
    <Screen>
      <View style={styles.backgroundPattern}>
        {[...Array(20)].map((_, i) => (
          <View key={i} style={styles.patternItem}>
            <AppText variant="body1" style={styles.patternText}>LB</AppText>
          </View>
        ))}
      </View>

      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <View style={styles.logo}>
            <AppText variant="h2" color={colors.white}>
              LB
            </AppText>
          </View>
        </View>

        <View style={styles.titleContainer}>
          <AppText variant="h1">
            Legacy{' '}
            <AppText variant="h1" color={colors.primary} style={styles.titleAccent}>
              Battle
            </AppText>
          </AppText>
          <AppText variant="body1" color={colors.textSecondary} style={styles.subtitle}>
            Create Battle And Win Challenges
          </AppText>
        </View>

        <View style={styles.buttonsContainer}>
          {!showEmailLogin ? (
            <>
              <TouchableOpacity
                style={styles.socialButton}
                onPress={() => handleSocialLogin('Apple')}
              >
                <Ionicons name="logo-apple" size={20} color={colors.text} />
                <AppText variant="body1" style={styles.socialButtonText}>
                  Continue With Apple
                </AppText>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.socialButton}
                onPress={() => handleSocialLogin('Facebook')}
              >
                <FontAwesome name="facebook" size={20} color="#1877F2" />
                <AppText variant="body1" style={styles.socialButtonText}>
                  Continue With Facebook
                </AppText>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.socialButton}
                onPress={() => handleSocialLogin('Google')}
              >
                <Image
                  source={{ uri: 'https://www.google.com/favicon.ico' }}
                  style={styles.googleIcon}
                />
                <AppText variant="body1" style={styles.socialButtonText}>
                  Continue With Google
                </AppText>
              </TouchableOpacity>

              <TouchableOpacity style={styles.socialButton} onPress={() => setShowEmailLogin(true)}>
                <Ionicons name="mail-outline" size={20} color={colors.text} />
                <AppText variant="body1" style={styles.socialButtonText}>
                  Continue With Email
                </AppText>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.createAccountButton}
                onPress={() => navigation.navigate('SignUp')}
              >
                <AppText variant="body1" color={colors.white} style={styles.createAccountText}>
                  Create Account
                </AppText>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <View style={styles.inputContainer}>
                <View style={styles.inputWrapper}>
                  <Ionicons name="mail-outline" size={20} color={colors.textSecondary} />
                  <TextInput
                    style={styles.input}
                    placeholder="Email"
                    placeholderTextColor={colors.muted}
                    value={loginEmail}
                    onChangeText={setLoginEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    editable={!loginLoading}
                  />
                </View>
              </View>

              <View style={styles.inputContainer}>
                <View style={styles.inputWrapper}>
                  <Ionicons name="lock-closed-outline" size={20} color={colors.textSecondary} />
                  <TextInput
                    style={styles.input}
                    placeholder="Password"
                    placeholderTextColor={colors.muted}
                    value={loginPassword}
                    onChangeText={setLoginPassword}
                    secureTextEntry
                    editable={!loginLoading}
                  />
                </View>
              </View>

              <TouchableOpacity
                style={[styles.createAccountButton, loginLoading && styles.buttonDisabled]}
                onPress={handleEmailLogin}
                disabled={loginLoading}
              >
                {loginLoading ? (
                  <ActivityIndicator color={colors.white} />
                ) : (
                  <AppText variant="body1" color={colors.white} style={styles.createAccountText}>
                    Log In
                  </AppText>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.backToOptionsButton}
                onPress={resetLoginForm}
              >
                <AppText variant="body1" color={colors.textSecondary}>
                  Back to login options
                </AppText>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.createAccountLink}
                onPress={() => navigation.navigate('SignUp')}
              >
                <AppText variant="body1" color={colors.textSecondary}>
                  Don't have an account?{' '}
                  <AppText variant="label" color={colors.text}>
                    Sign Up
                  </AppText>
                </AppText>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  backgroundPattern: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    alignItems: 'center',
    opacity: 0.1,
  },
  patternItem: {
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
  },
  patternText: {
    color: colors.primary,
    fontSize: fontSizes.lg,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing[6],
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: spacing[6],
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: spacing[6] + spacing[4],
  },
  titleAccent: {
    fontStyle: 'italic',
  },
  subtitle: {
    marginTop: spacing[2],
  },
  buttonsContainer: {
    gap: spacing[3],
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.inputBackground,
    paddingVertical: spacing[4],
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    gap: spacing[2],
  },
  socialButtonText: {
    fontSize: fontSizes.md,
    fontWeight: '500',
  },
  googleIcon: {
    width: 20,
    height: 20,
  },
  createAccountButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing[4],
    borderRadius: radii.lg,
    alignItems: 'center',
    marginTop: spacing[2],
  },
  createAccountText: {
    fontSize: fontSizes.md,
    fontWeight: 'bold',
  },
  inputContainer: {
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
  input: {
    flex: 1,
    color: colors.text,
    fontSize: fontSizes.md,
    paddingVertical: spacing[4],
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  backToOptionsButton: {
    alignItems: 'center',
    paddingVertical: spacing[2],
  },
  createAccountLink: {
    alignItems: 'center',
    paddingVertical: spacing[2],
  },
});
