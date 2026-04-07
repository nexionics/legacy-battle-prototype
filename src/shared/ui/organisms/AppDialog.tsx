import { Modal, View, Pressable, StyleSheet } from 'react-native';
import { useThemeColors } from '@/app/providers/ThemeProvider';
import { horizontalScale, moderate, spacing, radii, verticalScale } from '@/shared/theme';
import { AppText } from '../atoms/AppText';
import { Button } from '../molecules/Button';
import type { AppDialogProps } from '@/shared/types';

const DEFAULT_DISMISS_LABEL = 'OK';

/**
 * Theme-aware modal dialog. Prefer this over `Alert.alert` for consistent styling.
 * - `showActions: false` — informational only; single dismiss control.
 * - `showActions: true` — cancel + confirm (or equivalent primary action).
 */
export function AppDialog(props: AppDialogProps) {
  const colors = useThemeColors();

  const handleRequestClose = () => {
    if (props.showActions) {
      props.onCancel();
    } else {
      props.onDismiss();
    }
  };

  return (
    <Modal
      visible={props.visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={handleRequestClose}
    >
      <View style={[styles.overlay, { backgroundColor: colors.overlay }]}>
        <Pressable style={styles.backdrop} onPress={handleRequestClose} accessibilityRole="button" />
        <View
          style={[
            styles.card,
            {
              backgroundColor: colors.card,
              borderColor: colors.cardBorder,
            },
          ]}
          accessibilityRole="alert"
          accessibilityLabel={`${props.title}. ${props.message}`}
        >
          <AppText variant="h5" style={[styles.title, { color: colors.text }]}>
            {props.title}
          </AppText>
          <AppText variant="body2" style={[styles.message, { color: colors.textSecondary }]}>
            {props.message}
          </AppText>
          {props.showActions ? (
            <View style={styles.actions}>
              <Button variant="outline" onPress={props.onCancel} style={styles.actionButton}>
                {props.cancelLabel}
              </Button>
              <Button variant="primary" onPress={props.onConfirm} style={styles.actionButton}>
                {props.confirmLabel}
              </Button>
            </View>
          ) : (
            <View style={styles.actionsSingle}>
              <Button variant="primary" onPress={props.onDismiss} style={styles.singleActionButton}>
                {props.dismissLabel ?? DEFAULT_DISMISS_LABEL}
              </Button>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: horizontalScale(24),
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  card: {
    zIndex: 1,
    width: '100%',
    maxWidth: horizontalScale(340),
    borderRadius: radii.lg,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: horizontalScale(20),
    paddingTop: verticalScale(20),
    paddingBottom: verticalScale(16),
  },
  title: {
    marginBottom: verticalScale(8),
  },
  message: {
    marginBottom: verticalScale(20),
    lineHeight: verticalScale(22),
  },
  actions: {
    flexDirection: 'row',
    gap: spacing[3],
  },
  actionsSingle: {
    flexDirection: 'row',
  },
  actionButton: {
    flex: 1,
    minHeight: moderate(48),
    paddingVertical: verticalScale(12),
  },
  singleActionButton: {
    flex: 1,
    minHeight: moderate(48),
    paddingVertical: verticalScale(12),
  },
});
