// src/navigation/AuthStack.tsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { COLORS } from '../../shared/constants/theme';
import LoginScreen from '../../modules/auth/screens/LoginScreen';
import SignUpScreen from '../../modules/auth/screens/SignUpScreen';
import OTPVerificationScreen from '../../modules/auth/screens/OTPVerificationScreen';
import CreateUsernameScreen from '../../modules/auth/screens/CreateUsernameScreen';

const Stack = createNativeStackNavigator();

export default function AuthStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: COLORS.background },
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />
      <Stack.Screen name="OTPVerification" component={OTPVerificationScreen} />
      <Stack.Screen name="CreateUsername" component={CreateUsernameScreen} />
    </Stack.Navigator>
  );
}
