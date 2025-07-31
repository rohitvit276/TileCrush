import { MD3LightTheme } from 'react-native-paper';

export const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#6366f1',
    primaryContainer: '#e0e7ff',
    secondary: '#f59e0b',
    secondaryContainer: '#fef3c7',
    surface: '#ffffff',
    surfaceVariant: '#f8fafc',
    background: '#fafafa',
    onPrimary: '#ffffff',
    onSecondary: '#000000',
    onSurface: '#1f2937',
    onBackground: '#1f2937',
  },
  roundness: 12,
};

export const moodColors = {
  happy: '#fbbf24',
  sad: '#3b82f6',
  angry: '#ef4444',
  calm: '#10b981',
  excited: '#f97316',
  anxious: '#8b5cf6',
  neutral: '#6b7280',
  energetic: '#ff6b6b',
  peaceful: '#4ade80',
  frustrated: '#dc2626',
};