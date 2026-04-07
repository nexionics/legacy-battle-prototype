import type { CompositeScreenProps } from '@react-navigation/native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AppStackParamList, TabParamList } from '@/app/navigation/types';
import { useBattlesScreen } from '../../hooks/useBattlesScreen';
import { BattlesScreen } from './BattlesScreen';

type Props = CompositeScreenProps<
  BottomTabScreenProps<TabParamList, 'Battles'>,
  NativeStackScreenProps<AppStackParamList>
>;

export default function BattlesScreenContainer({ navigation }: Props) {
  return <BattlesScreen {...useBattlesScreen(navigation)} />;
}
