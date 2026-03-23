import type { SettingsScreenProps } from '@/shared/types';
import { useSettingsScreen } from '../../hooks/useSettingsScreen';
import { SettingsScreen } from './SettingsScreen';

export default function SettingsScreenContainer(props: SettingsScreenProps) {
  const vm = useSettingsScreen({ navigation: props.navigation });
  return <SettingsScreen {...props} {...vm} />;
}
