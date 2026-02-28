import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES } from '@/shared/theme';

interface StatDuelDetailsScreenProps {
  navigation: any;
  route: any;
}

const SPORTS = [
  { id: 'NFL', name: 'NFL', icon: '🏈' },
  { id: 'NBA', name: 'NBA', icon: '🏀' },
  { id: 'MLB', name: 'MLB', icon: '⚾' },
  { id: 'NHL', name: 'NHL', icon: '🏒' },
];

const MOCK_GAMES = [
  { id: '1', name: 'Chiefs vs Bills, Week 5', sport: 'NFL', homeTeam: 'Chiefs', awayTeam: 'Bills' },
  { id: '2', name: 'Cowboys vs Eagles, Week 5', sport: 'NFL', homeTeam: 'Cowboys', awayTeam: 'Eagles' },
  { id: '3', name: 'Lakers vs Celtics', sport: 'NBA', homeTeam: 'Lakers', awayTeam: 'Celtics' },
  { id: '4', name: 'Warriors vs Suns', sport: 'NBA', homeTeam: 'Warriors', awayTeam: 'Suns' },
];

// Positions by sport
const POSITIONS_BY_SPORT: Record<string, { id: string; name: string }[]> = {
  NFL: [
    { id: 'QB', name: 'Quarterback (QB)' },
    { id: 'RB', name: 'Running Back (RB)' },
    { id: 'WR', name: 'Wide Receiver (WR)' },
    { id: 'TE', name: 'Tight End (TE)' },
    { id: 'K', name: 'Kicker (K)' },
    { id: 'DEF', name: 'Defense (DEF)' },
  ],
  NBA: [
    { id: 'PG', name: 'Point Guard (PG)' },
    { id: 'SG', name: 'Shooting Guard (SG)' },
    { id: 'SF', name: 'Small Forward (SF)' },
    { id: 'PF', name: 'Power Forward (PF)' },
    { id: 'C', name: 'Center (C)' },
  ],
  MLB: [
    { id: 'P', name: 'Pitcher (P)' },
    { id: 'C', name: 'Catcher (C)' },
    { id: '1B', name: 'First Base (1B)' },
    { id: '2B', name: 'Second Base (2B)' },
    { id: 'SS', name: 'Shortstop (SS)' },
    { id: '3B', name: 'Third Base (3B)' },
    { id: 'OF', name: 'Outfield (OF)' },
  ],
  NHL: [
    { id: 'C', name: 'Center (C)' },
    { id: 'LW', name: 'Left Wing (LW)' },
    { id: 'RW', name: 'Right Wing (RW)' },
    { id: 'D', name: 'Defenseman (D)' },
    { id: 'G', name: 'Goalie (G)' },
  ],
};

