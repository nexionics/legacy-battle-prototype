import React, { useState, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
  Screen,
  AppText,
  ScreenHeader,
  IconCircle,
  SVGWrapper,
  Button,
  OTPInput,
  SuccessBottomSheet,
} from '@/shared/ui';
import { OTP_LENGTH } from '@/shared/constants';
import { colors, spacing, sizes } from '@/shared/constants/theme';
import type { VerifyEmailOTPScreenProps } from '@/shared/types';
import { BottomSheetModal } from '@gorhom/bottom-sheet';

export default function VerifyEmailOTPScreen({ navigation, route }: VerifyEmailOTPScreenProps) {
  const { email } = route.params;
  const [otp, setOtp] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const successSheetRef = useRef<BottomSheetModal>(null);

  const handleVerify = async () => {
    if (otp.length !== OTP_LENGTH) return;

    setIsSubmitting(true);
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSubmitting(false);

    successSheetRef.current?.present();
  };

  const handleDone = () => {
    successSheetRef.current?.dismiss();
    navigation.navigate('AccountDetails');
  };

  return (
    <Screen padding={0}>
      <View style={styles.content}>
        <ScreenHeader onBack={() => navigation.goBack()} />

        <View style={styles.iconContainer}>
          <IconCircle size={sizes.iconHero} backgroundColor={colors.card}>
            <SVGWrapper name="ChatBubble" width={sizes.icon40} height={sizes.icon40} />
          </IconCircle>
        </View>

        <View style={styles.titleContainer}>
          <AppText variant="h2">Verify Email</AppText>
          <AppText variant="body1" color={colors.textSecondary} style={styles.subtitle}>
            We Sent A Verification Code To Your Email{'\n'}
            <AppText variant="body1" color={colors.text}>
              {email}
            </AppText>
          </AppText>
        </View>

        <View style={styles.otpSection}>
          <OTPInput
            length={OTP_LENGTH}
            onChange={setOtp}
            onComplete={() => {}}
            disabled={isSubmitting}
          />
        </View>

        <View style={styles.resendBlock}>
          <AppText variant="body2" color={colors.textSecondary} style={styles.resendPrompt}>
            Didn't receive the email?
          </AppText>
          <TouchableOpacity onPress={() => {}} style={styles.resendCta}>
            <AppText variant="label" color={colors.primary}>
              Click To Resend
            </AppText>
          </TouchableOpacity>
        </View>

        <Button
          variant="primary"
          loading={isSubmitting}
          disabled={otp.length !== OTP_LENGTH || isSubmitting}
          onPress={handleVerify}
          style={styles.verifyButton}
          rightIcon={<Ionicons name="mail-outline" size={sizes.icon20} color={colors.white} />}
        >
          Verify Email
        </Button>
      </View>

      <SuccessBottomSheet
        ref={successSheetRef}
        onClose={handleDone}
        title="Email Verified"
        subtitle="Your Email Address Have Been Verified Successfully"
      />
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
  otpSection: {
    marginBottom: spacing[6],
  },
  resendBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing[6],
    gap: spacing[2],
  },
  resendPrompt: {
    textAlign: 'center',
  },
  resendCta: {
    paddingVertical: spacing[1],
  },
  verifyButton: {
    marginTop: spacing[2],
  },
});
