import type { TermsOfServiceScreenProps } from '@/shared/types';
import { useTermsOfServiceScreen } from '../../hooks/useTermsOfServiceScreen';
import { TermsOfServiceScreen } from './TermsOfServiceScreen';

export default function TermsOfServiceScreenContainer(props: TermsOfServiceScreenProps) {
  const vm = useTermsOfServiceScreen();
  return <TermsOfServiceScreen {...props} {...vm} />;
}
