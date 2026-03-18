import { View, StyleSheet, ViewStyle } from 'react-native';
import { colors } from '@/shared/theme';

interface IconCircleProps {
  size?: number;
  backgroundColor?: string;
  children: React.ReactNode;
  style?: ViewStyle;
}

export function IconCircle({
  size = 40,
  backgroundColor = colors.inputBackground,
  children,
  style,
}: IconCircleProps) {
  return (
    <View
      style={[
        styles.base,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
