import { View, StyleSheet } from 'react-native';
import { spacing } from '@/shared/theme';
import { Screen, Input, AuthHeader, Button, KeyboardAwareScroll } from '@/shared/ui';
import type { ChangePasswordScreenProps } from '@/shared/types';
import { AuthHeaderVariant } from '@/shared/utils/enum';
import type { UseChangePasswordScreenReturn } from '../../hooks/useChangePasswordScreen';

export type ChangePasswordScreenViewProps = ChangePasswordScreenProps &
  UseChangePasswordScreenReturn;

export function ChangePasswordScreen({
  currentPassword,
  setCurrentPassword,
  newPassword,
  setNewPassword,
  confirmPassword,
  setConfirmPassword,
  changePasswordPending,
  handleSave,
  changePasswordScreenStrings,
  onBeforeBack,
}: ChangePasswordScreenViewProps) {
  return (
    <Screen padding={0}>
      <KeyboardAwareScroll contentContainerStyle={styles.scrollContent}>
          <AuthHeader
            variant={AuthHeaderVariant.Left}
            canGoBack
            title={changePasswordScreenStrings.authHeader.title}
            subtitle={changePasswordScreenStrings.authHeader.subtitle}
            onBeforeBack={onBeforeBack}
            logoSize={0}
          />

          <View style={styles.form}>
            <Input
              label={changePasswordScreenStrings.fields.oldPasswordLabel}
              value={currentPassword}
              onChangeText={setCurrentPassword}
              isPassword
              placeholder={changePasswordScreenStrings.fields.placeholder}
              editable={!changePasswordPending}
              containerStyle={styles.inputContainer}
            />

            <Input
              label={changePasswordScreenStrings.fields.newPasswordLabel}
              value={newPassword}
              onChangeText={setNewPassword}
              isPassword
              placeholder={changePasswordScreenStrings.fields.placeholder}
              editable={!changePasswordPending}
              containerStyle={styles.inputContainer}
            />

            <Input
              label={changePasswordScreenStrings.fields.confirmPasswordLabel}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              isPassword
              placeholder={changePasswordScreenStrings.fields.placeholder}
              editable={!changePasswordPending}
              containerStyle={styles.inputContainer}
            />

            <Button
              variant="primary"
              loading={changePasswordPending}
              onPress={handleSave}
              style={styles.submitButton}
            >
              {changePasswordScreenStrings.saveButton}
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
    gap: spacing[4],
    marginTop: spacing[2],
  },
  inputContainer: {
    gap: spacing[2],
  },
  submitButton: {
    marginTop: spacing[4],
  },
});
