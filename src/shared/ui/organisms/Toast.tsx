import React, { useRef, useEffect } from 'react';
import { StyleSheet, View, Animated, TouchableOpacity, Dimensions } from 'react-native';
import { AntDesign, Entypo } from '@expo/vector-icons';
import { Colors, RPH, RPW, Sizes, verticalScale } from '@/shared/theme';
import { AppText } from '../atoms/AppText';

interface ToastProps {
  type: string;
  message: string;
  visible: boolean;
  onClose: () => void;
}

const TOAST_DURATION = 5000;

export const Toast: React.FC<ToastProps> = ({ type, message, visible, onClose }) => {
  const windowHeight = Dimensions.get('window').height;
  const popAnim = useRef(new Animated.Value(windowHeight * -1)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  const colors: { [key: string]: string } = {
    success: '#6dcf81',
    fail: '#bf6060',
  };

  const headers: { [key: string]: string } = {
    success: 'Success!',
    fail: 'Error!',
  };

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
          color={colors[type]}
        />
        <View style={styles.toastText}>
          <AppText fontMedium>{headers[type]}</AppText>
          <AppText small>{message}</AppText>
        </View>
        <TouchableOpacity onPress={instantPopOut}>
          <Entypo name="cross" size={Sizes.font22} color={Colors.black} />
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
    transform: [{ translateX: -175 }],
    height: verticalScale(60),
    width: RPW(90),
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: Sizes.font6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
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
    padding: Sizes.font2,
  },
  progressBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    height: Sizes.font4 + 1,
    backgroundColor: Colors.secondary,
  },
});
