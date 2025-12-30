import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  StatusBar,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import { COLORS, SIZES } from '../constants/theme';
import { useAuth } from '../contexts/AuthContext';

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
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
      
      {/* Background pattern - simplified */}
      <View style={styles.backgroundPattern}>
        {[...Array(20)].map((_, i) => (
          <View key={i} style={styles.patternItem}>
            <Text style={styles.patternText}>LB</Text>
          </View>
        ))}
      </View>

      <View style={styles.content}>
        {/* Logo */}
        <View style={styles.logoContainer}>
          <View style={styles.logo}>
            <Text style={styles.logoText}>LB</Text>
          </View>
        </View>

        {/* Title */}
        <View style={styles.titleContainer}>
          <Text style={styles.title}>
            Legacy <Text style={styles.titleAccent}>Battle</Text>
          </Text>
          <Text style={styles.subtitle}>Create Battle And Win Challenges</Text>
        </View>

        {/* Auth Buttons */}
        <View style={styles.buttonsContainer}>
          {!showEmailLogin ? (
            <>
              <TouchableOpacity 
                style={styles.socialButton}
                onPress={() => handleSocialLogin('Apple')}
              >
                <Ionicons name="logo-apple" size={20} color={COLORS.text} />
                <Text style={styles.socialButtonText}>Continue With Apple</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.socialButton}
                onPress={() => handleSocialLogin('Facebook')}
              >
                <FontAwesome name="facebook" size={20} color="#1877F2" />
                <Text style={styles.socialButtonText}>Continue With Facebook</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.socialButton}
                onPress={() => handleSocialLogin('Google')}
              >
                <Image
                  source={{ uri: 'https://www.google.com/favicon.ico' }}
                  style={styles.googleIcon}
                />
                <Text style={styles.socialButtonText}>Continue With Google</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.socialButton}
                onPress={() => setShowEmailLogin(true)}
              >
                <Ionicons name="mail-outline" size={20} color={COLORS.text} />
                <Text style={styles.socialButtonText}>Continue With Email</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.createAccountButton}
                onPress={() => navigation.navigate('SignUp')}
              >
                <Text style={styles.createAccountText}>Create Account</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <View style={styles.inputContainer}>
                <View style={styles.inputWrapper}>
                  <Ionicons name="mail-outline" size={20} color={COLORS.textSecondary} />
                  <TextInput
                    style={styles.input}
                    placeholder="Email"
                    placeholderTextColor={COLORS.textMuted}
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
                  <Ionicons name="lock-closed-outline" size={20} color={COLORS.textSecondary} />
                  <TextInput
                    style={styles.input}
                    placeholder="Password"
                    placeholderTextColor={COLORS.textMuted}
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
                  <ActivityIndicator color={COLORS.white} />
                ) : (
                  <Text style={styles.createAccountText}>Log In</Text>
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
                <Text style={styles.backToOptionsText}>Back to login options</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.createAccountLink}
                onPress={() => navigation.navigate('SignUp')}
              >
                <Text style={styles.createAccountLinkText}>
                  Don't have an account? <Text style={styles.createAccountLinkBold}>Sign Up</Text>
                </Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
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
    color: COLORS.primary,
    fontSize: 20,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    paddingHorizontal: SIZES.padding * 2,
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: SIZES.padding * 2,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    color: COLORS.white,
    fontSize: 28,
    fontWeight: 'bold',
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: SIZES.padding * 3,
  },
  title: {
    fontSize: SIZES.xxxl,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  titleAccent: {
    color: COLORS.primary,
    fontStyle: 'italic',
  },
  subtitle: {
    fontSize: SIZES.font,
    color: COLORS.textSecondary,
    marginTop: SIZES.base,
  },
  buttonsContainer: {
    gap: SIZES.base * 1.5,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.inputBackground,
    paddingVertical: SIZES.padding,
    borderRadius: SIZES.radius,
    borderWidth: 1,
    borderColor: COLORS.inputBorder,
    gap: SIZES.base,
  },
  socialButtonText: {
    color: COLORS.text,
    fontSize: SIZES.medium,
    fontWeight: '500',
  },
  googleIcon: {
    width: 20,
    height: 20,
  },
  createAccountButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: SIZES.padding,
    borderRadius: SIZES.radius,
    alignItems: 'center',
    marginTop: SIZES.base,
  },
  createAccountText: {
    color: COLORS.white,
    fontSize: SIZES.medium,
    fontWeight: 'bold',
  },
  inputContainer: {
    gap: SIZES.base,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.inputBackground,
    borderRadius: SIZES.radius,
    borderWidth: 1,
    borderColor: COLORS.inputBorder,
    paddingHorizontal: SIZES.padding,
    gap: SIZES.base,
  },
  input: {
    flex: 1,
    color: COLORS.text,
    fontSize: SIZES.medium,
    paddingVertical: SIZES.padding,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  backToOptionsButton: {
    alignItems: 'center',
    paddingVertical: SIZES.base,
  },
  backToOptionsText: {
    color: COLORS.textSecondary,
    fontSize: SIZES.font,
  },
  createAccountLink: {
    alignItems: 'center',
    paddingVertical: SIZES.base,
  },
  createAccountLinkText: {
    color: COLORS.textSecondary,
    fontSize: SIZES.font,
  },
  createAccountLinkBold: {
    color: COLORS.text,
    fontWeight: 'bold',
  },
});
