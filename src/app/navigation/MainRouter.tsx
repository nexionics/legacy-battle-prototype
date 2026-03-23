import { NavigationContainer } from '@react-navigation/native';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { useAuthStore } from '@/features/auth/data/store/auth.store';
import AppStack from './AppStack';
import AuthStack from './AuthStack';

export default function MainRouter() {
  const isLoading = useAuthStore((s) => s.isLoading);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const needsUsername = useAuthStore((s) => s.needsUsername);
  const accessToken = useAuthStore((s) => s.accessToken);
  const _hasHydrated = useAuthStore((s) => s._hasHydrated);
  const isBiometricEnabled = useAuthStore((s) => s.isBiometricEnabled);
  const isLocallyUnlocked = useAuthStore((s) => s.isLocallyUnlocked);

  if (!_hasHydrated || isLoading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const inMainApp = Boolean(accessToken && isAuthenticated && !needsUsername);
  const showBiometricLock = inMainApp && isBiometricEnabled && !isLocallyUnlocked;
  const shouldShowCreateUsername = Boolean(accessToken && isAuthenticated && needsUsername);

  return (
    <NavigationContainer>
      {showBiometricLock ? (
        <AuthStack key="biometric-lock" initialRoute="LoginWithBiometrics" />
      ) : shouldShowCreateUsername ? (
        <AuthStack key="create-username" initialRoute="CreateUsername" />
      ) : inMainApp ? (
        <AppStack />
      ) : (
        <AuthStack key="auth-entry" />
      )}
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
