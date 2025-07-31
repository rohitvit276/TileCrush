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
import { Audio } from 'expo-av';

const { width, height } = Dimensions.get('window');
const GRID_SIZE = 8;
const ROCK_SIZE = (width - 40) / GRID_SIZE;

const ROCK_TYPES = [
  { id: 1, color: '#32CD32', name: 'Green Rock' },
  { id: 2, color: '#0080FF', name: 'Blue Rock' },
  { id: 3, color: '#8B4513', name: 'Brown Rock' },
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
  const [showGameControls, setShowGameControls] = useState(false);
  const [sounds, setSounds] = useState({});
  const [hintAvailable, setHintAvailable] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [hintPattern, setHintPattern] = useState(null);

  useEffect(() => {
    loadHighScore();
    initializeGrid();
    loadSounds();
  }, []);

  const loadSounds = async () => {
    try {
      // Create sound objects programmatically since we can't load external files
      const successSound = new Audio.Sound();
      const errorSound = new Audio.Sound();
      
      // We'll use system sounds or generate tones
      setSounds({
        success: successSound,
        error: errorSound
      });
    } catch (error) {
      console.log('Error loading sounds:', error);
    }
  };

  const playSuccessSound = async () => {
    try {
      // Generate a success tone using Web Audio API for web
      if (typeof window !== 'undefined' && window.AudioContext) {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime); // C5
        oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime + 0.1); // E5
        oscillator.frequency.setValueAtTime(783.99, audioContext.currentTime + 0.2); // G5
        
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.3);
      }
    } catch (error) {
      console.log('Error playing success sound:', error);
    }
  };

  const playErrorSound = async () => {
    try {
      // Generate an error tone using Web Audio API for web
      if (typeof window !== 'undefined' && window.AudioContext) {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(200, audioContext.currentTime); // Low tone
        oscillator.frequency.setValueAtTime(150, audioContext.currentTime + 0.1); // Lower tone
        
        gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.2);
      }
    } catch (error) {
      console.log('Error playing error sound:', error);
    }
  };

  // Check if there are any possible moves
  const checkPossibleMoves = (gridToCheck) => {
    const possibleMoves = [];
    
    for (let row = 0; row < GRID_SIZE; row++) {
      for (let col = 0; col < GRID_SIZE; col++) {
        // Check right swap
        if (col < GRID_SIZE - 1) {
          const testGrid = gridToCheck.map(r => [...r]);
          [testGrid[row][col], testGrid[row][col + 1]] = [testGrid[row][col + 1], testGrid[row][col]];
          const matches = findMatches(testGrid);
          if (matches.length > 0) {
            possibleMoves.push({
              from: { row, col },
              to: { row, col: col + 1 },
              matches: matches
            });
          }
        }
        
        // Check down swap
        if (row < GRID_SIZE - 1) {
          const testGrid = gridToCheck.map(r => [...r]);
          [testGrid[row][col], testGrid[row + 1][col]] = [testGrid[row + 1][col], testGrid[row][col]];
          const matches = findMatches(testGrid);
          if (matches.length > 0) {
            possibleMoves.push({
              from: { row, col },
              to: { row: row + 1, col },
              matches: matches
            });
          }
        }
      }
    }
    
    return possibleMoves;
  };

  // Check game state and provide hints or end game
  const checkGameState = (currentGrid) => {
    const possibleMoves = checkPossibleMoves(currentGrid);
    
    if (possibleMoves.length === 0) {
      // No moves possible - Game Over
      setGameOver(true);
      saveHighScore(score);
      Alert.alert(
        'Game Over!',
        `No more matches possible!\n\nFinal Score: ${score}\nHigh Score: ${Math.max(score, highScore)}\n\nThe board has no valid moves left.`,
        [{ 
          text: 'Play Again', 
          onPress: () => {
            setGameOver(false);
            initializeGrid();
          }
        }]
      );
    } else if (possibleMoves.length === 1) {
      // Only one move possible - Show hint option
      setHintAvailable(true);
      setHintPattern(possibleMoves[0]);
    } else {
      // Multiple moves possible
      setHintAvailable(false);
      setHintPattern(null);
      setShowHint(false);
    }
  };

  const showHintToPlayer = () => {
    if (hintPattern) {
      setShowHint(true);
      // Auto-hide hint after 3 seconds
      setTimeout(() => {
        setShowHint(false);
      }, 3000);
    }
  };

  const isHintRock = (rock) => {
    if (!hintPattern) return false;
    return (
      (rock.row === hintPattern.from.row && rock.col === hintPattern.from.col) ||
      (rock.row === hintPattern.to.row && rock.col === hintPattern.to.col)
    );
  };

  // Find all matches in the grid
  const findMatches = (gridToCheck) => {
    const matches = [];
    
    // Check horizontal matches
    for (let row = 0; row < GRID_SIZE; row++) {
      let matchCount = 1;
      let currentType = gridToCheck[row][0].type;
      
      for (let col = 1; col < GRID_SIZE; col++) {
        if (gridToCheck[row][col].type === currentType) {
          matchCount++;
        } else {
          if (matchCount >= 3) {
            for (let i = col - matchCount; i < col; i++) {
              matches.push({ row, col: i });
            }
          }
          matchCount = 1;
          currentType = gridToCheck[row][col].type;
        }
      }
      
      // Check end of row
      if (matchCount >= 3) {
        for (let i = GRID_SIZE - matchCount; i < GRID_SIZE; i++) {
          matches.push({ row, col: i });
        }
      }
    }
    
    // Check vertical matches
    for (let col = 0; col < GRID_SIZE; col++) {
      let matchCount = 1;
      let currentType = gridToCheck[0][col].type;
      
      for (let row = 1; row < GRID_SIZE; row++) {
        if (gridToCheck[row][col].type === currentType) {
          matchCount++;
        } else {
          if (matchCount >= 3) {
            for (let i = row - matchCount; i < row; i++) {
              matches.push({ row: i, col });
            }
          }
          matchCount = 1;
          currentType = gridToCheck[row][col].type;
        }
      }
      
      // Check end of column
      if (matchCount >= 3) {
        for (let i = GRID_SIZE - matchCount; i < GRID_SIZE; i++) {
          matches.push({ row: i, col });
        }
      }
    }
    
    return matches;
  };

  useEffect(() => {
    if (moves === 0 && gameStarted && !gameOver) {
      // Show out of moves popup
      Alert.alert(
        'Out of Moves!',
        `Game Over!\n\nFinal Score: ${score}\nHigh Score: ${Math.max(score, highScore)}\n\nYou've used all 30 moves.`,
        [
          {
            text: 'Play Again',
            onPress: () => {
              setGameOver(false);
              initializeGrid();
            },
          },
        ]
      );
      setGameOver(true);
      saveHighScore(score);
    }
  }, [moves, gameStarted, gameOver, score, highScore]);

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
    
    // Fill the grid row by row, ensuring no initial matches
    for (let row = 0; row < GRID_SIZE; row++) {
      const gridRow = [];
      for (let col = 0; col < GRID_SIZE; col++) {
        let rockType;
        let attempts = 0;
        
        do {
          rockType = Math.floor(Math.random() * ROCK_TYPES.length) + 1;
          attempts++;
          
          // Prevent infinite loops
          if (attempts > 50) {
            rockType = 1;
            break;
          }
        } while (wouldCreateInitialMatch(newGrid, row, col, rockType));
        
        gridRow.push({
          id: `${row}-${col}`,
          type: rockType,
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
    setHintAvailable(false);
    setShowHint(false);
    setHintPattern(null);
  };

  const wouldCreateInitialMatch = (grid, row, col, rockType) => {
    // Check horizontal match (left) - ensure we have enough filled positions
    if (col >= 2 && 
        grid[row] && grid[row].length > col - 1 && grid[row][col - 1] && grid[row][col - 1].type === rockType &&
        grid[row] && grid[row].length > col - 2 && grid[row][col - 2] && grid[row][col - 2].type === rockType) {
      return true;
    }
    
    // Check vertical match (up) - ensure we have enough filled rows
    if (row >= 2 && 
        grid.length > row - 1 && grid[row - 1] && grid[row - 1][col] && grid[row - 1][col].type === rockType &&
        grid.length > row - 2 && grid[row - 2] && grid[row - 2][col] && grid[row - 2][col].type === rockType) {
      return true;
    }
    
    return false;
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
      // Play error sound for invalid move
      playErrorSound();
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
    // Create a test grid to check if this swap would create matches
    const testGrid = grid.map(row => [...row]);
    const temp = testGrid[rock1.row][rock1.col].type;
    testGrid[rock1.row][rock1.col].type = testGrid[rock2.row][rock2.col].type;
    testGrid[rock2.row][rock2.col].type = temp;

    // Check if this swap creates any matches
    const matches = findMatches(testGrid);
    
    if (matches.length === 0) {
      // Invalid move - no matches created
      playErrorSound();
      setSelectedRock(null);
      animateRock(rock1.id, 'deselect');
      animateRock(rock2.id, 'deselect');
      return;
    }

    // Valid move - proceed with swap
    const newGrid = [...grid];
    newGrid[rock1.row][rock1.col].type = testGrid[rock1.row][rock1.col].type;
    newGrid[rock2.row][rock2.col].type = testGrid[rock2.row][rock2.col].type;

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
      // Play success sound for successful match
      playSuccessSound();
    } else {
      // No new matches found, check game state
      checkGameState(currentGrid);
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
      // Check game state after processing matches
      setTimeout(() => {
        checkGameState(newGrid);
      }, 100);
    }, 300);
  };

  const endGame = () => {
    setGameOver(true);
    saveHighScore(score);
    
    Alert.alert(
      'Out of Moves!',
      `Game Over!\n\nFinal Score: ${score}\nHigh Score: ${Math.max(score, highScore)}\n\nNo more moves available.`,
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
          {showHint && hintPattern && isHintRock(rock) && (
            <View style={styles.hintHighlight} />
          )}
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
          
          <View style={styles.buttonRow}>
            <TouchableOpacity 
              style={styles.helpButton} 
              onPress={() => setShowGameControls(!showGameControls)}
            >
              <Text style={styles.helpButtonText}>
                {showGameControls ? 'Hide Help' : 'Show Help'}
              </Text>
            </TouchableOpacity>

            {hintAvailable && (
              <TouchableOpacity 
                style={styles.hintButton} 
                onPress={showHintToPlayer}
              >
                <Text style={styles.hintButtonText}>
                  💡 Hint
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {showGameControls && (
            <View style={styles.gameControlsContainer}>
              <Text style={styles.gameControlsTitle}>Game Controls:</Text>
              <Text style={styles.gameControlsText}>
                • TAP a rock to select it (red border)
                {'\n'}• TAP adjacent rock to swap
                {'\n'}• Match 3+ rocks in a line
                {'\n'}• Get points before moves run out
              </Text>
            </View>
          )}
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
  helpButton: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 15,
    alignSelf: 'center',
    marginTop: 10,
  },
  helpButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  gameControlsContainer: {
    backgroundColor: 'rgba(33, 150, 243, 0.2)',
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#2196F3',
  },
  gameControlsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2196F3',
    marginBottom: 8,
    textAlign: 'center',
  },
  gameControlsText: {
    fontSize: 13,
    color: '#fff',
    lineHeight: 18,
    textAlign: 'left',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 15,
    marginTop: 10,
  },
  hintButton: {
    backgroundColor: '#FF9800',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 15,
  },
  hintButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  hintHighlight: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 0, 0.4)',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#FFD700',
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