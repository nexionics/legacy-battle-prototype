import { useState, useRef } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useThemeColors } from '@/app/providers/ThemeProvider';
import { spacing } from '@/shared/theme';
import { Screen, Input, AuthHeader, Button } from '@/shared/ui';
import { useToast } from '@/app/providers/useToast';
import type { ChangePasswordScreenProps } from '@/shared/types';
import { AuthHeaderVariant } from '@/shared/utils/enum';
import { useChangePassword } from '../../data/mutations/useChangePassword';
import { SuccessBottomSheet } from '../components/SuccessBottomSheet';
import { BottomSheetModal } from '@gorhom/bottom-sheet';

export default function ChangePasswordScreen({ navigation }: ChangePasswordScreenProps) {
  const colors = useThemeColors();
  const { showToast } = useToast();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const changePasswordMutation = useChangePassword();

  const handleSave = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      showToast('fail', 'Please fill in all fields');
      return;
    }

    if (newPassword !== confirmPassword) {
      showToast('fail', 'New passwords do not match');
      return;
    }

    if (newPassword.length < 8) {
      showToast('fail', 'Password must be at least 8 characters long');
      return;
    }

    try {
      await changePasswordMutation.mutateAsync({
        oldPassword: currentPassword,
        newPassword: newPassword,
      });

      // Show success modal
      requestAnimationFrame(() => {
        bottomSheetRef.current?.present();
      });
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message || 'Failed to change password. Please try again.';
      showToast('fail', errorMessage);
    }
  };

  return (
    <Screen padding={0}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <AuthHeader
          variant={AuthHeaderVariant.Left}
          canGoBack
          title="Edit Password"
          subtitle="Enter Old And New Password To Edit."
          onBeforeBack={() => navigation.goBack()}
        />

        <View style={styles.form}>
          <Input
            label="Enter Old Password"
            value={currentPassword}
            onChangeText={setCurrentPassword}
            isPassword
            placeholder="Enter Password"
            editable={!changePasswordMutation.isPending}
            containerStyle={styles.inputContainer}
          />

          <Input
            label="Enter New Password"
            value={newPassword}
            onChangeText={setNewPassword}
            isPassword
            placeholder="Enter Password"
            editable={!changePasswordMutation.isPending}
            containerStyle={styles.inputContainer}
          />

          <Input
            label="Confirm New Password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            isPassword
            placeholder="Enter Password"
            editable={!changePasswordMutation.isPending}
            containerStyle={styles.inputContainer}
          />

          <Button
            variant="primary"
            loading={changePasswordMutation.isPending}
            onPress={handleSave}
            style={styles.submitButton}
          >
            Save Password
          </Button>
        </View>
      </ScrollView>

      <SuccessBottomSheet
        ref={bottomSheetRef}
        onClose={() => {
          bottomSheetRef.current?.dismiss();
          navigation.goBack();
        }}
      />
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
