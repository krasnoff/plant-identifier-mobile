import { useLocalSearchParams } from 'expo-router';
import { Text, View, StyleSheet, ScrollView, Alert } from 'react-native';
import React, { useRef } from 'react';
import { StatusBar } from 'expo-status-bar';
import { useTheme } from '../../context/theme-context';
import { Colors, Fonts } from '../../constants/theme';
import { Image } from 'expo-image';
import Markdown from 'react-native-markdown-display';
import { Button } from '@react-navigation/elements';
import { captureRef } from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';

export default function Results() {
  const { result, imageUri } = useLocalSearchParams<{ result: string, imageUri: string }>();
  const { colorScheme } = useTheme();
  const colors = Colors[colorScheme];

  // Parse the API response
  const data = result ? JSON.parse(result) : null;

  const viewRef = useRef<View>(null);

  const onShareCapture = async () => {
    try {
      if (!viewRef.current) {
        Alert.alert('Error', 'View is not ready yet. Please try again.');
        return;
      }

      // Use base64 for more reliable cross-platform sharing
      const uri = await captureRef(viewRef.current, {
        format: 'png',
        quality: 0.8,
        result: 'base64',
      });

      const isAvailable = await Sharing.isAvailableAsync();
      if (!isAvailable) {
        Alert.alert('Sharing is not available on this device');
        return;
      }

      // Create data URI for sharing
      const base64Image = `data:image/png;base64,${uri}`;
      
      await Sharing.shareAsync(base64Image, {
        mimeType: 'image/png',
        dialogTitle: 'Share plant identification',
      });
    } catch (error) {
      console.error('Share failed:', error);
      Alert.alert('Error', 'Failed to capture and share image. Please try again.');
    }
  };

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}> 
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.container,
          { backgroundColor: colors.background, paddingBottom: 96 },
        ]}
      >
      <StatusBar
        backgroundColor={colors.background}
        style={colorScheme === 'dark' ? 'light' : 'dark'}
      />
      <View ref={viewRef} collapsable={false}>        
        {imageUri && imageUri.trim() !== '' ? (
          <View>
            <View style={[styles.previewContainer]}>
              <Image
                source={{ uri: imageUri }}
                style={styles.preview}
                contentFit="contain"
                
              />
            </View>
          </View>
        ) : (
          <Text style={{ color: colors.text, textAlign: 'center', marginBottom: 20 }}>
            No image available - imageUri is: "{imageUri || 'undefined'}"
          </Text>
        )}
        <View style={styles.descriptionContainer}>
          {data && (
            
              <Markdown
                style={{
                  body: { fontFamily: Fonts.body },
                  paragraph: { fontFamily: Fonts.body },
                  text: { fontFamily: Fonts.body },
                  heading1: { fontFamily: Fonts.heading },
                  heading2: { fontFamily: Fonts.headingSemiBold },
                  heading3: { fontFamily: Fonts.headingSemiBold },
                }}
              >
                {data.response}
              </Markdown>
            
          )}
        </View>
        <View style={styles.centerButtonWrapper}>
          <Button onPress={onShareCapture}>Share</Button>
        </View>
      </View>
      </ScrollView>
      
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  container: {
    alignItems: 'center',
    paddingVertical: 20,
    gap: 12,
    marginHorizontal: 20,
  },
  previewContainer: {
    width: '100%',
    height: 427,
    marginBottom: 24,
    borderRadius: 32,
    overflow: 'hidden', // This ensures the image stays within the container bounds
  },
  preview: {
    width: '100%',
    height: '100%', // Fill the container height
    borderRadius: 32,
  },
  descriptionContainer: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.22,
    shadowRadius: 18,
    elevation: 10,
    borderRadius: 20,
    padding: 20,
    margin: 20,
    width: '100%',
  },
  textContainer: {
    fontFamily: Fonts.body,
  },
  centerButtonWrapper: {
    marginTop: 4,
    marginVertical: 0,
    alignSelf: 'center',
  }
});