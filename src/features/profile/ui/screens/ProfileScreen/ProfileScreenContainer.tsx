import type { ProfileScreenProps } from '@/shared/types';
import { useProfileScreen } from '../../hooks/useProfileScreen';
import { ProfileScreen } from './ProfileScreen';

export default function ProfileScreenContainer(props: ProfileScreenProps) {
  const vm = useProfileScreen({ navigation: props.navigation });
  return <ProfileScreen {...props} {...vm} />;
}
