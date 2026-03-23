import { View, StyleSheet } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Screen, AuthHeader, Input, Button, AppText, SVGWrapper, KeyboardAwareScroll } from '@/shared/ui';
import { colors, spacing, sizes } from '@/shared/theme';
import { AuthHeaderVariant, IconNameEnum } from '@/shared/utils/enum';
import type { EditUsernameScreenProps } from '@/shared/types';
import { useThemeColors } from '@/app/providers/ThemeProvider';
import type { UseEditUsernameScreenReturn } from '../../hooks/useEditUsernameScreen';

export type EditUsernameScreenViewProps = EditUsernameScreenProps & UseEditUsernameScreenReturn;

export function EditUsernameScreen({
  username,
  handleUsernameChange,
  isChecking,
  isAvailable,
  statusMessage,
  profileUsername,
  displayNamePlaceholder,
  updateProfilePending,
  handleSave,
  editUsernameScreenStrings,
  onBeforeBack,
}: EditUsernameScreenViewProps) {
  const themeColors = useThemeColors();

  return (
    <Screen padding={0}>
      <KeyboardAwareScroll contentContainerStyle={styles.scrollContent}>
        <AuthHeader
          variant={AuthHeaderVariant.Left}
          canGoBack
          logoSize={sizes.logoScreenLg}
          title={editUsernameScreenStrings.authHeader.title}
          subtitle={editUsernameScreenStrings.authHeader.subtitle}
          onBeforeBack={onBeforeBack}
        />

        <View style={styles.form}>
          <View style={styles.inputSection}>
            <Input
              label={editUsernameScreenStrings.fieldLabel}
              value={username}
              onChangeText={handleUsernameChange}
              placeholder={displayNamePlaceholder}
              autoCapitalize="none"
              autoCorrect={false}
              leftComponent={
                <Ionicons
                  name="person-outline"
                  size={sizes.icon20}
                  color={themeColors.textSecondary}
                />
              }
              rightComponent={
                isAvailable ? (
                  <SVGWrapper
                    name={IconNameEnum.CheckValid}
                    width={sizes.icon20}
                    height={sizes.icon20}
                  />
                ) : undefined
              }
              editable={!updateProfilePending}
              showSuccessBorder={Boolean(isAvailable)}
            />
            {statusMessage ? (
              <AppText
                variant="body2"
                color={isAvailable ? colors.success : colors.error}
                style={styles.statusText}
              >
                {statusMessage}
              </AppText>
            ) : null}
          </View>

          <Button
            variant="primary"
            loading={updateProfilePending || isChecking}
            disabled={!username || username === profileUsername || isAvailable === false}
            onPress={handleSave}
            style={styles.saveButton}
            rightIcon={
              <MaterialCommunityIcons name="fire" size={sizes.icon20} color={colors.white} />
            }
          >
            {editUsernameScreenStrings.changeButton}
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
  inputSection: {
    gap: spacing[2],
  },
  statusText: {
    marginLeft: spacing[1],
  },
  saveButton: {
    marginTop: spacing[2],
  },
});
