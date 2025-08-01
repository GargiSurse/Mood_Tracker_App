import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { getMoods, deleteMood } from '../../utils/storage';
import { useIsFocused } from '@react-navigation/native';
import { format } from 'date-fns';
import DateTimePicker from '@react-native-community/datetimepicker';

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
  const [allMoods, setAllMoods] = useState<Mood[]>([]);
  const isFocused = useIsFocused();

  const [fromDate, setFromDate] = useState<Date | null>(null);
  const [toDate, setToDate] = useState<Date | null>(null);
  const [showFromPicker, setShowFromPicker] = useState(false);
  const [showToPicker, setShowToPicker] = useState(false);

  // 🎣 Load all mood logs when the screen is focused
  useEffect(() => {
    const fetchMoods = async () => {
      const data = await getMoods();
      const validData = data.filter((m: Mood) => m.date && m.time && m.mood);
      setAllMoods(validData.reverse()); // reverse = most recent first
    };
    if (isFocused) fetchMoods();
  }, [isFocused]);

  // 🧹 Filter moods by selected date range
  useEffect(() => {
    const filtered = allMoods.filter((m: Mood) => {
      const entryDate = new Date(`${m.date}T${m.time}`);
      if (fromDate && entryDate < fromDate) return false;
      if (toDate && entryDate > toDate) return false;
      return true;
    });
    setMoods(filtered);
  }, [allMoods, fromDate, toDate]);

  // 🗑️ Delete a mood entry (with confirmation drama)
  const handleDelete = async (id: string) => {
    Alert.alert('🗑️ Delete Mood?', 'You sure you want to erase this moment from existence?', [
      { text: 'Nope 😅', style: 'cancel' },
      {
        text: 'Yes, Delete it 🔥',
        style: 'destructive',
        onPress: async () => {
          await deleteMood(id);
          const updated = allMoods.filter((m) => m.id !== id);
          setAllMoods(updated);
        },
      },
    ]);
  };

  // 🖼️ Mood card for each entry
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
      <Text style={styles.title}>📖 Your Mood Story</Text>

      {/* 🎯 Date Filters */}
      <View style={styles.filterRow}>
        <TouchableOpacity onPress={() => setShowFromPicker(true)}>
          <Text style={styles.filterText}>
            {fromDate ? `📅 From: ${format(fromDate, 'dd MMM yyyy')}` : '📆 Select From Date'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setShowToPicker(true)}>
          <Text style={styles.filterText}>
            {toDate ? `📅 To: ${format(toDate, 'dd MMM yyyy')}` : '📆 Select To Date'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* 🕰️ Date Pickers */}
      {showFromPicker && (
        <DateTimePicker
          value={fromDate || new Date()}
          mode="date"
          display="default"
          onChange={(event, date) => {
            setShowFromPicker(false);
            if (date) setFromDate(date);
          }}
        />
      )}

      {showToPicker && (
        <DateTimePicker
          value={toDate || new Date()}
          mode="date"
          display="default"
          onChange={(event, date) => {
            setShowToPicker(false);
            if (date) setToDate(date);
          }}
        />
      )}

      {/* 📊 Mood List */}
      {moods.length === 0 ? (
        <Text style={{ textAlign: 'center', marginTop: 20 }}>
          😶 No mood entries for this date range.
        </Text>
      ) : (
        <FlatList
          data={moods}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
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
    paddingTop: 60, // Increased from 30 to 60
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    flex: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 16, // Slightly more breathing room
    textAlign: 'center',
    color: '#333',
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
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
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
  filterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 12,
    paddingHorizontal: 10,
  },
  filterText: {
    color: '#007AFF',
    fontSize: 14,
  },
});
