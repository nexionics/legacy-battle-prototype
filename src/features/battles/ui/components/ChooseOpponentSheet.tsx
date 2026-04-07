import { View, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radii, fontSizes, verticalScale } from '@/shared/theme';
import { AppText, SearchInput, Avatar } from '@/shared/ui';
import { getInitials } from '@/shared/utils';
import type { StatDuelOpponent } from '@/shared/types';
import { battlesStatDuelOpponentLevelRank } from '@/features/battles/string';

export type ChooseOpponentSheetProps = {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  opponents: StatDuelOpponent[];
  selectedOpponentId: string | null;
  onSelectOpponent: (o: StatDuelOpponent) => void;
  onClose: () => void;
  onAddFriend: () => void;
  title: string;
  searchPlaceholder: string;
  addFriendLabel: string;
};

export function ChooseOpponentSheet({
  searchQuery,
  onSearchChange,
  opponents,
  selectedOpponentId,
  onSelectOpponent,
  onClose,
  onAddFriend,
  title,
  searchPlaceholder,
  addFriendLabel,
}: ChooseOpponentSheetProps) {
  return (
    <View style={styles.sheet}>
      <View style={styles.header}>
        <View style={styles.headerTitleWrap}>
          <AppText variant="h5" style={styles.headerTitle}>
            {title}
          </AppText>
        </View>
        <TouchableOpacity
          onPress={onClose}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          style={styles.closeBtn}
          accessibilityRole="button"
          accessibilityLabel="Close"
        >
          <Ionicons name="close" size={26} color={colors.text} />
        </TouchableOpacity>
      </View>

      <SearchInput
        value={searchQuery}
        onChangeText={onSearchChange}
        placeholder={searchPlaceholder}
        style={styles.search}
        leftIcon={<Ionicons name="search-outline" size={20} color={colors.textSecondary} />}
      />

      <FlatList
        data={opponents}
        keyExtractor={(item) => item.id}
        style={styles.list}
        keyboardShouldPersistTaps="handled"
        renderItem={({ item }) => {
          const level = item.level ?? 0;
          const rank = item.rankLabel ?? '';
          const levelLine =
            level > 0 && rank ? battlesStatDuelOpponentLevelRank(level, rank) : null;
          const isSelected = item.id === selectedOpponentId;

          return (
            <TouchableOpacity
              style={[styles.row, isSelected && styles.rowSelected]}
              onPress={() => onSelectOpponent(item)}
              activeOpacity={0.85}
            >
              <Avatar
                initials={getInitials(item.display_name)}
                size="sm"
                backgroundColor={colors.primary}
                borderColor={colors.primary}
                textColor={colors.white}
              />
              <View style={styles.rowText}>
                <AppText variant="label" style={styles.displayName}>
                  {item.display_name}
                </AppText>
                <AppText variant="captionSm" color={colors.textSecondary}>
                  {item.subtitle ?? (item.username ? `@${item.username}` : '')}
                </AppText>
              </View>
              {levelLine ? (
                <View style={styles.rowMeta}>
                  <View style={styles.starBadge}>
                    <Ionicons name="star" size={11} color={colors.white} />
                    <AppText variant="captionSm" style={styles.starBadgeText}>
                      {level}
                    </AppText>
                  </View>
                  <AppText variant="captionSm" color={colors.text} style={styles.levelLine} numberOfLines={2}>
                    {levelLine}
                  </AppText>
                </View>
              ) : null}
            </TouchableOpacity>
          );
        }}
      />

      <TouchableOpacity style={styles.addFriendBtn} onPress={onAddFriend} activeOpacity={0.9}>
        <AppText variant="buttonLg" color={colors.white}>
          {addFriendLabel}
        </AppText>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  sheet: {
    width: '100%',
    maxHeight: '92%',
    backgroundColor: colors.background,
    borderTopLeftRadius: radii.xl,
    borderTopRightRadius: radii.xl,
    paddingHorizontal: spacing[4],
    paddingTop: verticalScale(12),
    paddingBottom: verticalScale(20),
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: verticalScale(16),
    paddingBottom: verticalScale(12),
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.inputBorder,
  },
  headerTitleWrap: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: spacing[6],
  },
  headerTitle: {
    textAlign: 'center',
  },
  closeBtn: {
    position: 'absolute',
    right: 0,
    top: 0,
    padding: spacing[1],
  },
  search: {
    marginBottom: spacing[3],
  },
  list: {
    flexGrow: 0,
    maxHeight: verticalScale(340),
    marginHorizontal: -spacing[1],
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing[4],
    paddingHorizontal: spacing[2],
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.inputBorder,
    gap: spacing[3],
  },
  rowSelected: {
    backgroundColor: colors.primaryTint,
  },
  rowText: {
    flex: 1,
    minWidth: 0,
  },
  displayName: {
    fontSize: fontSizes.md,
    fontWeight: '600',
  },
  rowMeta: {
    alignItems: 'flex-end',
    maxWidth: '36%',
    gap: spacing[1],
  },
  starBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
    backgroundColor: colors.success,
    paddingHorizontal: spacing[2],
    paddingVertical: 3,
    borderRadius: radii.sm,
    minWidth: 44,
  },
  starBadgeText: {
    color: colors.white,
    fontWeight: '700',
    fontSize: fontSizes.xs,
  },
  levelLine: {
    textAlign: 'right',
    fontSize: fontSizes.xs,
  },
  addFriendBtn: {
    marginTop: verticalScale(16),
    backgroundColor: colors.primary,
    borderRadius: radii.lg,
    paddingVertical: verticalScale(16),
    alignItems: 'center',
    justifyContent: 'center',
  },
});
