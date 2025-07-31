import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert, Linking } from 'react-native';
import { Card, Title, Text, Button, Surface, Switch, Divider, List } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import * as Animatable from 'react-native-animatable';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { gameColors } from '../theme/gameTheme';

export default function SettingsScreen() {
  const [settings, setSettings] = useState({
    soundEnabled: true,
    musicEnabled: true,
    vibrationEnabled: true,
    notifications: true,
    autoSave: true,
    cloudSync: false,
    highQuality: true,
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const savedSettings = await AsyncStorage.getItem('gameSettings');
      if (savedSettings) {
        setSettings(JSON.parse(savedSettings));
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const saveSettings = async (newSettings) => {
    try {
      await AsyncStorage.setItem('gameSettings', JSON.stringify(newSettings));
      setSettings(newSettings);
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  };

  const toggleSetting = (setting) => {
    const newSettings = { ...settings, [setting]: !settings[setting] };
    saveSettings(newSettings);
  };

  const resetProgress = () => {
    Alert.alert(
      'Reset Game Progress',
      'Are you sure you want to reset all game progress? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.multiRemove([
                'bestScore',
                'totalGames',
                'totalCoins',
                'totalScore',
                'ownedCharacters',
                'selectedCharacter'
              ]);
              Alert.alert('Success', 'Game progress has been reset.');
            } catch (error) {
              Alert.alert('Error', 'Failed to reset progress.');
            }
          }
        }
      ]
    );
  };

  const exportData = async () => {
    try {
      const allKeys = await AsyncStorage.getAllKeys();
      const gameKeys = allKeys.filter(key => 
        ['bestScore', 'totalGames', 'totalCoins', 'ownedCharacters', 'selectedCharacter', 'gameSettings'].includes(key)
      );
      const gameData = await AsyncStorage.multiGet(gameKeys);
      const exportData = Object.fromEntries(gameData);
      
      Alert.alert(
        'Export Data',
        `Game data exported:\n\n${JSON.stringify(exportData, null, 2)}`,
        [{ text: 'OK' }]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to export data.');
    }
  };

  const openPrivacyPolicy = () => {
    Linking.openURL('https://example.com/privacy-policy');
  };

  const openTermsOfService = () => {
    Linking.openURL('https://example.com/terms-of-service');
  };

  const contactSupport = () => {
    Linking.openURL('mailto:support@templerunner.com?subject=Temple Runner Support');
  };

  const rateApp = () => {
    // In real app, this would open Play Store
    Alert.alert(
      'Rate Temple Runner',
      'Thank you for playing! Please rate us on the Play Store.',
      [{ text: 'OK' }]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <LinearGradient colors={['#1a1a2e', '#16213e']} style={styles.gradient}>
        
        {/* Game Settings */}
        <Animatable.View animation="fadeInDown" duration={800}>
          <Surface style={styles.sectionCard}>
            <Title style={styles.sectionTitle}>🎮 Game Settings</Title>
            
            <List.Item
              title="Sound Effects"
              description="Enable game sound effects"
              left={props => <List.Icon {...props} icon="volume-high" color="#4ecdc4" />}
              right={() => (
                <Switch
                  value={settings.soundEnabled}
                  onValueChange={() => toggleSetting('soundEnabled')}
                  color="#ff6b6b"
                />
              )}
              titleStyle={styles.listTitle}
              descriptionStyle={styles.listDescription}
            />

            <Divider style={styles.divider} />

            <List.Item
              title="Background Music"
              description="Enable background music"
              left={props => <List.Icon {...props} icon="music-note" color="#4ecdc4" />}
              right={() => (
                <Switch
                  value={settings.musicEnabled}
                  onValueChange={() => toggleSetting('musicEnabled')}
                  color="#ff6b6b"
                />
              )}
              titleStyle={styles.listTitle}
              descriptionStyle={styles.listDescription}
            />

            <Divider style={styles.divider} />

            <List.Item
              title="Vibration"
              description="Enable haptic feedback"
              left={props => <List.Icon {...props} icon="vibrate" color="#4ecdc4" />}
              right={() => (
                <Switch
                  value={settings.vibrationEnabled}
                  onValueChange={() => toggleSetting('vibrationEnabled')}
                  color="#ff6b6b"
                />
              )}
              titleStyle={styles.listTitle}
              descriptionStyle={styles.listDescription}
            />

            <Divider style={styles.divider} />

            <List.Item
              title="High Quality Graphics"
              description="Better visuals, may affect performance"
              left={props => <List.Icon {...props} icon="high-definition-box" color="#4ecdc4" />}
              right={() => (
                <Switch
                  value={settings.highQuality}
                  onValueChange={() => toggleSetting('highQuality')}
                  color="#ff6b6b"
                />
              )}
              titleStyle={styles.listTitle}
              descriptionStyle={styles.listDescription}
            />
          </Surface>
        </Animatable.View>

        {/* App Settings */}
        <Animatable.View animation="fadeInUp" duration={800} delay={200}>
          <Surface style={styles.sectionCard}>
            <Title style={styles.sectionTitle}>📱 App Settings</Title>
            
            <List.Item
              title="Push Notifications"
              description="Receive game updates and reminders"
              left={props => <List.Icon {...props} icon="bell" color="#ffd93d" />}
              right={() => (
                <Switch
                  value={settings.notifications}
                  onValueChange={() => toggleSetting('notifications')}
                  color="#ff6b6b"
                />
              )}
              titleStyle={styles.listTitle}
              descriptionStyle={styles.listDescription}
            />

            <Divider style={styles.divider} />

            <List.Item
              title="Auto Save"
              description="Automatically save game progress"
              left={props => <List.Icon {...props} icon="content-save" color="#ffd93d" />}
              right={() => (
                <Switch
                  value={settings.autoSave}
                  onValueChange={() => toggleSetting('autoSave')}
                  color="#ff6b6b"
                />
              )}
              titleStyle={styles.listTitle}
              descriptionStyle={styles.listDescription}
            />

            <Divider style={styles.divider} />

            <List.Item
              title="Cloud Sync"
              description="Sync progress across devices"
              left={props => <List.Icon {...props} icon="cloud-sync" color="#ffd93d" />}
              right={() => (
                <Switch
                  value={settings.cloudSync}
                  onValueChange={() => toggleSetting('cloudSync')}
                  color="#ff6b6b"
                />
              )}
              titleStyle={styles.listTitle}
              descriptionStyle={styles.listDescription}
            />
          </Surface>
        </Animatable.View>

        {/* Data Management */}
        <Animatable.View animation="fadeInUp" duration={800} delay={400}>
          <Surface style={styles.sectionCard}>
            <Title style={styles.sectionTitle}>💾 Data Management</Title>
            
            <Button
              mode="outlined"
              icon="export"
              style={styles.actionButton}
              onPress={exportData}
            >
              Export Game Data
            </Button>

            <Button
              mode="outlined"
              icon="backup-restore"
              style={styles.actionButton}
            >
              Import Game Data
            </Button>

            <Button
              mode="outlined"
              icon="delete-forever"
              style={[styles.actionButton, styles.dangerButton]}
              onPress={resetProgress}
            >
              Reset All Progress
            </Button>
          </Surface>
        </Animatable.View>

        {/* App Info */}
        <Animatable.View animation="fadeInUp" duration={800} delay={600}>
          <Surface style={styles.sectionCard}>
            <Title style={styles.sectionTitle}>ℹ️ App Information</Title>
            
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Version</Text>
              <Text style={styles.infoValue}>1.0.0</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Build</Text>
              <Text style={styles.infoValue}>20250731</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Engine</Text>
              <Text style={styles.infoValue}>React Native + Expo</Text>
            </View>

            <Divider style={styles.divider} />

            <Button
              mode="outlined"
              icon="star"
              style={styles.actionButton}
              onPress={rateApp}
            >
              Rate Temple Runner
            </Button>

            <Button
              mode="outlined"
              icon="help-circle"
              style={styles.actionButton}
              onPress={contactSupport}
            >
              Contact Support
            </Button>
          </Surface>
        </Animatable.View>

        {/* Legal */}
        <Animatable.View animation="fadeInUp" duration={800} delay={800}>
          <Surface style={styles.sectionCard}>
            <Title style={styles.sectionTitle}>⚖️ Legal</Title>
            
            <Button
              mode="text"
              icon="shield-check"
              style={styles.legalButton}
              onPress={openPrivacyPolicy}
            >
              Privacy Policy
            </Button>

            <Button
              mode="text"
              icon="file-document"
              style={styles.legalButton}
              onPress={openTermsOfService}
            >
              Terms of Service
            </Button>

            <View style={styles.copyrightContainer}>
              <Text style={styles.copyrightText}>
                © 2025 Temple Runner. All rights reserved.
              </Text>
              <Text style={styles.copyrightSubtext}>
                Made with ❤️ for endless running fun
              </Text>
            </View>
          </Surface>
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
  sectionCard: {
    backgroundColor: 'rgba(22, 33, 62, 0.9)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    elevation: 8,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
  },
  listTitle: {
    color: '#fff',
    fontSize: 16,
  },
  listDescription: {
    color: '#ccc',
    fontSize: 14,
  },
  divider: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginVertical: 8,
  },
  actionButton: {
    marginVertical: 6,
    borderColor: '#4ecdc4',
  },
  dangerButton: {
    borderColor: '#ff4757',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  infoLabel: {
    color: '#ccc',
    fontSize: 16,
  },
  infoValue: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  legalButton: {
    alignSelf: 'flex-start',
    marginVertical: 4,
  },
  copyrightContainer: {
    alignItems: 'center',
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  copyrightText: {
    color: '#ccc',
    fontSize: 12,
    textAlign: 'center',
  },
  copyrightSubtext: {
    color: '#666',
    fontSize: 10,
    textAlign: 'center',
    marginTop: 4,
  },
});