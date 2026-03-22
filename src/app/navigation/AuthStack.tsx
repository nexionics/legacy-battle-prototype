import {
  createNativeStackNavigator,
  type NativeStackNavigationOptions,
} from '@react-navigation/native-stack';
import { AuthStackParamList } from './types';
import {
  LoginWelcomeScreen,
  EmailLoginScreen,
  SignUpScreen,
  OTPVerificationScreen,
  ForgotPasswordScreen,
  VerifyResetOTPScreen,
  ResetPasswordScreen,
  CreateUsernameScreen,
  useAuthStore,
} from '@/features/auth';

const Stack = createNativeStackNavigator<AuthStackParamList>();
const headerOptions: NativeStackNavigationOptions = { headerShown: false };

const AuthStack = () => {
  const accessToken = useAuthStore((s) => s.accessToken);
  const needsUsername = useAuthStore((s) => s.needsUsername);
  const initialRouteName = accessToken && needsUsername ? 'CreateUsername' : 'Login';

  return (
    <Stack.Navigator initialRouteName={initialRouteName} screenOptions={headerOptions}>
      <Stack.Screen name="Login" component={LoginWelcomeScreen} />
      <Stack.Screen name="EmailLogin" component={EmailLoginScreen} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />
      <Stack.Screen name="OTPVerification" component={OTPVerificationScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      <Stack.Screen name="VerifyResetOTP" component={VerifyResetOTPScreen} />
      <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
      <Stack.Screen name="CreateUsername" component={CreateUsernameScreen} />
    </Stack.Navigator>
  );
};

export default AuthStack;
