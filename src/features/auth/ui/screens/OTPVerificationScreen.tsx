import React, { useRef } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import type { TextInput as RNTextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuthFormStore } from '@/features/auth/data/store/authForm.store';
import { Screen, AppText, ScreenHeader, Input, IconCircle, PatternBackground } from '@/shared/ui';
import {
  colors,
  spacing,
  radii,
  fontSizes,
  fontWeights,
  borderWidths,
  sizes,
} from '@/shared/constants/theme';
import { loginScreenStrings, otpVerificationScreenStrings } from '@/features/auth/strings';
import type { OTPVerificationScreenProps } from '@/shared/types';

export default function OTPVerificationScreen({ navigation }: OTPVerificationScreenProps) {
  const { otp, setOtpDigit } = useAuthFormStore();
  const inputRefs = useRef<(RNTextInput | null)[]>([]);

  const handleOtpChange = (value: string, index: number) => {
    setOtpDigit(index, value);
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  return (
    <Screen padding={0}>
      <PatternBackground text={loginScreenStrings.backgroundPattern.watermarkText} />
      <View style={styles.content}>
        <ScreenHeader onBack={() => navigation.goBack()} />

        <View style={styles.iconContainer}>
          <IconCircle size={sizes.iconHero} backgroundColor={colors.card}>
            <Ionicons name="chatbubble-outline" size={sizes.icon40} color={colors.primary} />
          </IconCircle>
        </View>

        <View style={styles.titleContainer}>
          <AppText variant="h2">{otpVerificationScreenStrings.headings.verifyEmail}</AppText>
          <AppText variant="body1" color={colors.textSecondary} style={styles.subtitle}>
            {otpVerificationScreenStrings.body.codeSentLeadIn}
            {'\n'}
            <AppText variant="body1" color={colors.text}>
              {otpVerificationScreenStrings.body.mockRecipientEmail}
            </AppText>
          </AppText>
        </View>

        <View style={styles.otpContainer}>
          {otp.map((digit, index) => (
            <Input
              key={index}
              ref={(ref) => {
                inputRefs.current[index] = ref;
              }}
              value={digit}
              onChangeText={(value) => handleOtpChange(value, index)}
              keyboardType="number-pad"
              maxLength={1}
              selectTextOnFocus
              wrapperStyle={styles.otpInputWrapper}
              inputTextStyle={styles.otpInput}
            />
          ))}
        </View>

        <View style={styles.resendContainer}>
          <AppText variant="body2" color={colors.textSecondary}>
            {otpVerificationScreenStrings.resend.prompt}{' '}
          </AppText>
          <TouchableOpacity>
            <AppText variant="label" color={colors.primary}>
              {otpVerificationScreenStrings.resend.cta}
            </AppText>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.verifyButton}
          onPress={() => navigation.navigate('CreateUsername')}
        >
          <AppText variant="buttonLg" color={colors.white}>
            {otpVerificationScreenStrings.primaryCta.verifyEmail}
          </AppText>
          <Ionicons name="mail-outline" size={sizes.icon20} color={colors.white} />
        </TouchableOpacity>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingHorizontal: spacing[5],
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: spacing[6],
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: spacing[6],
  },
  subtitle: {
    textAlign: 'center',
    marginTop: spacing[2],
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing[2],
    marginBottom: spacing[6],
  },
  otpInputWrapper: {
    width: sizes.otpInputWidth,
    height: sizes.otpInputHeight,
    borderRadius: radii.lg,
    borderWidth: borderWidths.thick,
    borderColor: colors.primary,
    paddingHorizontal: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  otpInput: {
    fontSize: fontSizes.xl,
    fontWeight: fontWeights.bold,
    textAlign: 'center',
    paddingVertical: 0,
  },
  resendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: spacing[6],
  },
  verifyButton: {
    flexDirection: 'row',
    backgroundColor: colors.primary,
    paddingVertical: spacing[4],
    borderRadius: radii.lg,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[2],
  },
});
