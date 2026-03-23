import { StyleSheet, ScrollView, View } from 'react-native';
import { spacing, lineHeights } from '@/shared/theme';
import { AppText, Screen, ScreenHeader } from '@/shared/ui';
import type { PrivacyPolicyScreenProps } from '@/shared/types';
import { useThemeColors } from '@/app/providers/ThemeProvider';
import type { UsePrivacyPolicyScreenReturn } from '../../hooks/usePrivacyPolicyScreen';

export type PrivacyPolicyScreenViewProps = PrivacyPolicyScreenProps & UsePrivacyPolicyScreenReturn;

export function PrivacyPolicyScreen({
  navigation,
  privacyPolicyScreenStrings,
}: PrivacyPolicyScreenViewProps) {
  const colors = useThemeColors();

  return (
    <Screen padding={spacing[4]}>
      <ScreenHeader title={privacyPolicyScreenStrings.title} onBack={() => navigation.goBack()} />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <AppText variant="body2" style={[styles.date, { color: colors.textSecondary }]}>
          {privacyPolicyScreenStrings.effectiveDate}
        </AppText>

        <View style={styles.section}>
          <AppText variant="body2" style={{ color: colors.text }}>
            {privacyPolicyScreenStrings.entityLine}
          </AppText>
          <AppText variant="body2" style={{ color: colors.text }}>
            {privacyPolicyScreenStrings.contactLabel}{' '}
            <AppText style={{ textDecorationLine: 'underline' }}>
              {privacyPolicyScreenStrings.contactEmail}
            </AppText>{' '}
            •{' '}
            <AppText style={{ textDecorationLine: 'underline' }}>
              {privacyPolicyScreenStrings.contactPhone}
            </AppText>
          </AppText>
          <AppText variant="body2" style={{ color: colors.text }}>
            {privacyPolicyScreenStrings.addressLine}
          </AppText>
          <AppText variant="body2" style={{ color: colors.text }}>
            {privacyPolicyScreenStrings.businessHours}
          </AppText>
        </View>

        <AppText variant="body2" style={[styles.paragraph, { color: colors.text }]}>
          {privacyPolicyScreenStrings.introParagraph1}
        </AppText>

        <AppText variant="body2" style={[styles.paragraph, { color: colors.text }]}>
          {privacyPolicyScreenStrings.introParagraph2}
        </AppText>

        <View style={styles.sectionTitleContainer}>
          <AppText variant="h6" style={{ color: colors.text }}>
            {privacyPolicyScreenStrings.section1Title}
          </AppText>
        </View>

        <AppText variant="body2" style={[styles.paragraph, { color: colors.text }]}>
          {privacyPolicyScreenStrings.section1P1}
        </AppText>

        <AppText variant="body2" style={[styles.paragraph, { color: colors.text }]}>
          {privacyPolicyScreenStrings.section1P2}
        </AppText>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    marginTop: spacing[4],
  },
  date: {
    marginBottom: spacing[4],
  },
  section: {
    marginBottom: spacing[6],
    gap: spacing[1],
  },
  paragraph: {
    marginBottom: spacing[4],
    lineHeight: lineHeights.md,
  },
  sectionTitleContainer: {
    marginTop: spacing[4],
    marginBottom: spacing[2],
  },
});
