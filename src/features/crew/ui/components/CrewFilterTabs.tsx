import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { AppText } from '@/shared/ui';
import { colors, radii, spacing } from '@/shared/theme';
import type { CrewFilterTabsProps, CrewMemberFilter } from '@/shared/types';

const TABS: CrewMemberFilter[] = ['all', 'active', 'rivals'];

export function CrewFilterTabs({
  activeFilter,
  onFilterChange,
  allLabel,
  activeLabel,
  rivalsLabel,
}: CrewFilterTabsProps) {
  const labels: Record<CrewMemberFilter, string> = {
    all: allLabel,
    active: activeLabel,
    rivals: rivalsLabel,
  };

  return (
    <View style={styles.container}>
      {TABS.map((tab) => {
        const isActive = tab === activeFilter;
        return (
          <TouchableOpacity
            key={tab}
            style={[styles.tabButton, isActive && styles.activeTabButton]}
            onPress={() => onFilterChange(tab)}
          >
            <AppText variant="body2" color={isActive ? colors.white : colors.textSecondary}>
              {labels[tab]}
            </AppText>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.background,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    padding: spacing[1],
    gap: spacing[2],
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing[3],
    borderRadius: radii.md,
  },
  activeTabButton: {
    backgroundColor: colors.primary,
  },
});
