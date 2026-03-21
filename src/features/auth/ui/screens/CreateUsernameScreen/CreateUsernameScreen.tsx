import { View, StyleSheet } from 'react-native';
import { Controller } from 'react-hook-form';
import { Ionicons } from '@expo/vector-icons';
import { Screen, AppText, ScreenHeader, AuthHeader, Input, PatternBackground, Button } from '@/shared/ui';
import { colors, spacing, sizes } from '@/shared/constants/theme';
import type { CreateUsernameScreenProps } from '@/shared/types';
import { AuthHeaderVariant } from '@/shared/utils/enum';
import type { UseCreateUsernameReturn } from '@/features/auth/ui/hooks/useCreateUsername.types';

export type CreateUsernameViewProps = CreateUsernameScreenProps & UseCreateUsernameReturn;

export function CreateUsernameScreen({
  navigation,
  control,
  handleSubmit: _handleSubmit,
  onSubmit,
  errors,
  isValid,
  isSubmitting,
  createUsernameScreenStrings,
  loginScreenStrings,
}: CreateUsernameViewProps) {
  return (
    <Screen padding={0}>
      <PatternBackground text={loginScreenStrings.backgroundPattern.watermarkText} />
      <View style={styles.content}>
        <ScreenHeader onBack={() => navigation.goBack()} />

        <AuthHeader
          variant={AuthHeaderVariant.Left}
          style={styles.authHeader}
          title={createUsernameScreenStrings.authHeader.screenTitle}
          subtitle={createUsernameScreenStrings.authHeader.screenSubtitle}
        />

        <View style={styles.inputContainer}>
          <Controller
            control={control}
            name="username"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label={createUsernameScreenStrings.form.usernameLabel}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholder={createUsernameScreenStrings.form.usernamePlaceholder}
                autoCapitalize="none"
                editable={!isSubmitting}
                error={errors.username?.message}
                leftComponent={
                  <Ionicons name="person-outline" size={sizes.icon20} color={colors.textSecondary} />
                }
                containerStyle={styles.inputWrapperContainer}
              />
            )}
          />
        </View>

        <Button
          variant="primary"
          loading={isSubmitting}
          disabled={!isValid || isSubmitting}
          onPress={onSubmit}
          style={styles.startButton}
          rightIcon={
            <AppText variant="body1">{createUsernameScreenStrings.primaryCta.decorativeSwordEmoji}</AppText>
          }
        >
          {createUsernameScreenStrings.primaryCta.startBattle}
        </Button>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingHorizontal: spacing[5],
  },
  authHeader: {
    marginBottom: spacing[6],
  },
  inputContainer: {
    marginBottom: spacing[6],
    gap: spacing[2],
  },
  inputWrapperContainer: {},
  startButton: {
    marginTop: spacing[2],
  },
});
