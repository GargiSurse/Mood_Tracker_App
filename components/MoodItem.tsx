import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface MoodItemProps {
  mood: string;
  timestamp: string;
}

export default function MoodItem({ mood, timestamp }: MoodItemProps) {
  return (
    <View>
      <Text style={styles.mood}>{mood}</Text>
      <Text style={styles.time}>{new Date(timestamp).toLocaleString()}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  mood: { fontSize: 22 },
  time: { color: '#888' },
});
