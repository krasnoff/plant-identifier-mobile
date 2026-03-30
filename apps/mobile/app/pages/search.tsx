import { useRouter } from 'expo-router';
import { Text, View, StyleSheet, Pressable, Button } from 'react-native';
import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { useTheme } from '../../context/theme-context';
import { Colors } from '../../constants/theme';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';

export default function Search() {
  const router = useRouter();
  const { colorScheme } = useTheme();
  const colors = Colors[colorScheme];

  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();

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
        <Text style={{ color: colors.text }}>search view</Text>
      </View>
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  cameraFrame: {
    flex: 1,
    width: '100%',
    paddingHorizontal: 24,
    paddingTop: 24,
    alignItems: 'center',
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
  
  
  
  
  
  
  
});