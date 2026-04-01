import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppText } from '@/shared/ui';
import { colors, horizontalScale, moderate, spacing, verticalScale } from '@/shared/theme';
import type { CrewScreenHeaderProps } from '@/shared/types';

export function CrewScreenHeader({
  title,
  iconName,
  onBackPress,
  rightActionIconName,
  onRightActionPress,
}: CrewScreenHeaderProps) {
  return (
    <View style={styles.header}>
      <TouchableOpacity style={styles.backButton} onPress={onBackPress}>
        <Ionicons name="arrow-back" size={moderate(20)} color={colors.white} />
      </TouchableOpacity>

      <View style={styles.headerCenter}>
        <AppText variant="h4" style={!iconName ? styles.headerTitleOnly : undefined}>
          {title}
        </AppText>
        {iconName ? (
          <Ionicons
            name={iconName as keyof typeof Ionicons.glyphMap}
            size={moderate(18)}
            color={colors.primary}
          />
        ) : null}
      </View>

      {rightActionIconName && onRightActionPress ? (
        <TouchableOpacity style={styles.actionButton} onPress={onRightActionPress}>
          <Ionicons
            name={rightActionIconName as keyof typeof Ionicons.glyphMap}
            size={moderate(20)}
            color={colors.white}
          />
        </TouchableOpacity>
      ) : (
        <View style={styles.placeholder} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing[4],
    paddingHorizontal: spacing[4],
  },
  backButton: {
    width: horizontalScale(36),
    height: verticalScale(36),
    borderRadius: moderate(18),
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerCenter: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[2],
  },
  headerTitleOnly: {
    textAlign: 'center',
  },
  actionButton: {
    width: horizontalScale(36),
    height: verticalScale(36),
    borderRadius: moderate(18),
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholder: {
    width: horizontalScale(36),
  },
});
