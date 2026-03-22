import { postLogout } from './api/authApi';
import { deleteRegisteredDevice } from './api/devicesApi';
import { logout as logoutBiometrics } from '../lib/biometrics';
import { useAuthStore } from './store/auth.store';

/**
 * Unregisters push (while the access token is still valid), notifies `POST /auth/logout`,
 * wipes biometric keys and SecureStore flags, then clears local auth state.
 */
let isLoggingOut = false;

export async function logoutSession(): Promise<void> {
  if (isLoggingOut) {
    return;
  }
  isLoggingOut = true;
  try {
    const { expoPushToken, accessToken } = useAuthStore.getState();

    if (accessToken && expoPushToken) {
      try {
        await deleteRegisteredDevice(expoPushToken);
      } catch {}
    }

    if (accessToken) {
      try {
        await postLogout();
      } catch {}
    }

    await logoutBiometrics();
    useAuthStore.getState().logout();
  } finally {
    isLoggingOut = false;
  }
}
