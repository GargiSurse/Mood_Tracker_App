// utils/storage.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

export type MoodEntry = {
  id: string;
  mood: string;
  date: string; // ISO date
  time: string; // ISO time
};

// Save a mood
export const saveMood = async (entry: MoodEntry) => {
  try {
    const stored = await AsyncStorage.getItem('moods');
    const current = stored ? JSON.parse(stored) : [];

    // Add time if not included
    const now = new Date();
    const entryWithTime = {
      ...entry,
      time: now.toTimeString().split(' ')[0], // HH:mm:ss
    };

    const updated = [...current, entryWithTime];
    await AsyncStorage.setItem('moods', JSON.stringify(updated));
  } catch (err) {
    console.error('Error saving mood:', err);
  }
};

// Get all moods
export const getMoods = async (): Promise<MoodEntry[]> => {
  try {
    const stored = await AsyncStorage.getItem('moods');
    return stored ? JSON.parse(stored) : [];
  } catch (err) {
    console.error('Error loading moods:', err);
    return [];
  }
};

// Delete mood by ID
export const deleteMood = async (id: string) => {
  try {
    const moods = await getMoods();
    const filtered = moods.filter((m) => m.id !== id);
    await AsyncStorage.setItem('moods', JSON.stringify(filtered));
  } catch (err) {
    console.error('Error deleting mood:', err);
  }
};
