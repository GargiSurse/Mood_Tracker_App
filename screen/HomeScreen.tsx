// app/home.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';

const HomeScreen = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <Text style={styles.header}>Mood Tracker Dashboard</Text>

      <TouchableOpacity style={styles.button} onPress={() => router.push('/logMood')}>
        <Text style={styles.buttonText}>😊 LOG MOOD</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => router.push('/history')}>
        <Text style={styles.buttonText}>📜 VIEW HISTORY</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => router.push('/stats')}>
        <Text style={styles.buttonText}>📊 VIEW STATS</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, { backgroundColor: '#ff4d4d' }]} onPress={() => router.push('/login')}>
        <Text style={styles.buttonText}>🚪 LOGOUT</Text>
      </TouchableOpacity>

      <View style={styles.emojiRow}>
        <Text style={styles.emoji}>🥰 😐 😔 😡 🤩</Text>
      </View>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f1f1',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 30, // reduced top space
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#333',
  },
  button: {
    backgroundColor: '#1e90ff',
    paddingVertical: 14,
    paddingHorizontal: 24,
    marginVertical: 10,
    borderRadius: 12,
    width: '80%',
    alignItems: 'center',
    elevation: 3, // shadow for Android
    shadowColor: '#000', // shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  emojiRow: {
    marginTop: 30,
  },
  emoji: {
    fontSize: 24,
  },
});
