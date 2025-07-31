import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { Card, Title, Text, Surface, Avatar, Button, Divider } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import * as Animatable from 'react-native-animatable';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { gameColors } from '../theme/gameTheme';

export default function LeaderboardScreen() {
  const [localStats, setLocalStats] = useState({
    bestScore: 0,
    totalGames: 0,
    totalCoins: 0,
    averageScore: 0,
  });
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadLocalStats();
  }, []);

  const loadLocalStats = async () => {
    try {
      const bestScore = await AsyncStorage.getItem('bestScore');
      const totalGames = await AsyncStorage.getItem('totalGames');
      const totalCoins = await AsyncStorage.getItem('totalCoins');
      const totalScore = await AsyncStorage.getItem('totalScore');
      
      const games = totalGames ? parseInt(totalGames) : 0;
      const score = totalScore ? parseInt(totalScore) : 0;
      
      setLocalStats({
        bestScore: bestScore ? parseInt(bestScore) : 0,
        totalGames: games,
        totalCoins: totalCoins ? parseInt(totalCoins) : 0,
        averageScore: games > 0 ? Math.round(score / games) : 0,
      });
    } catch (error) {
      console.error('Error loading local stats:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadLocalStats();
    setRefreshing(false);
  };

  const clearStats = async () => {
    try {
      await AsyncStorage.multiRemove(['bestScore', 'totalGames', 'totalCoins', 'totalScore']);
      setLocalStats({
        bestScore: 0,
        totalGames: 0,
        totalCoins: 0,
        averageScore: 0,
      });
    } catch (error) {
      console.error('Error clearing stats:', error);
    }
  };

  // Mock global leaderboard data
  const globalLeaderboard = [
    { rank: 1, name: "Temple Master", score: 25000, coins: 1250 },
    { rank: 2, name: "Speed Runner", score: 22500, coins: 1100 },
    { rank: 3, name: "Coin Collector", score: 20000, coins: 1500 },
    { rank: 4, name: "Obstacle Dodger", score: 18750, coins: 950 },
    { rank: 5, name: "Endless Explorer", score: 17500, coins: 875 },
    { rank: 6, name: "Swift Survivor", score: 16250, coins: 800 },
    { rank: 7, name: "Temple Runner", score: 15000, coins: 750 },
    { rank: 8, name: "Ancient Warrior", score: 13750, coins: 690 },
    { rank: 9, name: "Mystic Jumper", score: 12500, coins: 625 },
    { rank: 10, name: "Golden Hunter", score: 11250, coins: 560 },
  ];

  const getTrophyIcon = (rank) => {
    if (rank === 1) return { name: "trophy", color: "#ffd93d" };
    if (rank === 2) return { name: "medal", color: "#c0c0c0" };
    if (rank === 3) return { name: "medal", color: "#cd7f32" };
    return { name: "ribbon", color: "#666" };
  };

  const getPlayerRank = () => {
    const betterPlayers = globalLeaderboard.filter(player => player.score > localStats.bestScore).length;
    return betterPlayers + 1;
  };

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <LinearGradient colors={['#1a1a2e', '#16213e']} style={styles.gradient}>
        
        {/* Your Stats Card */}
        <Animatable.View animation="fadeInDown" duration={800}>
          <Card style={styles.yourStatsCard}>
            <Card.Content>
              <View style={styles.yourStatsHeader}>
                <Avatar.Icon size={60} icon="account" backgroundColor="#ff6b6b" />
                <View style={styles.yourStatsInfo}>
                  <Title style={styles.yourStatsTitle}>Your Performance</Title>
                  <Text style={styles.yourRank}>Global Rank: #{getPlayerRank()}</Text>
                </View>
              </View>
              
              <Divider style={styles.divider} />
              
              <View style={styles.statsGrid}>
                <View style={styles.statItem}>
                  <Ionicons name="trophy" size={24} color="#ffd93d" />
                  <Text style={styles.statValue}>{localStats.bestScore}</Text>
                  <Text style={styles.statLabel}>Best Score</Text>
                </View>
                
                <View style={styles.statItem}>
                  <Ionicons name="game-controller" size={24} color="#4ecdc4" />
                  <Text style={styles.statValue}>{localStats.totalGames}</Text>
                  <Text style={styles.statLabel}>Games Played</Text>
                </View>
                
                <View style={styles.statItem}>
                  <Ionicons name="diamond" size={24} color="#ff6b6b" />
                  <Text style={styles.statValue}>{localStats.totalCoins}</Text>
                  <Text style={styles.statLabel}>Total Coins</Text>
                </View>
                
                <View style={styles.statItem}>
                  <Ionicons name="analytics" size={24} color="#a55eea" />
                  <Text style={styles.statValue}>{localStats.averageScore}</Text>
                  <Text style={styles.statLabel}>Average Score</Text>
                </View>
              </View>
            </Card.Content>
          </Card>
        </Animatable.View>

        {/* Global Leaderboard */}
        <Animatable.View animation="fadeInUp" duration={800} delay={200}>
          <Surface style={styles.leaderboardCard}>
            <View style={styles.leaderboardHeader}>
              <Title style={styles.leaderboardTitle}>🏆 Global Leaderboard</Title>
              <Text style={styles.leaderboardSubtitle}>Top Temple Runners Worldwide</Text>
            </View>
            
            {globalLeaderboard.map((player, index) => {
              const trophy = getTrophyIcon(player.rank);
              const isPlayerScore = player.score <= localStats.bestScore && 
                                  (index === 0 || globalLeaderboard[index - 1].score > localStats.bestScore);
              
              return (
                <Animatable.View 
                  key={player.rank}
                  animation="fadeInLeft" 
                  duration={600} 
                  delay={index * 100}
                >
                  <View style={[
                    styles.leaderboardEntry,
                    player.rank <= 3 && styles.topThreeEntry,
                    isPlayerScore && styles.playerEntry
                  ]}>
                    <View style={styles.rankSection}>
                      <Text style={[
                        styles.rankNumber,
                        player.rank <= 3 && styles.topRankNumber
                      ]}>
                        #{player.rank}
                      </Text>
                      <Ionicons 
                        name={trophy.name} 
                        size={20} 
                        color={trophy.color} 
                      />
                    </View>
                    
                    <View style={styles.playerSection}>
                      <Text style={[
                        styles.playerName,
                        player.rank <= 3 && styles.topPlayerName
                      ]}>
                        {player.name}
                      </Text>
                      <View style={styles.playerStats}>
                        <Text style={styles.playerScore}>
                          🏃 {player.score.toLocaleString()}
                        </Text>
                        <Text style={styles.playerCoins}>
                          💎 {player.coins}
                        </Text>
                      </View>
                    </View>
                  </View>
                </Animatable.View>
              );
            })}
          </Surface>
        </Animatable.View>

        {/* Achievement Badges */}
        <Animatable.View animation="fadeInUp" duration={800} delay={400}>
          <Card style={styles.achievementsCard}>
            <Card.Content>
              <Title style={styles.achievementsTitle}>🏅 Achievements</Title>
              
              <View style={styles.achievementsGrid}>
                <View style={[
                  styles.achievement,
                  localStats.bestScore > 1000 && styles.achievementUnlocked
                ]}>
                  <Ionicons 
                    name="ribbon" 
                    size={30} 
                    color={localStats.bestScore > 1000 ? "#ffd93d" : "#666"} 
                  />
                  <Text style={styles.achievementText}>First Runner</Text>
                  <Text style={styles.achievementDesc}>Score 1,000+</Text>
                </View>
                
                <View style={[
                  styles.achievement,
                  localStats.bestScore > 5000 && styles.achievementUnlocked
                ]}>
                  <Ionicons 
                    name="medal" 
                    size={30} 
                    color={localStats.bestScore > 5000 ? "#c0c0c0" : "#666"} 
                  />
                  <Text style={styles.achievementText}>Speed Demon</Text>
                  <Text style={styles.achievementDesc}>Score 5,000+</Text>
                </View>
                
                <View style={[
                  styles.achievement,
                  localStats.bestScore > 10000 && styles.achievementUnlocked
                ]}>
                  <Ionicons 
                    name="trophy" 
                    size={30} 
                    color={localStats.bestScore > 10000 ? "#ffd93d" : "#666"} 
                  />
                  <Text style={styles.achievementText}>Temple Master</Text>
                  <Text style={styles.achievementDesc}>Score 10,000+</Text>
                </View>
                
                <View style={[
                  styles.achievement,
                  localStats.totalCoins > 100 && styles.achievementUnlocked
                ]}>
                  <Ionicons 
                    name="diamond" 
                    size={30} 
                    color={localStats.totalCoins > 100 ? "#ff6b6b" : "#666"} 
                  />
                  <Text style={styles.achievementText}>Coin Collector</Text>
                  <Text style={styles.achievementDesc}>Collect 100+ coins</Text>
                </View>
              </View>
            </Card.Content>
          </Card>
        </Animatable.View>

        {/* Reset Stats Button */}
        <Animatable.View animation="fadeInUp" duration={800} delay={600}>
          <Button
            mode="outlined"
            style={styles.resetButton}
            onPress={clearStats}
            icon="refresh"
          >
            Reset All Stats
          </Button>
        </Animatable.View>

      </LinearGradient>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    minHeight: '100%',
    padding: 20,
  },
  yourStatsCard: {
    backgroundColor: 'rgba(22, 33, 62, 0.9)',
    marginBottom: 20,
    elevation: 8,
  },
  yourStatsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  yourStatsInfo: {
    marginLeft: 15,
    flex: 1,
  },
  yourStatsTitle: {
    color: '#fff',
    fontSize: 20,
  },
  yourRank: {
    color: '#4ecdc4',
    fontSize: 16,
    fontWeight: 'bold',
  },
  divider: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginBottom: 20,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
    width: '48%',
    marginBottom: 15,
  },
  statValue: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 8,
  },
  statLabel: {
    color: '#ccc',
    fontSize: 12,
    marginTop: 4,
  },
  leaderboardCard: {
    backgroundColor: 'rgba(22, 33, 62, 0.9)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    elevation: 8,
  },
  leaderboardHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  leaderboardTitle: {
    color: '#fff',
    fontSize: 22,
    textAlign: 'center',
  },
  leaderboardSubtitle: {
    color: '#ccc',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 5,
  },
  leaderboardEntry: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginVertical: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 8,
  },
  topThreeEntry: {
    backgroundColor: 'rgba(255, 215, 61, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 61, 0.3)',
  },
  playerEntry: {
    backgroundColor: 'rgba(255, 107, 107, 0.2)',
    borderWidth: 2,
    borderColor: '#ff6b6b',
  },
  rankSection: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 60,
  },
  rankNumber: {
    color: '#ccc',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 8,
  },
  topRankNumber: {
    color: '#ffd93d',
  },
  playerSection: {
    flex: 1,
    marginLeft: 10,
  },
  playerName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  topPlayerName: {
    color: '#ffd93d',
  },
  playerStats: {
    flexDirection: 'row',
    marginTop: 4,
  },
  playerScore: {
    color: '#4ecdc4',
    fontSize: 14,
    marginRight: 15,
  },
  playerCoins: {
    color: '#ff6b6b',
    fontSize: 14,
  },
  achievementsCard: {
    backgroundColor: 'rgba(22, 33, 62, 0.9)',
    marginBottom: 20,
  },
  achievementsTitle: {
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20,
  },
  achievementsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  achievement: {
    width: '48%',
    alignItems: 'center',
    padding: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    marginBottom: 10,
  },
  achievementUnlocked: {
    backgroundColor: 'rgba(255, 215, 61, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 61, 0.3)',
  },
  achievementText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 8,
  },
  achievementDesc: {
    color: '#ccc',
    fontSize: 10,
    textAlign: 'center',
    marginTop: 4,
  },
  resetButton: {
    borderColor: '#ff6b6b',
    marginBottom: 20,
  },
});