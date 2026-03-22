import React, { useCallback, useMemo, forwardRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BottomSheetModal, BottomSheetBackdrop, BottomSheetView } from '@gorhom/bottom-sheet';
import { colors, spacing } from '@/shared/theme';
import { Button } from '@/shared/ui/molecules/Button';
import Confetti from 'assets/confetti.svg';

export type SuccessBottomSheetProps = {
  onClose: () => void;
};

export const SuccessBottomSheet = forwardRef<BottomSheetModal, SuccessBottomSheetProps>(
  ({ onClose }, ref) => {
    const snapPoints = useMemo(() => ['45%'], []);

    const renderBackdrop = useCallback(
      (props: any) => (
        <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} opacity={0.5} />
      ),
      [],
    );

    return (
      <BottomSheetModal
        ref={ref}
        index={0}
        snapPoints={snapPoints}
        backdropComponent={renderBackdrop}
        enablePanDownToClose
        backgroundStyle={{ backgroundColor: colors.background }}
      >
        <BottomSheetView style={styles.container}>
          <View style={styles.content}>
            <View style={styles.iconContainer}>
              <Confetti width={120} height={120} />
            </View>

            <Text style={styles.title}>Password Changed!</Text>
            <Text style={styles.subtitle}>Your password has been updated successfully.</Text>
          </View>

          <View style={{ flex: 1 }} />

          <Button onPress={onClose} style={styles.button}>
            Done
          </Button>
        </BottomSheetView>
      </BottomSheetModal>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    padding: spacing[6],
    paddingBottom: spacing[6],
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing[6],
  },
  iconContainer: {
    marginBottom: spacing[6],
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    color: colors.white,
    fontFamily: 'Montserrat_700Bold',
    marginBottom: spacing[4],
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: colors.white + '80',
    fontFamily: 'Roboto_400Regular',
    textAlign: 'center',
    paddingHorizontal: spacing[4],
  },
  button: {
    width: '100%',
  },
});
