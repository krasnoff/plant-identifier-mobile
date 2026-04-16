import { useLocalSearchParams } from 'expo-router';
import { Text, View, StyleSheet, ScrollView, Alert, Share, Platform } from 'react-native';
import React, { useRef } from 'react';
import { StatusBar } from 'expo-status-bar';
import { useTheme } from '../../context/theme-context';
import { Colors, Fonts } from '../../constants/theme';
import { Image } from 'expo-image';
import Markdown from 'react-native-markdown-display';

import * as Print from 'expo-print';
import { Button } from '@react-navigation/elements';

export default function Results() {
  const { result, imageUri } = useLocalSearchParams<{ result: string, imageUri: string }>();
  const { colorScheme } = useTheme();
  const colors = Colors[colorScheme];

  // Parse the API response
  const data = result ? JSON.parse(result) : null;  

  const escapeHtml = (text: string) => {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;')
      .replace(/\n/g, '<br/>');
  }

  const createAndOpenPdf = async ({ imageUri, text }: { imageUri: string, text: string }) => {
    try {
      console.log('Starting PDF creation with imageUri:', imageUri);
      
      // For production builds, try a simpler approach using fetch to read the image
      let imageBase64;
      try {
        console.log('Attempting to fetch image...');
        const response = await fetch(imageUri);
        console.log('Fetch response status:', response.status);
        
        const blob = await response.blob();
        console.log('Blob size:', blob.size, 'Type:', blob.type);
        
        const reader = new FileReader();
        
        imageBase64 = await new Promise((resolve, reject) => {
          reader.onloadend = () => {
            const base64data = reader.result as string;
            // Remove the data:image/jpeg;base64, prefix if present
            const base64 = base64data.split(',')[1] || base64data;
            console.log('Base64 conversion successful, length:', base64.length);
            resolve(base64);
          };
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });
      } catch (fetchError) {
        console.error('Failed to read image as base64:', fetchError);
        throw new Error('Unable to process image for PDF generation');
      }

      console.log('Creating HTML content...');
      const html = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8" />
            <style>
              @page {
                margin: 24px;
              }
              body {
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
                padding: 0;
                margin: 0;
                color: #111;
              }
              .title {
                font-size: 24px;
                font-weight: 700;
                margin-bottom: 16px;
              }
              .photo {
                width: 100%;
                max-width: 500px;
                height: auto;
                border-radius: 8px;
                margin-bottom: 16px;
              }
              .text {
                font-size: 16px;
                line-height: 1.5;
                white-space: normal;
              }
            </style>
          </head>
          <body>
            <div class="title">Plant Identification Report</div>
            <img class="photo" src="data:image/jpeg;base64,${imageBase64}" />
            <div class="text">${escapeHtml(text)}</div>
          </body>
        </html>
      `;

      console.log('Generating PDF with expo-print...');
      // Create the PDF file
      const { uri } = await Print.printToFileAsync({
        html,
        base64: false,
      });
      
      console.log('PDF created successfully at:', uri);

      // Try sharing the PDF file directly without additional message text
      try {
        console.log('Attempting to share PDF at:', uri);
        const shareResult = await Share.share({
          url: uri,
          title: 'Plant Identification PDF',
        }, {
          dialogTitle: 'Open Plant Identification Report',
        });
        console.log('Share result:', shareResult);
      } catch (shareError) {
        console.warn('Direct share failed:', shareError);
        Alert.alert(
          'PDF Created Successfully!', 
          `Your PDF has been created and saved.\n\nFile location: ${uri}\n\nYou can find it in your Files app by navigating to the cached files or try opening it with a PDF reader app.`,
          [{ text: 'OK' }]
        );
      }

      return uri;
    } catch (error) { 
      Alert.alert('Error', 'An error occurred while creating the PDF. Please try again.');
      console.error('PDF creation error:', error);
    }
  }

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
      <View collapsable={false}>        
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
      <View style={styles.centerButtonWrapper}>
        <Button onPress={() => createAndOpenPdf({ imageUri, text: data?.response || '' })}>Export as PDF</Button>
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