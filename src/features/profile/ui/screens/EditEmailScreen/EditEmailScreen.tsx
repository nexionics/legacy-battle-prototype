import { View, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Screen, AuthHeader, Input, Button } from '@/shared/ui';
import { spacing, sizes } from '@/shared/theme';
import { AuthHeaderVariant } from '@/shared/utils/enum';
import type { EditEmailScreenProps } from '@/shared/types';
import { useThemeColors } from '@/app/providers/ThemeProvider';
import type { UseEditEmailScreenReturn } from '../../hooks/useEditEmailScreen';

export type EditEmailScreenViewProps = EditEmailScreenProps & UseEditEmailScreenReturn;

export function EditEmailScreen({
  email,
  setEmail,
  handleVerify,
  editEmailScreenStrings,
  onBeforeBack,
}: EditEmailScreenViewProps) {
  const themeColors = useThemeColors();

  return (
    <Screen padding={0}>
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <AuthHeader
          variant={AuthHeaderVariant.Left}
          canGoBack
          logoSize={sizes.logoScreenLg}
          title={editEmailScreenStrings.authHeader.title}
          subtitle={editEmailScreenStrings.authHeader.subtitle}
          onBeforeBack={onBeforeBack}
        />

        <View style={styles.form}>
          <Input
            label={editEmailScreenStrings.fieldLabel}
            value={email}
            onChangeText={setEmail}
            placeholder={editEmailScreenStrings.placeholder}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            leftComponent={
              <Ionicons name="mail-outline" size={sizes.icon20} color={themeColors.textSecondary} />
            }
          />

          <Button variant="primary" onPress={handleVerify} style={styles.saveButton}>
            {editEmailScreenStrings.verifyButton}
          </Button>
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: spacing[5],
    paddingTop: spacing[4],
    paddingBottom: spacing[6],
  },
  form: {
    marginTop: spacing[4],
    gap: spacing[6],
  },
  saveButton: {
    marginTop: spacing[2],
  },
});
