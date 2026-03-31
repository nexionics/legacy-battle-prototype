import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useThemeColors } from '@/app/providers/ThemeProvider';
import { AppText } from '@/shared/ui';
import type { AccountDetailsInfoRowProps } from '@/shared/types';
import { spacing, sizes } from '@/shared/theme';

export function InfoRow({ icon, label, value, onEdit }: AccountDetailsInfoRowProps) {
  const colors = useThemeColors();

  return (
    <View style={styles.row}>
      <View style={styles.rowLeft}>
        <Ionicons
          name={icon}
          size={sizes.icon24}
          color={colors.textSecondary}
          style={styles.rowIcon}
        />
        <View style={styles.rowStack}>
          <AppText
            variant="body2"
            style={{ color: colors.textSecondary, marginBottom: spacing[1] }}
          >
            {label}
          </AppText>
          <AppText variant="body1" style={{ color: colors.text }}>
            {value}
          </AppText>
        </View>
      </View>
      <TouchableOpacity onPress={onEdit} style={styles.editButton} accessibilityRole="button">
        <MaterialCommunityIcons
          name="account-edit-outline"
          size={sizes.icon24}
          color={colors.textSecondary}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing[4],
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
  },
  rowStack: {
    flex: 1,
  },
  rowIcon: {
    marginRight: spacing[4],
    marginTop: spacing[1],
  },
  editButton: {
    padding: spacing[1],
  },
});
