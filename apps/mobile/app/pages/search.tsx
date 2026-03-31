import { useRouter } from 'expo-router';
import { Text, View, StyleSheet, Pressable, Button, TextInput, KeyboardAvoidingView, Platform, ScrollView, Keyboard } from 'react-native';
import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { useTheme } from '../../context/theme-context';
import { Colors, Fonts } from '../../constants/theme';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { useHeaderHeight } from '@react-navigation/elements';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

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

  useEffect(() => {
    const showSubscription = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardOpen(true);
    });
    const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardOpen(false);
    });

    console.log('headerHeight', headerHeight);
    console.log('insets', insets);
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
      keyboardVerticalOffset={Platform.OS === 'ios' ? headerHeight : -keyboardMargin} // tweak this if needed
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
              <CameraView style={styles.cameraView} facing={facing} />
              <View style={styles.cameraOverlay}>
                <Pressable
                  style={[styles.button]}
                  >
                  
                </Pressable>
                <Pressable style={styles.centerCircleButton}>
                  <View style={styles.centerCircleInner} />
                </Pressable>
                <Pressable
                  style={[styles.button]}
                  >
                  
                </Pressable>
              </View>
            </View>
          </View>
      </View>

      <View style={styles.buttonForm}>
        <Text style={styles.title}>Add details or ask a question</Text>
        <View style={styles.inputContainer}>
          <TextInput 
            placeholder='e.g Found near an oak tree, seems to have serrated edges...'
            multiline
            numberOfLines={4}
            style={{ flex: 1 }}
          />

        </View>
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
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 9999,
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
  }

});