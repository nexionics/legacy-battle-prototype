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
import { colors, spacing, sizes } from '@/shared/constants/theme';
import type { VerifyEmailOTPScreenProps } from '@/shared/types';
import type { UseVerifyEmailOtpScreenReturn } from '../../hooks/useVerifyEmailOtpScreen';

export type VerifyEmailOTPScreenViewProps = VerifyEmailOTPScreenProps & UseVerifyEmailOtpScreenReturn;

export function VerifyEmailOTPScreen({
  email,
  otp,
  setOtp,
  isSubmitting,
  successSheetRef,
  handleVerify,
  handleDone,
  verifyEmailOtpScreenStrings,
  onBack,
  otpLength,
}: VerifyEmailOTPScreenViewProps) {
  return (
    <Screen padding={0}>
      <View style={styles.content}>
        <ScreenHeader onBack={onBack} />

        <View style={styles.iconContainer}>
          <IconCircle size={sizes.iconHero} backgroundColor={colors.card}>
            <SVGWrapper name="ChatBubble" width={sizes.icon40} height={sizes.icon40} />
          </IconCircle>
        </View>

        <View style={styles.titleContainer}>
          <AppText variant="h2">{verifyEmailOtpScreenStrings.title}</AppText>
          <AppText variant="body1" color={colors.textSecondary} style={styles.subtitle}>
            {verifyEmailOtpScreenStrings.subtitleLead}
            {'\n'}
            <AppText variant="body1" color={colors.text}>
              {email}
            </AppText>
          </AppText>
        </View>

        <View style={styles.otpSection}>
          <OTPInput
            length={otpLength}
            onChange={setOtp}
            onComplete={() => {}}
            disabled={isSubmitting}
          />
        </View>

        <View style={styles.resendBlock}>
          <AppText variant="body2" color={colors.textSecondary} style={styles.resendPrompt}>
            {verifyEmailOtpScreenStrings.resendPrompt}
          </AppText>
          <TouchableOpacity onPress={() => {}} style={styles.resendCta}>
            <AppText variant="label" color={colors.primary}>
              {verifyEmailOtpScreenStrings.resendCta}
            </AppText>
          </TouchableOpacity>
        </View>

        <Button
          variant="primary"
          loading={isSubmitting}
          disabled={otp.length !== otpLength || isSubmitting}
          onPress={handleVerify}
          style={styles.verifyButton}
          rightIcon={<Ionicons name="mail-outline" size={sizes.icon20} color={colors.white} />}
        >
          {verifyEmailOtpScreenStrings.verifyButton}
        </Button>
      </View>

      <SuccessBottomSheet
        ref={successSheetRef}
        onClose={handleDone}
        title={verifyEmailOtpScreenStrings.successSheet.title}
        subtitle={verifyEmailOtpScreenStrings.successSheet.subtitle}
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
