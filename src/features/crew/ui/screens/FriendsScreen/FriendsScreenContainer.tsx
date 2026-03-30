import type { FriendsScreenProps } from '@/shared/types';
import { useFriendsScreen } from '../../hooks/useFriendsScreen';
import { FriendsScreen } from './FriendsScreen';

export default function FriendsScreenContainer(props: FriendsScreenProps) {
  const vm = useFriendsScreen({ navigation: props.navigation });
  return <FriendsScreen {...props} {...vm} />;
}
