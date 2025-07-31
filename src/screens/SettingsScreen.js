import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert, Linking } from 'react-native';
import { List, Switch, Card, Title, Text, Button, Surface, Divider } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Animatable from 'react-native-animatable';

export default function SettingsScreen({ navigation }) {
  const [notifications, setNotifications] = useState(true);
  const [autoSave, setAutoSave] = useState(true);
  const [highQuality, setHighQuality] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [dataCount, setDataCount] = useState({ moods: 0, songs: 0 });

  useEffect(() => {
    loadSettings();
    loadDataStats();
  }, []);

  const loadSettings = async () => {
    try {
      const settings = await AsyncStorage.getItem('appSettings');
      if (settings) {
        const parsed = JSON.parse(settings);
        setNotifications(parsed.notifications ?? true);
        setAutoSave(parsed.autoSave ?? true);
        setHighQuality(parsed.highQuality ?? false);
        setDarkMode(parsed.darkMode ?? false);
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const saveSettings = async (newSettings) => {
    try {
      const currentSettings = {
        notifications,
        autoSave,
        highQuality,
        darkMode,
        ...newSettings
      };
      await AsyncStorage.setItem('appSettings', JSON.stringify(currentSettings));
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  };

  const loadDataStats = async () => {
    try {
      const moodHistory = await AsyncStorage.getItem('moodHistory');
      const moodCount = moodHistory ? JSON.parse(moodHistory).length : 0;
      
      setDataCount({
        moods: moodCount,
        songs: moodCount * 3 // Assuming 3 song recommendations per mood
      });
    } catch (error) {
      console.error('Error loading data stats:', error);
    }
  };

  const handleNotificationToggle = () => {
    const newValue = !notifications;
    setNotifications(newValue);
    saveSettings({ notifications: newValue });
  };

  const handleAutoSaveToggle = () => {
    const newValue = !autoSave;
    setAutoSave(newValue);
    saveSettings({ autoSave: newValue });
  };

  const handleHighQualityToggle = () => {
    const newValue = !highQuality;
    setHighQuality(newValue);
    saveSettings({ highQuality: newValue });
  };

  const handleDarkModeToggle = () => {
    const newValue = !darkMode;
    setDarkMode(newValue);
    saveSettings({ darkMode: newValue });
    Alert.alert(
      'Restart Required',
      'Dark mode changes will take effect after restarting the app.',
      [{ text: 'OK' }]
    );
  };

  const exportData = async () => {
    try {
      const moodHistory = await AsyncStorage.getItem('moodHistory');
      const settings = await AsyncStorage.getItem('appSettings');
      
      const exportData = {
        moodHistory: moodHistory ? JSON.parse(moodHistory) : [],
        settings: settings ? JSON.parse(settings) : {},
        exportDate: new Date().toISOString(),
        appVersion: '1.0.0'
      };

      // In a real app, this would save to file or share
      Alert.alert(
        'Export Complete',
        `Exported ${exportData.moodHistory.length} mood entries and settings. In a production app, this would save to your device or cloud storage.`,
        [{ text: 'OK' }]
      );
    } catch (error) {
      Alert.alert('Export Failed', 'Failed to export data: ' + error.message);
    }
  };

  const clearAllData = () => {
    Alert.alert(
      'Clear All Data',
      'This will permanently delete all your mood history and reset settings. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete All',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.multiRemove(['moodHistory', 'appSettings']);
              setDataCount({ moods: 0, songs: 0 });
              
              // Reset settings to defaults
              setNotifications(true);
              setAutoSave(true);
              setHighQuality(false);
              setDarkMode(false);
              
              Alert.alert('Success', 'All data has been cleared.');
            } catch (error) {
              Alert.alert('Error', 'Failed to clear data: ' + error.message);
            }
          }
        }
      ]
    );
  };

  const openPrivacyPolicy = () => {
    Alert.alert(
      'Privacy Policy',
      'Music Mood Mapper is committed to protecting your privacy. All mood detection data is stored locally on your device and is never shared with third parties. Camera and microphone access is used only for mood detection and recordings are not stored permanently.',
      [{ text: 'OK' }]
    );
  };

  const openSupport = () => {
    Alert.alert(
      'Support',
      'Need help? Contact our support team at support@musicmoodmapper.com or visit our FAQ section.',
      [
        { text: 'Cancel' },
        { text: 'Email Support', onPress: () => Linking.openURL('mailto:support@musicmoodmapper.com') }
      ]
    );
  };

  const rateApp = () => {
    Alert.alert(
      'Rate Music Mood Mapper',
      'Enjoying the app? Please rate us on the app store to help others discover Music Mood Mapper!',
      [
        { text: 'Later' },
        { text: 'Rate Now', onPress: () => {
          // In production, this would open the app store
          Alert.alert('Thank you!', 'This would open the app store in a production app.');
        }}
      ]
    );
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Animatable.View animation="fadeInUp" duration={800}>
        <Card style={styles.statsCard}>
          <Card.Content>
            <Title style={styles.statsTitle}>Your Music Journey</Title>
            <View style={styles.statsGrid}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{dataCount.moods}</Text>
                <Text style={styles.statLabel}>Moods Detected</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{dataCount.songs}</Text>
                <Text style={styles.statLabel}>Songs Discovered</Text>
              </View>
            </View>
          </Card.Content>
        </Card>
      </Animatable.View>

      <Animatable.View animation="fadeInUp" duration={800} delay={200}>
        <Surface style={styles.section}>
          <Title style={styles.sectionTitle}>Preferences</Title>
          
          <List.Item
            title="Enable Notifications"
            description="Get reminders to track your mood"
            left={props => <List.Icon {...props} icon="bell-outline" />}
            right={() => (
              <Switch
                value={notifications}
                onValueChange={handleNotificationToggle}
              />
            )}
          />
          
          <Divider />
          
          <List.Item
            title="Auto-save Photos"
            description="Automatically save mood detection photos to gallery"
            left={props => <List.Icon {...props} icon="content-save-outline" />}
            right={() => (
              <Switch
                value={autoSave}
                onValueChange={handleAutoSaveToggle}
              />
            )}
          />
          
          <Divider />
          
          <List.Item
            title="High Quality Analysis"
            description="Use enhanced mood detection (uses more battery)"
            left={props => <List.Icon {...props} icon="high-definition" />}
            right={() => (
              <Switch
                value={highQuality}
                onValueChange={handleHighQualityToggle}
              />
            )}
          />
          
          <Divider />
          
          <List.Item
            title="Dark Mode"
            description="Switch to dark theme (requires restart)"
            left={props => <List.Icon {...props} icon="weather-night" />}
            right={() => (
              <Switch
                value={darkMode}
                onValueChange={handleDarkModeToggle}
              />
            )}
          />
        </Surface>
      </Animatable.View>

      <Animatable.View animation="fadeInUp" duration={800} delay={400}>
        <Surface style={styles.section}>
          <Title style={styles.sectionTitle}>Data Management</Title>
          
          <List.Item
            title="Export Data"
            description="Save your mood history and settings"
            left={props => <List.Icon {...props} icon="download-outline" />}
            onPress={exportData}
          />
          
          <Divider />
          
          <List.Item
            title="Clear All Data"
            description="Delete all mood history and reset settings"
            left={props => <List.Icon {...props} icon="delete-outline" color="#ef4444" />}
            onPress={clearAllData}
          />
        </Surface>
      </Animatable.View>

      <Animatable.View animation="fadeInUp" duration={800} delay={600}>
        <Surface style={styles.section}>
          <Title style={styles.sectionTitle}>Music Services</Title>
          
          <List.Item
            title="Connect Spotify"
            description="Link your Spotify account for personalized playlists"
            left={props => <List.Icon {...props} icon="spotify" />}
            right={props => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => Alert.alert('Coming Soon', 'Spotify integration will be available in a future update.')}
          />
          
          <Divider />
          
          <List.Item
            title="YouTube Music"
            description="Connect YouTube Music for enhanced recommendations"
            left={props => <List.Icon {...props} icon="youtube" />}
            right={props => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => Alert.alert('Coming Soon', 'YouTube Music integration will be available in a future update.')}
          />
        </Surface>
      </Animatable.View>

      <Animatable.View animation="fadeInUp" duration={800} delay={800}>
        <Surface style={styles.section}>
          <Title style={styles.sectionTitle}>Support & Feedback</Title>
          
          <List.Item
            title="Privacy Policy"
            description="Learn how we protect your data"
            left={props => <List.Icon {...props} icon="shield-check-outline" />}
            right={props => <List.Icon {...props} icon="chevron-right" />}
            onPress={openPrivacyPolicy}
          />
          
          <Divider />
          
          <List.Item
            title="Help & Support"
            description="Get help and contact support"
            left={props => <List.Icon {...props} icon="help-circle-outline" />}
            right={props => <List.Icon {...props} icon="chevron-right" />}
            onPress={openSupport}
          />
          
          <Divider />
          
          <List.Item
            title="Rate the App"
            description="Share your experience on the app store"
            left={props => <List.Icon {...props} icon="star-outline" />}
            right={props => <List.Icon {...props} icon="chevron-right" />}
            onPress={rateApp}
          />
        </Surface>
      </Animatable.View>

      <Animatable.View animation="fadeInUp" duration={800} delay={1000}>
        <Card style={styles.infoCard}>
          <Card.Content style={styles.infoContent}>
            <Text style={styles.appName}>Music Mood Mapper</Text>
            <Text style={styles.version}>Version 1.0.0</Text>
            <Text style={styles.description}>
              Discover music that matches your mood through AI-powered emotion detection.
            </Text>
          </Card.Content>
        </Card>
      </Animatable.View>

      <View style={styles.bottomPadding} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafafa',
  },
  statsCard: {
    margin: 20,
    marginBottom: 10,
    elevation: 4,
    borderRadius: 12,
  },
  statsTitle: {
    textAlign: 'center',
    marginBottom: 15,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#6366f1',
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  section: {
    margin: 20,
    marginTop: 10,
    borderRadius: 12,
    elevation: 2,
    overflow: 'hidden',
  },
  sectionTitle: {
    padding: 20,
    paddingBottom: 10,
    fontSize: 18,
  },
  infoCard: {
    margin: 20,
    marginTop: 10,
    elevation: 2,
    borderRadius: 12,
  },
  infoContent: {
    alignItems: 'center',
    padding: 30,
  },
  appName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#6366f1',
    marginBottom: 5,
  },
  version: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
  },
  description: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
  },
  bottomPadding: {
    height: 30,
  },
});