import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme } from 'react-native';

type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeColors {
  background: string;
  surface: string;
  card: string;
  text: string;
  textSecondary: string;
  primary: string;
  primaryLight: string;
  border: string;
  success: string;
  error: string;
  warning: string;
}

interface ThemeContextType {
  themeMode: ThemeMode;
  isDarkMode: boolean;
  colors: ThemeColors;
  setThemeMode: (mode: ThemeMode) => void;
}

const lightColors: ThemeColors = {
  background: '#F4F4F6',
  surface: '#FFFFFF',
  card: '#FFFFFF',
  text: '#1a1625',
  textSecondary: '#666666',
  primary: '#9163F2',
  primaryLight: '#E8DEFF',
  border: '#E0E0E0',
  success: '#6BCF7F',
  error: '#FF6B6B',
  warning: '#FFD88A',
};

const darkColors: ThemeColors = {
  background: '#121212',
  surface: '#1E1E1E',
  card: '#2C2C2C',
  text: '#FFFFFF',
  textSecondary: '#B0B0B0',
  primary: '#9163F2',
  primaryLight: '#2D1B4E',
  border: '#3C3C3C',
  success: '#6BCF7F',
  error: '#FF6B6B',
  warning: '#FFD88A',
};

const THEME_STORAGE_KEY = '@theme_mode';

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const systemColorScheme = useColorScheme();
  const [themeMode, setThemeModeState] = useState<ThemeMode>('system');
  
  // Determine if dark mode is active
  const isDarkMode = themeMode === 'system' 
    ? systemColorScheme === 'dark' 
    : themeMode === 'dark';

  const colors = isDarkMode ? darkColors : lightColors;

  // Load theme preference on mount
  useEffect(() => {
    loadThemePreference();
  }, []);

  const loadThemePreference = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
      if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark' || savedTheme === 'system')) {
        setThemeModeState(savedTheme as ThemeMode);
      }
    } catch (error) {
      console.error('Error loading theme preference:', error);
    }
  };

  const setThemeMode = async (mode: ThemeMode) => {
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, mode);
      setThemeModeState(mode);
    } catch (error) {
      console.error('Error saving theme preference:', error);
      // Still update state even if storage fails
      setThemeModeState(mode);
    }
  };

  return (
    <ThemeContext.Provider value={{ themeMode, isDarkMode, colors, setThemeMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}
