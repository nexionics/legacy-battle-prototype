import React, { useRef, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { Video, ResizeMode, AVPlaybackStatus } from 'expo-av';
import { colors } from '@/shared/theme';
import type { SplashVideoProps } from '@/shared/types';

export const SplashVideo: React.FC<SplashVideoProps> = ({ onFinish }) => {
  const videoRef = useRef<Video>(null);

  const handlePlaybackStatusUpdate = useCallback(
    (status: AVPlaybackStatus) => {
      if (status.isLoaded && status.didJustFinish) {
        onFinish();
      }
    },
    [onFinish],
  );

  return (
    <View style={styles.container}>
      <Video
        ref={videoRef}
        source={require('../../../assets/videos/splash-video.mp4')}
        style={styles.video}
        resizeMode={ResizeMode.COVER}
        shouldPlay
        isLooping={false}
        onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
        onError={onFinish}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  video: {
    flex: 1,
  },
});
