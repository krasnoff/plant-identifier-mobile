/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */



const tintColorLight = '#191c17';
const tintColorDark = '#E2E3DF';

/** Font family names matching the loaded fonts in _layout.tsx */
export const Fonts = {
  heading: 'Epilogue_700Bold',
  headingSemiBold: 'Epilogue_600SemiBold',
  body: 'Manrope_400Regular',
  bodySemiBold: 'Manrope_600SemiBold',
  bodyBold: 'Manrope_700Bold',
};

export const Colors = {
  light: {
    text: '#191c17',
    background: '#F8FaF1',
    tint: tintColorLight,
    icon: '#191c17',
    tabIconDefault: '#191c17',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#E2E3DF',
    background: '#121412',
    tint: tintColorDark,
    icon: '#E2E3DF',
    tabIconDefault: '#E2E3DF',
    tabIconSelected: tintColorDark,
  },
};

