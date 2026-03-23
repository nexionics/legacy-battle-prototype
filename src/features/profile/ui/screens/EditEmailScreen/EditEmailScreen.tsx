import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Screen, AuthHeader, Input, Button, KeyboardAwareScroll } from '@/shared/ui';
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
  isSubmitting,
  initialEmail,
}: EditEmailScreenViewProps) {
  const themeColors = useThemeColors();

  return (
    <Screen padding={0}>
      <KeyboardAwareScroll contentContainerStyle={styles.scrollContent}>
        <AuthHeader
          variant={AuthHeaderVariant.Left}
          canGoBack
          logoSize={0}
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

          <Button
            variant="primary"
            onPress={handleVerify}
            style={styles.saveButton}
            loading={isSubmitting}
            disabled={
              !email.trim() || email.trim() === initialEmail.trim() || isSubmitting
            }
          >
            {editEmailScreenStrings.verifyButton}
          </Button>
        </View>
      </KeyboardAwareScroll>
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
