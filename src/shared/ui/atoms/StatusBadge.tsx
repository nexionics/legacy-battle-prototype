import { View, StyleSheet, ViewStyle } from 'react-native';
import { spacing, radii } from '@/shared/theme';
import { AppText } from './AppText';

interface StatusBadgeProps {
  label: string;
  color: string;
  textColor?: string;
  style?: ViewStyle;
}

export function StatusBadge({
  label,
  color,
  textColor = '#FFFFFF',
  style,
}: StatusBadgeProps) {
  return (
    <View style={[styles.badge, { backgroundColor: color }, style]}>
      <AppText variant="captionSm" color={textColor} style={styles.text}>
        {label}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: spacing[2],
    paddingVertical: spacing[1],
    borderRadius: radii.sm,
    alignSelf: 'flex-start',
  },
  text: {
    textTransform: 'uppercase',
  },
});
