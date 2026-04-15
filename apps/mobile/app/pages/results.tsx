import { useLocalSearchParams } from 'expo-router';
import { Text, View, StyleSheet, ScrollView, Alert, Share, Platform } from 'react-native';
import React, { useRef } from 'react';
import { StatusBar } from 'expo-status-bar';
import { useTheme } from '../../context/theme-context';
import { Colors, Fonts } from '../../constants/theme';
import { Image } from 'expo-image';
import Markdown from 'react-native-markdown-display';
import { Button } from '@react-navigation/elements';
import { captureRef } from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system/legacy';

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

      console.log('Starting capture process...');

      // Wait a bit to ensure view is fully rendered
      await new Promise(resolve => setTimeout(resolve, 500));

      // Extract the plant identification text
      const plantText = data?.response || 'Plant identification result';
      
      // Clean up markdown formatting for plain text sharing
      const cleanText = plantText
        .replace(/[#*_`]/g, '') // Remove markdown formatting
        .replace(/\n\s*\n/g, '\n\n') // Clean up extra line breaks
        .trim();

      // Try different capture methods progressively
      let captureSuccess = false;
      let capturedUri = null;
      let lastError = null;
      
      // Method 1: Basic tmpfile capture
      try {
        console.log('Attempting tmpfile capture...');
        const uri = await captureRef(viewRef.current, {
          format: 'png',
          quality: 0.8,
          result: 'tmpfile',
        });
        
        console.log('Capture successful:', uri);
        capturedUri = uri;
        captureSuccess = true;
        
      } catch (tmpError) {
        lastError = `Method 1 failed: ${tmpError.message}`;
        console.log(lastError);
      }

      if (!captureSuccess) {
        // Method 2: Alternative capture settings
        try {
          console.log('Attempting alternative capture settings...');
          const uri = await captureRef(viewRef.current, {
            format: 'jpg',
            quality: 0.8,
            result: 'tmpfile',
            snapshotContentContainer: false,
          });
          
          console.log('Alternative capture successful:', uri);
          capturedUri = uri;
          captureSuccess = true;
          
        } catch (altError) {
          lastError = `Method 2 failed: ${altError.message}`;
          console.log(lastError);
        }
      }

      if (!captureSuccess) {
        throw new Error(`Image capture failed: ${lastError}`);
      }

      // Now try sharing the captured image with text content
      let shareSuccess = false;

      // Try 1: Copy to shared directory and share with text
      try {
        console.log('Attempting to copy image to shareable location...');
        
        // Create a unique filename in the documents directory (more accessible)
        const timestamp = Date.now();
        const filename = `plant-identification-${timestamp}.png`;
        const shareablePath = `${FileSystem.documentDirectory}${filename}`;

        // Copy the captured image to a shareable location
        await FileSystem.copyAsync({
          from: capturedUri,
          to: shareablePath,
        });

        console.log('Image copied to shareable location:', shareablePath);

        // Share with both text and image
        const shareContent = {
          title: 'Plant Identification Result',
          message: `🌱 Plant Identification Result 🌱\n\n${cleanText}`,
          url: shareablePath,
        };
        
        await Share.share(shareContent);
        
        console.log('Share with copied image successful!');
        shareSuccess = true;
        
        // Clean up after 30 seconds
        setTimeout(async () => {
          try {
            await FileSystem.deleteAsync(shareablePath);
            console.log('Temporary share file cleaned up');
          } catch (cleanupError) {
            console.log('Cleanup warning:', cleanupError);
          }
        }, 30000);
        
      } catch (shareError) {
        console.log('Copy and share failed:', shareError.message);
      }

      // Try 2: Android-specific sharing approach
      if (!shareSuccess && Platform.OS === 'android') {
        try {
          console.log('Attempting Android-specific image sharing...');
          
          // Share image only first, then follow with text
          await Share.share({
            url: capturedUri,
            type: 'image/png',
          });
          
          // Wait a moment, then share text
          setTimeout(async () => {
            try {
              await Share.share({
                message: `🌱 Plant Identification Result 🌱\n\n${cleanText}`,
              });
            } catch (textError) {
              console.log('Follow-up text share failed:', textError);
            }
          }, 1000);
          
          console.log('Android-specific sharing initiated!');
          shareSuccess = true;
          
        } catch (androidError) {
          console.log('Android-specific sharing failed:', androidError.message);
        }
      }

      // Try 3: Direct file sharing without message
      if (!shareSuccess) {
        try {
          console.log('Attempting direct image sharing...');
          
          await Share.share({
            url: capturedUri,
            title: `Plant ID: ${cleanText.substring(0, 100)}...`,
          });
          
          console.log('Direct image sharing successful!');
          shareSuccess = true;
          
        } catch (directError) {
          console.log('Direct image sharing failed:', directError.message);
        }
      }

      // Try 2: Expo Sharing (if RN Share failed)
      if (!shareSuccess) {
        try {
          console.log('Attempting Expo Sharing as fallback...');
          
          const isAvailable = await Sharing.isAvailableAsync();
          if (isAvailable && capturedUri) {
            await Sharing.shareAsync(capturedUri, {
              mimeType: 'image/png',
              dialogTitle: `Plant Identification: ${cleanText.substring(0, 50)}...`,
            });
            console.log('Expo sharing successful!');
            shareSuccess = true;
          } else {
            console.log('Expo sharing not available');
          }
          
        } catch (expoShareError) {
          console.log('Expo sharing failed:', expoShareError.message);
        }
      }

      // Try 3: Text-only fallback (if image sharing failed)
      if (!shareSuccess) {
        try {
          console.log('Attempting text-only sharing fallback...');
          
          await Share.share({
            title: 'Plant Identification Result',
            message: `🌱 Plant Identification Result 🌱\n\n${cleanText}\n\n(Note: Image sharing failed, but here's the identification text)`,
          });
          
          console.log('Text-only sharing successful!');
          shareSuccess = true;
          
        } catch (textError) {
          console.log('Text sharing failed:', textError.message);
        }
      }

      if (!shareSuccess) {
        throw new Error('All sharing methods failed');
      }
      
    } catch (error) {
      console.error('All sharing methods failed:', error);
      
      const errorMessage = __DEV__ 
        ? `Error: ${error.message}` 
        : `Error: Sharing not supported on this device`;
      
      Alert.alert(
        'Sharing Failed', 
        `Unable to share the result.\n\n${errorMessage}\n\nYou can take a screenshot manually to save the result.`,
        [
          { text: 'Copy Text Only', onPress: () => {
            const plantText = data?.response || 'Plant identification result';
            const cleanText = plantText.replace(/[#*_`]/g, '').replace(/\n\s*\n/g, '\n\n').trim();
            Share.share({
              title: 'Plant Identification Result',
              message: `🌱 Plant Identification Result 🌱\n\n${cleanText}`,
            }).catch(() => {
              Alert.alert('Error', 'Unable to share text content');
            });
          }},
          { text: 'OK' }
        ]
      );
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