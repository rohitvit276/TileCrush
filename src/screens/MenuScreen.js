import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ImageBackground, Dimensions } from 'react-native';
import { Card, Title, Text, Button, Surface, Avatar } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import * as Animatable from 'react-native-animatable';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { gameColors } from '../theme/gameTheme';

const { width, height } = Dimensions.get('window');

export default function MenuScreen({ navigation }) {
  const [bestScore, setBestScore] = useState(0);
  const [totalGames, setTotalGames] = useState(0);
  const [totalCoins, setTotalCoins] = useState(0);

  useEffect(() => {
    loadGameStats();
  }, []);

  const loadGameStats = async () => {
    try {
      const score = await AsyncStorage.getItem('bestScore');
      const games = await AsyncStorage.getItem('totalGames');
      const coins = await AsyncStorage.getItem('totalCoins');
      
      setBestScore(score ? parseInt(score) : 0);
      setTotalGames(games ? parseInt(games) : 0);
      setTotalCoins(coins ? parseInt(coins) : 0);
    } catch (error) {
      console.error('Error loading game stats:', error);
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#1a1a2e', '#16213e', '#0f3460']}
        style={styles.gradient}
      >
        {/* Background Temple Elements */}
        <View style={styles.backgroundElements}>
          <Animatable.View 
            animation="pulse" 
            iterationCount="infinite" 
            duration={3000}
            style={styles.templeIcon}
          >
            <Ionicons name="library-outline" size={100} color="rgba(255, 107, 107, 0.2)" />
          </Animatable.View>
        </View>

        {/* Game Title */}
        <Animatable.View animation="fadeInDown" duration={1500} style={styles.titleContainer}>
          <Text style={styles.gameTitle}>TEMPLE</Text>
          <Text style={styles.gameTitleAccent}>RUNNER</Text>
          <Text style={styles.subtitle}>Endless Adventure Awaits</Text>
        </Animatable.View>

        {/* Game Stats */}
        <Animatable.View animation="fadeInUp" duration={1000} delay={500}>
          <Surface style={styles.statsCard}>
            <Title style={styles.statsTitle}>Your Stats</Title>
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Ionicons name="trophy" size={32} color="#ffd93d" />
                <Text style={styles.statNumber}>{bestScore}</Text>
                <Text style={styles.statLabel}>Best Score</Text>
              </View>
              <View style={styles.statItem}>
                <Ionicons name="game-controller" size={32} color="#4ecdc4" />
                <Text style={styles.statNumber}>{totalGames}</Text>
                <Text style={styles.statLabel}>Games Played</Text>
              </View>
              <View style={styles.statItem}>
                <Ionicons name="diamond" size={32} color="#ff6b6b" />
                <Text style={styles.statNumber}>{totalCoins}</Text>
                <Text style={styles.statLabel}>Coins Collected</Text>
              </View>
            </View>
          </Surface>
        </Animatable.View>

        {/* Main Menu Buttons */}
        <Animatable.View animation="fadeInUp" duration={800} delay={800} style={styles.menuButtons}>
          <Button
            mode="contained"
            icon="play"
            style={[styles.mainButton, { backgroundColor: '#ff6b6b' }]}
            contentStyle={styles.buttonContent}
            labelStyle={styles.buttonLabel}
            onPress={() => navigation.navigate('Play')}
          >
            START GAME
          </Button>

          <Button
            mode="contained"
            icon="storefront"
            style={[styles.mainButton, { backgroundColor: '#4ecdc4' }]}
            contentStyle={styles.buttonContent}
            labelStyle={styles.buttonLabel}
            onPress={() => navigation.navigate('Store')}
          >
            CHARACTER STORE
          </Button>

          <Button
            mode="outlined"
            icon="trophy"
            style={styles.secondaryButton}
            contentStyle={styles.buttonContent}
            labelStyle={styles.buttonLabel}
            onPress={() => navigation.navigate('Leaderboard')}
          >
            LEADERBOARD
          </Button>
        </Animatable.View>

        {/* How to Play Info */}
        <Animatable.View animation="fadeInUp" duration={800} delay={1200}>
          <Card style={styles.infoCard}>
            <Card.Content>
              <Title style={styles.infoTitle}>How to Play</Title>
              <View style={styles.instructionsContainer}>
                <View style={styles.instruction}>
                  <Ionicons name="arrow-up" size={20} color="#ffd93d" />
                  <Text style={styles.instructionText}>Swipe UP to jump</Text>
                </View>
                <View style={styles.instruction}>
                  <Ionicons name="arrow-down" size={20} color="#ffd93d" />
                  <Text style={styles.instructionText}>Swipe DOWN to slide</Text>
                </View>
                <View style={styles.instruction}>
                  <Ionicons name="arrow-forward" size={20} color="#ffd93d" />
                  <Text style={styles.instructionText}>Swipe LEFT/RIGHT to turn</Text>
                </View>
                <View style={styles.instruction}>
                  <Ionicons name="diamond" size={20} color="#ffd93d" />
                  <Text style={styles.instructionText}>Collect coins and power-ups</Text>
                </View>
              </View>
            </Card.Content>
          </Card>
        </Animatable.View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  backgroundElements: {
    position: 'absolute',
    top: height * 0.15,
    right: -20,
    opacity: 0.3,
  },
  templeIcon: {
    transform: [{ rotate: '15deg' }],
  },
  titleContainer: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 30,
  },
  gameTitle: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
    letterSpacing: 4,
  },
  gameTitleAccent: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#ff6b6b',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
    letterSpacing: 4,
    marginTop: -10,
  },
  subtitle: {
    fontSize: 16,
    color: '#4ecdc4',
    marginTop: 10,
    fontStyle: 'italic',
  },
  statsCard: {
    backgroundColor: 'rgba(22, 33, 62, 0.8)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: 'rgba(255, 107, 107, 0.3)',
  },
  statsTitle: {
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20,
    fontSize: 20,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#ccc',
    marginTop: 4,
  },
  menuButtons: {
    marginBottom: 30,
  },
  mainButton: {
    marginVertical: 8,
    borderRadius: 12,
    elevation: 8,
  },
  secondaryButton: {
    marginVertical: 8,
    borderRadius: 12,
    borderColor: '#ff6b6b',
    borderWidth: 2,
  },
  buttonContent: {
    paddingVertical: 12,
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  infoCard: {
    backgroundColor: 'rgba(22, 33, 62, 0.6)',
    borderRadius: 12,
    marginBottom: 20,
  },
  infoTitle: {
    color: '#fff',
    textAlign: 'center',
    marginBottom: 15,
  },
  instructionsContainer: {
    alignItems: 'flex-start',
  },
  instruction: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  instructionText: {
    color: '#ccc',
    marginLeft: 10,
    fontSize: 14,
  },
});