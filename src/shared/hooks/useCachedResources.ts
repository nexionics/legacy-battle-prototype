import { useState, useEffect, useCallback } from 'react';
import {
  useFonts,
  Montserrat_100Thin,
  Montserrat_300Light,
  Montserrat_400Regular,
  Montserrat_500Medium,
  Montserrat_600SemiBold,
  Montserrat_700Bold,
} from '@expo-google-fonts/montserrat';
import {
  Geist_100Thin,
  Geist_300Light,
  Geist_400Regular,
  Geist_500Medium,
  Geist_600SemiBold,
  Geist_700Bold,
} from '@expo-google-fonts/geist';

export type UseCachedResourcesResult = {
  isLoaded: boolean;
  isReady: boolean;
  onSplashFinish: () => void;
};

export const useCachedResources = (): UseCachedResourcesResult => {
  const [fontsLoaded] = useFonts({
    Montserrat_100Thin,
    Montserrat_300Light,
    Montserrat_400Regular,
    Montserrat_500Medium,
    Montserrat_600SemiBold,
    Montserrat_700Bold,
    Geist_100Thin,
    Geist_300Light,
    Geist_400Regular,
    Geist_500Medium,
    Geist_600SemiBold,
    Geist_700Bold,
  });

  const [isLoadingComplete, setIsLoadingComplete] = useState(false);
  const [splashDone, setSplashDone] = useState(false);

  useEffect(() => {
    if (fontsLoaded) {
      setIsLoadingComplete(true);
    }
  }, [fontsLoaded]);

  const onSplashFinish = useCallback(() => {
    setSplashDone(true);
  }, []);

  const isLoaded = isLoadingComplete;
  const isReady = isLoaded && splashDone;

  return {
    isLoaded,
    isReady,
    onSplashFinish,
  };
};
