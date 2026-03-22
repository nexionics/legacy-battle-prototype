import React from 'react';
import { StyleSheet, View } from 'react-native';
import { spacing } from '@/shared/theme';
import { AppText, Screen, ScreenHeader } from '@/shared/ui';
import type { ContactUsScreenProps } from '@/shared/types';
import { useThemeColors } from '@/app/providers/ThemeProvider';

export default function ContactUsScreen({ navigation }: ContactUsScreenProps) {
  const colors = useThemeColors();

  return (
    <Screen padding={spacing[4]}>
      <ScreenHeader title="Contact Us" onBack={() => navigation.goBack()} />

      <View style={styles.content}>
        <View style={styles.section}>
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
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    marginTop: spacing[4],
  },
  section: {
    marginBottom: spacing[6],
    gap: spacing[1],
  },
});
