import { useCallback, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import type { StatDuelOpponent, StatDuelOpponentScreenProps } from '@/shared/types';
import { useStatDuelStore } from '@/features/battles/data/store/statDuel.store';
import { MOCK_OPPONENTS } from '@/shared/constants';
import {
  statDuelOpponentSchema,
  type StatDuelOpponentFormValues,
} from '@/features/battles/data/validation/statDuelFlow.schema';

export type StatDuelOpponentScreenViewProps = ReturnType<typeof useStatDuelOpponentScreen>;

export function useStatDuelOpponentScreen({
  navigation,
  route,
}: Pick<StatDuelOpponentScreenProps, 'navigation' | 'route'>) {
  const {
    visibility: routeVisibility,
    battleMode,
    sport,
    game,
    position,
    positionName,
    player,
    statCategory,
    stake,
    direction,
    directionName,
  } = route?.params || {};
  const storeVisibility = useStatDuelStore((s) => s.visibility);
  const effectiveVisibility = routeVisibility ?? storeVisibility ?? null;
  const isPrivate = effectiveVisibility === 'private';

  const selectedOpponent = useStatDuelStore((s) => s.selectedOpponent);
  const setSelectedOpponent = useStatDuelStore((s) => s.setSelectedOpponent);

  const [opponentPickerOpen, setOpponentPickerOpen] = useState(false);
  const [sheetSearchQuery, setSheetSearchQuery] = useState('');

  const opponentSchema = useMemo(() => statDuelOpponentSchema(isPrivate), [isPrivate]);

  const {
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<StatDuelOpponentFormValues>({
    resolver: yupResolver(opponentSchema),
    mode: 'onChange',
    values: {
      opponentId: selectedOpponent?.id ?? '',
    },
  });

  const filteredSheetOpponents = useMemo(
    () =>
      MOCK_OPPONENTS.filter(
        (o) =>
          o.display_name.toLowerCase().includes(sheetSearchQuery.toLowerCase()) ||
          (o.username?.toLowerCase().includes(sheetSearchQuery.toLowerCase()) ?? false) ||
          (o.subtitle?.toLowerCase().includes(sheetSearchQuery.toLowerCase()) ?? false),
      ),
    [sheetSearchQuery],
  );

  const openOpponentPicker = useCallback(() => {
    setSheetSearchQuery('');
    setOpponentPickerOpen(true);
  }, []);

  const closeOpponentPicker = useCallback(() => {
    setOpponentPickerOpen(false);
  }, []);

  const onSelectOpponentFromSheet = useCallback(
    (opponent: StatDuelOpponent) => {
      setSelectedOpponent(opponent);
      closeOpponentPicker();
    },
    [setSelectedOpponent, closeOpponentPicker],
  );

  const onAddFriendFromSheet = useCallback(() => {
    closeOpponentPicker();
    navigation.navigate('AddFriend');
  }, [navigation, closeOpponentPicker]);

  const submitOpponent = useCallback(() => {
    navigation.navigate('StatDuelConfirm', {
      visibility: effectiveVisibility ?? undefined,
      battleMode,
      sport,
      game,
      player,
      statCategory,
      stake,
      opponent: selectedOpponent,
    });
  }, [
    navigation,
    effectiveVisibility,
    battleMode,
    sport,
    game,
    player,
    statCategory,
    stake,
    selectedOpponent,
  ]);

  const onContinue = useCallback(() => {
    void handleSubmit(submitOpponent)();
  }, [handleSubmit, submitOpponent]);

  const onBack = useCallback(() => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate('StatDuelChampion', {
        visibility: effectiveVisibility ?? undefined,
        battleMode,
        sport,
        game,
        position,
        positionName,
      });
    }
  }, [navigation, effectiveVisibility, battleMode, sport, game, position, positionName]);

  return {
    visibility: effectiveVisibility,
    battleMode,
    sport,
    game,
    player,
    statCategory,
    stake,
    direction,
    directionName,
    opponentPickerOpen,
    sheetSearchQuery,
    setSheetSearchQuery,
    openOpponentPicker,
    closeOpponentPicker,
    selectedOpponent,
    setSelectedOpponent,
    filteredSheetOpponents,
    onSelectOpponentFromSheet,
    onAddFriendFromSheet,
    canContinue: isValid,
    opponentError: errors.opponentId?.message,
    onContinue,
    onBack,
  };
}
