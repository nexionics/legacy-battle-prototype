import { Modal, View, Pressable, StyleSheet } from 'react-native';
import { useThemeColors } from '@/app/providers/ThemeProvider';
import type { AppModalProps } from '@/shared/types';

/**
 * Single reusable `Modal` wrapper for the app. Use instead of importing `Modal` from `react-native`.
 * - `presentation: 'center'` — fades in; content is centered (dialogs, pickers).
 * - `presentation: 'bottom'` — slides up; content aligns to the bottom (sheets).
 */
export function AppModal({
  visible,
  onRequestClose,
  children,
  presentation = 'center',
  animationType: animationTypeProp,
  backdropColor,
}: AppModalProps) {
  const colors = useThemeColors();
  const animationType =
    animationTypeProp ?? (presentation === 'bottom' ? 'slide' : 'fade');
  const overlayFill = backdropColor ?? colors.overlayHeavy;

  return (
    <Modal
      visible={visible}
      transparent
      animationType={animationType}
      statusBarTranslucent
      onRequestClose={onRequestClose}
    >
      <View style={styles.root}>
        <Pressable
          style={[StyleSheet.absoluteFillObject, { backgroundColor: overlayFill }]}
          onPress={onRequestClose}
          accessibilityRole="button"
          accessibilityLabel="Dismiss"
        />
        <View
          style={presentation === 'bottom' ? styles.wrapBottom : styles.wrapCenter}
          pointerEvents="box-none"
        >
          {children}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  wrapCenter: {
    flex: 1,
    zIndex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  wrapBottom: {
    flex: 1,
    zIndex: 1,
    width: '100%',
    justifyContent: 'flex-end',
  },
});
