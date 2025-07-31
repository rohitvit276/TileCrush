import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Alert,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';

const { width, height } = Dimensions.get('window');
const GRID_SIZE = 8;
const ROCK_SIZE = (width - 40) / GRID_SIZE;

const ROCK_TYPES = [
  { id: 1, color: '#00FF00', name: 'Green Rock' },
  { id: 2, color: '#0080FF', name: 'Blue Rock' },
  { id: 3, color: '#FF0040', name: 'Red Rock' },
  { id: 4, color: '#FFD700', name: 'Yellow Rock' },
  { id: 5, color: '#FF1493', name: 'Pink Rock' },
];

export default function GameScreen() {
  const [grid, setGrid] = useState([]);
  const [score, setScore] = useState(0);
  const [moves, setMoves] = useState(30);
  const [selectedRock, setSelectedRock] = useState(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [highScore, setHighScore] = useState(0);
  const [animations, setAnimations] = useState({});
  const [showInstructions, setShowInstructions] = useState(false);

  useEffect(() => {
    loadHighScore();
    initializeGrid();
  }, []);

  useEffect(() => {
    if (moves === 0 && gameStarted) {
      endGame();
    }
  }, [moves, gameStarted]);

  const loadHighScore = async () => {
    try {
      const savedHighScore = await AsyncStorage.getItem('rockCrushHighScore');
      if (savedHighScore) {
        setHighScore(parseInt(savedHighScore));
      }
    } catch (error) {
      console.log('Error loading high score:', error);
    }
  };

  const saveHighScore = async (newScore) => {
    try {
      if (newScore > highScore) {
        setHighScore(newScore);
        await AsyncStorage.setItem('rockCrushHighScore', newScore.toString());
      }
    } catch (error) {
      console.log('Error saving high score:', error);
    }
  };

  const initializeGrid = () => {
    const newGrid = [];
    for (let row = 0; row < GRID_SIZE; row++) {
      const gridRow = [];
      for (let col = 0; col < GRID_SIZE; col++) {
        gridRow.push({
          id: `${row}-${col}`,
          type: Math.floor(Math.random() * ROCK_TYPES.length) + 1,
          row,
          col,
        });
      }
      newGrid.push(gridRow);
    }
    setGrid(newGrid);
    setScore(0);
    setMoves(30);
    setGameStarted(false);
    setGameOver(false);
    setSelectedRock(null);
  };

  const handleRockPress = (rock) => {
    if (gameOver) return;
    
    if (!gameStarted) {
      setGameStarted(true);
    }

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    if (!selectedRock) {
      setSelectedRock(rock);
      animateRock(rock.id, 'select');
    } else if (selectedRock.id === rock.id) {
      setSelectedRock(null);
      animateRock(rock.id, 'deselect');
    } else if (isAdjacent(selectedRock, rock)) {
      swapRocks(selectedRock, rock);
    } else {
      animateRock(selectedRock.id, 'deselect');
      setSelectedRock(rock);
      animateRock(rock.id, 'select');
    }
  };

  const isAdjacent = (rock1, rock2) => {
    const rowDiff = Math.abs(rock1.row - rock2.row);
    const colDiff = Math.abs(rock1.col - rock2.col);
    return (rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1);
  };

  const animateRock = (rockId, type) => {
    const animValue = new Animated.Value(type === 'select' ? 1 : 0);
    setAnimations(prev => ({ ...prev, [rockId]: animValue }));
    
    Animated.spring(animValue, {
      toValue: type === 'select' ? 1.2 : 1,
      useNativeDriver: true,
    }).start();
  };

  const swapRocks = (rock1, rock2) => {
    const newGrid = [...grid];
    const temp = newGrid[rock1.row][rock1.col].type;
    newGrid[rock1.row][rock1.col].type = newGrid[rock2.row][rock2.col].type;
    newGrid[rock2.row][rock2.col].type = temp;

    setGrid(newGrid);
    setSelectedRock(null);
    setMoves(moves - 1);

    // Check for matches
    setTimeout(() => {
      checkForMatches(newGrid);
    }, 100);
  };

  const checkForMatches = (currentGrid) => {
    const matches = [];
    
    // Check horizontal matches
    for (let row = 0; row < GRID_SIZE; row++) {
      for (let col = 0; col < GRID_SIZE - 2; col++) {
        if (
          currentGrid[row][col].type === currentGrid[row][col + 1].type &&
          currentGrid[row][col].type === currentGrid[row][col + 2].type
        ) {
          matches.push(
            { row, col },
            { row, col: col + 1 },
            { row, col: col + 2 }
          );
        }
      }
    }

    // Check vertical matches
    for (let row = 0; row < GRID_SIZE - 2; row++) {
      for (let col = 0; col < GRID_SIZE; col++) {
        if (
          currentGrid[row][col].type === currentGrid[row + 1][col].type &&
          currentGrid[row][col].type === currentGrid[row + 2][col].type
        ) {
          matches.push(
            { row, col },
            { row: row + 1, col },
            { row: row + 2, col }
          );
        }
      }
    }

    if (matches.length > 0) {
      removeMatches(currentGrid, matches);
    }
  };

  const removeMatches = (currentGrid, matches) => {
    const newGrid = [...currentGrid];
    const uniqueMatches = [];
    
    // Remove duplicates
    matches.forEach(match => {
      if (!uniqueMatches.find(m => m.row === match.row && m.col === match.col)) {
        uniqueMatches.push(match);
      }
    });

    // Mark rocks for removal
    uniqueMatches.forEach(match => {
      newGrid[match.row][match.col].type = 0; // 0 means empty
    });

    // Calculate score
    const points = uniqueMatches.length * 10;
    setScore(prevScore => prevScore + points);

    // Haptic feedback for successful match
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    // Drop rocks down
    setTimeout(() => {
      dropRocks(newGrid);
    }, 200);
  };

  const dropRocks = (currentGrid) => {
    const newGrid = [...currentGrid];
    
    for (let col = 0; col < GRID_SIZE; col++) {
      // Get all non-empty rocks in this column
      const rocks = [];
      for (let row = GRID_SIZE - 1; row >= 0; row--) {
        if (newGrid[row][col].type !== 0) {
          rocks.push(newGrid[row][col].type);
        }
      }
      
      // Fill column from bottom with existing rocks
      for (let row = GRID_SIZE - 1; row >= 0; row--) {
        if (rocks.length > 0) {
          newGrid[row][col].type = rocks.shift();
        } else {
          // Fill empty spaces with new random rocks
          newGrid[row][col].type = Math.floor(Math.random() * ROCK_TYPES.length) + 1;
        }
      }
    }

    setGrid(newGrid);
    
    // Check for new matches after dropping
    setTimeout(() => {
      checkForMatches(newGrid);
    }, 300);
  };

  const endGame = () => {
    setGameOver(true);
    saveHighScore(score);
    
    Alert.alert(
      'Game Over!',
      `Final Score: ${score}\nHigh Score: ${Math.max(score, highScore)}`,
      [
        {
          text: 'Play Again',
          onPress: initializeGrid,
        },
      ]
    );
  };

  const getRockColor = (type) => {
    const rockType = ROCK_TYPES.find(r => r.id === type);
    return rockType ? rockType.color : '#8B4513';
  };

  const renderRock = (rock) => {
    const isSelected = selectedRock && selectedRock.id === rock.id;
    const animationValue = animations[rock.id] || new Animated.Value(1);
    
    return (
      <Animated.View
        key={rock.id}
        style={[
          styles.rock,
          {
            backgroundColor: getRockColor(rock.type),
            transform: [{ scale: animationValue }],
            borderWidth: isSelected ? 3 : 1,
            borderColor: isSelected ? '#ff6b6b' : '#333',
          },
        ]}
      >
        <TouchableOpacity
          style={styles.rockTouchable}
          onPress={() => handleRockPress(rock)}
          disabled={gameOver}
        >
          <View style={styles.rockInner} />
        </TouchableOpacity>
      </Animated.View>
    );
  };

  if (!gameStarted && !gameOver) {
    return (
      <LinearGradient colors={['#1a1a2e', '#16213e']} style={styles.container}>
        <View style={styles.menuContainer}>
          <Text style={styles.gameTitle}>ROCK CRUSH</Text>
          <Text style={styles.subtitle}>Match 3 or more rocks to crush them!</Text>
          <Text style={styles.instructions}>
            • Tap a rock, then tap an adjacent rock to swap
            {'\n'}• Match 3+ rocks in a row or column
            {'\n'}• Score points before moves run out
            {'\n'}• Beat your high score!
          </Text>
          <TouchableOpacity style={styles.startButton} onPress={() => setGameStarted(true)}>
            <Text style={styles.startButtonText}>START GAME</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.instructionsButton} 
            onPress={() => setShowInstructions(!showInstructions)}
          >
            <Text style={styles.instructionsButtonText}>
              {showInstructions ? 'HIDE CONTROLS' : 'SHOW CONTROLS'}
            </Text>
          </TouchableOpacity>

          {showInstructions && (
            <View style={styles.controlsContainer}>
              <Text style={styles.controlsTitle}>Game Controls:</Text>
              <Text style={styles.controlsText}>
                1. TAP any rock to select it (it will glow with red border)
                {'\n'}2. TAP an adjacent rock (up, down, left, right) to swap positions
                {'\n'}3. Make matches of 3+ rocks in a row or column to crush them
                {'\n'}4. Rocks will fall down and new ones appear from the top
                {'\n'}5. Score points before your 30 moves run out!
                {'\n'}6. Chain matches together for higher scores
              </Text>
            </View>
          )}
          
          <View style={styles.scoreContainer}>
            <Text style={styles.highScoreText}>High Score: {highScore}</Text>
          </View>
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={['#1a1a2e', '#16213e']} style={styles.container}>
      <View style={styles.gameContainer}>
        <View style={styles.header}>
          <View style={styles.scoreBoard}>
            <Text style={styles.scoreText}>Score: {score}</Text>
            <Text style={styles.movesText}>Moves: {moves}</Text>
          </View>
        </View>

        <View style={styles.gridContainer}>
          {grid.map((row, rowIndex) => (
            <View key={rowIndex} style={styles.row}>
              {row.map((rock) => renderRock(rock))}
            </View>
          ))}
        </View>

        <View style={styles.bottomContainer}>
          <TouchableOpacity style={styles.resetButton} onPress={initializeGrid}>
            <Text style={styles.resetButtonText}>NEW GAME</Text>
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
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
  gameContainer: {
    flex: 1,
    padding: 20,
  },
  gameTitle: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#ff6b6b',
    textAlign: 'center',
    marginBottom: 20,
    textShadowColor: '#000',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 18,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 30,
  },
  instructions: {
    fontSize: 16,
    color: '#ccc',
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 24,
  },
  startButton: {
    backgroundColor: '#ff6b6b',
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 25,
    marginBottom: 20,
  },
  startButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  instructionsButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 20,
    marginBottom: 20,
  },
  instructionsButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  controlsContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
    marginHorizontal: 10,
  },
  controlsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ff6b6b',
    marginBottom: 10,
    textAlign: 'center',
  },
  controlsText: {
    fontSize: 14,
    color: '#fff',
    lineHeight: 22,
    textAlign: 'left',
  },
  header: {
    marginBottom: 20,
  },
  scoreBoard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 15,
    borderRadius: 10,
  },
  scoreText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  movesText: {
    color: '#ff6b6b',
    fontSize: 18,
    fontWeight: 'bold',
  },
  highScoreText: {
    color: '#ffd93d',
    fontSize: 16,
    fontWeight: 'bold',
  },
  gridContainer: {
    alignSelf: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    padding: 10,
    borderRadius: 10,
  },
  row: {
    flexDirection: 'row',
  },
  rock: {
    width: ROCK_SIZE,
    height: ROCK_SIZE,
    margin: 1,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  rockTouchable: {
    flex: 1,
    borderRadius: 8,
  },
  rockInner: {
    flex: 1,
    borderRadius: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  bottomContainer: {
    marginTop: 30,
    alignItems: 'center',
  },
  resetButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 20,
  },
  resetButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  scoreContainer: {
    marginTop: 20,
  },
});