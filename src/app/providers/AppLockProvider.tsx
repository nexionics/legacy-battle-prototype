import React, { useEffect, useRef } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { useAuthStore } from '@/features/auth/data/store/auth.store';

export const AppLockProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const setLocallyUnlocked = useAuthStore((s) => s.setLocallyUnlocked);
  const isBiometricEnabled = useAuthStore((s) => s.isBiometricEnabled);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  const appState = useRef(AppState.currentState);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState: AppStateStatus) => {
      if (appState.current === 'active' && nextAppState.match(/inactive|background/)) {
        if (isAuthenticated && isBiometricEnabled) {
          setLocallyUnlocked(false);
        }
      }
      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, [isAuthenticated, isBiometricEnabled, setLocallyUnlocked]);

  return <>{children}</>;
};
