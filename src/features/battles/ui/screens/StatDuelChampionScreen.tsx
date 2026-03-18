import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppText, Screen, ScreenHeader, ProgressBar, Avatar, SearchInput } from '@/shared/ui';
import { SelectionModal, type SelectionOption } from '@/shared/ui';
import { colors, spacing, radii, fontSizes, verticalScale, horizontalScale } from '@/shared/theme';
import { getInitials } from '@/shared/utils';
import { useStatDuelStore } from '@/features/battles/data/store/statDuel.store';
import type { StatDuelChampionScreenProps, StatDuelPlayer, StatDuelStatCategory } from '@/shared/types';

const MOCK_PLAYERS = [
  { id: '1', name: 'Patrick Mahomes', team: 'Kansas City Chiefs', position: 'Quarterback', positionCode: 'QB', sport: 'NFL' },
  { id: '2', name: 'Josh Allen', team: 'Buffalo Bills', position: 'Quarterback', positionCode: 'QB', sport: 'NFL' },
  { id: '3', name: 'Derrick Henry', team: 'Tennessee Titans', position: 'Running Back', positionCode: 'RB', sport: 'NFL' },
  { id: '4', name: 'Christian McCaffrey', team: 'San Francisco 49ers', position: 'Running Back', positionCode: 'RB', sport: 'NFL' },
  { id: '5', name: 'Tyreek Hill', team: 'Miami Dolphins', position: 'Wide Receiver', positionCode: 'WR', sport: 'NFL' },
  { id: '6', name: 'Justin Jefferson', team: 'Minnesota Vikings', position: 'Wide Receiver', positionCode: 'WR', sport: 'NFL' },
  { id: '7', name: 'Travis Kelce', team: 'Kansas City Chiefs', position: 'Tight End', positionCode: 'TE', sport: 'NFL' },
  { id: '8', name: 'George Kittle', team: 'San Francisco 49ers', position: 'Tight End', positionCode: 'TE', sport: 'NFL' },
  { id: '9', name: 'Justin Tucker', team: 'Baltimore Ravens', position: 'Kicker', positionCode: 'K', sport: 'NFL' },
  { id: '10', name: 'Harrison Butker', team: 'Kansas City Chiefs', position: 'Kicker', positionCode: 'K', sport: 'NFL' },
  { id: '11', name: 'San Francisco 49ers', team: '49ers Defense', position: 'Defense', positionCode: 'DEF', sport: 'NFL' },
  { id: '12', name: 'Dallas Cowboys', team: 'Cowboys Defense', position: 'Defense', positionCode: 'DEF', sport: 'NFL' },
  { id: '13', name: 'Stephen Curry', team: 'Golden State Warriors', position: 'Point Guard', positionCode: 'PG', sport: 'NBA' },
  { id: '14', name: 'Luka Doncic', team: 'Dallas Mavericks', position: 'Point Guard', positionCode: 'PG', sport: 'NBA' },
  { id: '15', name: 'Devin Booker', team: 'Phoenix Suns', position: 'Shooting Guard', positionCode: 'SG', sport: 'NBA' },
  { id: '16', name: 'Anthony Edwards', team: 'Minnesota Timberwolves', position: 'Shooting Guard', positionCode: 'SG', sport: 'NBA' },
  { id: '17', name: 'LeBron James', team: 'Los Angeles Lakers', position: 'Small Forward', positionCode: 'SF', sport: 'NBA' },
  { id: '18', name: 'Jayson Tatum', team: 'Boston Celtics', position: 'Small Forward', positionCode: 'SF', sport: 'NBA' },
  { id: '19', name: 'Giannis Antetokounmpo', team: 'Milwaukee Bucks', position: 'Power Forward', positionCode: 'PF', sport: 'NBA' },
  { id: '20', name: 'Kevin Durant', team: 'Phoenix Suns', position: 'Power Forward', positionCode: 'PF', sport: 'NBA' },
  { id: '21', name: 'Nikola Jokic', team: 'Denver Nuggets', position: 'Center', positionCode: 'C', sport: 'NBA' },
  { id: '22', name: 'Joel Embiid', team: 'Philadelphia 76ers', position: 'Center', positionCode: 'C', sport: 'NBA' },
  { id: '23', name: 'Gerrit Cole', team: 'New York Yankees', position: 'Pitcher', positionCode: 'P', sport: 'MLB' },
  { id: '24', name: 'Max Scherzer', team: 'Texas Rangers', position: 'Pitcher', positionCode: 'P', sport: 'MLB' },
  { id: '25', name: 'J.T. Realmuto', team: 'Philadelphia Phillies', position: 'Catcher', positionCode: 'C', sport: 'MLB' },
  { id: '26', name: 'Will Smith', team: 'Los Angeles Dodgers', position: 'Catcher', positionCode: 'C', sport: 'MLB' },
  { id: '27', name: 'Freddie Freeman', team: 'Los Angeles Dodgers', position: 'First Base', positionCode: '1B', sport: 'MLB' },
  { id: '28', name: 'Paul Goldschmidt', team: 'St. Louis Cardinals', position: 'First Base', positionCode: '1B', sport: 'MLB' },
  { id: '29', name: 'Mookie Betts', team: 'Los Angeles Dodgers', position: 'Second Base', positionCode: '2B', sport: 'MLB' },
  { id: '30', name: 'Jose Altuve', team: 'Houston Astros', position: 'Second Base', positionCode: '2B', sport: 'MLB' },
  { id: '31', name: 'Trea Turner', team: 'Philadelphia Phillies', position: 'Shortstop', positionCode: 'SS', sport: 'MLB' },
  { id: '32', name: 'Francisco Lindor', team: 'New York Mets', position: 'Shortstop', positionCode: 'SS', sport: 'MLB' },
  { id: '33', name: 'Nolan Arenado', team: 'St. Louis Cardinals', position: 'Third Base', positionCode: '3B', sport: 'MLB' },
  { id: '34', name: 'Jose Ramirez', team: 'Cleveland Guardians', position: 'Third Base', positionCode: '3B', sport: 'MLB' },
  { id: '35', name: 'Mike Trout', team: 'Los Angeles Angels', position: 'Outfield', positionCode: 'OF', sport: 'MLB' },
  { id: '36', name: 'Ronald Acuna Jr', team: 'Atlanta Braves', position: 'Outfield', positionCode: 'OF', sport: 'MLB' },
  { id: '37', name: 'Connor McDavid', team: 'Edmonton Oilers', position: 'Center', positionCode: 'C', sport: 'NHL' },
  { id: '38', name: 'Auston Matthews', team: 'Toronto Maple Leafs', position: 'Center', positionCode: 'C', sport: 'NHL' },
  { id: '39', name: 'Alex Ovechkin', team: 'Washington Capitals', position: 'Left Wing', positionCode: 'LW', sport: 'NHL' },
  { id: '40', name: 'Matthew Tkachuk', team: 'Florida Panthers', position: 'Left Wing', positionCode: 'LW', sport: 'NHL' },
  { id: '41', name: 'Nikita Kucherov', team: 'Tampa Bay Lightning', position: 'Right Wing', positionCode: 'RW', sport: 'NHL' },
  { id: '42', name: 'David Pastrnak', team: 'Boston Bruins', position: 'Right Wing', positionCode: 'RW', sport: 'NHL' },
  { id: '43', name: 'Cale Makar', team: 'Colorado Avalanche', position: 'Defenseman', positionCode: 'D', sport: 'NHL' },
  { id: '44', name: 'Victor Hedman', team: 'Tampa Bay Lightning', position: 'Defenseman', positionCode: 'D', sport: 'NHL' },
  { id: '45', name: 'Igor Shesterkin', team: 'New York Rangers', position: 'Goalie', positionCode: 'G', sport: 'NHL' },
  { id: '46', name: 'Andrei Vasilevskiy', team: 'Tampa Bay Lightning', position: 'Goalie', positionCode: 'G', sport: 'NHL' },
];

