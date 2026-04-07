import type { CompositeScreenProps } from '@react-navigation/native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AppStackParamList, TabParamList } from '@/app/navigation/types';
import { useHomeScreen } from '../../hooks/useHomeScreen';
import { HomeScreen } from './HomeScreen';

type HomeScreenContainerProps = CompositeScreenProps<
  BottomTabScreenProps<TabParamList, 'Home'>,
  NativeStackScreenProps<AppStackParamList>
>;

export default function HomeScreenContainer({ navigation }: HomeScreenContainerProps) {
  const viewProps = useHomeScreen(navigation);
  return <HomeScreen {...viewProps} />;
}
