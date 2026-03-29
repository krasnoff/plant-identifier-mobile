import { useRouter } from 'expo-router';
import { Text, View, StyleSheet, Pressable } from 'react-native';
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { useTheme } from '../../context/theme-context';
import { Colors } from '../../constants/theme';

export default function Search() {
  const router = useRouter();
  const { colorScheme } = useTheme();
  const colors = Colors[colorScheme];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar
        backgroundColor={colors.background}
        style={colorScheme === 'dark' ? 'light' : 'dark'}
      />
      <Text style={{ color: colors.text }}>search view</Text>
      <Pressable
        style={[styles.button, { backgroundColor: colors.tint }]}
        onPress={() => router.push('/pages/results')}>
        <Text style={[styles.buttonText, { color: colors.background }]}>Go To Results</Text>
      </Pressable>
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
  button: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});