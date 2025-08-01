import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, StyleSheet, Dimensions } from 'react-native';
import { getMoods, deleteMood } from '../../utils/storage'; // local storage utils
import { useFocusEffect } from 'expo-router'; 
import { format } from 'date-fns';

type Mood = {
  id: string;
  mood: string;
  date: string;
  time: string;
};

const numColumns = 2;
const screenWidth = Dimensions.get('window').width;

export default function HistoryScreen() {
  const [moods, setMoods] = useState<Mood[]>([]);

  useFocusEffect(
    React.useCallback(() => {
      const fetchMoods = async () => {
        const data = await getMoods();
        const validData = data.filter((m: Mood) => m.date && m.time && m.mood);
        setMoods(validData.reverse());
      };

      fetchMoods();
    }, [])
  );

  const handleDelete = (id: string) => {
    Alert.alert('Confirm Delete', 'Are you sure you want to delete this mood entry?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await deleteMood(id);
          setMoods(prev => prev.filter(m => m.id !== id));
        },
      },
    ]);
  };

  const renderItem = ({ item }: { item: Mood }) => {
    let readableDate = 'Invalid Date';
    try {
      const fullDateTime = new Date(`${item.date}T${item.time}`);
      if (!isNaN(fullDateTime.getTime())) {
        readableDate = format(fullDateTime, 'dd MMM yyyy, h:mm a');
      }
    } catch (error) {
      console.warn('Invalid date/time entry:', item);
    }

    return (
      <View style={styles.card}>
        <TouchableOpacity style={styles.deleteBtn} onPress={() => handleDelete(item.id)}>
          <Text style={styles.deleteText}>✖</Text>
        </TouchableOpacity>
        <Text style={styles.emoji}>{item.mood}</Text>
        <Text style={styles.date}>{readableDate}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mood History</Text>
      {moods.length === 0 ? (
        <Text style={{ textAlign: 'center', marginTop: 20 }}>No mood entries yet.</Text>
      ) : (
        <FlatList
          data={moods}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          numColumns={numColumns}
          columnWrapperStyle={styles.row}
          contentContainerStyle={{ paddingBottom: 80 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 30,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    flex: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 10,
    textAlign: 'center',
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  card: {
    backgroundColor: '#f1f1f1',
    width: screenWidth / 2 - 24,
    borderRadius: 10,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  emoji: {
    fontSize: 36,
    marginBottom: 8,
  },
  date: {
    fontSize: 13,
    color: '#444',
    textAlign: 'center',
  },
  deleteBtn: {
    position: 'absolute',
    top: 6,
    right: 6,
    padding: 4,
  },
  deleteText: {
    fontSize: 14,
    color: 'red',
  },
});
