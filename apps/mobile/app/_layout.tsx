import { Stack } from 'expo-router';
import React from 'react';
import { I18nManager } from 'react-native';
import { ThemeProvider, useTheme } from '../context/theme-context';
import { Colors } from '../constants/theme';

export const unstable_settings = {
  anchor: '(tabs)',
};

function LayoutStack() {
  const { colorScheme } = useTheme();
  const colors = Colors[colorScheme];

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: colors.background },
        headerTitleAlign: 'center',
        headerTitleStyle: { fontWeight: 'bold', fontSize: 24, color: colors.text },
      }}
    >
      <Stack.Screen name="pages/search" options={{ title: 'Home' }} />
      <Stack.Screen name="pages/results" options={{ title: 'Results' }} />
    </Stack>
  );
}

export default function RootLayout() {
  I18nManager.allowRTL(false);
  I18nManager.forceRTL(false);

  return (
    <ThemeProvider>
      <LayoutStack />
    </ThemeProvider>
  );
}
