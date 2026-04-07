import { useCallback, useEffect, useMemo } from 'react';
import type { StatDuelDetailsScreenProps } from '@/shared/types';
import { useStatDuelStore } from '@/features/battles/data/store/statDuel.store';
import { STAT_DUEL_SPORTS, MOCK_GAMES, POSITIONS_BY_SPORT } from '@/shared/constants';

export type StatDuelDetailsScreenViewProps = ReturnType<typeof useStatDuelDetailsScreen>;

export function useStatDuelDetailsScreen({
  navigation,
  route,
}: Pick<StatDuelDetailsScreenProps, 'navigation' | 'route'>) {
  const { visibility, battleMode: routeBattleMode } = route?.params || {};

  const battleMode = useStatDuelStore((s) => s.battleMode);
  const selectedSport = useStatDuelStore((s) => s.selectedSport);
  const selectedGame = useStatDuelStore((s) => s.selectedGame);
  const selectedPosition = useStatDuelStore((s) => s.selectedPosition);
  const startTime = useStatDuelStore((s) => s.startTime);
  const endTime = useStatDuelStore((s) => s.endTime);
  const showSportModal = useStatDuelStore((s) => s.showSportModal);
  const showGameModal = useStatDuelStore((s) => s.showGameModal);
  const showPositionModal = useStatDuelStore((s) => s.showPositionModal);
  const setVisibility = useStatDuelStore((s) => s.setVisibility);
  const setBattleMode = useStatDuelStore((s) => s.setBattleMode);
  const setSelectedSport = useStatDuelStore((s) => s.setSelectedSport);
  const setSelectedGame = useStatDuelStore((s) => s.setSelectedGame);
  const setSelectedPosition = useStatDuelStore((s) => s.setSelectedPosition);
  const setShowSportModal = useStatDuelStore((s) => s.setShowSportModal);
  const setShowGameModal = useStatDuelStore((s) => s.setShowGameModal);
  const setShowPositionModal = useStatDuelStore((s) => s.setShowPositionModal);

  useEffect(() => {
    if (visibility) setVisibility(visibility);
    if (routeBattleMode) setBattleMode(routeBattleMode);
  }, [visibility, routeBattleMode, setVisibility, setBattleMode]);

  const effectiveBattleMode = battleMode ?? routeBattleMode;
  const isStandardMode =
    effectiveBattleMode === 'STANDARD' || effectiveBattleMode === 'BOTH_PICKS';
  const isFantasyMode = effectiveBattleMode === 'FANTASY';

  const filteredGames = useMemo(
    () =>
      selectedSport ? MOCK_GAMES.filter((g) => g.sport === selectedSport) : [...MOCK_GAMES],
    [selectedSport],
  );

  const availablePositions = useMemo(
    () => (selectedSport ? POSITIONS_BY_SPORT[selectedSport] || [] : []),
    [selectedSport],
  );

  const selectedSportData = STAT_DUEL_SPORTS.find((s) => s.id === selectedSport);
  const selectedGameData = MOCK_GAMES.find((g) => g.id === selectedGame);
  const selectedPositionData = availablePositions.find((p) => p.id === selectedPosition);

  const canContinue = isStandardMode
    ? Boolean(selectedSport && selectedGame && selectedPosition)
    : Boolean(selectedSport && selectedPosition);

  const onContinue = useCallback(() => {
    navigation.navigate('StatDuelChampion', {
      visibility,
      battleMode: effectiveBattleMode,
      sport: selectedSport,
      game: isStandardMode ? selectedGameData ?? null : null,
      position: selectedPosition,
      positionName: selectedPositionData?.name,
    });
  }, [
    navigation,
    visibility,
    effectiveBattleMode,
    selectedSport,
    isStandardMode,
    selectedGameData,
    selectedPosition,
    selectedPositionData?.name,
  ]);

  const onBack = useCallback(() => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate('StatDuelMode', { visibility });
    }
  }, [navigation, visibility]);

  const onSelectSport = useCallback(
    (sportId: string) => {
      setSelectedSport(sportId);
      setSelectedGame(null);
      setSelectedPosition(null);
      setShowSportModal(false);
    },
    [setSelectedSport, setSelectedGame, setSelectedPosition, setShowSportModal],
  );

  const onSelectGame = useCallback(
    (gameId: string) => {
      setSelectedGame(gameId);
      setShowGameModal(false);
    },
    [setSelectedGame, setShowGameModal],
  );

  const onSelectPosition = useCallback(
    (positionId: string) => {
      setSelectedPosition(positionId);
      setShowPositionModal(false);
    },
    [setSelectedPosition, setShowPositionModal],
  );

  return {
    visibility,
    effectiveBattleMode,
    isStandardMode,
    isFantasyMode,
    selectedSport,
    selectedGame,
    selectedPosition,
    startTime,
    endTime,
    showSportModal,
    showGameModal,
    showPositionModal,
    setShowSportModal,
    setShowGameModal,
    setShowPositionModal,
    selectedSportData,
    selectedGameData,
    selectedPositionData,
    filteredGames,
    availablePositions,
    canContinue,
    onContinue,
    onBack,
    onSelectSport,
    onSelectGame,
    onSelectPosition,
  };
}
