// src/modules/profile/screens/DevDebugScreen.tsx
// Temporary screen to verify Supabase connectivity
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '../../../shared/lib/supabaseClient';
import { COLORS, SIZES } from '../../../shared/constants/theme';

type ConnectionStatus = 'idle' | 'testing' | 'ok' | 'error';

export default function DevDebugScreen({ navigation }: { navigation: any }) {
  const [status, setStatus] = useState<ConnectionStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  const [details, setDetails] = useState<string>('');

  const testConnection = async () => {
    setStatus('testing');
    setError(null);
    setDetails('');

    try {
      // Simple query: count profiles (will be zero at first)
      const { data, error, count } = await supabase
        .from('profiles')
        .select('id', { count: 'exact', head: true });

      if (error) {
        console.error('Supabase error:', error);
        setError(error.message);
        setStatus('error');
        setDetails(`Code: ${error.code}\nHint: ${error.hint || 'None'}`);
      } else {
        setStatus('ok');
        setDetails(`Profiles count: ${count ?? 0}`);
      }
    } catch (e: any) {
      console.error('Connection error:', e);
      setError(e.message);
      setStatus('error');
    }
  };

  useEffect(() => {
    testConnection();
  }, []);

  const getStatusColor = () => {
    switch (status) {
      case 'ok': return '#4CAF50';
      case 'error': return COLORS.primary;
      case 'testing': return '#FFC107';
      default: return COLORS.textSecondary;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
      
      <View style={styles.content}>
        <Text style={styles.title}>Supabase Connection Test</Text>
        
        <View style={[styles.statusCard, { borderColor: getStatusColor() }]}>
          <Text style={styles.statusLabel}>Status</Text>
          <Text style={[styles.statusValue, { color: getStatusColor() }]}>
            {status.toUpperCase()}
          </Text>
        </View>

        {error && (
          <View style={styles.errorCard}>
            <Text style={styles.errorLabel}>Error</Text>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {details && (
          <View style={styles.detailsCard}>
            <Text style={styles.detailsLabel}>Details</Text>
            <Text style={styles.detailsText}>{details}</Text>
          </View>
        )}

        <TouchableOpacity 
          style={styles.retryButton} 
          onPress={testConnection}
          disabled={status === 'testing'}
        >
          <Text style={styles.retryButtonText}>
            {status === 'testing' ? 'Testing...' : 'Retry Connection'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>Back to App</Text>
        </TouchableOpacity>

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Environment</Text>
          <Text style={styles.infoText}>
            URL: {process.env.EXPO_PUBLIC_SUPABASE_URL ? 'Set' : 'Missing'}
          </Text>
          <Text style={styles.infoText}>
            Key: {process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ? 'Set' : 'Missing'}
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
    padding: SIZES.padding,
    justifyContent: 'center',
  },
  title: {
    fontSize: SIZES.extraLarge,
    fontWeight: 'bold',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: SIZES.padding * 2,
  },
  statusCard: {
    backgroundColor: COLORS.card,
    borderRadius: SIZES.radius,
    borderWidth: 2,
    padding: SIZES.padding,
    alignItems: 'center',
    marginBottom: SIZES.padding,
  },
  statusLabel: {
    fontSize: SIZES.small,
    color: COLORS.textSecondary,
    marginBottom: SIZES.base,
  },
  statusValue: {
    fontSize: SIZES.extraLarge,
    fontWeight: 'bold',
  },
  errorCard: {
    backgroundColor: 'rgba(229, 57, 53, 0.1)',
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    marginBottom: SIZES.padding,
  },
  errorLabel: {
    fontSize: SIZES.small,
    color: COLORS.primary,
    marginBottom: SIZES.base,
  },
  errorText: {
    fontSize: SIZES.font,
    color: COLORS.primary,
  },
  detailsCard: {
    backgroundColor: COLORS.card,
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    marginBottom: SIZES.padding,
  },
  detailsLabel: {
    fontSize: SIZES.small,
    color: COLORS.textSecondary,
    marginBottom: SIZES.base,
  },
  detailsText: {
    fontSize: SIZES.font,
    color: COLORS.text,
  },
  retryButton: {
    backgroundColor: COLORS.primary,
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    alignItems: 'center',
    marginBottom: SIZES.base,
  },
  retryButtonText: {
    color: COLORS.white,
    fontSize: SIZES.font,
    fontWeight: 'bold',
  },
  backButton: {
    backgroundColor: COLORS.card,
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    alignItems: 'center',
    marginBottom: SIZES.padding,
  },
  backButtonText: {
    color: COLORS.text,
    fontSize: SIZES.font,
  },
  infoCard: {
    backgroundColor: COLORS.card,
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
  },
  infoTitle: {
    fontSize: SIZES.small,
    color: COLORS.textSecondary,
    marginBottom: SIZES.base,
  },
  infoText: {
    fontSize: SIZES.small,
    color: COLORS.text,
    marginBottom: 4,
  },
});
