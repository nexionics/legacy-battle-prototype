import '@/features/auth/data/api/authRefreshInterceptor';
import { View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/shared/lib/queryClient';
import {
  AuthProvider,
  PushNotificationProvider,
  ThemeProvider,
  ToastProvider,
  AppLockProvider,
} from '@/app/providers';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { useCachedResources } from '@/shared/hooks';
import { MainRouter } from '@/app/navigation';
import { SplashVideo } from '@/shared/ui';

function App() {
  const { isLoaded, isReady, onSplashFinish } = useCachedResources();

  if (!isLoaded) {
    return <View style={{ flex: 1 }} />;
  }

  if (!isReady) {
    return <SplashVideo onFinish={onSplashFinish} />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <ThemeProvider>
          <AuthProvider>
            <PushNotificationProvider>
              <ToastProvider>
                <BottomSheetModalProvider>
                  <AppLockProvider>
                    <MainRouter />
                  </AppLockProvider>
                </BottomSheetModalProvider>
              </ToastProvider>
            </PushNotificationProvider>
          </AuthProvider>
        </ThemeProvider>
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
}

export default App;
