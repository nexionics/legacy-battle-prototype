import { Modal, View, Pressable, StyleSheet } from 'react-native';
import { useThemeColors } from '@/app/providers/ThemeProvider';
import { horizontalScale, moderate, spacing, radii, verticalScale } from '@/shared/theme';
import { AppText } from '../atoms/AppText';
import { Button } from '../molecules/Button';
import type { ActionPromptModalProps } from '@/shared/types';

export function ActionPromptModal({
  visible,
  title,
  message,
  confirmLabel,
  cancelLabel,
  onConfirm,
  onCancel,
}: ActionPromptModalProps) {
  const colors = useThemeColors();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onCancel}
    >
      <View style={[styles.overlay, { backgroundColor: colors.overlay }]}>
        <Pressable style={styles.backdrop} onPress={onCancel} accessibilityRole="button" />
        <View
          style={[
            styles.card,
            {
              backgroundColor: colors.card,
              borderColor: colors.cardBorder,
            },
          ]}
          accessibilityRole="none"
        >
          <AppText variant="h5" style={[styles.title, { color: colors.text }]}>
            {title}
          </AppText>
          <AppText variant="body2" style={[styles.message, { color: colors.textSecondary }]}>
            {message}
          </AppText>
          <View style={styles.actions}>
            <Button variant="outline" onPress={onCancel} style={styles.actionButton}>
              {cancelLabel}
            </Button>
            <Button variant="primary" onPress={onConfirm} style={styles.actionButton}>
              {confirmLabel}
            </Button>
          </View>
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
  actionButton: {
    flex: 1,
    minHeight: moderate(48),
    paddingVertical: verticalScale(12),
  },
});
