import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView, StatusBar } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { getMoods } from '../../utils/storage';
import { useFocusEffect } from '@react-navigation/native'; 

type MoodEntry = {
  id: string;
  mood: string; 
  date: string;
};

export default function StatsScreen() {
  const [moodCounts, setMoodCounts] = useState<{ [mood: string]: number }>({});
  const [totalMoods, setTotalMoods] = useState(0);

  const loadData = async () => {
    const moods: MoodEntry[] = await getMoods();
    const counts: { [mood: string]: number } = {};

    moods.forEach(entry => {
      counts[entry.mood] = (counts[entry.mood] || 0) + 1;
    });

    setMoodCounts(counts);
    setTotalMoods(moods.length);
  };

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const moodLabels = Object.keys(moodCounts);
  const moodData = Object.values(moodCounts);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <StatusBar backgroundColor="#f5f5f5" barStyle="dark-content" />
      <Text style={styles.title}>📊 Mood Stats</Text>

      {totalMoods > 0 && (
        <Text style={styles.totalText}>Total Entries: {totalMoods}</Text>
      )}

      {moodLabels.length === 0 ? (
        <Text style={styles.noDataText}>No mood data available yet.</Text>
      ) : (
        <BarChart
          data={{
            labels: moodLabels,
            datasets: [{ data: moodData }],
          }}
          width={Dimensions.get('window').width - 40}
          height={280}
          yAxisLabel=""
          fromZero
          chartConfig={{
            backgroundGradientFrom: '#ffffff',
            backgroundGradientTo: '#ffffff',
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(76, 175, 80, ${opacity})`,
            labelColor: () => '#000',
            barPercentage: 0.6,
            propsForBackgroundLines: {
              strokeDasharray: '',
            },
          }}
          style={{
            marginVertical: 20,
            borderRadius: 12,
          }}
        />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 60,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    flex: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
    color: '#333',
  },
  totalText: {
    fontSize: 16,
    color: '#444',
    marginBottom: 10,
  },
  noDataText: {
    fontSize: 16,
    color: '#777',
    marginTop: 40,
    textAlign: 'center',
  },
});
