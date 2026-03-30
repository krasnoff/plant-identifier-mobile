import { Stack } from 'expo-router';
import React, { useEffect } from 'react';
import { I18nManager } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import { ThemeProvider, useTheme } from '../context/theme-context';
import { Colors, Fonts } from '../constants/theme';
import {
  useFonts,
  Epilogue_400Regular,
  Epilogue_600SemiBold,
  Epilogue_700Bold,
} from '@expo-google-fonts/epilogue';
import {
  Manrope_400Regular,
  Manrope_600SemiBold,
  Manrope_700Bold,
} from '@expo-google-fonts/manrope';

SplashScreen.preventAutoHideAsync();

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
        headerTitleStyle: {
          fontFamily: Fonts.heading,
          fontSize: 20,
          color: colors.text,
        },
      }}
    >
      <Stack.Screen name="pages/search" options={{ title: 'The Living Archive' }} />
      <Stack.Screen name="pages/results" options={{ title: 'Results' }} />
    </Stack>
  );
}

export default function RootLayout() {
  I18nManager.allowRTL(false);
  I18nManager.forceRTL(false);

  const [fontsLoaded] = useFonts({
    Epilogue_400Regular,
    Epilogue_600SemiBold,
    Epilogue_700Bold,
    Manrope_400Regular,
    Manrope_600SemiBold,
    Manrope_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <ThemeProvider>
      <LayoutStack />
    </ThemeProvider>
  );
}
