import { View, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing } from '@/shared/theme';
import { AppText, Screen } from '@/shared/ui';
import If from '@/shared/ui/atoms/If';
import { battlesStrings } from '@/features/battles/string';
import { BattleInfoCard } from '@/features/battles/ui/components/BattleInfoCard';
import { ScoreDisplay } from '@/features/battles/ui/components/ScoreDisplay';
import { WinnerCard } from '@/features/battles/ui/components/WinnerCard';
import { ParticipantsList } from '@/features/battles/ui/components/ParticipantsList';
import { JoinBattleSection } from '@/features/battles/ui/components/JoinBattleSection';
import type { BattleDetailScreenViewProps } from '../../hooks/useBattleDetailScreen';

export function BattleDetailScreen(props: BattleDetailScreenViewProps) {
  const {
    user,
    battle,
    participants,
    gameScore,
    detailLoading,
    pick,
    setPick,
    joining,
    isCreator,
    canJoin,
    alreadyJoined,
    isHeadToHeadBattle,
    isHeadToHeadReady,
    creatorWinningTeam,
    joinerWinningTeam,
    homeTeamName,
    awayTeamName,
    pendingResolution,
    winnerName,
    handleJoin,
    onBack,
  } = props;

  return (
    <Screen>
      <If condition={detailLoading}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </If>

      <If condition={!detailLoading && !battle}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={onBack}>
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <AppText variant="h4">{battlesStrings.battleDetail.notFound}</AppText>
          <View style={styles.placeholder} />
        </View>
      </If>

      <If condition={!detailLoading && Boolean(battle)}>
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <TouchableOpacity style={styles.backButton} onPress={onBack}>
              <Ionicons name="arrow-back" size={24} color={colors.text} />
            </TouchableOpacity>
            <AppText variant="h4">{battlesStrings.battleDetail.screenTitle}</AppText>
            <View style={styles.placeholder} />
          </View>

          <BattleInfoCard battle={battle!} isCreator={isCreator} />

          {gameScore ? (
            <ScoreDisplay gameScore={gameScore} isCompleted={battle!.status === 'completed'} />
          ) : null}

          <WinnerCard
            battle={battle!}
            winnerName={winnerName}
            pendingResolution={pendingResolution}
          />

          <ParticipantsList participants={participants} currentUserId={user?.id} />

          <JoinBattleSection
            canJoin={canJoin}
            alreadyJoined={alreadyJoined}
            isCreator={isCreator}
            isHeadToHeadBattle={isHeadToHeadBattle}
            isHeadToHeadReady={isHeadToHeadReady}
            creatorWinningTeam={creatorWinningTeam}
            joinerWinningTeam={joinerWinningTeam}
            homeTeamName={homeTeamName}
            awayTeamName={awayTeamName}
            pick={pick}
            onPickChange={setPick}
            joining={joining}
            onJoin={handleJoin}
          />
        </ScrollView>
      </If>
    </Screen>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
});
