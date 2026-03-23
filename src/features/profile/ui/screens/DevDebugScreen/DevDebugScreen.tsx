import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, spacing, radii, borderWidths } from '@/shared/theme';
import { AppText, Screen } from '@/shared/ui';
import type { DevDebugScreenProps } from '@/shared/types';
import type { UseDevDebugScreenReturn } from '../../hooks/useDevDebugScreen';

export type DevDebugScreenViewProps = DevDebugScreenProps & UseDevDebugScreenReturn;

export function DevDebugScreen({
  connectionStatus,
  debugError,
  debugDetails,
  testConnection,
  getStatusColor,
  devDebugScreenStrings,
  onBack,
}: DevDebugScreenViewProps) {
  return (
    <Screen padding={0}>
      <View style={styles.content}>
        <AppText variant="h2" style={{ textAlign: 'center', marginBottom: spacing[6] }}>
          {devDebugScreenStrings.title}
        </AppText>

        <View style={[styles.statusCard, { borderColor: getStatusColor(connectionStatus) }]}>
          <AppText
            variant="captionSm"
            color={colors.textSecondary}
            style={{ marginBottom: spacing[2] }}
          >
            {devDebugScreenStrings.statusLabel}
          </AppText>
          <AppText variant="h2" color={getStatusColor(connectionStatus)}>
            {connectionStatus.toUpperCase()}
          </AppText>
        </View>

        {debugError ? (
          <View style={styles.errorCard}>
            <AppText
              variant="captionSm"
              color={colors.primary}
              style={{ marginBottom: spacing[2] }}
            >
              {devDebugScreenStrings.errorLabel}
            </AppText>
            <AppText variant="body2" color={colors.primary}>
              {debugError}
            </AppText>
          </View>
        ) : null}

        {debugDetails ? (
          <View style={styles.detailsCard}>
            <AppText
              variant="captionSm"
              color={colors.textSecondary}
              style={{ marginBottom: spacing[2] }}
            >
              {devDebugScreenStrings.detailsLabel}
            </AppText>
            <AppText variant="body2">{debugDetails}</AppText>
          </View>
        ) : null}

        <TouchableOpacity
          style={styles.retryButton}
          onPress={testConnection}
          disabled={connectionStatus === 'testing'}
        >
          <AppText variant="buttonMd" color={colors.white}>
            {connectionStatus === 'testing'
              ? devDebugScreenStrings.retryTesting
              : devDebugScreenStrings.retryConnection}
          </AppText>
        </TouchableOpacity>

        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <AppText variant="body2">{devDebugScreenStrings.backToApp}</AppText>
        </TouchableOpacity>

        <View style={styles.infoCard}>
          <AppText
            variant="captionSm"
            color={colors.textSecondary}
            style={{ marginBottom: spacing[2] }}
          >
            {devDebugScreenStrings.environmentLabel}
          </AppText>
          <AppText variant="captionSm" style={{ marginBottom: spacing[1] }}>
            {devDebugScreenStrings.urlCaption}{' '}
            {process.env.EXPO_PUBLIC_SUPABASE_URL ? devDebugScreenStrings.urlSet : devDebugScreenStrings.urlMissing}
          </AppText>
          <AppText variant="captionSm" style={{ marginBottom: spacing[1] }}>
            {devDebugScreenStrings.keyCaption}{' '}
            {process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY
              ? devDebugScreenStrings.keySet
              : devDebugScreenStrings.keyMissing}
          </AppText>
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    padding: spacing[4],
    justifyContent: 'center',
  },
  statusCard: {
    backgroundColor: colors.card,
    borderRadius: radii.lg,
    borderWidth: borderWidths.thick,
    padding: spacing[4],
    alignItems: 'center',
    marginBottom: spacing[4],
  },
  errorCard: {
    backgroundColor: colors.primaryTint,
    borderRadius: radii.lg,
    padding: spacing[4],
    marginBottom: spacing[4],
  },
  detailsCard: {
    backgroundColor: colors.card,
    borderRadius: radii.lg,
    padding: spacing[4],
    marginBottom: spacing[4],
  },
  retryButton: {
    backgroundColor: colors.primary,
    borderRadius: radii.lg,
    padding: spacing[4],
    alignItems: 'center',
    marginBottom: spacing[2],
  },
  backButton: {
    backgroundColor: colors.card,
    borderRadius: radii.lg,
    padding: spacing[4],
    alignItems: 'center',
    marginBottom: spacing[4],
  },
  infoCard: {
    backgroundColor: colors.card,
    borderRadius: radii.lg,
    padding: spacing[4],
  },
});
