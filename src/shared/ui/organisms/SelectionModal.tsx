import { View, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radii, verticalScale } from '@/shared/theme';
import { AppText } from '../atoms/AppText';
import { AppModal } from './AppModal';
import type { SelectionOption, SelectionModalProps } from '@/shared/types';

export type { SelectionOption };

export function SelectionModal<T extends string = string>({
  visible,
  title,
  options,
  selectedKey,
  onSelect,
  onClose,
}: SelectionModalProps<T>) {
  return (
    <AppModal visible={visible} onRequestClose={onClose} presentation="bottom" animationType="slide">
      <View style={styles.sheet}>
        <View style={styles.header}>
          <AppText variant="h5">{title}</AppText>
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>
        <FlatList
          data={options}
          keyExtractor={(item) => item.key}
          style={styles.list}
          renderItem={({ item }) => {
            const isSelected = item.key === selectedKey;
            return (
              <TouchableOpacity
                style={[styles.option, isSelected && styles.optionSelected]}
                onPress={() => onSelect(item.key)}
              >
                <View style={styles.optionContent}>
                  <AppText variant="body1" color={colors.text}>
                    {item.label}
                  </AppText>
                  {item.subtitle ? (
                    <AppText variant="body2" color={colors.textSecondary}>
                      {item.subtitle}
                    </AppText>
                  ) : null}
                </View>
                {isSelected ? (
                  <Ionicons name="checkmark" size={20} color={colors.primary} />
                ) : null}
              </TouchableOpacity>
            );
          }}
        />
      </View>
    </AppModal>
  );
}

const styles = StyleSheet.create({
  sheet: {
    backgroundColor: colors.card,
    borderTopLeftRadius: radii.xl,
    borderTopRightRadius: radii.xl,
    maxHeight: '60%',
    paddingBottom: verticalScale(24),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[4],
    borderBottomWidth: 1,
    borderBottomColor: colors.inputBorder,
  },
  list: {
    paddingHorizontal: spacing[4],
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing[4],
    borderBottomWidth: 1,
    borderBottomColor: colors.inputBorder,
  },
  optionSelected: {
    backgroundColor: colors.primaryTint,
  },
  optionContent: {
    flex: 1,
  },
});
