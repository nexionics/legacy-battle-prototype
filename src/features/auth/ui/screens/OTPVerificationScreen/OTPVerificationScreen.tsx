import { useRef } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import type { TextInput as RNTextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
  Screen,
  AppText,
  ScreenHeader,
  Input,
  IconCircle,
  PatternBackground,
  SVGWrapper,
  Button,
} from '@/shared/ui';
import {
  colors,
  spacing,
  radii,
  fontSizes,
  fontWeights,
  borderWidths,
  sizes,
} from '@/shared/constants/theme';
import type { OTPVerificationScreenProps } from '@/shared/types';
import type { UseOtpVerificationReturn } from '@/features/auth/ui/hooks/useOtpVerification.types';

const OTP_LENGTH = 6;

export type OTPVerificationViewProps = OTPVerificationScreenProps & UseOtpVerificationReturn;

export function OTPVerificationScreen({
  navigation,
  onDigitChange,
  digitAt,
  onSubmit,
  errors,
  isValid,
  isSubmitting,
  onResend,
  resendDisabled,
  cooldownSec,
  displayEmail,
  loginScreenStrings,
  otpVerificationScreenStrings,
}: OTPVerificationViewProps) {
  const inputRefs = useRef<(RNTextInput | null)[]>([]);

  const handleDigitChange = (index: number, value: string) => {
    onDigitChange(index, value);
    const last = value.replace(/\D/g, '').slice(-1) ?? '';
    if (last && index < OTP_LENGTH - 1) {
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
            <SVGWrapper name="ChatBubble" width={sizes.icon40} height={sizes.icon40} />
          </IconCircle>
        </View>

        <View style={styles.titleContainer}>
          <AppText variant="h2">{otpVerificationScreenStrings.headings.verifyEmail}</AppText>
          <AppText variant="body1" color={colors.textSecondary} style={styles.subtitle}>
            {otpVerificationScreenStrings.body.codeSentLeadIn}
            {'\n'}
            <AppText variant="body1" color={colors.text}>
              {displayEmail}
            </AppText>
          </AppText>
        </View>

        <View style={styles.otpContainer}>
          {Array.from({ length: OTP_LENGTH }, (_, index) => (
            <Input
              key={index}
              ref={(ref) => {
                inputRefs.current[index] = ref;
              }}
              value={digitAt(index)}
              onChangeText={(v) => handleDigitChange(index, v)}
              keyboardType="number-pad"
              maxLength={1}
              selectTextOnFocus
              wrapperStyle={styles.otpInputWrapper}
              inputTextStyle={styles.otpInput}
            />
          ))}
        </View>
        {errors.code?.message ? (
          <AppText variant="error" color={colors.error} style={styles.codeError}>
            {errors.code.message}
          </AppText>
        ) : null}

        <View style={styles.resendContainer}>
          <AppText variant="body2" color={colors.textSecondary}>
            {otpVerificationScreenStrings.resend.prompt}{' '}
          </AppText>
          <TouchableOpacity onPress={onResend} disabled={resendDisabled}>
            <AppText variant="label" color={resendDisabled ? colors.textSecondary : colors.primary}>
              {cooldownSec > 0
                ? `${otpVerificationScreenStrings.resend.cta} (${cooldownSec}s)`
                : otpVerificationScreenStrings.resend.cta}
            </AppText>
          </TouchableOpacity>
        </View>

        <Button
          variant="primary"
          loading={isSubmitting}
          disabled={!isValid || isSubmitting}
          onPress={onSubmit}
          style={styles.verifyButton}
          rightIcon={<Ionicons name="mail-outline" size={sizes.icon20} color={colors.white} />}
        >
          {otpVerificationScreenStrings.primaryCta.verifyEmail}
        </Button>
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
    marginTop: spacing[2],
  },
  codeError: {
    textAlign: 'center',
    marginBottom: spacing[4],
  },
});
