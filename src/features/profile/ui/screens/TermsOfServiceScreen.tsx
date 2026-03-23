import React from 'react';
import { StyleSheet, ScrollView, View } from 'react-native';
import { spacing } from '@/shared/theme';
import { AppText, Screen, ScreenHeader } from '@/shared/ui';
import type { TermsOfServiceScreenProps } from '@/shared/types';
import { useThemeColors } from '@/app/providers/ThemeProvider';

export default function TermsOfServiceScreen({ navigation }: TermsOfServiceScreenProps) {
  const colors = useThemeColors();

  return (
    <Screen padding={spacing[4]}>
      <ScreenHeader title="Terms Of Service" onBack={() => navigation.goBack()} />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <AppText variant="body2" style={[styles.date, { color: colors.textSecondary }]}>
          Last Updated: October 29, 2025
        </AppText>

        <View style={styles.section}>
          <AppText variant="h6" style={[styles.sectionTitle, { color: colors.text }]}>
            1. Acceptance of Terms
          </AppText>
          <AppText variant="body2" style={[styles.paragraph, { color: colors.text }]}>
            By accessing or using the Legacy Battle mobile application and services, you agree to be
            bound by these Terms of Service. If you do not agree to these terms, please do not use
            our services.
          </AppText>
        </View>

        <View style={styles.section}>
          <AppText variant="h6" style={[styles.sectionTitle, { color: colors.text }]}>
            2. Eligibility
          </AppText>
          <AppText variant="body2" style={[styles.paragraph, { color: colors.text }]}>
            You must be at least 18 years of age (or 21 where required by law) to use our services.
            By using Legacy Battle, you represent and warrant that you meet these age requirements.
          </AppText>
        </View>

        <View style={styles.section}>
          <AppText variant="h6" style={[styles.sectionTitle, { color: colors.text }]}>
            3. User Accounts
          </AppText>
          <AppText variant="body2" style={[styles.paragraph, { color: colors.text }]}>
            You are responsible for maintaining the confidentiality of your account information,
            including your password. You agree to notify us immediately of any unauthorized use of
            your account.
          </AppText>
        </View>

        <View style={styles.section}>
          <AppText variant="h6" style={[styles.sectionTitle, { color: colors.text }]}>
            4. Prohibited Conduct
          </AppText>
          <AppText variant="body2" style={[styles.paragraph, { color: colors.text }]}>
            Users are prohibited from using the services for any unlawful purpose, engaging in
            fraudulent activity, or interfering with the operation of the platform.
          </AppText>
        </View>

        <View style={styles.section}>
          <AppText variant="h6" style={[styles.sectionTitle, { color: colors.text }]}>
            5. Intellectual Property
          </AppText>
          <AppText variant="body2" style={[styles.paragraph, { color: colors.text }]}>
            All content on the Legacy Battle platform, including logos, text, and graphics, is the
            property of Legacy Battle LLC and is protected by intellectual property laws.
          </AppText>
        </View>

        <View style={styles.section}>
          <AppText variant="h6" style={[styles.sectionTitle, { color: colors.text }]}>
            6. Limitation of Liability
          </AppText>
          <AppText variant="body2" style={[styles.paragraph, { color: colors.text }]}>
            Legacy Battle LLC shall not be liable for any indirect, incidental, or consequential
            damages arising out of your use of the services.
          </AppText>
        </View>
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
    lineHeight: 22,
  },
});