const DIRECTION_OPTIONS: SelectionOption[] = [
  { key: 'MOST', label: 'Most' },
  { key: 'LEAST', label: 'Least' },
];

const STAT_CATEGORIES_BY_SPORT: Record<string, { id: string; name: string }[]> = {
  NFL: [
    { id: 'passing_yards', name: 'Passing Yards' },
    { id: 'rushing_yards', name: 'Rushing Yards' },
    { id: 'receiving_yards', name: 'Receiving Yards' },
    { id: 'touchdowns', name: 'Touchdowns' },
    { id: 'receptions', name: 'Receptions' },
    { id: 'interceptions', name: 'Interceptions' },
  ],
  NBA: [
    { id: 'points', name: 'Points' },
    { id: 'rebounds', name: 'Rebounds' },
    { id: 'assists', name: 'Assists' },
    { id: 'steals', name: 'Steals' },
    { id: 'blocks', name: 'Blocks' },
    { id: 'three_pointers', name: 'Three Pointers' },
  ],
  MLB: [
    { id: 'home_runs', name: 'Home Runs' },
    { id: 'rbis', name: 'RBIs' },
    { id: 'batting_average', name: 'Batting Average' },
    { id: 'stolen_bases', name: 'Stolen Bases' },
    { id: 'strikeouts', name: 'Strikeouts' },
    { id: 'era', name: 'ERA' },
  ],
  NHL: [
    { id: 'goals', name: 'Goals' },
    { id: 'assists', name: 'Assists' },
    { id: 'points', name: 'Points' },
    { id: 'plus_minus', name: 'Plus/Minus' },
    { id: 'saves', name: 'Saves' },
    { id: 'penalty_minutes', name: 'Penalty Minutes' },
  ],
};

