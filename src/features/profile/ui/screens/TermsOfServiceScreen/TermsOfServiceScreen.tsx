import { StyleSheet, ScrollView, View } from 'react-native';
import { spacing, lineHeights } from '@/shared/theme';
import { AppText, Screen, ScreenHeader } from '@/shared/ui';
import type { TermsOfServiceScreenProps } from '@/shared/types';
import { useThemeColors } from '@/app/providers/ThemeProvider';
import type { UseTermsOfServiceScreenReturn } from '../../hooks/useTermsOfServiceScreen';

export type TermsOfServiceScreenViewProps = TermsOfServiceScreenProps &
  UseTermsOfServiceScreenReturn;

export function TermsOfServiceScreen({
  navigation,
  termsOfServiceScreenStrings,
}: TermsOfServiceScreenViewProps) {
  const colors = useThemeColors();

  return (
    <Screen padding={spacing[4]}>
      <ScreenHeader
        title={termsOfServiceScreenStrings.title}
        onBack={() => navigation.goBack()}
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <AppText variant="body2" style={[styles.date, { color: colors.textSecondary }]}>
          {termsOfServiceScreenStrings.lastUpdated}
        </AppText>

        {termsOfServiceScreenStrings.sections.map((section) => (
          <View key={section.title} style={styles.section}>
            <AppText variant="h6" style={[styles.sectionTitle, { color: colors.text }]}>
              {section.title}
            </AppText>
            <AppText variant="body2" style={[styles.paragraph, { color: colors.text }]}>
              {section.body}
            </AppText>
          </View>
        ))}
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
    marginBottom: spacing[4],
  },
  sectionTitle: {
    marginBottom: spacing[2],
  },
  paragraph: {
    lineHeight: lineHeights.md,
  },
});
