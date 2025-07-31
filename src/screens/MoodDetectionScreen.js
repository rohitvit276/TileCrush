import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, Alert, Dimensions, Platform } from 'react-native';
import { Button, Card, Title, Text, Surface, ActivityIndicator, Chip } from 'react-native-paper';
import { Camera } from 'expo-camera';
import { Audio } from 'expo-av';
import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from 'expo-file-system';
import { Ionicons } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { moodColors } from '../theme/theme';

const { width, height } = Dimensions.get('window');

export default function MoodDetectionScreen({ navigation }) {
  const [hasPermission, setHasPermission] = useState(null);
  const [cameraType, setCameraType] = useState(Camera.Constants.Type.front);
  const [isDetecting, setIsDetecting] = useState(false);
  const [detectedMood, setDetectedMood] = useState(null);
  const [detectionMethod, setDetectionMethod] = useState('photo'); // 'photo' or 'audio'
  const [recording, setRecording] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  
  const cameraRef = useRef(null);

  useEffect(() => {
    requestPermissions();
  }, []);

  const requestPermissions = async () => {
    const { status: cameraStatus } = await Camera.requestCameraPermissionsAsync();
    const { status: audioStatus } = await Audio.requestPermissionsAsync();
    const { status: mediaStatus } = await MediaLibrary.requestPermissionsAsync();
    
    setHasPermission(cameraStatus === 'granted' && audioStatus === 'granted' && mediaStatus === 'granted');
  };

  const simulateMoodDetection = async (imageUri = null, audioUri = null) => {
    setIsDetecting(true);
    
    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Simulate mood detection with realistic probabilities
    const moods = ['happy', 'calm', 'excited', 'neutral', 'peaceful', 'energetic'];
    const weights = [0.25, 0.2, 0.15, 0.15, 0.15, 0.1]; // Happy and calm more likely
    
    let randomValue = Math.random();
    let selectedMood = moods[0];
    
    for (let i = 0; i < moods.length; i++) {
      if (randomValue <= weights.slice(0, i + 1).reduce((a, b) => a + b, 0)) {
        selectedMood = moods[i];
        break;
      }
    }
    
    const confidence = Math.floor(Math.random() * 20) + 80; // 80-99% confidence
    
    const moodResult = {
      mood: selectedMood,
      confidence,
      method: detectionMethod,
      timestamp: new Date().toISOString(),
      imageUri,
      audioUri,
    };
    
    setDetectedMood(moodResult);
    setIsDetecting(false);
    
    // Save to history
    await saveMoodToHistory(moodResult);
  };

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.8,
          base64: false,
        });
        
        // Save photo to media library
        await MediaLibrary.saveToLibraryAsync(photo.uri);
        
        await simulateMoodDetection(photo.uri);
      } catch (error) {
        Alert.alert('Error', 'Failed to take picture: ' + error.message);
      }
    }
  };

  const startRecording = async () => {
    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      
      setRecording(recording);
      setIsRecording(true);
      
      // Auto-stop after 5 seconds
      setTimeout(() => {
        if (recording) {
          stopRecording();
        }
      }, 5000);
    } catch (error) {
      Alert.alert('Error', 'Failed to start recording: ' + error.message);
    }
  };

  const stopRecording = async () => {
    if (!recording) return;
    
    setIsRecording(false);
    setRecording(null);
    
    try {
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      
      await simulateMoodDetection(null, uri);
    } catch (error) {
      Alert.alert('Error', 'Failed to stop recording: ' + error.message);
    }
  };

  const saveMoodToHistory = async (moodData) => {
    try {
      const existingHistory = await AsyncStorage.getItem('moodHistory');
      const history = existingHistory ? JSON.parse(existingHistory) : [];
      
      history.push(moodData);
      
      // Keep only last 100 entries
      if (history.length > 100) {
        history.splice(0, history.length - 100);
      }
      
      await AsyncStorage.setItem('moodHistory', JSON.stringify(history));
    } catch (error) {
      console.error('Error saving mood to history:', error);
    }
  };

  const getMusicRecommendations = () => {
    navigation.navigate('Music', { mood: detectedMood.mood });
  };

  if (hasPermission === null) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>Requesting permissions...</Text>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={styles.centered}>
        <Ionicons name="warning-outline" size={64} color="#ef4444" />
        <Title style={styles.errorTitle}>Camera and microphone access required</Title>
        <Text style={styles.errorText}>
          Please enable camera and microphone permissions in your device settings to use mood detection.
        </Text>
        <Button mode="contained" onPress={requestPermissions} style={styles.retryButton}>
          Retry Permissions
        </Button>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {detectedMood ? (
        <Animatable.View animation="fadeIn" style={styles.resultContainer}>
          <Card style={styles.resultCard}>
            <Card.Content style={styles.resultContent}>
              <Animatable.View animation="bounceIn" delay={300}>
                <Ionicons 
                  name="happy-outline" 
                  size={80} 
                  color={moodColors[detectedMood.mood]} 
                  style={styles.moodIcon}
                />
              </Animatable.View>
              
              <Title style={styles.resultTitle}>Mood Detected!</Title>
              
              <Chip 
                style={[styles.moodChip, { backgroundColor: moodColors[detectedMood.mood] }]}
                textStyle={styles.moodChipText}
              >
                {detectedMood.mood.toUpperCase()}
              </Chip>
              
              <Text style={styles.confidenceText}>
                Confidence: {detectedMood.confidence}%
              </Text>
              
              <Text style={styles.methodText}>
                Detected via {detectedMood.method === 'photo' ? 'Photo Analysis' : 'Voice Analysis'}
              </Text>
              
              <View style={styles.resultActions}>
                <Button 
                  mode="contained" 
                  onPress={getMusicRecommendations}
                  style={styles.musicButton}
                  icon="musical-notes"
                >
                  Get Music Recommendations
                </Button>
                
                <Button 
                  mode="outlined" 
                  onPress={() => setDetectedMood(null)}
                  style={styles.retryButton}
                >
                  Detect Again
                </Button>
              </View>
            </Card.Content>
          </Card>
        </Animatable.View>
      ) : (
        <>
          <Surface style={styles.methodSelector}>
            <Title style={styles.selectorTitle}>Choose Detection Method</Title>
            <View style={styles.methodButtons}>
              <Button
                mode={detectionMethod === 'photo' ? 'contained' : 'outlined'}
                icon="camera"
                onPress={() => setDetectionMethod('photo')}
                style={styles.methodButton}
              >
                Photo
              </Button>
              <Button
                mode={detectionMethod === 'audio' ? 'contained' : 'outlined'}
                icon="microphone"
                onPress={() => setDetectionMethod('audio')}
                style={styles.methodButton}
              >
                Audio
              </Button>
            </View>
          </Surface>

          {detectionMethod === 'photo' ? (
            <View style={styles.cameraContainer}>
              <Camera 
                style={styles.camera} 
                type={cameraType}
                ref={cameraRef}
              >
                <View style={styles.cameraOverlay}>
                  <View style={styles.frameGuide} />
                </View>
              </Camera>
              
              <View style={styles.cameraControls}>
                <Button
                  mode="contained"
                  icon="camera-flip"
                  onPress={() => setCameraType(
                    cameraType === Camera.Constants.Type.back
                      ? Camera.Constants.Type.front
                      : Camera.Constants.Type.back
                  )}
                  style={styles.flipButton}
                >
                  Flip
                </Button>
                
                <Button
                  mode="contained"
                  icon="camera"
                  onPress={takePicture}
                  disabled={isDetecting}
                  style={styles.captureButton}
                  loading={isDetecting}
                >
                  {isDetecting ? 'Analyzing...' : 'Capture Mood'}
                </Button>
              </View>
            </View>
          ) : (
            <View style={styles.audioContainer}>
              <Card style={styles.audioCard}>
                <Card.Content style={styles.audioContent}>
                  <Animatable.View 
                    animation={isRecording ? "pulse" : undefined}
                    iterationCount="infinite"
                  >
                    <Ionicons 
                      name={isRecording ? "mic" : "mic-outline"} 
                      size={120} 
                      color={isRecording ? "#ef4444" : "#6366f1"} 
                    />
                  </Animatable.View>
                  
                  <Title style={styles.audioTitle}>
                    {isRecording ? 'Recording your voice...' : 'Voice Mood Detection'}
                  </Title>
                  
                  <Text style={styles.audioInstructions}>
                    {isRecording 
                      ? 'Speak for a few seconds to analyze your mood'
                      : 'Press record and speak naturally for 5 seconds'
                    }
                  </Text>
                  
                  {isRecording && (
                    <Text style={styles.recordingTimer}>
                      Recording will stop automatically in 5 seconds
                    </Text>
                  )}
                  
                  <Button
                    mode="contained"
                    icon={isRecording ? "stop" : "microphone"}
                    onPress={isRecording ? stopRecording : startRecording}
                    disabled={isDetecting}
                    loading={isDetecting}
                    style={[styles.recordButton, { backgroundColor: isRecording ? "#ef4444" : "#6366f1" }]}
                  >
                    {isDetecting ? 'Analyzing...' : isRecording ? 'Stop Recording' : 'Start Recording'}
                  </Button>
                </Card.Content>
              </Card>
            </View>
          )}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafafa',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  errorTitle: {
    marginTop: 16,
    textAlign: 'center',
  },
  errorText: {
    marginTop: 8,
    textAlign: 'center',
    color: '#666',
    lineHeight: 22,
  },
  retryButton: {
    marginTop: 20,
  },
  methodSelector: {
    margin: 20,
    padding: 20,
    borderRadius: 12,
    elevation: 2,
  },
  selectorTitle: {
    textAlign: 'center',
    marginBottom: 15,
  },
  methodButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  methodButton: {
    minWidth: 120,
  },
  cameraContainer: {
    flex: 1,
    margin: 20,
    borderRadius: 12,
    overflow: 'hidden',
  },
  camera: {
    flex: 1,
  },
  cameraOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  frameGuide: {
    width: 250,
    height: 250,
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.8)',
    borderRadius: 125,
    borderStyle: 'dashed',
  },
  cameraControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'rgba(0,0,0,0.8)',
  },
  flipButton: {
    minWidth: 80,
  },
  captureButton: {
    minWidth: 160,
  },
  audioContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  audioCard: {
    elevation: 4,
    borderRadius: 12,
  },
  audioContent: {
    alignItems: 'center',
    padding: 30,
  },
  audioTitle: {
    marginTop: 20,
    textAlign: 'center',
  },
  audioInstructions: {
    marginTop: 10,
    textAlign: 'center',
    color: '#666',
    lineHeight: 22,
  },
  recordingTimer: {
    marginTop: 15,
    fontSize: 12,
    color: '#ef4444',
    textAlign: 'center',
  },
  recordButton: {
    marginTop: 30,
    minWidth: 160,
  },
  resultContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  resultCard: {
    elevation: 8,
    borderRadius: 16,
  },
  resultContent: {
    alignItems: 'center',
    padding: 30,
  },
  moodIcon: {
    marginBottom: 20,
  },
  resultTitle: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 20,
  },
  moodChip: {
    marginBottom: 15,
  },
  moodChipText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  confidenceText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
  },
  methodText: {
    fontSize: 14,
    color: '#888',
    marginBottom: 30,
  },
  resultActions: {
    width: '100%',
    gap: 12,
  },
  musicButton: {
    marginBottom: 10,
  },
});