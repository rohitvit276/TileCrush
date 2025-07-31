import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Dimensions, PanResponder, Alert } from 'react-native';
import { Text, Button, Surface } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import * as Animatable from 'react-native-animatable';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { gameColors } from '../theme/gameTheme';

const { width, height } = Dimensions.get('window');

// Game constants
const GROUND_HEIGHT = 100;
const CHARACTER_SIZE = 40;
const OBSTACLE_WIDTH = 30;
const COIN_SIZE = 20;

export default function GameScreen({ navigation }) {
  const [gameState, setGameState] = useState('menu'); // 'menu', 'playing', 'paused', 'gameOver'
  const [score, setScore] = useState(0);
  const [coins, setCoins] = useState(0);
  const [speed, setSpeed] = useState(2);
  const [character, setCharacter] = useState({
    x: width / 2 - CHARACTER_SIZE / 2,
    y: height - GROUND_HEIGHT - CHARACTER_SIZE,
    isJumping: false,
    isSliding: false,
    lane: 1, // 0 = left, 1 = center, 2 = right
  });
  const [obstacles, setObstacles] = useState([]);
  const [collectibles, setCollectibles] = useState([]);
  const [gameTime, setGameTime] = useState(0);
  const gameLoopRef = useRef(null);
  const scoreRef = useRef(0);

  // Pan responder for swipe gestures
  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => gameState === 'playing',
    onMoveShouldSetPanResponder: () => gameState === 'playing',
    
    onPanResponderGrant: (evt) => {
      // Handle tap for jump
      if (gameState === 'playing') {
        handleJump();
      }
    },
    
    onPanResponderMove: (evt, gestureState) => {
      if (gameState !== 'playing') return;
      
      const { dx, dy } = gestureState;
      
      // Swipe gestures
      if (Math.abs(dx) > Math.abs(dy)) {
        // Horizontal swipe
        if (Math.abs(dx) > 50) {
          if (dx > 0) {
            handleSwipeRight();
          } else {
            handleSwipeLeft();
          }
        }
      } else {
        // Vertical swipe
        if (Math.abs(dy) > 30) {
          if (dy > 0) {
            handleSwipeDown();
          } else {
            handleSwipeUp();
          }
        }
      }
    },
  });

  useEffect(() => {
    if (gameState === 'playing') {
      startGameLoop();
    } else {
      stopGameLoop();
    }
    
    return () => stopGameLoop();
  }, [gameState]);

  const startGame = () => {
    setGameState('playing');
    setScore(0);
    setCoins(0);
    setSpeed(2);
    setGameTime(0);
    setCharacter({
      x: width / 2 - CHARACTER_SIZE / 2,
      y: height - GROUND_HEIGHT - CHARACTER_SIZE,
      isJumping: false,
      isSliding: false,
      lane: 1,
    });
    setObstacles([]);
    setCollectibles([]);
    scoreRef.current = 0;
  };

  const startGameLoop = () => {
    gameLoopRef.current = setInterval(() => {
      updateGame();
    }, 16); // ~60 FPS
  };

  const stopGameLoop = () => {
    if (gameLoopRef.current) {
      clearInterval(gameLoopRef.current);
      gameLoopRef.current = null;
    }
  };

  const updateGame = () => {
    setGameTime(prev => prev + 16);
    scoreRef.current += 1;
    setScore(scoreRef.current);
    
    // Increase speed over time
    if (scoreRef.current % 1000 === 0) {
      setSpeed(prev => Math.min(prev + 0.5, 8));
    }
    
    // Update character position
    updateCharacter();
    
    // Spawn obstacles and collectibles
    spawnGameObjects();
    
    // Update obstacles and collectibles
    updateGameObjects();
    
    // Check collisions
    checkCollisions();
  };

  const updateCharacter = () => {
    setCharacter(prev => {
      let newY = prev.y;
      let newIsJumping = prev.isJumping;
      
      // Handle jumping physics
      if (prev.isJumping) {
        newY -= 8; // Jump up
        if (newY <= height - GROUND_HEIGHT - CHARACTER_SIZE - 80) {
          newY = height - GROUND_HEIGHT - CHARACTER_SIZE - 80; // Max jump height
        }
      } else if (newY < height - GROUND_HEIGHT - CHARACTER_SIZE) {
        newY += 8; // Fall down
        if (newY >= height - GROUND_HEIGHT - CHARACTER_SIZE) {
          newY = height - GROUND_HEIGHT - CHARACTER_SIZE;
          newIsJumping = false;
        }
      }
      
      // Handle sliding
      let newIsSliding = prev.isSliding;
      if (prev.isSliding) {
        setTimeout(() => {
          setCharacter(current => ({ ...current, isSliding: false }));
        }, 500);
      }
      
      return {
        ...prev,
        y: newY,
        isJumping: newIsJumping,
        isSliding: newIsSliding,
      };
    });
  };

  const spawnGameObjects = () => {
    // Spawn obstacles randomly
    if (Math.random() < 0.01 + speed * 0.001) {
      const lane = Math.floor(Math.random() * 3);
      const newObstacle = {
        id: Date.now() + Math.random(),
        x: width,
        y: height - GROUND_HEIGHT - 30,
        lane: lane,
        type: 'obstacle',
      };
      setObstacles(prev => [...prev, newObstacle]);
    }
    
    // Spawn collectibles
    if (Math.random() < 0.005) {
      const lane = Math.floor(Math.random() * 3);
      const newCollectible = {
        id: Date.now() + Math.random(),
        x: width,
        y: height - GROUND_HEIGHT - 60,
        lane: lane,
        type: 'coin',
      };
      setCollectibles(prev => [...prev, newCollectible]);
    }
  };

  const updateGameObjects = () => {
    // Move obstacles
    setObstacles(prev => 
      prev.map(obstacle => ({
        ...obstacle,
        x: obstacle.x - speed
      })).filter(obstacle => obstacle.x > -OBSTACLE_WIDTH)
    );
    
    // Move collectibles
    setCollectibles(prev => 
      prev.map(collectible => ({
        ...collectible,
        x: collectible.x - speed
      })).filter(collectible => collectible.x > -COIN_SIZE)
    );
  };

  const checkCollisions = () => {
    const characterLane = character.lane;
    const characterX = width / 3 * characterLane + width / 6;
    const characterY = character.y;
    
    // Check obstacle collisions
    obstacles.forEach(obstacle => {
      if (obstacle.lane === characterLane && 
          obstacle.x < characterX + CHARACTER_SIZE && 
          obstacle.x + OBSTACLE_WIDTH > characterX &&
          !character.isJumping && !character.isSliding) {
        gameOver();
      }
    });
    
    // Check collectible collisions
    collectibles.forEach((collectible, index) => {
      if (collectible.lane === characterLane && 
          collectible.x < characterX + CHARACTER_SIZE && 
          collectible.x + COIN_SIZE > characterX) {
        setCoins(prev => prev + 1);
        setCollectibles(prev => prev.filter((_, i) => i !== index));
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
    });
  };

  const handleSwipeUp = () => {
    handleJump();
  };

  const handleSwipeDown = () => {
    if (!character.isJumping) {
      setCharacter(prev => ({ ...prev, isSliding: true }));
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  };

  const handleSwipeLeft = () => {
    setCharacter(prev => ({
      ...prev,
      lane: Math.max(0, prev.lane - 1)
    }));
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleSwipeRight = () => {
    setCharacter(prev => ({
      ...prev,
      lane: Math.min(2, prev.lane + 1)
    }));
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleJump = () => {
    if (!character.isJumping) {
      setCharacter(prev => ({ ...prev, isJumping: true }));
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  };

  const gameOver = async () => {
    setGameState('gameOver');
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    
    // Save game stats
    try {
      const bestScore = await AsyncStorage.getItem('bestScore');
      const totalGames = await AsyncStorage.getItem('totalGames');
      const totalCoins = await AsyncStorage.getItem('totalCoins');
      
      if (!bestScore || score > parseInt(bestScore)) {
        await AsyncStorage.setItem('bestScore', score.toString());
      }
      
      await AsyncStorage.setItem('totalGames', 
        ((totalGames ? parseInt(totalGames) : 0) + 1).toString()
      );
      
      await AsyncStorage.setItem('totalCoins', 
        ((totalCoins ? parseInt(totalCoins) : 0) + coins).toString()
      );
      
    } catch (error) {
      console.error('Error saving game stats:', error);
    }
  };

  const pauseGame = () => {
    setGameState('paused');
  };

  const resumeGame = () => {
    setGameState('playing');
  };

  const getLaneX = (lane) => {
    return width / 3 * lane + width / 6 - CHARACTER_SIZE / 2;
  };

  if (gameState === 'menu') {
    return (
      <View style={styles.container}>
        <LinearGradient colors={['#1a1a2e', '#16213e']} style={styles.menuContainer}>
          <Animatable.View animation="pulse" iterationCount="infinite">
            <Text style={styles.gameTitle}>TEMPLE RUNNER</Text>
          </Animatable.View>
          <Text style={styles.subtitle}>Swipe to control your character</Text>
          <Button
            mode="contained"
            style={styles.startButton}
            onPress={startGame}
          >
            START GAME
          </Button>
        </LinearGradient>
      </View>
    );
  }

  return (
    <View style={styles.container} {...panResponder.panHandlers}>
      <LinearGradient colors={['#87CEEB', '#228B22', '#8B4513']} style={styles.gameArea}>
        {/* Game UI */}
        <Surface style={styles.gameUI}>
          <View style={styles.gameStats}>
            <Text style={styles.scoreText}>Score: {score}</Text>
            <Text style={styles.coinsText}>
              <Ionicons name="diamond" size={16} color="#ffd93d" /> {coins}
            </Text>
            <Button
              mode="outlined"
              compact
              onPress={pauseGame}
              style={styles.pauseButton}
            >
              {gameState === 'paused' ? 'Resume' : 'Pause'}
            </Button>
          </View>
        </Surface>

        {/* Game World */}
        <View style={styles.gameWorld}>
          {/* Ground */}
          <View style={styles.ground} />
          
          {/* Lane dividers */}
          <View style={styles.laneContainer}>
            <View style={[styles.lane, styles.leftLane]} />
            <View style={[styles.lane, styles.centerLane]} />
            <View style={[styles.lane, styles.rightLane]} />
          </View>
          
          {/* Character */}
          <Animatable.View
            animation={character.isJumping ? "pulse" : character.isSliding ? "bounceIn" : "bounce"}
            duration={200}
            style={[
              styles.character,
              {
                left: getLaneX(character.lane),
                top: character.y,
                backgroundColor: character.isSliding ? '#ff4757' : '#ff6b6b',
                height: character.isSliding ? CHARACTER_SIZE / 2 : CHARACTER_SIZE,
              }
            ]}
          >
            <Ionicons 
              name="person" 
              size={character.isSliding ? 20 : 30} 
              color="#fff" 
            />
          </Animatable.View>
          
          {/* Obstacles */}
          {obstacles.map(obstacle => (
            <View
              key={obstacle.id}
              style={[
                styles.obstacle,
                {
                  left: obstacle.x,
                  top: obstacle.y,
                  left: getLaneX(obstacle.lane),
                }
              ]}
            >
              <Ionicons name="cube" size={25} color="#654321" />
            </View>
          ))}
          
          {/* Collectibles */}
          {collectibles.map(collectible => (
            <Animatable.View
              key={collectible.id}
              animation="rotate"
              iterationCount="infinite"
              duration={1000}
              style={[
                styles.collectible,
                {
                  left: collectible.x,
                  top: collectible.y,
                  left: getLaneX(collectible.lane),
                }
              ]}
            >
              <Ionicons name="diamond" size={20} color="#ffd93d" />
            </Animatable.View>
          ))}
        </View>

        {/* Game Over Overlay */}
        {gameState === 'gameOver' && (
          <View style={styles.gameOverOverlay}>
            <Surface style={styles.gameOverCard}>
              <Text style={styles.gameOverTitle}>GAME OVER</Text>
              <Text style={styles.finalScore}>Final Score: {score}</Text>
              <Text style={styles.coinsEarned}>
                Coins Earned: <Ionicons name="diamond" size={16} color="#ffd93d" /> {coins}
              </Text>
              <View style={styles.gameOverButtons}>
                <Button
                  mode="contained"
                  style={styles.restartButton}
                  onPress={startGame}
                >
                  PLAY AGAIN
                </Button>
                <Button
                  mode="outlined"
                  style={styles.menuButton}
                  onPress={() => navigation.navigate('Menu')}
                >
                  MAIN MENU
                </Button>
              </View>
            </Surface>
          </View>
        )}

        {/* Pause Overlay */}
        {gameState === 'paused' && (
          <View style={styles.pauseOverlay}>
            <Surface style={styles.pauseCard}>
              <Text style={styles.pauseTitle}>PAUSED</Text>
              <Button
                mode="contained"
                style={styles.resumeButton}
                onPress={resumeGame}
              >
                RESUME
              </Button>
            </Surface>
          </View>
        )}
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  menuContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  gameTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#ff6b6b',
    textAlign: 'center',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 16,
    color: '#ccc',
    textAlign: 'center',
    marginBottom: 40,
  },
  startButton: {
    backgroundColor: '#ff6b6b',
    paddingHorizontal: 40,
    paddingVertical: 10,
  },
  gameArea: {
    flex: 1,
  },
  gameUI: {
    position: 'absolute',
    top: 40,
    left: 20,
    right: 20,
    zIndex: 100,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 12,
    padding: 15,
  },
  gameStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  scoreText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  coinsText: {
    color: '#fff',
    fontSize: 16,
  },
  pauseButton: {
    borderColor: '#ff6b6b',
  },
  gameWorld: {
    flex: 1,
    position: 'relative',
  },
  ground: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: GROUND_HEIGHT,
    backgroundColor: '#8B4513',
  },
  laneContainer: {
    position: 'absolute',
    bottom: GROUND_HEIGHT,
    left: 0,
    right: 0,
    height: 200,
    flexDirection: 'row',
  },
  lane: {
    flex: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  character: {
    position: 'absolute',
    width: CHARACTER_SIZE,
    height: CHARACTER_SIZE,
    borderRadius: CHARACTER_SIZE / 2,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  obstacle: {
    position: 'absolute',
    width: OBSTACLE_WIDTH,
    height: 30,
    backgroundColor: '#654321',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  collectible: {
    position: 'absolute',
    width: COIN_SIZE,
    height: COIN_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gameOverOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  gameOverCard: {
    backgroundColor: '#1a1a2e',
    borderRadius: 16,
    padding: 30,
    alignItems: 'center',
    elevation: 10,
  },
  gameOverTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ff6b6b',
    marginBottom: 20,
  },
  finalScore: {
    fontSize: 20,
    color: '#fff',
    marginBottom: 10,
  },
  coinsEarned: {
    fontSize: 16,
    color: '#ffd93d',
    marginBottom: 30,
  },
  gameOverButtons: {
    gap: 15,
  },
  restartButton: {
    backgroundColor: '#ff6b6b',
    paddingHorizontal: 30,
  },
  menuButton: {
    borderColor: '#4ecdc4',
  },
  pauseOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pauseCard: {
    backgroundColor: '#1a1a2e',
    borderRadius: 16,
    padding: 30,
    alignItems: 'center',
  },
  pauseTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  resumeButton: {
    backgroundColor: '#4ecdc4',
    paddingHorizontal: 30,
  },
});