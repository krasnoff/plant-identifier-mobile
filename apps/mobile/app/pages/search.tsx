import { useRouter } from 'expo-router';
import { Text, View, StyleSheet, Pressable, Button, TextInput, KeyboardAvoidingView, Platform, ScrollView, Keyboard } from 'react-native';
import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { useTheme } from '../../context/theme-context';
import { Colors, Fonts } from '../../constants/theme';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { useHeaderHeight } from '@react-navigation/elements';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import SubmitButtonComponent from '@/assets/svg/submitButton';
import FlipCameraComponent from '@/assets/svg/flipCamera';
import FlashLightOnComponent from '@/assets/svg/flashLightOn';

export default function Search() {
  const router = useRouter();
  const { colorScheme } = useTheme();
  const colors = Colors[colorScheme];

  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();

  const [keyboardOpen, setKeyboardOpen] = useState(false);
  const headerHeight = useHeaderHeight(); // Adjust this value based on your header's actual height
  const insets = useSafeAreaInsets();

  const [keyboardMargin, setKeyboardMargin] = useState(0);

  const [flashLightOn, setFlashLightOn] = useState(false);

  useEffect(() => {
    const showSubscription = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardOpen(true);
    });
    const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardOpen(false);
    });

    setKeyboardMargin(headerHeight - insets.top + insets.bottom);

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.container}>
        <Text style={{ color: colors.text }}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : (keyboardOpen ? 'height' : undefined)}
      keyboardVerticalOffset={Platform.OS === 'ios' ? headerHeight : -keyboardMargin - 10} // tweak this if needed
    >
    <ScrollView
      contentContainerStyle={{ flexGrow: 1, justifyContent: 'flex-end' }}
      keyboardShouldPersistTaps="handled"
    >
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar
        backgroundColor={colors.background}
        style={colorScheme === 'dark' ? 'light' : 'dark'}
      />
      {/* Camera view with overlay buttons */}
      <View
        style={styles.cameraFrame}>
          <View style={styles.cameraShadow}>
            <View style={styles.cameraContainer}>
              <CameraView style={styles.cameraView} facing={facing} enableTorch={flashLightOn} />
              <View style={styles.cameraOverlay}>
                <Pressable
                  style={({ pressed }) => [styles.button, { opacity: pressed ? 0.86 : 1 }]}
                  android_ripple={{ color: 'rgba(255, 255, 255, 0.32)', borderless: false }}
                  onPress={() => {
                    setFlashLightOn(!flashLightOn);
                  }}
                  >
                  <FlashLightOnComponent />
                </Pressable>
                <Pressable style={styles.centerCircleButton}>
                  <View style={styles.centerCircleInner} />
                </Pressable>
                <Pressable
                  style={({ pressed }) => [styles.button, { opacity: pressed ? 0.86 : 1 }]}
                  android_ripple={{ color: 'rgba(255, 255, 255, 0.32)', borderless: false }}
                  onPress={() => {
                    setFacing((prev) => (prev === 'back' ? 'front' : 'back'));
                  }}
                  >
                  <FlipCameraComponent />
                </Pressable>
              </View>
            </View>
          </View>
      </View>

      {/* input text view */}
      <View style={styles.buttonForm}>
        <Text style={styles.title}>Add details or ask a question</Text>
        <View style={styles.inputContainer}>
          <TextInput 
            placeholder='e.g Found near an oak tree, seems to have serrated edges...'
            multiline
            numberOfLines={4}
            style={ styles.inputText }
          />

        </View>
      </View>

      {/* pressable button */}
      <View style={styles.pressableWrapper}>
        <Pressable
          style={({ pressed }) => [styles.pressableContainer, { opacity: pressed ? 0.85 : 1 }]}
          android_ripple={{ color: 'rgba(255, 255, 255, 0.3)', borderless: false }}
          onPress={() => router.push('/pages/results')}
        >
          <LinearGradient
            colors={['#0D631B', '#2E7D32']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradient}
          >
            <SubmitButtonComponent />
            <Text style={styles.text}>Identify</Text>
          </LinearGradient>
        </Pressable>
      </View>
      
    </View>
    </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  // general container styles
  container: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    gap: 12,
  },
  // Camera frame styles
  cameraFrame: {
    height: 'auto',
    width: '100%',
    paddingHorizontal: 24,
    paddingTop: 24,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    gap: 12,
  },
  cameraShadow: {
    width: '100%',
    height: 427,
    borderRadius: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.22,
    shadowRadius: 18,
    elevation: 10,
  },
  cameraContainer: {
    width: '100%',
    height: 427,
    borderRadius: 32,
    overflow: 'hidden',
    position: 'relative',
  },
  cameraView: {
    width: '100%',
    height: '100%',
  },
  cameraOverlay: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
    alignItems: 'center',
  },
  centerCircleButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerCircleInner: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 2,
    borderColor: '#999999',
  },
  button: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 9999,
    overflow: 'hidden',
  },
  
  // bottom form styles
  buttonForm: {
    paddingHorizontal: 24,
    width: '100%',
  },
  title: {
    marginTop: 30,
    fontFamily: Fonts.heading,
    fontSize: 18,
  },
  inputContainer: {
    marginTop: 12,
    backgroundColor: '#e1e3DA',
    height: 128,
    borderRadius: 16,
    padding: 12,
    paddingTop: 5
  },
  inputText: {
    flex: 1,
    textAlignVertical: 'top',
    fontFamily: Fonts.body,
    fontSize: 16
  },

  // presable submit button styles can go here
  pressableWrapper: {
    marginTop: 24,
    width: '100%',
    paddingHorizontal: 24,
  },
  pressableContainer: {
    height: 68,
    borderRadius: 9999,
    overflow: 'hidden',
  },
  gradient: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    gap: 12, // note: works on newer RN versions
  },
  text: {
    color: '#fff',
    fontSize: 18,
    fontFamily: Fonts.heading
  },

});