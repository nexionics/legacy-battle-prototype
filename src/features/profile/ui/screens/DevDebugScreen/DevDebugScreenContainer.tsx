import type { DevDebugScreenProps } from '@/shared/types';
import { useDevDebugScreen } from '../../hooks/useDevDebugScreen';
import { DevDebugScreen } from './DevDebugScreen';

export default function DevDebugScreenContainer(props: DevDebugScreenProps) {
  const vm = useDevDebugScreen({ navigation: props.navigation });
  return <DevDebugScreen {...props} {...vm} />;
}
