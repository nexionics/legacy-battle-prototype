import type { EditUsernameScreenProps } from '@/shared/types';
import { useEditUsernameScreen } from '../../hooks/useEditUsernameScreen';
import { EditUsernameScreen } from './EditUsernameScreen';

export default function EditUsernameScreenContainer(props: EditUsernameScreenProps) {
  const vm = useEditUsernameScreen({ navigation: props.navigation });
  return <EditUsernameScreen {...props} {...vm} />;
}
