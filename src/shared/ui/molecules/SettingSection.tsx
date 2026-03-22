import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColors } from '@/app/providers/ThemeProvider';
import { spacing, radii } from '@/shared/theme';
import { AppText } from '../atoms/AppText';
import type { SettingSectionProps } from '@/shared/types';

export function SettingSection({ title, subtitle, icon, children, style }: SettingSectionProps) {
  const colors = useThemeColors();

  return (
    <View style={[styles.container, style]}>
      <View
        style={[
          styles.content,
          {
            backgroundColor: colors.card,
            borderColor: colors.inputBorder,
            borderWidth: 1,
          },
        ]}
      >
        {title && (
          <View style={styles.headerContainer}>
            <View style={styles.headerTop}>
              {icon && (
                <View style={styles.iconWrapper}>
                  <Ionicons name={icon as any} size={24} color={colors.text} />
                </View>
              )}
              <View style={styles.titleWrapper}>
                <AppText variant="h6" style={{ color: colors.text }}>
                  {title}
                </AppText>
                {subtitle && (
                  <AppText variant="captionSm" style={{ color: colors.textSecondary }}>
                    {subtitle}
                  </AppText>
                )}
              </View>
            </View>
            <View style={[styles.divider, { backgroundColor: colors.inputBorder }]} />
          </View>
        )}
        {React.Children.map(children, (child, index) => {
          if (!React.isValidElement(child)) return child;

          const isLast = index === React.Children.count(children) - 1;

          return (
            <React.Fragment key={index}>
              {child}
              {!isLast && <View style={[styles.divider, { backgroundColor: colors.inputBorder }]} />}
            </React.Fragment>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing[6],
  },
  headerContainer: {
    width: '100%',
  },
  headerTop: {
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing[4],
  },
  iconWrapper: {
    marginRight: spacing[4],
  },
  titleWrapper: {
    flex: 1,
  },
  content: {
    borderRadius: radii.xl,
    overflow: 'hidden',
  },
  divider: {
    height: 1,
  },
});
