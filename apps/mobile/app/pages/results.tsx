import { useLocalSearchParams } from 'expo-router';
import { Text, View, StyleSheet } from 'react-native';
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { useTheme } from '../../context/theme-context';
import { Colors } from '../../constants/theme';

export default function Results() {
  const { result } = useLocalSearchParams<{ result: string }>();
  const { colorScheme } = useTheme();
  const colors = Colors[colorScheme];

  // Parse the API response
  const data = result ? JSON.parse(result) : null;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar
        backgroundColor={colors.background}
        style={colorScheme === 'dark' ? 'light' : 'dark'}
      />
      <Text style={{ color: colors.text }}>Plant Identification Results</Text>
      {data && (
        <View style={{ margin: 20, padding: 15, backgroundColor: colors.background }}>
          <Text style={{ color: colors.text, fontSize: 16 }}>
            {data.response}
          </Text>
        </View>
      )}
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
});