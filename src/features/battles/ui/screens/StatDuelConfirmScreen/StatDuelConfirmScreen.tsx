import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppText, Screen, ScreenHeader, ProgressBar } from '@/shared/ui';
import { colors, spacing, radii, verticalScale } from '@/shared/theme';
import {
  battlesFormatStakeBc,
  battlesStatCategorySummary,
  battlesStrings,
} from '@/features/battles/string';
import { getBattleModeLabel } from '@/shared/utils';
import type { StatDuelConfirmScreenViewProps } from '../../hooks/useStatDuelConfirmScreen';

function SummaryRow({
  label,
  value,
  valueColor,
}: {
  label: string;
  value: string;
  valueColor?: string;
}) {
  return (
    <View style={summaryStyles.row}>
      <View style={summaryStyles.dot} />
      <AppText variant="captionSm" color={colors.textSecondary}>
        {label}
      </AppText>
      <AppText variant="label" color={valueColor}>
        {value}
      </AppText>
    </View>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={detailStyles.row}>
      <AppText variant="body2" color={colors.textSecondary}>
        {label}
      </AppText>
      <AppText variant="label">{value}</AppText>
    </View>
  );
}

export function StatDuelConfirmScreen(props: StatDuelConfirmScreenViewProps) {
  const {
    visibility,
    battleMode,
    game,
    player,
    statCategory,
    stake,
    opponent,
    isSubmitting,
    onCreateBattle,
    onBack,
  } = props;

  return (
    <Screen padding={0}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <ScreenHeader
          title={battlesStrings.common.createBattle}
          onBack={onBack}
          rightSlot={
            <TouchableOpacity style={styles.notificationButton}>
              <Ionicons name="notifications-outline" size={20} color={colors.primary} />
            </TouchableOpacity>
          }
        />

        <View style={styles.progressRow}>
          <ProgressBar progress={1} />
          <AppText variant="label">{battlesStrings.statDuel.progress6of6}</AppText>
        </View>

        <View style={styles.titleSection}>
          <AppText variant="h4">{battlesStrings.statDuel.confirmTitle}</AppText>
          <AppText variant="body2" color={colors.textSecondary}>
            {battlesStrings.statDuel.confirmSubtitle}
          </AppText>
        </View>

        <View style={styles.card}>
          <SummaryRow
            label={battlesStrings.statDuel.summaryStatCategory}
            value={battlesStatCategorySummary(
              statCategory?.name || battlesStrings.statDuel.defaultStatCategory,
            )}
          />
          <SummaryRow
            label={battlesStrings.statDuel.summaryGameEvent}
            value={game?.name || battlesStrings.statDuel.defaultGame}
          />
          <SummaryRow
            label={battlesStrings.statDuel.summaryPlayer}
            value={player?.name || battlesStrings.statDuel.defaultPlayer}
            valueColor={colors.primary}
          />
        </View>

        <View style={styles.lockTimeBanner}>
          <Ionicons name="lock-closed" size={16} color={colors.primary} />
          <AppText variant="captionSm">{battlesStrings.statDuel.lockKickoff}</AppText>
        </View>

        <View style={styles.card}>
          <AppText variant="label">{battlesStrings.statDuel.officialRules}</AppText>
          <AppText variant="captionSm" color={colors.textSecondary} style={styles.rulesText}>
            {battlesStrings.statDuel.confirmRules}
          </AppText>
        </View>

        <View style={styles.oracleCard}>
          <View style={styles.oracleIcon}>
            <Ionicons name="shield-checkmark" size={24} color={colors.primary} />
          </View>
          <View style={styles.oracleContent}>
            <AppText variant="label">{battlesStrings.common.oracleVerified}</AppText>
            <AppText variant="captionSm" color={colors.textSecondary}>
              {battlesStrings.common.oracleVerifiedBody}
            </AppText>
          </View>
        </View>

        <View style={styles.card}>
          <DetailRow
            label={battlesStrings.statDuel.detailBattleMode}
            value={getBattleModeLabel(battleMode ?? 'STANDARD')}
          />
          <DetailRow
            label={battlesStrings.statDuel.detailVisibility}
            value={
              visibility === 'private'
                ? battlesStrings.statDuel.visibilityPrivate
                : battlesStrings.statDuel.visibilityPublic
            }
          />
          <DetailRow
            label={battlesStrings.statDuel.detailStake}
            value={battlesFormatStakeBc(stake ?? '')}
          />
          {opponent ? (
            <DetailRow label={battlesStrings.statDuel.detailOpponent} value={opponent.display_name} />
          ) : null}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.lockTimeFooter}>
          <Ionicons name="lock-closed" size={14} color={colors.primary} />
          <AppText variant="captionSm" color={colors.primary}>
            {battlesStrings.statDuel.lockFooter}
          </AppText>
        </View>
        <TouchableOpacity
          style={[styles.continueButton, isSubmitting && styles.continueButtonDisabled]}
          onPress={onCreateBattle}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator color={colors.white} />
          ) : (
            <>
              <AppText variant="buttonLg" color={colors.white}>
                {battlesStrings.common.continue}
              </AppText>
              <AppText variant="body1">⚔</AppText>
            </>
          )}
        </TouchableOpacity>
      </View>
    </Screen>
  );
}

const summaryStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing[2],
    gap: spacing[2],
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.text,
  },
});

const detailStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing[2],
    borderBottomWidth: 1,
    borderBottomColor: colors.inputBorder,
  },
});

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    paddingHorizontal: spacing[4],
  },
  notificationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.card,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
    marginBottom: spacing[4],
  },
  titleSection: {
    marginBottom: spacing[4],
    gap: spacing[1],
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: radii.lg,
    padding: spacing[4],
    marginBottom: spacing[4],
    borderWidth: 1,
    borderColor: colors.inputBorder,
    gap: spacing[2],
  },
  lockTimeBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: radii.lg,
    padding: spacing[4],
    gap: spacing[2],
    marginBottom: spacing[4],
  },
  rulesText: {
    lineHeight: 20,
  },
  oracleCard: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: radii.lg,
    padding: spacing[4],
    marginBottom: spacing[4],
    borderWidth: 1,
    borderColor: colors.primary,
    gap: spacing[4],
  },
  oracleIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primaryTint,
    justifyContent: 'center',
    alignItems: 'center',
  },
  oracleContent: {
    flex: 1,
    gap: spacing[1],
  },
  footer: {
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[4],
    borderTopWidth: 1,
    borderTopColor: colors.inputBorder,
  },
  lockTimeFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[1],
    marginBottom: spacing[4],
  },
  continueButton: {
    flexDirection: 'row',
    backgroundColor: colors.primary,
    paddingVertical: verticalScale(16),
    borderRadius: radii.lg,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[2],
  },
  continueButtonDisabled: {
    opacity: 0.7,
  },
});
