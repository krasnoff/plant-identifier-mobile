import { useLocalSearchParams } from 'expo-router';
import { Text, View, StyleSheet, ScrollView, Alert, Share, Platform, ActivityIndicator } from 'react-native';
import React, { useRef, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { useTheme } from '../../context/theme-context';
import { Colors, Fonts } from '../../constants/theme';
import { Image } from 'expo-image';
import Markdown from 'react-native-markdown-display';
import { Button } from '@react-navigation/elements';
import { File, Paths } from 'expo-file-system';
import * as WebBrowser from 'expo-web-browser';
import * as Sharing from 'expo-sharing';
import * as ImageManipulator from 'expo-image-manipulator';
import useUtils from '@/hooks/usUtils';

export default function Results() {
  const { result, imageUri } = useLocalSearchParams<{ result: string, imageUri: string }>();
  const { colorScheme } = useTheme();
  const colors = Colors[colorScheme];
  const [loadingPdf, setLoadingPdf] = useState(false);

  const { manipulateImage, getBase64FromUri } = useUtils();

  // Parse the API response
  const data = result ? JSON.parse(result) : null;  

  const handleViewPdf = async () => {
    try {
      setLoadingPdf(true);
      const apiBaseUrl = process.env.EXPO_PUBLIC_BASE_URL;
      const pdfUrl = `${apiBaseUrl}getPDF`;
      
      // Convert image to base64
      let imageBase64 = '';
      
      if (imageUri && imageUri.trim() !== '') {
        try {
          console.log('Processing image with URI:', imageUri);
          
          const manipulatedImage = await manipulateImage(imageUri, 500);   

          // Get the base64 string
          const base64String = manipulatedImage.base64;
          if (base64String) {
            imageBase64 = base64String;
            console.log('Successfully processed image, base64 length:', base64String.length);
          } else {
            console.warn('No base64 data returned from image manipulation');
          }
          
        } catch (imageError) {
          console.error('Error processing image with ImageManipulator:', imageError);
          
          // Fallback: try to use fetch method as before
          try {
            imageBase64 = await getBase64FromUri(imageUri);
            console.log('Fallback method succeeded');
          } catch (fallbackError) {
            console.error('Both image processing methods failed:', fallbackError);
          }
        }
      } else {
        console.warn('No valid imageUri provided:', imageUri);
      }
      
      if (Platform.OS === 'ios' || Platform.OS === 'android') {
        // For mobile devices, download the file first and then open it
        const localFile = new File(Paths.document, 'shem.pdf');
        
        // Fetch the PDF data
        const response = await fetch(pdfUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ result, imageBase64 }),
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const pdfData = await response.arrayBuffer();
        
        // Convert ArrayBuffer to Uint8Array for expo-file-system compatibility
        const uint8Array = new Uint8Array(pdfData);
        
        // Write the PDF data to the file
        await localFile.write(uint8Array);
        
        if (localFile.exists) {
          // Use expo-sharing to properly open the PDF file
          const isAvailable = await Sharing.isAvailableAsync();
          if (isAvailable) {
            await Sharing.shareAsync(localFile.uri, {
              mimeType: 'application/pdf',
              dialogTitle: 'Open PDF with...',
            });
          } else {
            // Fallback: use WebBrowser for viewing
            await WebBrowser.openBrowserAsync(pdfUrl);
          }
        }
      } else {
        // For web/desktop, open directly in browser
        // Note: For web, we might need to handle base64 conversion differently
        // depending on how the imageUri is structured in web environments
        await WebBrowser.openBrowserAsync(`${pdfUrl}?result=${encodeURIComponent(result)}&imageBase64=${encodeURIComponent(imageBase64)}`);
      }
    } catch (error) {
      console.error('Error opening PDF:', error);
      Alert.alert(
        'Error',
        'Unable to open PDF file. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setLoadingPdf(false);
    }
  };

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}> 
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.container,
          { backgroundColor: colors.background, paddingBottom: 30 },
        ]}
      >
      <StatusBar
        backgroundColor={colors.background}
        style={colorScheme === 'dark' ? 'light' : 'dark'}
      />
      <View collapsable={false} style={{alignSelf: 'stretch'}}>        
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
      </View>
      <View style={styles.buttonContainer}>
        <Button 
          onPress={() => handleViewPdf()} 
          disabled={loadingPdf}
        >
          {loadingPdf ? 'Loading PDF...' : 'View PDF Guide'}
        </Button>
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
    margin: 20
    
  },
  textContainer: {
    fontFamily: Fonts.body,
  },
  centerButtonWrapper: {
    marginTop: 4,
    marginVertical: 0,
    alignSelf: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 8,
  },
});