import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/features/auth/ui/hooks/useAuth';
import { useAuthFormStore } from '@/features/auth/data/store/authForm.store';
import { Screen, AppText } from '@/shared/ui';
import { colors, spacing, fontSizes, radii } from '@/shared/theme';
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
      Alert.alert('Missing Info', 'Please fill in all fields');
      return;
    }

    if (signUpPassword !== signUpConfirmPassword) {
      Alert.alert('Password Mismatch', 'Passwords do not match');
      return;
    }

    if (signUpPassword.length < 6) {
      Alert.alert('Weak Password', 'Password must be at least 6 characters');
      return;
    }

    setSignUpLoading(true);
    const { error } = await signUp({ email: signUpEmail, password: signUpPassword });
    setSignUpLoading(false);

    if (error) {
      Alert.alert('Sign Up Failed', error);
      return;
    }

    Alert.alert(
      'Account Created',
      'Please check your email to confirm your account, then log in.',
      [{ text: 'OK', onPress: () => navigation.navigate('Login') }],
    );
  };

  const handleSocialSignUp = (provider: string) => {
    Alert.alert('Coming Soon', `${provider} sign up will be available in a future update.`);
  };

  return (
    <Screen padding={0}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>

        <View style={styles.logoContainer}>
          <View style={styles.logo}>
            <AppText variant="h3" color={colors.white}>
              LB
            </AppText>
          </View>
        </View>

        <View style={styles.titleContainer}>
          <AppText variant="h2" style={styles.title}>
            Welcome, Legend-In-The-Making!
          </AppText>
          <AppText variant="body1" color={colors.textSecondary} style={styles.subtitle}>
            Create An Account To Start Battling
          </AppText>
        </View>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <AppText variant="label" color={colors.textSecondary} style={styles.inputLabel}>
              Email Address
            </AppText>
            <View style={styles.inputWrapper}>
              <Ionicons name="mail-outline" size={20} color={colors.textSecondary} />
              <TextInput
                style={styles.input}
                placeholder="Enter Email"
                placeholderTextColor={colors.muted}
                value={signUpEmail}
                onChangeText={setSignUpEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
          </View>

          <View style={styles.inputContainer}>
            <AppText variant="label" color={colors.textSecondary} style={styles.inputLabel}>
              Enter Password
            </AppText>
            <View style={styles.inputWrapper}>
              <Ionicons name="lock-closed-outline" size={20} color={colors.textSecondary} />
              <TextInput
                style={styles.input}
                placeholder="Enter Password"
                placeholderTextColor={colors.muted}
                value={signUpPassword}
                onChangeText={setSignUpPassword}
                secureTextEntry={!showSignUpPassword}
              />
              <TouchableOpacity onPress={() => setShowSignUpPassword(!showSignUpPassword)}>
                <Ionicons
                  name={showSignUpPassword ? 'eye-outline' : 'eye-off-outline'}
                  size={20}
                  color={colors.textSecondary}
                />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.inputContainer}>
            <AppText variant="label" color={colors.textSecondary} style={styles.inputLabel}>
              Confirm Password
            </AppText>
            <View style={styles.inputWrapper}>
              <Ionicons name="lock-closed-outline" size={20} color={colors.textSecondary} />
              <TextInput
                style={styles.input}
                placeholder="Enter Password"
                placeholderTextColor={colors.muted}
                value={signUpConfirmPassword}
                onChangeText={setSignUpConfirmPassword}
                secureTextEntry={!showSignUpConfirmPassword}
              />
              <TouchableOpacity onPress={() => setShowSignUpConfirmPassword(!showSignUpConfirmPassword)}>
                <Ionicons
                  name={showSignUpConfirmPassword ? 'eye-outline' : 'eye-off-outline'}
                  size={20}
                  color={colors.textSecondary}
                />
              </TouchableOpacity>
            </View>
          </View>

          <AppText variant="captionSm" color={colors.textSecondary} style={styles.termsText}>
            By Continuing You Agree To Our{' '}
            <AppText variant="captionSm" color={colors.primary} style={styles.termsLink}>
              Terms
            </AppText>{' '}
            And{' '}
            <AppText variant="captionSm" color={colors.primary} style={styles.termsLink}>
              Conditions
            </AppText>
          </AppText>

          <TouchableOpacity
            style={[styles.signUpButton, signUpLoading && styles.buttonDisabled]}
            onPress={handleSignUp}
            disabled={signUpLoading}
          >
            {signUpLoading ? (
              <ActivityIndicator color={colors.white} />
            ) : (
              <>
                <AppText variant="body1" color={colors.white} style={styles.signUpButtonText}>
                  Sign Up
                </AppText>
                <Ionicons name="arrow-forward" size={20} color={colors.white} />
              </>
            )}
          </TouchableOpacity>

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <AppText variant="captionSm" color={colors.textSecondary} style={styles.dividerText}>
              Or
            </AppText>
            <View style={styles.dividerLine} />
          </View>

          <TouchableOpacity
            style={styles.googleButton}
            onPress={() => handleSocialSignUp('Google')}
          >
            <Image
              source={{ uri: 'https://www.google.com/favicon.ico' }}
              style={styles.googleIcon}
            />
            <AppText variant="body1" style={styles.googleButtonText}>
              Continue With Google
            </AppText>
          </TouchableOpacity>

          <View style={styles.loginContainer}>
            <AppText variant="body1" color={colors.textSecondary} style={styles.loginText}>
              Already have an account?{' '}
            </AppText>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <AppText variant="body1" color={colors.text} style={styles.loginLink}>
                Log in
              </AppText>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: spacing[5],
    paddingBottom: spacing[6],
  },
  header: {
    paddingTop: spacing[4],
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: spacing[4],
    marginBottom: spacing[4],
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
    marginBottom: spacing[5],
  },
  title: {
    marginBottom: spacing[2],
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
  inputLabel: {
    fontSize: fontSizes.xs,
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
  termsText: {
    fontSize: fontSizes.xs,
    textAlign: 'center',
  },
  termsLink: {
    color: colors.primary,
    textDecorationLine: 'underline',
  },
  signUpButton: {
    flexDirection: 'row',
    backgroundColor: colors.primary,
    paddingVertical: spacing[4],
    borderRadius: radii.lg,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[2],
  },
  signUpButtonText: {
    fontWeight: 'bold',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[4],
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.inputBorder,
  },
  dividerText: {
    fontSize: fontSizes.xs,
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.transparent,
    paddingVertical: spacing[4],
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.primary,
    gap: spacing[2],
  },
  googleIcon: {
    width: 20,
    height: 20,
  },
  googleButtonText: {
    fontWeight: '500',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginText: {
    fontSize: fontSizes.sm,
  },
  loginLink: {
    fontSize: fontSizes.sm,
    fontWeight: 'bold',
  },
  buttonDisabled: {
    opacity: 0.7,
  },
});
