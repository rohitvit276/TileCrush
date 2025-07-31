import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, FlatList, Dimensions } from 'react-native';
import { Card, Title, Text, Surface, Button, Avatar, Chip, FAB } from 'react-native-paper';
import { LineChart, PieChart } from 'react-native-chart-kit';
import { Ionicons } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { moodColors } from '../theme/theme';

const { width } = Dimensions.get('window');

export default function MoodHistoryScreen({ navigation }) {
  const [moodHistory, setMoodHistory] = useState([]);
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'charts'
  const [timeFilter, setTimeFilter] = useState('week'); // 'week', 'month', 'all'

  useFocusEffect(
    useCallback(() => {
      loadMoodHistory();
    }, [])
  );

  const loadMoodHistory = async () => {
    try {
      const history = await AsyncStorage.getItem('moodHistory');
      if (history) {
        const parsedHistory = JSON.parse(history);
        setMoodHistory(parsedHistory.reverse()); // Show most recent first
      }
    } catch (error) {
      console.error('Error loading mood history:', error);
    }
  };

  const clearHistory = async () => {
    try {
      await AsyncStorage.removeItem('moodHistory');
      setMoodHistory([]);
    } catch (error) {
      console.error('Error clearing history:', error);
    }
  };

  const getFilteredHistory = () => {
    const now = new Date();
    let cutoffDate;

    switch (timeFilter) {
      case 'week':
        cutoffDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        cutoffDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      default:
        return moodHistory;
    }

    return moodHistory.filter(item => new Date(item.timestamp) >= cutoffDate);
  };

  const getMoodStats = () => {
    const filteredHistory = getFilteredHistory();
    const moodCounts = {};
    
    filteredHistory.forEach(item => {
      moodCounts[item.mood] = (moodCounts[item.mood] || 0) + 1;
    });

    return Object.entries(moodCounts).map(([mood, count]) => ({
      name: mood.charAt(0).toUpperCase() + mood.slice(1),
      population: count,
      color: moodColors[mood] || moodColors.neutral,
      legendFontColor: '#333',
      legendFontSize: 12,
    }));
  };

  const getMoodTrend = () => {
    const filteredHistory = getFilteredHistory().slice(-7); // Last 7 entries
    const moodScores = {
      happy: 5, excited: 4, energetic: 4, peaceful: 3, calm: 3,
      neutral: 2, anxious: 1, sad: 0, angry: 0, frustrated: 0
    };

    const trendData = filteredHistory.map((item, index) => ({
      day: index + 1,
      score: moodScores[item.mood] || 2,
    }));

    return trendData;
  };

  const renderHistoryItem = ({ item, index }) => (
    <Animatable.View animation="fadeInUp" delay={index * 50}>
      <Card style={styles.historyCard}>
        <Card.Content>
          <View style={styles.historyHeader}>
            <Avatar.Icon 
              size={50} 
              icon="emoticon-outline" 
              style={{ backgroundColor: moodColors[item.mood] }}
            />
            <View style={styles.historyInfo}>
              <View style={styles.historyTitleRow}>
                <Title style={styles.historyMood}>
                  {item.mood.charAt(0).toUpperCase() + item.mood.slice(1)}
                </Title>
                <Chip 
                  style={styles.confidenceChip}
                  textStyle={styles.confidenceText}
                >
                  {item.confidence}%
                </Chip>
              </View>
              <Text style={styles.historyDate}>
                {new Date(item.timestamp).toLocaleDateString('en-US', {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </Text>
              <Text style={styles.detectionMethod}>
                Detected via {item.method === 'photo' ? 'Photo Analysis' : 'Voice Analysis'}
              </Text>
            </View>
          </View>
        </Card.Content>
      </Card>
    </Animatable.View>
  );

  const renderTimeFilters = () => (
    <Surface style={styles.filterContainer}>
      <View style={styles.filterButtons}>
        {['week', 'month', 'all'].map((filter) => (
          <Button
            key={filter}
            mode={timeFilter === filter ? 'contained' : 'outlined'}
            onPress={() => setTimeFilter(filter)}
            style={styles.filterButton}
            compact
          >
            {filter === 'week' ? 'This Week' : filter === 'month' ? 'This Month' : 'All Time'}
          </Button>
        ))}
      </View>
    </Surface>
  );

  const renderCharts = () => {
    const moodStats = getMoodStats();
    const trendData = getMoodTrend();

    if (moodStats.length === 0) {
      return (
        <View style={styles.emptyCharts}>
          <Ionicons name="analytics-outline" size={64} color="#ccc" />
          <Text style={styles.emptyText}>No mood data available for charts</Text>
          <Button mode="contained" onPress={() => navigation.navigate('Detect Mood')}>
            Start Tracking Your Mood
          </Button>
        </View>
      );
    }

    return (
      <View style={styles.chartsContainer}>
        <Card style={styles.chartCard}>
          <Card.Content>
            <Title style={styles.chartTitle}>Mood Distribution</Title>
            <PieChart
              data={moodStats}
              width={width - 80}
              height={220}
              chartConfig={{
                color: (opacity = 1) => `rgba(99, 102, 241, ${opacity})`,
              }}
              accessor="population"
              backgroundColor="transparent"
              paddingLeft="15"
              absolute
            />
          </Card.Content>
        </Card>

        {trendData.length > 1 && (
          <Card style={styles.chartCard}>
            <Card.Content>
              <Title style={styles.chartTitle}>Mood Trend (Last 7 Sessions)</Title>
              <LineChart
                data={{
                  labels: trendData.map(d => `${d.day}`),
                  datasets: [{
                    data: trendData.map(d => d.score),
                    strokeWidth: 3,
                  }]
                }}
                width={width - 80}
                height={220}
                chartConfig={{
                  backgroundColor: '#ffffff',
                  backgroundGradientFrom: '#ffffff',
                  backgroundGradientTo: '#ffffff',
                  decimalPlaces: 0,
                  color: (opacity = 1) => `rgba(99, 102, 241, ${opacity})`,
                  style: {
                    borderRadius: 16
                  }
                }}
                bezier
                style={styles.chart}
              />
              <View style={styles.trendLegend}>
                <Text style={styles.legendText}>0: Negative • 2: Neutral • 5: Positive</Text>
              </View>
            </Card.Content>
          </Card>
        )}
      </View>
    );
  };

  const filteredHistory = getFilteredHistory();

  return (
    <View style={styles.container}>
      {renderTimeFilters()}
      
      <Surface style={styles.viewToggle}>
        <Button
          mode={viewMode === 'list' ? 'contained' : 'outlined'}
          icon="format-list-bulleted"
          onPress={() => setViewMode('list')}
          style={styles.toggleButton}
          compact
        >
          List
        </Button>
        <Button
          mode={viewMode === 'charts' ? 'contained' : 'outlined'}
          icon="chart-pie"
          onPress={() => setViewMode('charts')}
          style={styles.toggleButton}
          compact
        >
          Charts
        </Button>
      </Surface>

      {viewMode === 'list' ? (
        <View style={styles.listContainer}>
          <View style={styles.listHeader}>
            <Title style={styles.sectionTitle}>
              Mood History ({filteredHistory.length} entries)
            </Title>
            {moodHistory.length > 0 && (
              <Button mode="text" onPress={clearHistory} textColor="#ef4444">
                Clear All
              </Button>
            )}
          </View>

          <FlatList
            data={filteredHistory}
            renderItem={renderHistoryItem}
            keyExtractor={(item, index) => `${item.timestamp}-${index}`}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.historyList}
            ListEmptyComponent={
              <View style={styles.emptyState}>
                <Ionicons name="time-outline" size={64} color="#ccc" />
                <Text style={styles.emptyText}>No mood history yet</Text>
                <Text style={styles.emptySubtext}>
                  Start detecting your mood to see your history here
                </Text>
                <Button 
                  mode="contained" 
                  onPress={() => navigation.navigate('Detect Mood')}
                  style={styles.emptyButton}
                >
                  Detect Your Mood
                </Button>
              </View>
            }
          />
        </View>
      ) : (
        renderCharts()
      )}

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => navigation.navigate('Detect Mood')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafafa',
  },
  filterContainer: {
    margin: 20,
    marginBottom: 10,
    padding: 15,
    borderRadius: 12,
    elevation: 2,
  },
  filterButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: 10,
  },
  filterButton: {
    flex: 1,
  },
  viewToggle: {
    marginHorizontal: 20,
    marginBottom: 10,
    padding: 10,
    borderRadius: 12,
    elevation: 2,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
  },
  toggleButton: {
    flex: 1,
  },
  listContainer: {
    flex: 1,
    marginHorizontal: 20,
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
  },
  historyList: {
    paddingBottom: 100,
  },
  historyCard: {
    marginBottom: 12,
    elevation: 2,
    borderRadius: 12,
  },
  historyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  historyInfo: {
    marginLeft: 15,
    flex: 1,
  },
  historyTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  historyMood: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  confidenceChip: {
    backgroundColor: '#e0e7ff',
  },
  confidenceText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  historyDate: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  detectionMethod: {
    fontSize: 12,
    color: '#888',
  },
  chartsContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  chartCard: {
    marginBottom: 20,
    elevation: 4,
    borderRadius: 12,
  },
  chartTitle: {
    textAlign: 'center',
    marginBottom: 15,
    fontSize: 18,
  },
  chart: {
    borderRadius: 16,
  },
  trendLegend: {
    marginTop: 10,
    alignItems: 'center',
  },
  legendText: {
    fontSize: 12,
    color: '#666',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyCharts: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#888',
    marginBottom: 20,
    textAlign: 'center',
    lineHeight: 20,
  },
  emptyButton: {
    marginTop: 10,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#6366f1',
  },
});