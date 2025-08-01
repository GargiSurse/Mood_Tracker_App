
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView, Dimensions } from 'react-native';
import { getMoods, MoodEntry } from '../utils/storage';
import { BarChart } from 'react-native-chart-kit';

const MoodStatsScreen: React.FC = () => {
  const [moodCounts, setMoodCounts] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMoodStats = async () => {
      setIsLoading(true);
      const moods: MoodEntry[] = await getMoods();

      const counts: Record<string, number> = moods.reduce((acc, mood) => {
        acc[mood.mood] = (acc[mood.mood] || 0) + 1;
        return acc;
      }, {});

      setMoodCounts(counts);
      setIsLoading(false);
    };

    fetchMoodStats();
  }, []);

  const chartData = {
    labels: Object.keys(moodCounts),
    datasets: [{ data: Object.values(moodCounts) }],
  };

  const chartConfig = {
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(66, 135, 245, ${opacity})`,
    labelColor: () => '#333',
    style: {
      borderRadius: 16,
    },
    barPercentage: 0.7,
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Mood Statistics</Text>

      {Object.keys(moodCounts).length === 0 ? (
        <Text style={styles.noStatsText}>No moods logged to show statistics.</Text>
      ) : (
        <>
          <View style={styles.statsContainer}>
            {Object.entries(moodCounts).map(([mood, count]) => (
              <View key={mood} style={styles.statItem}>
                <Text style={styles.statEmoji}>{mood}</Text>
                <Text style={styles.statCount}>{count} time(s)</Text>
              </View>
            ))}
          </View>

          <BarChart
            data={chartData}
            width={Dimensions.get('window').width - 32}
            height={250}
            yAxisLabel=""
            chartConfig={chartConfig}
            style={styles.chartStyle}
            fromZero
            showValuesOnTopOfBars
          />
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f4f4f4',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 20,
    color: '#222',
  },
  statsContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  statItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  statEmoji: {
    fontSize: 30,
  },
  statCount: {
    fontSize: 16,
    color: '#555',
  },
  chartStyle: {
    marginVertical: 10,
    borderRadius: 16,
    alignSelf: 'center',
  },
  noStatsText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 40,
  },
});

export default MoodStatsScreen;
