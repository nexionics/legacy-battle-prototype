import {
  createNativeStackNavigator,
  type NativeStackNavigationOptions,
} from '@react-navigation/native-stack';
import { AuthStackParamList } from './types';
import {
  LoginScreen,
  SignUpScreen,
  OTPVerificationScreen,
  CreateUsernameScreen,
} from '@/features/auth';

const Stack = createNativeStackNavigator<AuthStackParamList>();
const headerOptions: NativeStackNavigationOptions = { headerShown: false };

const AuthStack = () => {
  return (
    <Stack.Navigator screenOptions={headerOptions}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />
      <Stack.Screen name="OTPVerification" component={OTPVerificationScreen} />
      <Stack.Screen name="CreateUsername" component={CreateUsernameScreen} />
    </Stack.Navigator>
  );
};

export default AuthStack;
