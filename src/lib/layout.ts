import { Dimensions } from 'react-native';

export function isSmallDevice(): boolean {
  return Dimensions.get('window').width < 375;
}

export function screenPadding(): number {
  return isSmallDevice() ? 12 : 16;
}
