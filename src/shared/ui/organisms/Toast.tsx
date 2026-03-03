import React, { useRef, useEffect } from 'react';
import { StyleSheet, View, Animated, TouchableOpacity, Dimensions } from 'react-native';
import { AntDesign, Entypo } from '@expo/vector-icons';
import {
  colors,
  RPH,
  RPW,
  Sizes,
  verticalScale,
  horizontalScale,
  shadows,
} from '@/shared/theme';
import { AppText } from '@/shared/ui/atoms/AppText';

interface ToastProps {
  type: 'success' | 'fail';
  message: string;
  visible: boolean;
  onClose: () => void;
}

const TOAST_DURATION = 5000;

const typeConfig = {
  success: { label: 'Success!', color: colors.success } as const,
  fail: { label: 'Error!', color: colors.error } as const,
};

export const Toast: React.FC<ToastProps> = ({ type, message, visible, onClose }) => {
  const windowHeight = Dimensions.get('window').height;
  const popAnim = useRef(new Animated.Value(windowHeight * -1)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const config = typeConfig[type];

  useEffect(() => {
    if (visible) {
      popIn();
      startProgressBar();
    } else {
      popOut();
    }
  }, [visible]);

  const popIn = () => {
    Animated.timing(popAnim, {
      toValue: windowHeight * 0.35 * -1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const popOut = () => {
    Animated.timing(popAnim, {
      toValue: windowHeight * -1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const startProgressBar = () => {
    progressAnim.setValue(0);
    Animated.timing(progressAnim, {
      toValue: 1,
      duration: TOAST_DURATION,
      useNativeDriver: false,
    }).start(() => {
      onClose();
    });
  };

  const instantPopOut = () => {
    Animated.timing(popAnim, {
      toValue: windowHeight * -1,
      duration: 150,
      useNativeDriver: true,
    }).start(onClose);
  };

  return (
    <Animated.View
      style={[
        styles.toastContainer,
        {
          transform: [{ translateY: popAnim }],
        },
      ]}
    >
      <View style={styles.toastRow}>
        <AntDesign
          name={type === 'success' ? 'check-circle' : 'close-circle'}
          size={Sizes.font22}
          color={config.color}
        />
        <View style={styles.toastText}>
          <AppText variant="label" color={colors.text}>
            {config.label}
          </AppText>
          <AppText variant="body2" color={colors.textSecondary}>
            {message}
          </AppText>
        </View>
        <TouchableOpacity onPress={instantPopOut}>
          <Entypo name="cross" size={Sizes.font22} color={colors.text} />
        </TouchableOpacity>
      </View>
      <Animated.View
        style={[
          styles.progressBar,
          {
            width: progressAnim.interpolate({
              inputRange: [0, 1],
              outputRange: ['100%', '0%'],
            }),
          },
        ]}
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  toastContainer: {
    position: 'absolute',
    bottom: RPH(50),
    alignSelf: 'center',
    transform: [{ translateX: -RPW(45) }],
    height: verticalScale(60),
    width: RPW(90),
    backgroundColor: colors.card,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: Sizes.radius,
    ...shadows.md,
    elevation: 5,
  },
  toastRow: {
    width: '90%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  toastText: {
    width: '70%',
    paddingVertical: verticalScale(8),
    paddingHorizontal: horizontalScale(16),
  },
  progressBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    height: verticalScale(5),
    backgroundColor: colors.secondary,
  },
});
