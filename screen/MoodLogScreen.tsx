import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { saveMood } from '../utils/storage';

const moods = [
  { emoji: '😊', mood: 'Happy' },
  { emoji: '😢', mood: 'Sad' },
  { emoji: '😠', mood: 'Angry' },
  { emoji: '😐', mood: 'Neutral' },
  { emoji: '😴', mood: 'Tired' },
];

export default function LogMoodScreen() {
  const router = useRouter();
  const [selectedMood, setSelectedMood] = useState(null);

  const handleSave = async () => {
    if (!selectedMood) {
      Alert.alert('Please select a mood!');
      return;
    }

    const moodEntry = {
      id: Date.now().toString(),
      mood: selectedMood.mood,
      emoji: selectedMood.emoji,
      date: new Date().toISOString().split('T')[0],
    };

    await saveMood(moodEntry);
    Alert.alert('Mood saved!');
    router.replace('/home');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>How are you feeling today?</Text>
      <View style={styles.emojiContainer}>
        {moods.map((item) => (
          <TouchableOpacity
            key={item.mood}
            style={[
              styles.emojiButton,
              selectedMood?.mood === item.mood && styles.selected,
            ]}
            onPress={() => setSelectedMood(item)}
          >
            <Text style={styles.emoji}>{item.emoji}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveText}>Save Mood</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 },
  title: { fontSize: 24, marginBottom: 20 },
  emojiContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' },
  emojiButton: {
    padding: 10,
    margin: 10,
    borderRadius: 10,
    backgroundColor: '#eee',
  },
  selected: {
    backgroundColor: '#add8e6',
  },
  emoji: { fontSize: 32 },
  saveButton: {
    marginTop: 30,
    backgroundColor: '#3b82f6',
    padding: 15,
    borderRadius: 10,
  },
  saveText: { color: 'white', fontSize: 16 },
});
// screens/MoodLogScreen.tsx
import { useFocusEffect } from '@react-navigation/native';
import { signOut } from 'firebase/auth';
import React, { useCallback } from 'react';
import { ActivityIndicator, Button } from 'react-native';
import { auth } from '../firebaseConfig';
import { MoodTrackerNavigationProp } from '../types'; // Import navigation type
import { getMoods, MoodEntry } from '../utils/storage'; // Import MoodEntry type

interface MoodLogScreenProps {
  navigation: MoodTrackerNavigationProp<'MoodLog'>; // Type navigation prop
}

const MoodLogScreen: React.FC<MoodLogScreenProps> = ({ navigation }) => {
  const [todayMood, setTodayMood] = useState<MoodEntry | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchTodayMood = async () => {
    setIsLoading(true);
    const moods: MoodEntry[] = await getMoods();
    const today: string = new Date().toISOString().slice(0, 10);
    const foundMood: MoodEntry | undefined = moods.find(mood => mood.date === today);
    setTodayMood(foundMood || null);
    setIsLoading(false);
  };

  // Use useFocusEffect to refetch data when the screen comes into focus
  useFocusEffect(
    useCallback(() => {
      fetchTodayMood();
    }, [])
  );

  const handleLogout = async () => {
    try {
      await signOut(auth);
      Alert.alert('Logged Out', 'You have been logged out.');
      // The App.tsx `onAuthStateChanged` listener will handle navigation
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Today's Mood</Text>
      {todayMood ? (
        <View style={styles.moodDisplay}>
          <Text style={styles.moodEmoji}>{todayMood.mood}</Text>
          <Text style={styles.moodNote}>{todayMood.note || 'No note'}</Text>
        </View>
      ) : (
        <Text style={styles.noMoodText}>No mood logged for today yet.</Text>
      )}

      <View style={styles.buttonContainer}>
        <Button
          title={todayMood ? "Update Today's Mood" : "Log Today's Mood"}
          onPress={() => navigation.navigate('LogMood')}
          color="#6200EE"
        />
        <Button
          title="View Mood History"
          onPress={() => navigation.navigate('MoodHistory')}
          color="#03DAC6"
        />
        <Button
          title="View Mood Statistics"
          onPress={() => navigation.navigate('MoodStats')}
          color="#BB86FC"
        />
        <Button
          title="Logout"
          onPress={handleLogout}
          color="#CF6679"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#333',
  },
  moodDisplay: {
    backgroundColor: '#fff',
    padding: 25,
    borderRadius: 15,
    alignItems: 'center',
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  moodEmoji: {
    fontSize: 80,
    marginBottom: 10,
  },
  moodNote: {
    fontSize: 18,
    color: '#555',
    textAlign: 'center',
  },
  noMoodText: {
    fontSize: 18,
    color: '#777',
    marginBottom: 40,
  },
  buttonContainer: {
    width: '100%',
    gap: 15, // spacing between buttons
  },
});

export default MoodLogScreen;