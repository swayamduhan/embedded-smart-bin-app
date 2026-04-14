import { DarkTheme, DefaultTheme, type Theme } from '@react-navigation/native';

import { palette } from './colors';

export interface AppTheme {
  mode: 'light' | 'dark';
  colors: {
    background: string;
    surface: string;
    text: string;
    textMuted: string;
    border: string;
    success: string;
    warning: string;
    danger: string;
    accent: string;
    cardGradient: [string, string];
  };
  navigation: Theme;
}

export const lightTheme: AppTheme = {
  mode: 'light',
  colors: {
    background: '#EDF5F8',
    surface: palette.white,
    text: '#0B1822',
    textMuted: '#557081',
    border: '#C5D7E2',
    success: palette.emerald,
    warning: palette.amber,
    danger: palette.red,
    accent: palette.blue,
    cardGradient: ['#0E2432', '#14384D'],
  },
  navigation: {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: palette.blue,
      background: '#EDF5F8',
      card: palette.white,
      text: '#0B1822',
      border: '#C5D7E2',
      notification: palette.red,
    },
  },
};

export const darkTheme: AppTheme = {
  mode: 'dark',
  colors: {
    background: palette.slate900,
    surface: palette.surfaceDark,
    text: palette.white,
    textMuted: palette.slate300,
    border: '#1D3647',
    success: palette.emerald,
    warning: palette.amber,
    danger: palette.red,
    accent: palette.cyan,
    cardGradient: ['#102536', '#1B3E59'],
  },
  navigation: {
    ...DarkTheme,
    colors: {
      ...DarkTheme.colors,
      primary: palette.cyan,
      background: palette.slate900,
      card: palette.surfaceDark,
      text: palette.white,
      border: '#1D3647',
      notification: palette.red,
    },
  },
};
