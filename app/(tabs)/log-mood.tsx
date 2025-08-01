import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { saveMood } from '../../utils/storage';

// 🎭 Mood options – choose your fighter!
const moods = [
  { emoji: '😄', label: 'Happy' },
  { emoji: '😢', label: 'Sad' },
  { emoji: '😡', label: 'Angry' },
  { emoji: '😴', label: 'Sleepy' },
  { emoji: '😌', label: 'Calm' },
  { emoji: '😕', label: 'Confused' },
];

export default function LogMoodScreen() {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const router = useRouter();

  // 🧠 Save the selected mood entry
  const handleSave = async () => {
    if (!selectedMood) {
      Alert.alert('Oops!', 'Please tap on a mood before saving 😅');
      return;
    }

    const now = new Date();
    const entry = {
      id: now.getTime().toString(),
      mood: selectedMood,
      date: now.toISOString().split('T')[0],  // Format: YYYY-MM-DD
      time: now.toTimeString().split(' ')[0], // Format: HH:MM:SS
    };

    await saveMood(entry);
    router.replace('/(tabs)/history'); // ✨ Teleport to Mood History tab
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>👋 Hey! How are you feeling today?</Text>
      
      <View style={styles.emojiGrid}>
        {moods.map((item) => (
          <TouchableOpacity
            key={item.label}
            style={[
              styles.emojiButton,
              selectedMood === item.emoji && styles.selected,
            ]}
            onPress={() => setSelectedMood(item.emoji)}
          >
            <Text style={styles.emoji}>{item.emoji}</Text>
            <Text style={styles.label}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveText}>💾 Save Mood</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 20, 
    backgroundColor: '#fff', 
    justifyContent: 'center', 
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
    color: '#333',
  },
  emojiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  emojiButton: {
    width: '30%',
    padding: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 12,
    marginBottom: 15,
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
  },
  selected: {
    backgroundColor: '#e0f7fa',
    borderColor: '#00acc1',
  },
  emoji: {
    fontSize: 32,
  },
  label: {
    fontSize: 14,
    marginTop: 6,
    color: '#444',
  },
  saveButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 14,
    borderRadius: 10,
    marginTop: 10,
  },
  saveText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: 'bold',
  },
});
