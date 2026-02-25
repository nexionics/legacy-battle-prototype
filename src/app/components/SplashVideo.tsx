import React, { useRef, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { Video, ResizeMode, AVPlaybackStatus } from 'expo-av';

type SplashVideoProps = {
  onFinish: () => void;
};

export default function SplashVideo({ onFinish }: SplashVideoProps) {
  const videoRef = useRef<Video>(null);

  const handlePlaybackStatusUpdate = useCallback(
    (status: AVPlaybackStatus) => {
      if (status.isLoaded && status.didJustFinish) {
        onFinish();
      }
    },
    [onFinish]
  );

  return (
    <View style={styles.container}>
      <Video
        ref={videoRef}
        source={require('../../../assets/splash-video.mp4')}
        style={styles.video}
        resizeMode={ResizeMode.COVER}
        shouldPlay
        isLooping={false}
        onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
        onError={onFinish}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  video: {
    flex: 1,
  },
});
