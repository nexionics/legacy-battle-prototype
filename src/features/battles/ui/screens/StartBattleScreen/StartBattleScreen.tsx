import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radii } from '@/shared/theme';
import { AppText, Screen } from '@/shared/ui';
import If from '@/shared/ui/atoms/If';
import { SPORTS, BATTLE_CATEGORIES } from '@/shared/constants';
import { battlesStrings } from '@/features/battles/string';
import type { StartBattleScreenViewProps } from '../../hooks/useStartBattleScreen';

export function StartBattleScreen(props: StartBattleScreenViewProps) {
  const { selectedSport, onSportSelect, onCategorySelect, onBack, headerTitle } = props;

  return (
    <Screen padding={0}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <AppText variant="h4">{headerTitle}</AppText>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <If condition={!selectedSport}>
          <View style={styles.sportsGrid}>
            {SPORTS.map((sport) => (
              <TouchableOpacity
                key={sport.id}
                style={styles.sportCard}
                onPress={() => onSportSelect(sport.id)}
              >
                <View style={[styles.sportIconContainer, { backgroundColor: sport.color }]}>
                  <AppText style={styles.sportIcon}>{sport.icon}</AppText>
                </View>
                <AppText variant="label">{sport.name}</AppText>
                <AppText variant="captionSm" color={colors.textSecondary}>
                  {sport.id === 'SKILLS' ? '' : sport.id}
                </AppText>
              </TouchableOpacity>
            ))}
          </View>
        </If>

        <If condition={selectedSport === 'SKILLS'}>
          <View style={styles.skillsContainer}>
            <View style={styles.skillsCard}>
              <View style={styles.skillsBadge}>
                <Ionicons name="videocam" size={14} color={colors.primary} />
                <AppText variant="captionSm" color={colors.primary} style={{ fontWeight: '600' }}>
                  {battlesStrings.startBattle.neutralAttesterBadge}
                </AppText>
              </View>

              <View style={styles.skillsHeader}>
                <View style={styles.skillsIconContainer}>
                  <AppText style={styles.skillsIcon}>⚡</AppText>
                </View>
                <View style={styles.skillsInfo}>
                  <AppText variant="h4">{battlesStrings.startBattle.skillBattleTitle}</AppText>
                  <AppText variant="captionSm" color={colors.textSecondary}>
                    {battlesStrings.startBattle.skillsSubtitle}
                  </AppText>
                </View>
              </View>

              <View style={styles.skillsFeatures}>
                <View style={styles.skillsFeature}>
                  <Ionicons name="videocam-outline" size={16} color={colors.textSecondary} />
                  <AppText variant="body2" color={colors.textSecondary}>
                    {battlesStrings.startBattle.videoEvidence}
                  </AppText>
                </View>
                <View style={styles.skillsFeature}>
                  <Ionicons name="people-outline" size={16} color={colors.textSecondary} />
                  <AppText variant="body2" color={colors.textSecondary}>
                    {battlesStrings.startBattle.threeAttesters}
                  </AppText>
                </View>
              </View>
            </View>

            <View style={styles.comingSoonCard}>
              <Ionicons name="construct-outline" size={48} color={colors.primary} />
              <AppText variant="h4" style={styles.comingSoonTitle}>
                {battlesStrings.startBattle.comingSoonTitle}
              </AppText>
              <AppText variant="body2" color={colors.textSecondary} style={styles.comingSoonText}>
                {battlesStrings.startBattle.comingSoonBody}
              </AppText>
            </View>
          </View>
        </If>

        <If condition={Boolean(selectedSport && selectedSport !== 'SKILLS')}>
          <View style={styles.categoriesContainer}>
            <View style={styles.selectedSportBadge}>
              <AppText style={styles.selectedSportIcon}>
                {SPORTS.find((s) => s.id === selectedSport)?.icon}
              </AppText>
              <AppText variant="h4">{selectedSport}</AppText>
            </View>

            <View style={styles.categoriesList}>
              {BATTLE_CATEGORIES.map((category) => (
                <TouchableOpacity
                  key={category.id}
                  style={[styles.categoryCard, !category.enabled && styles.categoryCardDisabled]}
                  onPress={() => onCategorySelect(category)}
                  disabled={!category.enabled}
                >
                  <View
                    style={[
                      styles.categoryIconContainer,
                      !category.enabled && styles.categoryIconDisabled,
                    ]}
                  >
                    <Ionicons
                      name={category.icon as keyof typeof Ionicons.glyphMap}
                      size={28}
                      color={category.enabled ? colors.primary : colors.textSecondary}
                    />
                  </View>
                  <View style={styles.categoryInfo}>
                    <AppText
                      variant="label"
                      color={category.enabled ? colors.text : colors.textSecondary}
                    >
                      {category.name}
                    </AppText>
                    <AppText variant="captionSm" color={colors.textSecondary}>
                      {category.enabled
                        ? category.description
                        : battlesStrings.startBattle.categoryComingSoon}
                    </AppText>
                  </View>
                  <Ionicons
                    name="chevron-forward"
                    size={20}
                    color={category.enabled ? colors.textSecondary : colors.inputBorder}
                  />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </If>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[4],
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.card,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing[4],
  },
  sportsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: spacing[4],
    paddingTop: spacing[4],
  },
  sportCard: {
    width: '47%',
    backgroundColor: colors.card,
    borderRadius: radii.lg,
    padding: spacing[4] * 1.5,
    alignItems: 'center',
  },
  sportIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing[4],
  },
  sportIcon: {
    fontSize: 40,
  },
  categoriesContainer: {
    paddingTop: spacing[4],
  },
  selectedSportBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.card,
    borderRadius: radii.lg,
    padding: spacing[4],
    marginBottom: spacing[4] * 1.5,
    gap: spacing[2],
  },
  selectedSportIcon: {
    fontSize: 24,
  },
  categoriesList: {
    gap: spacing[2],
  },
  categoryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: radii.lg,
    padding: spacing[4],
    gap: spacing[4],
  },
  categoryCardDisabled: {
    opacity: 0.5,
  },
  categoryIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primaryTint,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryIconDisabled: {
    backgroundColor: colors.inputBackground,
  },
  categoryInfo: {
    flex: 1,
  },
  skillsContainer: {
    paddingTop: spacing[4],
  },
  skillsCard: {
    backgroundColor: colors.card,
    borderRadius: radii.lg,
    padding: spacing[4],
    borderWidth: 1,
    borderColor: colors.primary,
    marginBottom: spacing[4],
  },
  skillsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primaryTint,
    paddingHorizontal: spacing[2],
    paddingVertical: 4,
    borderRadius: radii.lg,
    alignSelf: 'flex-start',
    gap: 4,
    marginBottom: spacing[4],
  },
  skillsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[4],
    marginBottom: spacing[4],
  },
  skillsIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  skillsIcon: {
    fontSize: 24,
  },
  skillsInfo: {
    flex: 1,
  },
  skillsFeatures: {
    gap: spacing[2],
  },
  skillsFeature: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
  },
  comingSoonCard: {
    backgroundColor: colors.card,
    borderRadius: radii.lg,
    padding: spacing[4] * 2,
    alignItems: 'center',
  },
  comingSoonTitle: {
    marginTop: spacing[4],
    marginBottom: spacing[2],
  },
  comingSoonText: {
    textAlign: 'center',
    lineHeight: 22,
  },
});
