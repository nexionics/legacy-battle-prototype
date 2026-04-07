import { useCallback, useEffect, useMemo } from 'react';
import { Alert } from 'react-native';
import {
  battlesFormatPrediction,
  battlesStrings,
} from '@/features/battles/string';
import { useAuth } from '@/shared/hooks/useAuth';
import { useBattlesStore } from '@/features/battles/data/store/battles.store';
import type { OutcomeType } from '@/shared/types';
import type { DropdownOption } from '@/shared/types';
import { useCreateBattle } from '@/features/battles/data/mutations/useCreateBattle';
import { deriveTeamsFromTitle } from '@/shared/utils';
import type { CreateBattleScreenProps } from '@/shared/types';

export type CreateBattleScreenViewProps = ReturnType<typeof useCreateBattleScreen>;

export function useCreateBattleScreen({
  navigation,
  route,
}: Pick<CreateBattleScreenProps, 'navigation' | 'route'>) {
  const { user } = useAuth();

  const { prefillTitle, prefillEventId, homeTeam, awayTeam, visibility } = route?.params || {};

  const title = useBattlesStore((s) => s.title);
  const eventId = useBattlesStore((s) => s.eventId);
  const stake = useBattlesStore((s) => s.stake);
  const selectedTeam = useBattlesStore((s) => s.selectedTeam);
  const selectedOutcome = useBattlesStore((s) => s.selectedOutcome);
  const showTeamPicker = useBattlesStore((s) => s.showTeamPicker);
  const showOutcomePicker = useBattlesStore((s) => s.showOutcomePicker);
  const setTitle = useBattlesStore((s) => s.setTitle);
  const setEventId = useBattlesStore((s) => s.setEventId);
  const setStake = useBattlesStore((s) => s.setStake);
  const setSelectedTeam = useBattlesStore((s) => s.setSelectedTeam);
  const setSelectedOutcome = useBattlesStore((s) => s.setSelectedOutcome);
  const setShowTeamPicker = useBattlesStore((s) => s.setShowTeamPicker);
  const setShowOutcomePicker = useBattlesStore((s) => s.setShowOutcomePicker);
  const initCreateBattle = useBattlesStore((s) => s.initCreateBattle);

  const createMutation = useCreateBattle();
  const createLoading = createMutation.isPending;

  useEffect(() => {
    initCreateBattle({ title: prefillTitle, eventId: prefillEventId });
  }, [prefillTitle, prefillEventId, initCreateBattle]);

  const { home: derivedHome, away: derivedAway } = deriveTeamsFromTitle(prefillTitle);
  const finalHomeTeam = homeTeam || derivedHome;
  const finalAwayTeam = awayTeam || derivedAway;

  const teamOptions: DropdownOption[] = useMemo(
    () =>
      finalHomeTeam && finalAwayTeam
        ? [
            { label: finalHomeTeam, value: 'home' },
            { label: finalAwayTeam, value: 'away' },
          ]
        : [],
    [finalHomeTeam, finalAwayTeam],
  );

  const outcomeOptions: DropdownOption[] = useMemo(
    () => [
      { label: battlesStrings.createBattle.outcomeWillWin, value: 'WIN' },
      { label: battlesStrings.createBattle.outcomeWillLose, value: 'LOSE' },
    ],
    [],
  );

  const selectedTeamLabel = useMemo(() => {
    if (!selectedTeam) return battlesStrings.createBattle.selectTeam;
    const option = teamOptions.find((o) => o.value === selectedTeam);
    return option?.label || battlesStrings.createBattle.selectTeam;
  }, [selectedTeam, teamOptions]);

  const selectedOutcomeLabel = useMemo(() => {
    if (!selectedOutcome) return battlesStrings.createBattle.selectOutcome;
    const option = outcomeOptions.find((o) => o.value === selectedOutcome);
    return option?.label || battlesStrings.createBattle.selectOutcome;
  }, [selectedOutcome, outcomeOptions]);

  const battleDescription = useMemo(() => {
    if (selectedTeam && selectedOutcome && teamOptions.length > 0) {
      const teamName = teamOptions.find((o) => o.value === selectedTeam)?.label;
      if (!teamName) return '';
      return battlesFormatPrediction(teamName, selectedOutcome === 'WIN');
    }
    return '';
  }, [selectedTeam, selectedOutcome, teamOptions]);

  const creatorWinningTeam = useMemo(() => {
    if (!selectedTeam || !selectedOutcome || !finalHomeTeam || !finalAwayTeam) return undefined;
    const pickedHome = selectedTeam === 'home';
    const willWin = selectedOutcome === 'WIN';
    if (pickedHome && willWin) return finalHomeTeam;
    if (pickedHome && !willWin) return finalAwayTeam;
    if (!pickedHome && willWin) return finalAwayTeam;
    if (!pickedHome && !willWin) return finalHomeTeam;
    return undefined;
  }, [selectedTeam, selectedOutcome, finalHomeTeam, finalAwayTeam]);

  const onBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const onCreate = useCallback(async () => {
    if (!title.trim()) {
      Alert.alert(battlesStrings.common.error, battlesStrings.alerts.createTitleRequired);
      return;
    }

    if (teamOptions.length > 0 && !selectedTeam) {
      Alert.alert(battlesStrings.common.error, battlesStrings.alerts.createTeamRequired);
      return;
    }

    if (teamOptions.length > 0 && !selectedOutcome) {
      Alert.alert(battlesStrings.common.error, battlesStrings.alerts.createOutcomeRequired);
      return;
    }

    if (!user) {
      Alert.alert(battlesStrings.common.error, battlesStrings.alerts.createLoginRequired);
      return;
    }

    const vis = visibility === 'crew' ? 'public' : visibility || 'public';

    try {
      await createMutation.mutateAsync({
        type: 'CREW_PREDICTION',
        mode: 'STANDARD',
        eventId: eventId.trim() || undefined,
        stakeAmount: parseInt(stake, 10) || 0,
        visibility: vis,
        initialMetadata: {
          title: title.trim(),
          description: battleDescription || undefined,
          creatorWinningTeam,
        },
      });
      navigation.goBack();
    } catch (e) {
      Alert.alert(
        battlesStrings.common.failed,
        e instanceof Error ? e.message : battlesStrings.alerts.createGenericFailure,
      );
    }
  }, [
    title,
    teamOptions.length,
    selectedTeam,
    selectedOutcome,
    user,
    visibility,
    createMutation,
    eventId,
    stake,
    battleDescription,
    creatorWinningTeam,
    navigation,
  ]);

  return {
    user,
    prefillEventId,
    title,
    eventId,
    stake,
    selectedTeam,
    selectedOutcome,
    showTeamPicker,
    showOutcomePicker,
    teamOptions,
    outcomeOptions,
    selectedTeamLabel,
    selectedOutcomeLabel,
    battleDescription,
    showTeamSetup: teamOptions.length > 0,
    showPredictionPreview: Boolean(selectedTeam && selectedOutcome),
    createLoading,
    setTitle,
    setEventId,
    setStake,
    setSelectedTeam,
    setSelectedOutcome,
    setShowTeamPicker,
    setShowOutcomePicker,
    onBack,
    onCreate,
    onSelectOutcome: (value: string) => setSelectedOutcome(value as OutcomeType),
  };
}
