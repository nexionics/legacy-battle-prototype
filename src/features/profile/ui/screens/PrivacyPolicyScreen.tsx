import React from 'react';
import { StyleSheet, ScrollView, View } from 'react-native';
import { spacing } from '@/shared/theme';
import { AppText, Screen, ScreenHeader } from '@/shared/ui';
import type { PrivacyPolicyScreenProps } from '@/shared/types';
import { useThemeColors } from '@/app/providers/ThemeProvider';

export default function PrivacyPolicyScreen({ navigation }: PrivacyPolicyScreenProps) {
  const colors = useThemeColors();

  return (
    <Screen padding={spacing[4]}>
      <ScreenHeader title="Privacy And Policy" onBack={() => navigation.goBack()} />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <AppText variant="body2" style={[styles.date, { color: colors.textSecondary }]}>
          Effective Date: October 29, 2025
        </AppText>

        <View style={styles.section}>
          <AppText variant="body2" style={{ color: colors.text }}>
            Entity: Legacy Battle LLC ("Legacy Battle," "We," "Us," "Our")
          </AppText>
          <AppText variant="body2" style={{ color: colors.text }}>
            Contact:{' '}
            <AppText style={{ textDecorationLine: 'underline' }}>Legal@Legacybattle.Com</AppText> •{' '}
            <AppText style={{ textDecorationLine: 'underline' }}>702-835-9300</AppText>
          </AppText>
          <AppText variant="body2" style={{ color: colors.text }}>
            Address: 5940 S. Rainbow Boulevard, Las Vegas, NV 89118
          </AppText>
          <AppText variant="body2" style={{ color: colors.text }}>
            Business Hours: Mon–Fri, 9:00am–5:00pm PT
          </AppText>
        </View>

        <AppText variant="body2" style={[styles.paragraph, { color: colors.text }]}>
          Legacy Battle Operates A Competitive Skill Platform Where Users Issue, Accept, And Spectate
          Battles; Manage Battle Coins (BC) As Virtual, Non-Monetary Credits; And Share Outcomes And
          Highlights (The "Services"). By Using The Services You Agree To This Privacy Policy And Our
          Terms.
        </AppText>

        <AppText variant="body2" style={[styles.paragraph, { color: colors.text }]}>
          We Currently Target Adults 18+ (And 21+ Where Required For Gated Features). We Do Not Sell
          Or Share Personal Information For Cross-Context Behavioral Advertising And We Honor Global
          Privacy Control (GPC) Signals.
        </AppText>

        <View style={styles.sectionTitleContainer}>
          <AppText variant="h6" style={{ color: colors.text }}>
            1) Notice At Collection (What We Collect & Why)
          </AppText>
        </View>

        <AppText variant="body2" style={[styles.paragraph, { color: colors.text }]}>
          We Collect The Categories Below For The Listed Purposes. We Maintain Role-Based Access, Log
          Access, And Apply Least-Privilege.
        </AppText>

        <AppText variant="body2" style={[styles.paragraph, { color: colors.text }]}>
          Sensitive Data & Permissions. With Your Permission, The App May Access Camera, Microphone,
          And Photo Library To Capture Verification Evidence. You Can Revoke Permissions In Device
          Settings. We Do Not Collect Precise GPS Or Biometric Identifiers For Identity; If That
          Changes, We Will Update This Policy And Obtain Any Required Consent.
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
    lineHeight: 22,
  },
  sectionTitleContainer: {
    marginTop: spacing[4],
    marginBottom: spacing[2],
  },
});
