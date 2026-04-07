import * as yup from 'yup';
import { battlesStrings } from '@/features/battles/string';

const v = battlesStrings.statDuel.validation;

/** Event + position step (sport / game / position live in Zustand; form mirrors them for Yup + RHF). */
export function statDuelDetailsSchema(isStandardMode: boolean) {
  return yup.object({
    sport: yup.string().required(v.sportRequired),
    game: isStandardMode
      ? yup.string().required(v.eventRequired)
      : yup.string().optional(),
    position: yup.string().required(v.positionRequired),
  });
}

export type StatDuelDetailsFormValues = yup.InferType<ReturnType<typeof statDuelDetailsSchema>>;

/** Champion / stats step. */
export function statDuelChampionSchema(isStandardMode: boolean) {
  return yup.object({
    playerId: yup.string().required(v.playerRequired),
    statCategoryId: yup.string().required(v.statCategoryRequired),
    stake: yup.string().required(v.stakeRequired),
    direction: isStandardMode
      ? yup.string().required(v.directionRequired)
      : yup.string().optional(),
  });
}

export type StatDuelChampionFormValues = yup.InferType<ReturnType<typeof statDuelChampionSchema>>;

/** Opponent step — private battles require a selected opponent id. */
export function statDuelOpponentSchema(isPrivate: boolean) {
  return yup.object({
    opponentId: isPrivate
      ? yup.string().required(v.opponentRequired)
      : yup.string().optional(),
  });
}

export type StatDuelOpponentFormValues = yup.InferType<ReturnType<typeof statDuelOpponentSchema>>;
