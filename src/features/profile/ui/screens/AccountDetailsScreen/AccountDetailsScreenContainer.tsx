import type { AccountDetailsScreenProps } from '@/shared/types';
import { useAccountDetailsScreen } from '../../hooks/useAccountDetailsScreen';
import { AccountDetailsScreen } from './AccountDetailsScreen';

export default function AccountDetailsScreenContainer(props: AccountDetailsScreenProps) {
  const vm = useAccountDetailsScreen({ navigation: props.navigation });
  return <AccountDetailsScreen {...props} {...vm} />;
}
