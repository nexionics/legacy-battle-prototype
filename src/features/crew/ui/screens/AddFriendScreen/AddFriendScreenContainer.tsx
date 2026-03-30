import type { AddFriendScreenProps } from '@/shared/types';
import { useAddFriendScreen } from '../../hooks/useAddFriendScreen';
import { AddFriendScreen } from './AddFriendScreen';

export default function AddFriendScreenContainer(props: AddFriendScreenProps) {
  const vm = useAddFriendScreen({ navigation: props.navigation });
  return <AddFriendScreen {...props} {...vm} />;
}
