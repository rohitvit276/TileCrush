import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Switch,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default function SettingsScreen() {
  const [settings, setSettings] = useState({
    soundEnabled: true,
    vibrationsEnabled: true,
    difficulty: 'normal',
    gridSize: 8,
    autoSave: true,
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const savedSettings = await AsyncStorage.getItem('rockCrushSettings');
      if (savedSettings) {
        setSettings(JSON.parse(savedSettings));
      }
    } catch (error) {
      console.log('Error loading settings:', error);
    }
  };

  const saveSettings = async (newSettings) => {
    try {
      await AsyncStorage.setItem('rockCrushSettings', JSON.stringify(newSettings));
      setSettings(newSettings);
    } catch (error) {
      console.log('Error saving settings:', error);
    }
  };

  const handleToggle = (key, value) => {
    const newSettings = { ...settings, [key]: value };
    saveSettings(newSettings);
  };

  const resetAllData = () => {
    Alert.alert(
      'Reset All Data',
      'This will delete all your game progress, scores, and settings. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset All',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.multiRemove([
                'rockCrushHighScore',
                'rockCrushStats',
                'rockCrushSettings'
              ]);
              setSettings({
                soundEnabled: true,
                vibrationsEnabled: true,
                difficulty: 'normal',
                gridSize: 8,
                autoSave: true,
              });
              Alert.alert('Success', 'All data has been reset.');
            } catch (error) {
              Alert.alert('Error', 'Failed to reset data.');
            }
          },
        },
      ]
    );
  };

  const renderSettingItem = (title, subtitle, icon, children) => (
    <View style={styles.settingItem}>
      <View style={styles.settingHeader}>
        <Icon name={icon} size={24} color="#ff6b6b" />
        <View style={styles.settingText}>
          <Text style={styles.settingTitle}>{title}</Text>
          {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
        </View>
      </View>
      {children}
    </View>
  );

  return (
    <LinearGradient colors={['#1a1a2e', '#16213e']} style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Settings</Text>
          <Text style={styles.subtitle}>Customize your Rock Crush experience</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Game Settings</Text>
          
          {renderSettingItem(
            'Sound Effects',
            'Enable game sounds and music',
            'volume-up',
            <Switch
              value={settings.soundEnabled}
              onValueChange={(value) => handleToggle('soundEnabled', value)}
              trackColor={{ false: '#767577', true: '#ff6b6b' }}
              thumbColor={settings.soundEnabled ? '#fff' : '#f4f3f4'}
            />
          )}

          {renderSettingItem(
            'Vibrations',
            'Enable haptic feedback',
            'vibration',
            <Switch
              value={settings.vibrationsEnabled}
              onValueChange={(value) => handleToggle('vibrationsEnabled', value)}
              trackColor={{ false: '#767577', true: '#ff6b6b' }}
              thumbColor={settings.vibrationsEnabled ? '#fff' : '#f4f3f4'}
            />
          )}

          {renderSettingItem(
            'Auto Save',
            'Automatically save game progress',
            'save',
            <Switch
              value={settings.autoSave}
              onValueChange={(value) => handleToggle('autoSave', value)}
              trackColor={{ false: '#767577', true: '#ff6b6b' }}
              thumbColor={settings.autoSave ? '#fff' : '#f4f3f4'}
            />
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Game Info</Text>
          
          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>How to Play</Text>
            <Text style={styles.infoText}>
              • Tap a rock to select it{'\n'}
              • Tap an adjacent rock to swap positions{'\n'}
              • Match 3 or more rocks in a row or column{'\n'}
              • Score points before moves run out{'\n'}
              • Try to beat your high score!
            </Text>
          </View>

          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>Rock Types</Text>
            <View style={styles.rockTypes}>
              <View style={[styles.rockPreview, { backgroundColor: '#32CD32' }]} />
              <View style={[styles.rockPreview, { backgroundColor: '#0080FF' }]} />
              <View style={[styles.rockPreview, { backgroundColor: '#8B4513' }]} />
              <View style={[styles.rockPreview, { backgroundColor: '#FFD700' }]} />
              <View style={[styles.rockPreview, { backgroundColor: '#FF1493' }]} />
            </View>
            <Text style={styles.infoText}>5 colored rocks: Green, Blue, Brown, Yellow, Pink!</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data Management</Text>
          
          <TouchableOpacity style={styles.dangerButton} onPress={resetAllData}>
            <Icon name="delete-forever" size={20} color="#fff" />
            <Text style={styles.dangerButtonText}>Reset All Data</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.versionText}>Rock Crush v1.0.0</Text>
          <Text style={styles.copyrightText}>Made with React Native & Expo</Text>
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
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ff6b6b',
    marginBottom: 15,
  },
  settingItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  settingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingText: {
    marginLeft: 12,
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  settingSubtitle: {
    fontSize: 14,
    color: '#ccc',
    marginTop: 2,
  },
  infoCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#ccc',
    lineHeight: 20,
  },
  rockTypes: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  rockPreview: {
    width: 30,
    height: 30,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#333',
  },
  dangerButton: {
    backgroundColor: '#dc3545',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
  },
  dangerButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  footer: {
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 20,
  },
  versionText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  copyrightText: {
    fontSize: 12,
    color: '#555',
  },
});