import { StyleSheet, View } from 'react-native';
import { spacing } from '@/shared/theme';
import { AppText, Screen, ScreenHeader } from '@/shared/ui';
import type { ContactUsScreenProps } from '@/shared/types';
import { useThemeColors } from '@/app/providers/ThemeProvider';
import type { UseContactUsScreenReturn } from '../../hooks/useContactUsScreen';

export type ContactUsScreenViewProps = ContactUsScreenProps & UseContactUsScreenReturn;

export function ContactUsScreen({ navigation, contactUsScreenStrings }: ContactUsScreenViewProps) {
  const colors = useThemeColors();

  return (
    <Screen padding={spacing[4]}>
      <ScreenHeader title={contactUsScreenStrings.title} onBack={() => navigation.goBack()} />

      <View style={styles.content}>
        <View style={styles.section}>
          <AppText variant="body2" style={{ color: colors.text }}>
            {contactUsScreenStrings.contactLabel}{' '}
            <AppText style={{ textDecorationLine: 'underline' }}>
              {contactUsScreenStrings.contactEmail}
            </AppText>{' '}
            •{' '}
            <AppText style={{ textDecorationLine: 'underline' }}>
              {contactUsScreenStrings.contactPhone}
            </AppText>
          </AppText>
          <AppText variant="body2" style={{ color: colors.text }}>
            {contactUsScreenStrings.addressLine}
          </AppText>
          <AppText variant="body2" style={{ color: colors.text }}>
            {contactUsScreenStrings.businessHours}
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
