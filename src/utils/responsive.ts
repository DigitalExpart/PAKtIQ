import { Dimensions, Platform } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Breakpoints for responsive design
export const BREAKPOINTS = {
  small: 375,   // iPhone SE, small Android phones
  medium: 414,  // iPhone 11 Pro Max, most Android phones
  large: 768,   // Tablets
};

// Check if device is small screen
export const isSmallScreen = SCREEN_WIDTH < BREAKPOINTS.small;

// Check if device is medium screen
export const isMediumScreen = SCREEN_WIDTH >= BREAKPOINTS.small && SCREEN_WIDTH < BREAKPOINTS.medium;

// Check if device is large screen
export const isLargeScreen = SCREEN_WIDTH >= BREAKPOINTS.medium;

// Responsive width percentage
export const wp = (percentage: number): number => {
  return (SCREEN_WIDTH * percentage) / 100;
};

// Responsive height percentage
export const hp = (percentage: number): number => {
  return (SCREEN_HEIGHT * percentage) / 100;
};

// Responsive font size
export const rf = (size: number): number => {
  const scale = SCREEN_WIDTH / 375; // Base width (iPhone 6/7/8)
  const newSize = size * scale;
  
  // Limit font size scaling
  if (Platform.OS === 'ios') {
    return Math.max(12, Math.min(newSize, size * 1.2));
  }
  return Math.max(12, Math.min(newSize, size * 1.3));
};

// Responsive padding
export const rp = (size: number): number => {
  const scale = SCREEN_WIDTH / 375;
  return size * Math.min(scale, 1.2); // Limit scaling to 120%
};

// Get screen dimensions
export const getScreenDimensions = () => ({
  width: SCREEN_WIDTH,
  height: SCREEN_HEIGHT,
  isSmall: isSmallScreen,
  isMedium: isMediumScreen,
  isLarge: isLargeScreen,
});

// Responsive tab bar height
export const getTabBarHeight = (): number => {
  if (isSmallScreen) return 60;
  if (isMediumScreen) return 65;
  return 70;
};

// Responsive icon size
export const getIconSize = (baseSize: number): number => {
  if (isSmallScreen) return baseSize * 0.9;
  if (isLargeScreen) return baseSize * 1.1;
  return baseSize;
};

// Responsive spacing
export const getSpacing = (baseSpacing: number): number => {
  if (isSmallScreen) return baseSpacing * 0.85;
  if (isLargeScreen) return baseSpacing * 1.15;
  return baseSpacing;
};
