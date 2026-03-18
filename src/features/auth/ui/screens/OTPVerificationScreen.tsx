import React, { useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuthFormStore } from '@/features/auth/data/store/authForm.store';
import { Screen, AppText, ScreenHeader } from '@/shared/ui';
import { colors, spacing, radii, fontSizes, verticalScale, horizontalScale } from '@/shared/theme';
import { IconCircle } from '@/shared/ui';
import type { OTPVerificationScreenProps } from '@/shared/types';

export default function OTPVerificationScreen({ navigation }: OTPVerificationScreenProps) {
  const { otp, setOtpDigit } = useAuthFormStore();
  const inputRefs = useRef<TextInput[]>([]);

  const handleOtpChange = (value: string, index: number) => {
    setOtpDigit(index, value);
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  return (
    <Screen>
      <View style={styles.content}>
        <ScreenHeader onBack={() => navigation.goBack()} />

        <View style={styles.iconContainer}>
          <IconCircle size={80} backgroundColor={colors.card}>
            <Ionicons name="chatbubble-outline" size={40} color={colors.primary} />
          </IconCircle>
        </View>

        <View style={styles.titleContainer}>
          <AppText variant="h2">Verify Email</AppText>
          <AppText variant="body1" color={colors.textSecondary} style={styles.subtitle}>
            We Sent A Verification Code To Your Email{'\n'}
            <AppText variant="body1" color={colors.text}>Mike.Design@mail.com</AppText>
          </AppText>
        </View>

        <View style={styles.otpContainer}>
          {otp.map((digit, index) => (
            <View key={index} style={styles.otpInputWrapper}>
              <TextInput
                ref={(ref) => {
                  if (ref) inputRefs.current[index] = ref;
                }}
                style={styles.otpInput}
                value={digit}
                onChangeText={(value) => handleOtpChange(value, index)}
                keyboardType="number-pad"
                maxLength={1}
                selectTextOnFocus
              />
            </View>
          ))}
        </View>

        <View style={styles.resendContainer}>
          <AppText variant="body2" color={colors.textSecondary}>
            Didn't receive the email?{' '}
          </AppText>
          <TouchableOpacity>
            <AppText variant="label" color={colors.primary}>Click To Resend</AppText>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.verifyButton}
          onPress={() => navigation.navigate('CreateUsername')}
        >
          <AppText variant="buttonLg" color={colors.white}>Verify Email</AppText>
          <Ionicons name="mail-outline" size={20} color={colors.white} />
        </TouchableOpacity>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingHorizontal: horizontalScale(24),
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: verticalScale(32),
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: verticalScale(32),
  },
  subtitle: {
    textAlign: 'center',
    marginTop: verticalScale(8),
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing[2],
    marginBottom: verticalScale(32),
  },
  otpInputWrapper: {
    width: horizontalScale(50),
    height: verticalScale(60),
    borderRadius: radii.lg,
    borderWidth: 2,
    borderColor: colors.primary,
    backgroundColor: colors.inputBackground,
    justifyContent: 'center',
    alignItems: 'center',
  },
  otpInput: {
    fontSize: fontSizes.xl,
    fontWeight: 'bold',
    color: colors.text,
    textAlign: 'center',
    width: '100%',
    height: '100%',
  },
  resendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: verticalScale(32),
  },
  verifyButton: {
    flexDirection: 'row',
    backgroundColor: colors.primary,
    paddingVertical: verticalScale(16),
    borderRadius: radii.lg,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[2],
  },
});
