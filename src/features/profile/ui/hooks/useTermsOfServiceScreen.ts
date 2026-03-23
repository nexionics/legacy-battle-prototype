import { termsOfServiceScreenStrings } from '../../string';

/** Static legal screen — hook exposes feature strings for the presentational component. */
export function useTermsOfServiceScreen() {
  return { termsOfServiceScreenStrings };
}

export type UseTermsOfServiceScreenReturn = ReturnType<typeof useTermsOfServiceScreen>;
