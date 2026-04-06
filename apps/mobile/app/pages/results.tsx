import { useLocalSearchParams } from 'expo-router';
import { Text, View, StyleSheet, ScrollView } from 'react-native';
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { useTheme } from '../../context/theme-context';
import { Colors, Fonts } from '../../constants/theme';
import { Image } from 'expo-image';

export default function Results() {
  const { result, imageUri } = useLocalSearchParams<{ result: string, imageUri: string }>();
  const { colorScheme } = useTheme();
  const colors = Colors[colorScheme];

  // Parse the API response
  const data = result ? JSON.parse(result) : null;

  return (
    <ScrollView 
      style={[{ flex: 1, backgroundColor: colors.background }]}
      contentContainerStyle={[styles.container, { backgroundColor: colors.background }]}
    >
      <StatusBar
        backgroundColor={colors.background}
        style={colorScheme === 'dark' ? 'light' : 'dark'}
      />
      <View>        
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
            
              <Text style={[styles.textContainer, { color: '#000000', fontSize: 16 }]}>
                {data.response}
              </Text>
            
          )}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
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
  }
});