import type { ComponentProps } from 'react';
import { TouchableOpacity, View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColors } from '@/app/providers/ThemeProvider';
import { spacing } from '@/shared/theme';
import { AppText } from '../atoms/AppText';
import type { SettingRowProps } from '@/shared/types';

type IoniconName = ComponentProps<typeof Ionicons>['name'];

export function SettingRow({
  icon,
  title,
  subtitle,
  onPress,
  rightSlot,
  showChevron = true,
  iconColor,
  iconBgColor,
  style,
}: SettingRowProps) {
  const colors = useThemeColors();
  const Wrapper = onPress ? TouchableOpacity : View;

  return (
    <Wrapper style={[styles.container, style]} {...(onPress ? { onPress } : {})}>
      <View
        style={[
          styles.iconContainer,
          {
            backgroundColor: iconBgColor || colors.background,
            borderColor: iconColor || colors.primary,
          },
        ]}
      >
        <Ionicons name={icon as IoniconName} size={16} color={iconColor || colors.primary} />
      </View>

      <View style={styles.textContainer}>
        <AppText variant="body1" style={{ color: colors.text }}>
          {title}
        </AppText>
        {subtitle && (
          <AppText variant="captionSm" style={{ color: colors.textSecondary }}>
            {subtitle}
          </AppText>
        )}
      </View>

      <View style={styles.right}>
        {rightSlot}
        {showChevron && !rightSlot && (
          <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
        )}
      </View>
    </Wrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[4],
  },
  iconContainer: {
    width: 24,
    height: 24,
    borderRadius: 3,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0.5,
  },
  textContainer: {
    flex: 1,
    marginLeft: spacing[4],
    justifyContent: 'center',
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
  },
});