export default function StatDuelDetailsScreen({ navigation, route }: StatDuelDetailsScreenProps) {
  const { visibility, battleMode } = route?.params || {};
  
  // Determine if this is Standard-like mode (needs event selection)
  const isStandardMode = battleMode === 'STANDARD' || battleMode === 'BOTH_PICKS';
  const isFantasyMode = battleMode === 'FANTASY';
  
  const [selectedSport, setSelectedSport] = useState<string | null>(null);
  const [selectedGame, setSelectedGame] = useState<string | null>(null);
  const [selectedPosition, setSelectedPosition] = useState<string | null>(null);
  const [startTime, setStartTime] = useState<string>('Auto');
  const [endTime, setEndTime] = useState<string>('Auto');
  
  const [showSportModal, setShowSportModal] = useState(false);
  const [showGameModal, setShowGameModal] = useState(false);
  const [showPositionModal, setShowPositionModal] = useState(false);

  const filteredGames = selectedSport 
    ? MOCK_GAMES.filter(g => g.sport === selectedSport)
    : MOCK_GAMES;

  const availablePositions = selectedSport ? POSITIONS_BY_SPORT[selectedSport] || [] : [];

  const selectedSportData = SPORTS.find(s => s.id === selectedSport);
  const selectedGameData = MOCK_GAMES.find(g => g.id === selectedGame);
  const selectedPositionData = availablePositions.find(p => p.id === selectedPosition);

  const handleContinue = () => {
    navigation.navigate('StatDuelChampion', {
      visibility,
      battleMode,
      sport: selectedSport,
      game: isStandardMode ? selectedGameData : null,
      position: selectedPosition,
      positionName: selectedPositionData?.name,
    });
  };

  // Validation: Standard needs sport + event + position, Fantasy needs sport + position
  const canContinue = isStandardMode 
    ? (selectedSport && selectedGame && selectedPosition)
    : (selectedSport && selectedPosition);

  const handleBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate('StatDuelMode', { visibility });
    }
  };

  const DropdownButton = ({
    label, 
    value, 
    placeholder, 
    onPress,
    required = false,
  }: { 
    label: string; 
    value: string | null; 
    placeholder: string;
    onPress: () => void;
    required?: boolean;
  }) => (
    <View style={styles.dropdownContainer}>
      <Text style={styles.dropdownLabel}>
        {label}{required && ' *'} <Ionicons name="information-circle-outline" size={14} color={COLORS.textSecondary} />
      </Text>
      <TouchableOpacity style={styles.dropdown} onPress={onPress}>
        <Text style={[styles.dropdownText, !value && styles.dropdownPlaceholder]}>
          {value || placeholder}
        </Text>
        <Ionicons name="chevron-down" size={20} color={COLORS.textSecondary} />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={handleBack}
          >
            <View style={styles.backButtonInner}>
              <Ionicons name="arrow-back" size={20} color={COLORS.white} />
            </View>
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>Create Battle</Text>
            <View style={styles.headerIcon}>
              <Ionicons name="globe-outline" size={18} color={COLORS.text} />
            </View>
          </View>
          <TouchableOpacity style={styles.notificationButton}>
            <Ionicons name="notifications-outline" size={20} color={COLORS.primary} />
          </TouchableOpacity>
        </View>

        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: '50%' }]} />
          </View>
          <Text style={styles.progressText}>3/6</Text>
        </View>

        <View style={styles.titleSection}>
          <Text style={styles.sectionTitle}>Create Battle</Text>
          <Text style={styles.sectionSubtitle}>
            {isFantasyMode 
              ? 'Select Sport And Position For Fantasy Battle'
              : 'Select Event And Position For Standard Battle'
            }
          </Text>
        </View>

        {/* Mode indicator */}
        <View style={styles.modeIndicator}>
          <Text style={styles.modeIndicatorText}>
            Mode: {battleMode === 'STANDARD' ? 'Standard' : battleMode === 'FANTASY' ? 'Fantasy' : 'Both Picks'}
          </Text>
        </View>

        {/* Choose Sport - Always shown */}
        <DropdownButton
          label="Choose Sport"
          value={selectedSportData ? `${selectedSportData.icon} ${selectedSportData.name}` : null}
          placeholder="Select Sport"
          onPress={() => setShowSportModal(true)}
          required
        />

        {/* Choose Event - Only for Standard mode */}
        {isStandardMode && (
          <DropdownButton
            label="Choose Event"
            value={selectedGameData?.name || null}
            placeholder="Select Event"
            onPress={() => setShowGameModal(true)}
            required
          />
        )}

        {/* Choose Position - Always shown */}
        <DropdownButton
          label="Choose Position"
          value={selectedPositionData?.name || null}
          placeholder="Select Position"
          onPress={() => setShowPositionModal(true)}
          required
        />

        <View style={styles.timeRow}>
          <View style={styles.timeColumn}>
            <Text style={styles.dropdownLabel}>
              Start Time <Ionicons name="time-outline" size={14} color={COLORS.textSecondary} />
            </Text>
            <TouchableOpacity style={styles.dropdown}>
              <Text style={styles.dropdownText}>{startTime}</Text>
              <Ionicons name="chevron-down" size={20} color={COLORS.textSecondary} />
            </TouchableOpacity>
          </View>
          <View style={styles.timeColumn}>
            <Text style={styles.dropdownLabel}>
              End Time <Ionicons name="time-outline" size={14} color={COLORS.textSecondary} />
            </Text>
            <TouchableOpacity style={styles.dropdown}>
              <Text style={styles.dropdownText}>{endTime}</Text>
              <Ionicons name="chevron-down" size={20} color={COLORS.textSecondary} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.lockTimeContainer}>
          <Ionicons name="lock-closed" size={16} color={COLORS.primary} />
          <Text style={styles.lockTimeText}>
            {isStandardMode 
              ? 'Lock Time: Locks At Game Kickoff'
              : 'Lock Time: Locks At Earliest Kickoff This Week'
            }
          </Text>
        </View>

        {/* Fantasy mode info */}
        {isFantasyMode && (
          <View style={styles.infoBox}>
            <Ionicons name="information-circle-outline" size={20} color={COLORS.primary} />
            <Text style={styles.infoBoxText}>
              In Fantasy Mode, you can pick any player from the selected sport and position. 
              Your opponent can also pick any player of the same sport and position.
            </Text>
          </View>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity 
          style={[styles.continueButton, !canContinue && styles.continueButtonDisabled]}
          onPress={handleContinue}
          disabled={!canContinue}
        >
          <Text style={styles.continueButtonText}>Continue</Text>
          <View style={styles.continueIcon}>
            <Text style={styles.continueIconText}>⚔</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Sport Selection Modal */}
      <Modal visible={showSportModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Sport</Text>
              <TouchableOpacity onPress={() => setShowSportModal(false)}>
                <Ionicons name="close" size={24} color={COLORS.text} />
              </TouchableOpacity>
            </View>
            {SPORTS.map((sport) => (
              <TouchableOpacity
                key={sport.id}
                style={styles.modalOption}
                onPress={() => {
                  setSelectedSport(sport.id);
                  setSelectedGame(null);
                  setSelectedPosition(null);
                  setShowSportModal(false);
                }}
              >
                <Text style={styles.modalOptionIcon}>{sport.icon}</Text>
                <Text style={styles.modalOptionText}>{sport.name}</Text>
                {selectedSport === sport.id && (
                  <Ionicons name="checkmark" size={20} color={COLORS.primary} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>

      {/* Game Selection Modal */}
      <Modal visible={showGameModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Event</Text>
              <TouchableOpacity onPress={() => setShowGameModal(false)}>
                <Ionicons name="close" size={24} color={COLORS.text} />
              </TouchableOpacity>
            </View>
            {filteredGames.length > 0 ? (
              filteredGames.map((game) => (
                <TouchableOpacity
                  key={game.id}
                  style={styles.modalOption}
                  onPress={() => {
                    setSelectedGame(game.id);
                    setShowGameModal(false);
                  }}
                >
                  <Text style={styles.modalOptionText}>{game.name}</Text>
                  {selectedGame === game.id && (
                    <Ionicons name="checkmark" size={20} color={COLORS.primary} />
                  )}
                </TouchableOpacity>
              ))
            ) : (
              <Text style={styles.noOptionsText}>Select a sport first</Text>
            )}
          </View>
        </View>
      </Modal>

      {/* Position Selection Modal */}
      <Modal visible={showPositionModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Position</Text>
              <TouchableOpacity onPress={() => setShowPositionModal(false)}>
                <Ionicons name="close" size={24} color={COLORS.text} />
              </TouchableOpacity>
            </View>
            {availablePositions.length > 0 ? (
              availablePositions.map((position) => (
                <TouchableOpacity
                  key={position.id}
                  style={styles.modalOption}
                  onPress={() => {
                    setSelectedPosition(position.id);
                    setShowPositionModal(false);
                  }}
                >
                  <Text style={styles.modalOptionText}>{position.name}</Text>
                  {selectedPosition === position.id && (
                    <Ionicons name="checkmark" size={20} color={COLORS.primary} />
                  )}
                </TouchableOpacity>
              ))
            ) : (
              <Text style={styles.noOptionsText}>Select a sport first</Text>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: SIZES.padding,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SIZES.padding,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonInner: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SIZES.base,
  },
  headerTitle: {
    color: COLORS.text,
    fontSize: SIZES.large,
    fontWeight: 'bold',
  },
  headerIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.card,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.card,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SIZES.base,
    marginBottom: SIZES.padding,
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: COLORS.card,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 4,
  },
  progressText: {
    color: COLORS.text,
    fontSize: SIZES.font,
    fontWeight: '600',
  },
  titleSection: {
    marginBottom: SIZES.padding,
  },
  sectionTitle: {
    color: COLORS.text,
    fontSize: SIZES.extraLarge,
    fontWeight: 'bold',
    marginBottom: SIZES.base / 2,
  },
  sectionSubtitle: {
    color: COLORS.textSecondary,
    fontSize: SIZES.font,
  },
  modeIndicator: {
    backgroundColor: COLORS.card,
    borderRadius: SIZES.radius,
    padding: SIZES.base,
    marginBottom: SIZES.padding,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.primary,
  },
  modeIndicatorText: {
    color: COLORS.text,
    fontSize: SIZES.small,
    fontWeight: '600',
  },
  dropdownContainer: {
    marginBottom: SIZES.padding,
  },
  dropdownLabel: {
    color: COLORS.textSecondary,
    fontSize: SIZES.small,
    marginBottom: SIZES.base,
  },
  dropdown: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: SIZES.radius,
    borderWidth: 1,
    borderColor: COLORS.inputBorder,
    paddingHorizontal: SIZES.padding,
    paddingVertical: SIZES.padding,
  },
  dropdownText: {
    color: COLORS.text,
    fontSize: SIZES.font,
  },
  dropdownPlaceholder: {
    color: COLORS.textMuted,
  },
  timeRow: {
    flexDirection: 'row',
    gap: SIZES.padding,
    marginBottom: SIZES.padding,
  },
  timeColumn: {
    flex: 1,
  },
  lockTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    gap: SIZES.base,
    marginBottom: SIZES.padding,
  },
  lockTimeText: {
    color: COLORS.text,
    fontSize: SIZES.small,
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: 'rgba(229, 57, 53, 0.1)',
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    gap: SIZES.base,
    marginBottom: SIZES.padding,
  },
  infoBoxText: {
    flex: 1,
    color: COLORS.textSecondary,
    fontSize: SIZES.small,
    lineHeight: 18,
  },
  footer: {
    paddingHorizontal: SIZES.padding,
    paddingVertical: SIZES.padding,
    borderTopWidth: 1,
    borderTopColor: COLORS.inputBorder,
  },
  continueButton: {
    flexDirection: 'row',
    backgroundColor: COLORS.primary,
    paddingVertical: SIZES.padding,
    borderRadius: SIZES.radius,
    alignItems: 'center',
    justifyContent: 'center',
    gap: SIZES.base,
  },
  continueButtonDisabled: {
    opacity: 0.5,
  },
  continueButtonText: {
    color: COLORS.white,
    fontSize: SIZES.medium,
    fontWeight: 'bold',
  },
  continueIcon: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  continueIconText: {
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.background,
    borderTopLeftRadius: SIZES.radius * 2,
    borderTopRightRadius: SIZES.radius * 2,
    padding: SIZES.padding,
    maxHeight: '60%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.padding,
    paddingBottom: SIZES.padding,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.inputBorder,
  },
  modalTitle: {
    color: COLORS.text,
    fontSize: SIZES.large,
    fontWeight: 'bold',
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SIZES.padding,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.inputBorder,
    gap: SIZES.base,
  },
  modalOptionIcon: {
    fontSize: 20,
  },
  modalOptionText: {
    flex: 1,
    color: COLORS.text,
    fontSize: SIZES.font,
  },
  noOptionsText: {
    color: COLORS.textSecondary,
    fontSize: SIZES.font,
    textAlign: 'center',
    paddingVertical: SIZES.padding * 2,
  },
});
