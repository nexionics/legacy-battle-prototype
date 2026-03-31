import { View, StyleSheet } from 'react-native';
import { AppText } from '@/shared/ui';
import { useThemeColors } from '@/app/providers/ThemeProvider';
import { horizontalScale, moderate, verticalScale } from '@/shared/theme';
import type { ProfileActivityCardProps } from '@/shared/types';

export function ProfileActivityCard({ title, items }: ProfileActivityCardProps) {
  const colors = useThemeColors();

  return (
    <View
      style={[styles.card, { borderColor: colors.cardBorder, backgroundColor: colors.background }]}
    >
      <AppText variant="body1" style={[styles.title, { color: colors.text }]}>
        {title}
      </AppText>

      <View style={styles.list}>
        {items.map((item, index) => (
          <View
            key={item.id}
            style={[
              styles.row,
              index < items.length - 1 && {
                borderBottomWidth: 1,
                borderBottomColor: colors.cardBorder,
              },
            ]}
          >
            <View style={styles.leftCopy}>
              <AppText variant="body2" style={[styles.itemTitle, { color: colors.text }]}>
                {item.title}
              </AppText>
              <AppText
                variant="captionLg"
                style={[styles.itemSubtitle, { color: colors.textSecondary }]}
              >
                {item.subtitle}
              </AppText>
            </View>

            <View style={styles.rightCopy}>
              <AppText variant="captionLg" style={[styles.itemValue, { color: colors.text }]}>
                {item.value}
              </AppText>
              <AppText
                variant="captionLg"
                style={[styles.itemTime, { color: colors.textSecondary }]}
              >
                {item.timestamp}
              </AppText>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: moderate(12),
    borderWidth: 1,
    paddingHorizontal: horizontalScale(14),
    paddingVertical: verticalScale(14),
    marginBottom: verticalScale(28),
  },
  title: {
    marginBottom: verticalScale(10),
  },
  list: {
    gap: 0,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: horizontalScale(16),
    paddingVertical: verticalScale(10),
  },
  leftCopy: {
    flex: 1,
  },
  rightCopy: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  itemTitle: {
    marginBottom: verticalScale(2),
  },
  itemSubtitle: {
    lineHeight: verticalScale(18),
  },
  itemValue: {
    marginBottom: verticalScale(2),
  },
  itemTime: {
    textAlign: 'right',
  },
});
