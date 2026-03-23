import { useEffect } from 'react';
import { supabase } from '@/shared/lib/supabaseClient';
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

  const testConnection = async () => {
    setConnectionStatus('testing');
    setDebugError(null);
    setDebugDetails('');

    try {
      const { error, count } = await supabase
        .from('profiles')
        .select('id', { count: 'exact', head: true });

      if (error) {
        console.error('Supabase error:', error);
        setDebugError(error.message);
        setConnectionStatus('error');
        setDebugDetails(`Code: ${error.code}\nHint: ${error.hint || 'None'}`);
      } else {
        setConnectionStatus('ok');
        setDebugDetails(`Profiles count: ${count ?? 0}`);
      }
    } catch (e: any) {
      console.error('Connection error:', e);
      setDebugError(e.message);
      setConnectionStatus('error');
    }
  };

  useEffect(() => {
    void testConnection();
  }, []);

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
