import { useCallback, useMemo } from 'react';
import { battlesStatCompareDescription } from '@/features/battles/string';
import type {
  StatDuelChampionScreenProps,
  StatDuelPlayer,
  SelectionOption,
} from '@/shared/types';
import { useStatDuelStore } from '@/features/battles/data/store/statDuel.store';
import {
  MOCK_PLAYERS,
  DIRECTION_OPTIONS,
  STAT_CATEGORIES_BY_SPORT,
} from '@/shared/constants';

export type StatDuelChampionScreenViewProps = ReturnType<typeof useStatDuelChampionScreen>;

export function useStatDuelChampionScreen({
  navigation,
  route,
}: Pick<StatDuelChampionScreenProps, 'navigation' | 'route'>) {
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

  const filteredPlayers = useMemo(
    () =>
      MOCK_PLAYERS.filter((p) => {
        if (sport && p.sport !== sport) return false;
        if (position && p.positionCode !== position) return false;
        return (
          p.name.toLowerCase().includes(playerSearch.toLowerCase()) ||
          p.team.toLowerCase().includes(playerSearch.toLowerCase())
        );
      }),
    [sport, position, playerSearch],
  );

  const statCategories = STAT_CATEGORIES_BY_SPORT[sport ?? 'NFL'] ?? STAT_CATEGORIES_BY_SPORT.NFL;

  const statOptions: SelectionOption[] = useMemo(
    () => statCategories.map((s: { id: string; name: string }) => ({ key: s.id, label: s.name })),
    [statCategories],
  );

  const selectedDirectionData = DIRECTION_OPTIONS.find((d) => d.key === (direction ?? ''));

  const statDescription = useMemo(() => {
    if (!statCategory || !player) return '';
    return battlesStatCompareDescription(statCategory.name);
  }, [statCategory, player]);

  const canContinue = isStandardMode
    ? Boolean(player && statCategory && stake && direction)
    : Boolean(player && statCategory && stake);

  const onContinue = useCallback(() => {
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
  }, [
    navigation,
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
    selectedDirectionData?.label,
  ]);

  const onBack = useCallback(() => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate('StatDuelDetails', { visibility, battleMode });
    }
  }, [navigation, visibility, battleMode]);

  const onSelectPlayer = useCallback(
    (p: StatDuelPlayer) => {
      setPlayer(p);
      setShowPlayerModal(false);
      setPlayerSearch('');
    },
    [setPlayer, setShowPlayerModal, setPlayerSearch],
  );

  const onSelectStatCategory = useCallback(
    (key: string) => {
      const cat = statCategories.find((s: { id: string; name: string }) => s.id === key);
      if (cat) setStatCategory(cat);
      setShowStatModal(false);
    },
    [statCategories, setStatCategory, setShowStatModal],
  );

  const onSelectStake = useCallback(
    (key: string) => {
      setStake(key);
      setShowStakeModal(false);
    },
    [setStake, setShowStakeModal],
  );

  const onSelectDirection = useCallback(
    (key: string) => {
      setDirection(key);
      setShowDirectionModal(false);
    },
    [setDirection, setShowDirectionModal],
  );

  return {
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
    showPlayerModal,
    showStatModal,
    showStakeModal,
    showDirectionModal,
    setShowPlayerModal,
    setShowStatModal,
    setShowStakeModal,
    setShowDirectionModal,
    playerSearch,
    setPlayerSearch,
    isStandardMode,
    isFantasyMode,
    filteredPlayers,
    statOptions,
    selectedDirectionData,
    statDescription,
    canContinue,
    onContinue,
    onBack,
    onSelectPlayer,
    onSelectStatCategory,
    onSelectStake,
    onSelectDirection,
  };
}
