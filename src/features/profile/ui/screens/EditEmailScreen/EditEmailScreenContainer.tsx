import type { EditEmailScreenProps } from '@/shared/types';
import { useEditEmailScreen } from '../../hooks/useEditEmailScreen';
import { EditEmailScreen } from './EditEmailScreen';

export default function EditEmailScreenContainer(props: EditEmailScreenProps) {
  const vm = useEditEmailScreen({ navigation: props.navigation });
  return <EditEmailScreen {...props} {...vm} />;
}
