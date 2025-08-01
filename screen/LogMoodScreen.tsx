import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { saveMood } from '../utils/storage';
import { useRouter } from 'expo-router';

const moodEmojis = ['😊', '😐', '😢', '😠', '😍'];

export default function LogMoodScreen() {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const router = useRouter();

  const handleSave = async () => {
    if (!selectedMood) {
      Alert.alert('Please select a mood emoji before saving.');
      return;
    }

    await saveMood(selectedMood);
    Alert.alert('Mood saved successfully!');
    setSelectedMood(null);
    router.push('/'); // Go back to Home
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>How are you feeling today?</Text>

      <View style={styles.emojiContainer}>
        {moodEmojis.map((emoji) => (
          <TouchableOpacity
            key={emoji}
            style={[
              styles.emojiButton,
              selectedMood === emoji && styles.selectedEmoji
            ]}
            onPress={() => setSelectedMood(emoji)}
          >
            <Text style={styles.emoji}>{emoji}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Save Mood</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    marginBottom: 20,
  },
  emojiContainer: {
    flexDirection: 'row',
    marginBottom: 30,
  },
  emojiButton: {
    padding: 10,
    marginHorizontal: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  selectedEmoji: {
    backgroundColor: '#d1e7dd',
    borderColor: '#0f5132',
  },
  emoji: {
    fontSize: 32,
  },
  saveButton: {
    backgroundColor: '#0d6efd',
    paddingHorizontal: 40,
    paddingVertical: 12,
    borderRadius: 10,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});
