import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type ThemeMode = 'dark' | 'light';

type ThemeColors = {
  primary: string;
  primaryDark: string;
  background: string;
  backgroundLight: string;
  card: string;
  cardBorder: string;
  text: string;
  textSecondary: string;
  textMuted: string;
  success: string;
  warning: string;
  error: string;
  white: string;
  black: string;
  transparent: string;
  overlay: string;
  inputBackground: string;
  inputBorder: string;
};

const DARK_COLORS: ThemeColors = {
  primary: '#E53935',
  primaryDark: '#C62828',
  background: '#121212',
  backgroundLight: '#1E1E1E',
  card: '#1E1E1E',
  cardBorder: '#333333',
  text: '#FFFFFF',
  textSecondary: '#9E9E9E',
  textMuted: '#666666',
  success: '#4CAF50',
  warning: '#FFC107',
  error: '#F44336',
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
  overlay: 'rgba(0, 0, 0, 0.5)',
  inputBackground: '#2A2A2A',
  inputBorder: '#404040',
};

const LIGHT_COLORS: ThemeColors = {
  primary: '#E53935',
  primaryDark: '#C62828',
  background: '#F5F5F5',
  backgroundLight: '#FFFFFF',
  card: '#FFFFFF',
  cardBorder: '#E0E0E0',
  text: '#1A1A1A',
  textSecondary: '#666666',
  textMuted: '#999999',
  success: '#4CAF50',
  warning: '#FFC107',
  error: '#F44336',
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
  overlay: 'rgba(0, 0, 0, 0.3)',
  inputBackground: '#F0F0F0',
  inputBorder: '#D0D0D0',
};

type ThemeContextValue = {
  mode: ThemeMode;
  colors: ThemeColors;
  toggleTheme: () => void;
};

const THEME_STORAGE_KEY = '@lb_theme_mode';

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setMode] = useState<ThemeMode>('dark');

  useEffect(() => {
    AsyncStorage.getItem(THEME_STORAGE_KEY).then((stored) => {
      if (stored === 'light' || stored === 'dark') {
        setMode(stored);
      }
    });
  }, []);

  const toggleTheme = () => {
    const next = mode === 'dark' ? 'light' : 'dark';
    setMode(next);
    AsyncStorage.setItem(THEME_STORAGE_KEY, next);
  };

  const colors = mode === 'dark' ? DARK_COLORS : LIGHT_COLORS;

  return (
    <ThemeContext.Provider value={{ mode, colors, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useAppTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useAppTheme must be used within ThemeProvider');
  }
  return ctx;
};
