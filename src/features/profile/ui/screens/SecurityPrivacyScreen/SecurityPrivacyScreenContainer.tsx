import type { SecurityPrivacyScreenProps } from '@/shared/types';
import { useSecurityPrivacyScreen } from '../../hooks/useSecurityPrivacyScreen';
import { SecurityPrivacyScreen } from './SecurityPrivacyScreen';

export default function SecurityPrivacyScreenContainer(props: SecurityPrivacyScreenProps) {
  const vm = useSecurityPrivacyScreen({ navigation: props.navigation });
  return <SecurityPrivacyScreen {...props} {...vm} />;
}
