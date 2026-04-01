import { useCallback, useEffect } from 'react';
import { authenticatedHttp } from '@/shared/lib/httpClient';
import { parseApiResponse } from '@/shared/utils/helpers';
import type { DevDebugScreenProps } from '@/shared/types';
import type { ConnectionStatus } from '@/shared/types';
import { useProfileStore } from '../../data/store/profile.store';
import { colors } from '@/shared/theme';
import { devDebugScreenStrings } from '../../string';

export function useDevDebugScreen({ navigation }: Pick<DevDebugScreenProps, 'navigation'>) {
  const connectionStatus = useProfileStore((s) => s.connectionStatus);
  const debugError = useProfileStore((s) => s.debugError);
  const debugDetails = useProfileStore((s) => s.debugDetails);
  const setConnectionStatus = useProfileStore((s) => s.setConnectionStatus);
  const setDebugError = useProfileStore((s) => s.setDebugError);
  const setDebugDetails = useProfileStore((s) => s.setDebugDetails);

  const testConnection = useCallback(async () => {
    setConnectionStatus('testing');
    setDebugError(null);
    setDebugDetails('');

    const path = '/sports/leagues';
    try {
      const res = await authenticatedHttp.get(path);
      const parsed = parseApiResponse<unknown[]>(path, res.status, res.data);
      if (parsed.success) {
        const n = Array.isArray(parsed.data) ? parsed.data.length : 0;
        setConnectionStatus('ok');
        setDebugDetails(`REST API OK — GET ${path} (${n} leagues)`);
      } else {
        setDebugError(parsed.error.message);
        setConnectionStatus('error');
        setDebugDetails(`HTTP ${parsed.error.statusCode} — ${path}`);
      }
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Request failed';
      setDebugError(message);
      setConnectionStatus('error');
      setDebugDetails(path);
    }
  }, [setConnectionStatus, setDebugError, setDebugDetails]);

  useEffect(() => {
    void testConnection();
  }, [testConnection]);

  const getStatusColor = (s: ConnectionStatus): string => {
    switch (s) {
      case 'ok':
        return colors.success;
      case 'error':
        return colors.primary;
      case 'testing':
        return colors.warning;
      default:
        return colors.textSecondary;
    }
  };

  return {
    connectionStatus,
    debugError,
    debugDetails,
    testConnection,
    getStatusColor,
    devDebugScreenStrings,
    onBack: () => navigation.goBack(),
  };
}

export type UseDevDebugScreenReturn = ReturnType<typeof useDevDebugScreen>;
