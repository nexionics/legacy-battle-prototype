import React, { useState } from 'react';
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
import { useAuth } from '../contexts/AuthContext';
import { Screen, AppText } from '../components/ui';
import { colors, spacing, fontSizes, radii } from '../theme';

interface LoginScreenProps {
  navigation: any;
}

export default function LoginScreen({ navigation }: LoginScreenProps) {
  const { signIn } = useAuth();
  const [showEmailLogin, setShowEmailLogin] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleEmailLogin = async () => {
    if (!email || !password) {
      Alert.alert('Missing Info', 'Please enter email and password');
      return;
    }

    setLoading(true);
    const { error } = await signIn({ email, password });
    setLoading(false);

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
            <AppText style={styles.patternText}>LB</AppText>
          </View>
        ))}
      </View>

      <View style={styles.content}>
        {/* Logo */}
        <View style={styles.logoContainer}>
          <View style={styles.logo}>
            <AppText variant="h2" color={colors.white}>LB</AppText>
          </View>
        </View>

        {/* Title */}
        <View style={styles.titleContainer}>
          <AppText variant="h1">
            Legacy <AppText variant="h1" color={colors.primary} style={styles.titleAccent}>Battle</AppText>
          </AppText>
          <AppText variant="body" color={colors.textSecondary} style={styles.subtitle}>Create Battle And Win Challenges</AppText>
        </View>

        {/* Auth Buttons */}
        <View style={styles.buttonsContainer}>
          {!showEmailLogin ? (
            <>
              <TouchableOpacity 
                style={styles.socialButton}
                onPress={() => handleSocialLogin('Apple')}
              >
                <Ionicons name="logo-apple" size={20} color={colors.text} />
                <AppText variant="body" style={styles.socialButtonText}>Continue With Apple</AppText>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.socialButton}
                onPress={() => handleSocialLogin('Facebook')}
              >
                <FontAwesome name="facebook" size={20} color="#1877F2" />
                <AppText variant="body" style={styles.socialButtonText}>Continue With Facebook</AppText>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.socialButton}
                onPress={() => handleSocialLogin('Google')}
              >
                <Image
                  source={{ uri: 'https://www.google.com/favicon.ico' }}
                  style={styles.googleIcon}
                />
                <AppText variant="body" style={styles.socialButtonText}>Continue With Google</AppText>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.socialButton}
                onPress={() => setShowEmailLogin(true)}
              >
                <Ionicons name="mail-outline" size={20} color={colors.text} />
                <AppText variant="body" style={styles.socialButtonText}>Continue With Email</AppText>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.createAccountButton}
                onPress={() => navigation.navigate('SignUp')}
              >
                <AppText variant="body" color={colors.white} style={styles.createAccountText}>Create Account</AppText>
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
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    editable={!loading}
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
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    editable={!loading}
                  />
                </View>
              </View>

              <TouchableOpacity
                style={[styles.createAccountButton, loading && styles.buttonDisabled]}
                onPress={handleEmailLogin}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color={colors.white} />
                ) : (
                  <AppText variant="body" color={colors.white} style={styles.createAccountText}>Log In</AppText>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.backToOptionsButton}
                onPress={() => {
                  setShowEmailLogin(false);
                  setEmail('');
                  setPassword('');
                }}
              >
                <AppText variant="body" color={colors.textSecondary}>Back to login options</AppText>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.createAccountLink}
                onPress={() => navigation.navigate('SignUp')}
              >
                <AppText variant="body" color={colors.textSecondary}>
                  Don't have an account? <AppText variant="label" color={colors.text}>Sign Up</AppText>
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
