import type { VerifyEmailOTPScreenProps } from '@/shared/types';
import { useVerifyEmailOtpScreen } from '../../hooks/useVerifyEmailOtpScreen';
import { VerifyEmailOTPScreen } from './VerifyEmailOTPScreen';

export default function VerifyEmailOTPScreenContainer(props: VerifyEmailOTPScreenProps) {
  const vm = useVerifyEmailOtpScreen({ navigation: props.navigation, route: props.route });
  return <VerifyEmailOTPScreen {...props} {...vm} />;
}
