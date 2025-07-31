import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default function LeaderboardScreen() {
  const [gameStats, setGameStats] = useState({
    gamesPlayed: 0,
    highScore: 0,
    totalMatches: 0,
    totalRocksCrushed: 0,
    averageScore: 0,
    bestStreak: 0,
  });

  const [achievements, setAchievements] = useState([
    { id: 1, title: 'First Crush', description: 'Complete your first match', unlocked: false, icon: 'play-circle-filled' },
    { id: 2, title: 'Rock Crusher', description: 'Crush 100 rocks', unlocked: false, icon: 'gesture' },
    { id: 3, title: 'Score Master', description: 'Score 1000 points in a game', unlocked: false, icon: 'star' },
    { id: 4, title: 'Combo King', description: 'Get a 5+ rock combo', unlocked: false, icon: 'timeline' },
    { id: 5, title: 'High Achiever', description: 'Score 2500 points', unlocked: false, icon: 'emoji-events' },
    { id: 6, title: 'Rock Legend', description: 'Play 50 games', unlocked: false, icon: 'diamond' },
  ]);

  useEffect(() => {
    loadGameStats();
  }, []);

  const loadGameStats = async () => {
    try {
      const stats = await AsyncStorage.getItem('rockCrushStats');
      const highScore = await AsyncStorage.getItem('rockCrushHighScore');
      
      if (stats) {
        const parsedStats = JSON.parse(stats);
        if (highScore) {
          parsedStats.highScore = parseInt(highScore);
        }
        setGameStats(parsedStats);
        updateAchievements(parsedStats);
      } else {
        // Initialize default stats
        const defaultStats = {
          gamesPlayed: 0,
          highScore: parseInt(highScore) || 0,
          totalMatches: 0,
          totalRocksCrushed: 0,
          averageScore: 0,
          bestStreak: 0,
        };
        setGameStats(defaultStats);
      }
    } catch (error) {
      console.log('Error loading game stats:', error);
    }
  };

  const updateAchievements = (stats) => {
    setAchievements(prev => prev.map(achievement => {
      switch (achievement.id) {
        case 1: // First Crush
          return { ...achievement, unlocked: stats.gamesPlayed > 0 };
        case 2: // Rock Crusher
          return { ...achievement, unlocked: stats.totalRocksCrushed >= 100 };
        case 3: // Score Master
          return { ...achievement, unlocked: stats.highScore >= 1000 };
        case 4: // Combo King
          return { ...achievement, unlocked: stats.bestStreak >= 5 };
        case 5: // High Achiever
          return { ...achievement, unlocked: stats.highScore >= 2500 };
        case 6: // Rock Legend
          return { ...achievement, unlocked: stats.gamesPlayed >= 50 };
        default:
          return achievement;
      }
    }));
  };

  const resetStats = () => {
    Alert.alert(
      'Reset Statistics',
      'Are you sure you want to reset all game statistics? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.removeItem('rockCrushStats');
              await AsyncStorage.removeItem('rockCrushHighScore');
              setGameStats({
                gamesPlayed: 0,
                highScore: 0,
                totalMatches: 0,
                totalRocksCrushed: 0,
                averageScore: 0,
                bestStreak: 0,
              });
              setAchievements(prev => prev.map(achievement => ({ ...achievement, unlocked: false })));
              Alert.alert('Success', 'All statistics have been reset.');
            } catch (error) {
              Alert.alert('Error', 'Failed to reset statistics.');
            }
          },
        },
      ]
    );
  };

  const renderStatCard = (title, value, icon, color = '#ff6b6b') => (
    <View style={[styles.statCard, { borderLeftColor: color }]}>
      <View style={styles.statHeader}>
        <Icon name={icon} size={24} color={color} />
        <Text style={styles.statTitle}>{title}</Text>
      </View>
      <Text style={styles.statValue}>{value}</Text>
    </View>
  );

  const renderAchievement = (achievement) => (
    <View
      key={achievement.id}
      style={[
        styles.achievementCard,
        { opacity: achievement.unlocked ? 1 : 0.5 }
      ]}
    >
      <View style={styles.achievementIcon}>
        <Icon
          name={achievement.icon}
          size={30}
          color={achievement.unlocked ? '#ffd93d' : '#666'}
        />
      </View>
      <View style={styles.achievementInfo}>
        <Text style={[styles.achievementTitle, { color: achievement.unlocked ? '#fff' : '#666' }]}>
          {achievement.title}
        </Text>
        <Text style={[styles.achievementDescription, { color: achievement.unlocked ? '#ccc' : '#555' }]}>
          {achievement.description}
        </Text>
      </View>
      {achievement.unlocked && (
        <Icon name="check-circle" size={24} color="#4CAF50" />
      )}
    </View>
  );

  return (
    <LinearGradient colors={['#1a1a2e', '#16213e']} style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Game Statistics</Text>
          <Text style={styles.subtitle}>Track your Rock Crush progress</Text>
        </View>

        <View style={styles.statsGrid}>
          {renderStatCard('Games Played', gameStats.gamesPlayed.toString(), 'play-circle-filled', '#ff6b6b')}
          {renderStatCard('High Score', gameStats.highScore.toLocaleString(), 'star', '#ffd93d')}
          {renderStatCard('Total Matches', gameStats.totalMatches.toString(), 'group-work', '#4CAF50')}
          {renderStatCard('Rocks Crushed', gameStats.totalRocksCrushed.toLocaleString(), 'gesture', '#2196F3')}
          {renderStatCard('Average Score', Math.round(gameStats.averageScore).toString(), 'trending-up', '#9C27B0')}
          {renderStatCard('Best Streak', gameStats.bestStreak.toString(), 'timeline', '#FF9800')}
        </View>

        <View style={styles.achievementsSection}>
          <Text style={styles.sectionTitle}>Achievements</Text>
          <View style={styles.achievementsList}>
            {achievements.map(renderAchievement)}
          </View>
        </View>

        <View style={styles.actionsSection}>
          <TouchableOpacity style={styles.resetButton} onPress={resetStats}>
            <Icon name="refresh" size={20} color="#fff" />
            <Text style={styles.resetButtonText}>Reset Statistics</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    padding: 20,
  },
  header: {
    marginBottom: 30,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#ccc',
    textAlign: 'center',
  },
  statsGrid: {
    marginBottom: 30,
  },
  statCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  statTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginLeft: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  achievementsSection: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ff6b6b',
    marginBottom: 15,
  },
  achievementsList: {
    // No additional styles needed
  },
  achievementCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  achievementIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  achievementInfo: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  achievementDescription: {
    fontSize: 14,
  },
  actionsSection: {
    marginBottom: 30,
  },
  resetButton: {
    backgroundColor: '#dc3545',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
  },
  resetButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});