import { View, StyleSheet, ScrollView } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Screen, AuthHeader, Input, Button, AppText } from '@/shared/ui';
import { colors, spacing, sizes } from '@/shared/theme';
import { AuthHeaderVariant } from '@/shared/utils/enum';
import type { EditUsernameScreenProps } from '@/shared/types';
import { useThemeColors } from '@/app/providers/ThemeProvider';
import type { UseEditUsernameScreenReturn } from '../../hooks/useEditUsernameScreen';

export type EditUsernameScreenViewProps = EditUsernameScreenProps & UseEditUsernameScreenReturn;

export function EditUsernameScreen({
  username,
  setUsername,
  isChecking,
  isAvailable,
  statusMessage,
  profileUsername,
  updateProfilePending,
  handleSave,
  editUsernameScreenStrings,
  onBeforeBack,
}: EditUsernameScreenViewProps) {
  const themeColors = useThemeColors();

  return (
    <Screen padding={0}>
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
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
              onChangeText={setUsername}
              placeholder={editUsernameScreenStrings.placeholder}
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
                  <Ionicons name="checkmark-circle" size={sizes.icon20} color={colors.success} />
                ) : null
              }
              editable={!updateProfilePending}
            />
            {statusMessage ? (
              <AppText
                variant="body2"
                style={[styles.statusText, { color: isAvailable ? colors.success : colors.error }]}
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