const STAKE_OPTIONS: SelectionOption[] = [
  { key: '10', label: '10 BC' },
  { key: '25', label: '25 BC' },
  { key: '50', label: '50 BC' },
  { key: '100', label: '100 BC' },
  { key: '250', label: '250 BC' },
];

export default function StatDuelChampionScreen({ navigation, route }: StatDuelChampionScreenProps) {
  const { visibility, battleMode, sport, game, position, positionName } = route?.params || {};

  const player = useStatDuelStore((s) => s.player);
  const statCategory = useStatDuelStore((s) => s.statCategory);
  const stake = useStatDuelStore((s) => s.stake);
  const direction = useStatDuelStore((s) => s.direction);
  const showPlayerModal = useStatDuelStore((s) => s.showPlayerModal);
  const showStatModal = useStatDuelStore((s) => s.showStatModal);
  const showStakeModal = useStatDuelStore((s) => s.showStakeModal);
  const showDirectionModal = useStatDuelStore((s) => s.showDirectionModal);
  const playerSearch = useStatDuelStore((s) => s.playerSearch);
  const setPlayer = useStatDuelStore((s) => s.setPlayer);
  const setStatCategory = useStatDuelStore((s) => s.setStatCategory);
  const setStake = useStatDuelStore((s) => s.setStake);
  const setDirection = useStatDuelStore((s) => s.setDirection);
  const setShowPlayerModal = useStatDuelStore((s) => s.setShowPlayerModal);
  const setShowStatModal = useStatDuelStore((s) => s.setShowStatModal);
  const setShowStakeModal = useStatDuelStore((s) => s.setShowStakeModal);
  const setShowDirectionModal = useStatDuelStore((s) => s.setShowDirectionModal);
  const setPlayerSearch = useStatDuelStore((s) => s.setPlayerSearch);

  const isStandardMode = battleMode === 'STANDARD' || battleMode === 'BOTH_PICKS';
  const isFantasyMode = battleMode === 'FANTASY';

  const filteredPlayers = MOCK_PLAYERS.filter(p => {
    if (sport && p.sport !== sport) return false;
    if (position && p.positionCode !== position) return false;
    return p.name.toLowerCase().includes(playerSearch.toLowerCase()) ||
           p.team.toLowerCase().includes(playerSearch.toLowerCase());
  });

  const statCategories = STAT_CATEGORIES_BY_SPORT[sport] || STAT_CATEGORIES_BY_SPORT.NFL;
  const statOptions: SelectionOption[] = statCategories.map(s => ({ key: s.id, label: s.name }));
  const selectedStatData = statCategories.find(s => s.id === (statCategory?.id ?? ''));
  const selectedDirectionData = DIRECTION_OPTIONS.find(d => d.key === (direction ?? ''));

  const handleContinue = () => {
    navigation.navigate('StatDuelOpponent', {
      visibility,
      battleMode,
      sport,
      game,
      position,
      positionName,
      player,
      statCategory,
      stake,
      direction,
      directionName: selectedDirectionData?.label,
    });
  };

  const canContinue = isStandardMode
    ? (player && statCategory && stake && direction)
    : (player && statCategory && stake);

  const getStatDescription = () => {
    if (!statCategory || !player) return '';
    return `Compare Total ${statCategory.name} For Both Players`;
  };

  const handleBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate('StatDuelDetails', { visibility, battleMode });
    }
  };

  return (
    <Screen padding={0}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <ScreenHeader
          title="Create Battle"
          onBack={handleBack}
          rightSlot={
            <TouchableOpacity style={styles.notificationButton}>
              <Ionicons name="notifications-outline" size={20} color={colors.primary} />
            </TouchableOpacity>
          }
        />

        <View style={styles.progressContainer}>
          <ProgressBar progress={0.66} />
          <AppText variant="label">4/6</AppText>
        </View>

        <View style={styles.titleSection}>
          <AppText variant="h4">Choose Your Champion And The Dueling Stats</AppText>
          <AppText variant="body2" color={colors.textSecondary}>Choose Stats To Battle On</AppText>
        </View>

        <View style={styles.dropdownContainer}>
          <AppText variant="label" color={colors.textSecondary}>
            Pick Player * <Ionicons name="information-circle-outline" size={14} color={colors.textSecondary} />
          </AppText>
          <TouchableOpacity style={styles.dropdown} onPress={() => setShowPlayerModal(true)}>
            <AppText variant="body2" color={player ? colors.text : colors.muted}>
              {player ? player.name : 'pick players'}
            </AppText>
            <Ionicons name="chevron-down" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        <View style={styles.dropdownContainer}>
          <AppText variant="label" color={colors.textSecondary}>
            Stat Category * <Ionicons name="information-circle-outline" size={14} color={colors.textSecondary} />
          </AppText>
          <TouchableOpacity style={styles.dropdown} onPress={() => setShowStatModal(true)}>
            <AppText variant="body2" color={statCategory ? colors.text : colors.muted}>
              {statCategory?.name || 'Select stat category'}
            </AppText>
            <Ionicons name="chevron-down" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {isStandardMode ? (
          <View style={styles.dropdownContainer}>
            <AppText variant="label" color={colors.textSecondary}>
              Choose Direction * <Ionicons name="information-circle-outline" size={14} color={colors.textSecondary} />
            </AppText>
            <TouchableOpacity style={styles.dropdown} onPress={() => setShowDirectionModal(true)}>
              <AppText variant="body2" color={direction ? colors.text : colors.muted}>
                {selectedDirectionData?.label || 'Select direction (Most/Least)'}
              </AppText>
              <Ionicons name="chevron-down" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>
        ) : null}

        <View style={styles.dropdownContainer}>
          <AppText variant="label" color={colors.textSecondary}>
            Stake BC <Ionicons name="information-circle-outline" size={14} color={colors.textSecondary} />
          </AppText>
          <TouchableOpacity style={styles.dropdown} onPress={() => setShowStakeModal(true)}>
            <AppText variant="body2">{stake} BC</AppText>
            <Ionicons name="chevron-down" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {player && statCategory ? (
          <View style={styles.infoCard}>
            <AppText variant="label">Stat Description</AppText>
            <AppText variant="body2" color={colors.textSecondary}>{getStatDescription()}</AppText>
          </View>
        ) : null}

        <View style={styles.infoCard}>
          <AppText variant="label">Official Rules</AppText>
          <AppText variant="captionSm" color={colors.textSecondary}>
            Tie Rule: If Both QBs Have Same Passing Yards — Tie.{'\n'}
            Minimum Attempts: x10 Passes Required For Each QB.
          </AppText>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.continueButton, !canContinue && styles.continueButtonDisabled]}
          onPress={handleContinue}
          disabled={!canContinue}
        >
          <AppText variant="buttonLg" color={colors.white}>Continue</AppText>
          <AppText variant="body1">⚔</AppText>
        </TouchableOpacity>
      </View>

      {/* Player Selection Modal */}
      <Modal visible={showPlayerModal} transparent animationType="slide">
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowPlayerModal(false)}
        >
          <View style={styles.modalContent} onStartShouldSetResponder={() => true}>
            <View style={styles.modalHeader}>
              <AppText variant="h5">Search Player/Teams</AppText>
              <TouchableOpacity onPress={() => setShowPlayerModal(false)}>
                <Ionicons name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>

            <SearchInput
              value={playerSearch}
              onChangeText={setPlayerSearch}
              placeholder="Search players..."
              style={styles.searchSpacing}
            />

            <View style={styles.filterTabs}>
              <TouchableOpacity style={[styles.filterTab, styles.filterTabActive]}>
                <Ionicons name="person-outline" size={16} color={colors.white} />
                <AppText variant="captionSm" color={colors.white}>Ps</AppText>
              </TouchableOpacity>
              <TouchableOpacity style={styles.filterTab}>
                <Ionicons name="filter-outline" size={16} color={colors.textSecondary} />
                <AppText variant="captionSm" color={colors.textSecondary}>Filter</AppText>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.playerList}>
              {filteredPlayers.map((player) => (
                <TouchableOpacity
                  key={player.id}
                  style={styles.playerOption}
                  onPress={() => {
                    setPlayer(player as StatDuelPlayer);
                    setShowPlayerModal(false);
                    setPlayerSearch('');
                  }}
                >
                  <Avatar
                    initials={getInitials(player.name)}
                    size="sm"
                    backgroundColor={colors.primary}
                    borderColor={colors.primary}
                    textColor={colors.white}
                  />
                  <View style={styles.playerInfo}>
                    <AppText variant="label">{player.name}</AppText>
                    <AppText variant="captionSm" color={colors.textSecondary}>{player.position}</AppText>
                  </View>
                  <View style={styles.playerTeamBadge}>
                    <AppText variant="captionSm">{player.team}</AppText>
                    <View style={styles.activeIndicator}>
                      <View style={styles.activeDot} />
                      <AppText variant="captionSm" color={colors.success}>Active</AppText>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>

      <SelectionModal
        visible={showStatModal}
        title="Select Stat Category"
        options={statOptions}
        selectedKey={statCategory?.id ?? undefined}
        onSelect={(key) => {
          const cat = statCategories.find((s) => s.id === key);
          if (cat) setStatCategory(cat);
          setShowStatModal(false);
        }}
        onClose={() => setShowStatModal(false)}
      />

      <SelectionModal
        visible={showStakeModal}
        title="Select Stake"
        options={STAKE_OPTIONS}
        selectedKey={stake}
        onSelect={(key) => { setStake(key); setShowStakeModal(false); }}
        onClose={() => setShowStakeModal(false)}
      />

      <SelectionModal
        visible={showDirectionModal}
        title="Select Direction"
        options={DIRECTION_OPTIONS}
        selectedKey={direction || undefined}
        onSelect={(key) => { setDirection(key); setShowDirectionModal(false); }}
        onClose={() => setShowDirectionModal(false)}
      />
    </Screen>
  );
}

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
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
    marginBottom: spacing[4],
  },
  titleSection: {
    marginBottom: spacing[4],
    gap: spacing[1],
  },
  dropdownContainer: {
    marginBottom: spacing[4],
    gap: spacing[2],
  },
  dropdown: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[4],
  },
  infoCard: {
    backgroundColor: colors.card,
    borderRadius: radii.lg,
    padding: spacing[4],
    marginBottom: spacing[4],
    borderWidth: 1,
    borderColor: colors.inputBorder,
    gap: spacing[2],
  },
  footer: {
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[4],
    borderTopWidth: 1,
    borderTopColor: colors.inputBorder,
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
    opacity: 0.5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: colors.overlayHeavy,
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.background,
    borderTopLeftRadius: radii.xl,
    borderTopRightRadius: radii.xl,
    padding: spacing[4],
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing[4],
    paddingBottom: spacing[4],
    borderBottomWidth: 1,
    borderBottomColor: colors.inputBorder,
  },
  searchSpacing: {
    marginBottom: spacing[4],
  },
  filterTabs: {
    flexDirection: 'row',
    gap: spacing[2],
    marginBottom: spacing[4],
  },
  filterTab: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[2],
    borderRadius: radii.lg,
    gap: spacing[1],
  },
  filterTabActive: {
    backgroundColor: colors.primary,
  },
  playerList: {
    maxHeight: 400,
  },
  playerOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing[4],
    borderBottomWidth: 1,
    borderBottomColor: colors.inputBorder,
    gap: spacing[2],
  },
  playerInfo: {
    flex: 1,
  },
  playerTeamBadge: {
    alignItems: 'flex-end',
  },
  activeIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  activeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.success,
  },
});
