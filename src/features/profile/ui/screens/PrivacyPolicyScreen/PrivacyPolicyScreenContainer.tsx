import type { PrivacyPolicyScreenProps } from '@/shared/types';
import { usePrivacyPolicyScreen } from '../../hooks/usePrivacyPolicyScreen';
import { PrivacyPolicyScreen } from './PrivacyPolicyScreen';

export default function PrivacyPolicyScreenContainer(props: PrivacyPolicyScreenProps) {
  const vm = usePrivacyPolicyScreen();
  return <PrivacyPolicyScreen {...props} {...vm} />;
}
