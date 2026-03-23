import type { ChangePasswordScreenProps } from '@/shared/types';
import { useChangePasswordScreen } from '../../hooks/useChangePasswordScreen';
import { ChangePasswordScreen } from './ChangePasswordScreen';

export default function ChangePasswordScreenContainer(props: ChangePasswordScreenProps) {
  const vm = useChangePasswordScreen({ navigation: props.navigation });
  return <ChangePasswordScreen {...props} {...vm} />;
}
