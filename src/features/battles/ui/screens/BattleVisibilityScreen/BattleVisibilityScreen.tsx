import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radii } from '@/shared/theme';
import { AppText, Screen } from '@/shared/ui';
import { battlesStrings } from '@/features/battles/string';
import type { BattleVisibilityScreenViewProps } from '../../hooks/useBattleVisibilityScreen';

export function BattleVisibilityScreen({ onBack, onSelectVisibility }: BattleVisibilityScreenViewProps) {
  return (
    <Screen padding={0}>
      <View style={styles.content}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={onBack}>
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>

        <View style={styles.titleSection}>
          <AppText variant="h2" style={styles.title}>
            {battlesStrings.battleVisibility.screenTitle}
          </AppText>
          <AppText variant="body2" color={colors.textSecondary}>
            {battlesStrings.battleVisibility.subtitle}
          </AppText>
        </View>

        <TouchableOpacity style={styles.optionCard} onPress={() => onSelectVisibility('private')}>
          <View style={styles.optionIconContainer}>
            <View style={styles.privateIcon}>
              <Ionicons name="shield" size={24} color={colors.gold} />
              <View style={styles.lockBadge}>
                <Ionicons name="lock-closed" size={10} color={colors.white} />
              </View>
            </View>
          </View>
          <View style={styles.optionTextContainer}>
            <AppText variant="h5">{battlesStrings.battleVisibility.private}</AppText>
            <AppText variant="helper" color={colors.textSecondary}>
              {battlesStrings.battleVisibility.privateHint}
            </AppText>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.optionCard} onPress={() => onSelectVisibility('crew')}>
          <View style={styles.optionIconContainer}>
            <View style={styles.crewIcon}>
              <Ionicons name="people" size={24} color={colors.success} />
              <View style={styles.crewBadge}>
                <Ionicons name="star" size={10} color={colors.white} />
              </View>
            </View>
          </View>
          <View style={styles.optionTextContainer}>
            <AppText variant="h5">{battlesStrings.battleVisibility.crewOnly}</AppText>
            <AppText variant="helper" color={colors.textSecondary}>
              {battlesStrings.battleVisibility.crewHint}
            </AppText>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.optionCard} onPress={() => onSelectVisibility('public')}>
          <View style={styles.optionIconContainer}>
            <View style={styles.publicIcon}>
              <Ionicons name="globe" size={24} color={colors.info} />
              <View style={styles.peopleBadge}>
                <Ionicons name="people" size={10} color={colors.white} />
              </View>
            </View>
          </View>
          <View style={styles.optionTextContainer}>
            <AppText variant="h5">{battlesStrings.battleVisibility.public}</AppText>
            <AppText variant="helper" color={colors.textSecondary}>
              {battlesStrings.battleVisibility.publicHint}
            </AppText>
          </View>
        </TouchableOpacity>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingHorizontal: spacing[4],
  },
  header: {
    paddingVertical: spacing[4],
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
  },
  titleSection: {
    marginBottom: spacing[4] * 2,
  },
  title: {
    fontWeight: '300',
    marginBottom: spacing[2],
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing[4] * 1.5,
    borderBottomWidth: 1,
    borderBottomColor: colors.inputBorder,
  },
  optionIconContainer: {
    marginRight: spacing[4],
  },
  privateIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.card,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.info,
    position: 'relative',
  },
  lockBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: colors.info,
    justifyContent: 'center',
    alignItems: 'center',
  },
  publicIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.card,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.info,
    position: 'relative',
  },
  peopleBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: colors.info,
    justifyContent: 'center',
    alignItems: 'center',
  },
  crewIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.card,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.success,
    position: 'relative' as const,
  },
  crewBadge: {
    position: 'absolute' as const,
    bottom: -2,
    right: -2,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: colors.success,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionTextContainer: {
    flex: 1,
  },
});
