import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { Card, Title, Paragraph, Button, Surface, Text, Avatar } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import * as Animatable from 'react-native-animatable';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { moodColors } from '../theme/theme';
import LanguageSelector from '../components/LanguageSelector';

const { width } = Dimensions.get('window');

export default function HomeScreen({ navigation }) {
  const [recentMood, setRecentMood] = useState(null);
  const [totalSessions, setTotalSessions] = useState(0);
  const [selectedLanguage, setSelectedLanguage] = useState('english');

  useEffect(() => {
    loadRecentData();
    loadLanguagePreference();
  }, []);

  const loadRecentData = async () => {
    try {
      const moodHistory = await AsyncStorage.getItem('moodHistory');
      if (moodHistory) {
        const history = JSON.parse(moodHistory);
        if (history.length > 0) {
          setRecentMood(history[history.length - 1]);
          setTotalSessions(history.length);
        }
      }
    } catch (error) {
      console.error('Error loading recent data:', error);
    }
  };

  const loadLanguagePreference = async () => {
    try {
      const savedLanguage = await AsyncStorage.getItem('selectedLanguage');
      if (savedLanguage) {
        setSelectedLanguage(savedLanguage);
      }
    } catch (error) {
      console.error('Error loading language preference:', error);
    }
  };

  const handleLanguageChange = async (language) => {
    setSelectedLanguage(language);
    try {
      await AsyncStorage.setItem('selectedLanguage', language);
    } catch (error) {
      console.error('Error saving language preference:', error);
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <LinearGradient
        colors={['#6366f1', '#8b5cf6']}
        style={styles.header}
      >
        <Animatable.View animation="fadeInDown" duration={1000}>
          <Text style={styles.welcomeText}>
            {selectedLanguage === 'hindi' ? 'आपका स्वागत है' : 'Welcome to'}
          </Text>
          <Text style={styles.appTitle}>Music Mood Mapper</Text>
          <Text style={styles.subtitle}>
            {selectedLanguage === 'hindi' ? 
              'अपने मूड के अनुसार संगीत खोजें' : 
              'Discover music that matches your mood'
            }
          </Text>
        </Animatable.View>
      </LinearGradient>

      <View style={styles.content}>
        <LanguageSelector
          selectedLanguage={selectedLanguage}
          onLanguageChange={handleLanguageChange}
        />

        {recentMood && (
          <Animatable.View animation="fadeInUp" duration={800} delay={200}>
            <Card style={styles.recentMoodCard}>
              <Card.Content>
                <View style={styles.recentMoodHeader}>
                  <Avatar.Icon 
                    size={50} 
                    icon="emoticon-outline" 
                    style={{ backgroundColor: moodColors[recentMood.mood] || moodColors.neutral }}
                  />
                  <View style={styles.recentMoodText}>
                    <Title>
                      {selectedLanguage === 'hindi' ? 'अंतिम पहचाना गया मूड' : 'Last Detected Mood'}
                    </Title>
                    <Paragraph style={[styles.moodText, { color: moodColors[recentMood.mood] }]}>
                      {recentMood.mood.toUpperCase()}
                    </Paragraph>
                    <Text style={styles.timestamp}>
                      {new Date(recentMood.timestamp).toLocaleDateString()}
                    </Text>
                  </View>
                </View>
              </Card.Content>
            </Card>
          </Animatable.View>
        )}

        <Animatable.View animation="fadeInUp" duration={800} delay={400}>
          <Card style={styles.statsCard}>
            <Card.Content>
              <View style={styles.statsRow}>
                <View style={styles.statItem}>
                  <Ionicons name="analytics-outline" size={32} color="#6366f1" />
                  <Text style={styles.statNumber}>{totalSessions}</Text>
                  <Text style={styles.statLabel}>
                    {selectedLanguage === 'hindi' ? 'मूड सेशन' : 'Mood Sessions'}
                  </Text>
                </View>
                <View style={styles.statItem}>
                  <Ionicons name="musical-notes-outline" size={32} color="#f59e0b" />
                  <Text style={styles.statNumber}>{totalSessions * 3}</Text>
                  <Text style={styles.statLabel}>
                    {selectedLanguage === 'hindi' ? 'गाने खोजे' : 'Songs Discovered'}
                  </Text>
                </View>
              </View>
            </Card.Content>
          </Card>
        </Animatable.View>

        <Animatable.View animation="fadeInUp" duration={800} delay={600}>
          <Surface style={styles.quickActions}>
            <Title style={styles.sectionTitle}>
              {selectedLanguage === 'hindi' ? 'त्वरित कार्य' : 'Quick Actions'}
            </Title>
            
            <View style={styles.actionButtons}>
              <Button
                mode="contained"
                icon="camera-outline"
                style={[styles.actionButton, { backgroundColor: '#6366f1' }]}
                contentStyle={styles.buttonContent}
                onPress={() => navigation.navigate('Detect Mood')}
              >
                {selectedLanguage === 'hindi' ? 'मूड सेल्फी लें' : 'Take Mood Selfie'}
              </Button>

              <Button
                mode="contained"
                icon="musical-notes-outline"
                style={[styles.actionButton, { backgroundColor: '#f59e0b' }]}
                contentStyle={styles.buttonContent}
                onPress={() => navigation.navigate('Music')}
              >
                {selectedLanguage === 'hindi' ? 'संगीत ब्राउज़ करें' : 'Browse Music'}
              </Button>

              <Button
                mode="outlined"
                icon="analytics-outline"
                style={styles.actionButton}
                contentStyle={styles.buttonContent}
                onPress={() => navigation.navigate('History')}
              >
                {selectedLanguage === 'hindi' ? 'इतिहास देखें' : 'View History'}
              </Button>
            </View>
          </Surface>
        </Animatable.View>

        <Animatable.View animation="fadeInUp" duration={800} delay={800}>
          <Card style={styles.infoCard}>
            <Card.Content>
              <Title>
                {selectedLanguage === 'hindi' ? 'यह कैसे काम करता है' : 'How It Works'}
              </Title>
              <View style={styles.stepContainer}>
                <View style={styles.step}>
                  <Avatar.Icon size={40} icon="camera" style={styles.stepIcon} />
                  <Text style={styles.stepText}>
                    {selectedLanguage === 'hindi' ? 
                      'सेल्फी लें या ऑडियो रिकॉर्ड करें' : 
                      'Take a selfie or record audio'
                    }
                  </Text>
                </View>
                <View style={styles.step}>
                  <Avatar.Icon size={40} icon="brain" style={styles.stepIcon} />
                  <Text style={styles.stepText}>
                    {selectedLanguage === 'hindi' ? 
                      'AI आपके मूड का विश्लेषण करता है' : 
                      'AI analyzes your mood'
                    }
                  </Text>
                </View>
                <View style={styles.step}>
                  <Avatar.Icon size={40} icon="music" style={styles.stepIcon} />
                  <Text style={styles.stepText}>
                    {selectedLanguage === 'hindi' ? 
                      'व्यक्तिगत संगीत सिफारिशें प्राप्त करें' : 
                      'Get personalized music recommendations'
                    }
                  </Text>
                </View>
              </View>
            </Card.Content>
          </Card>
        </Animatable.View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafafa',
  },
  header: {
    padding: 30,
    paddingTop: 60,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  welcomeText: {
    fontSize: 18,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
  },
  appTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginVertical: 8,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
  },
  content: {
    padding: 20,
    paddingTop: 30,
  },
  recentMoodCard: {
    marginBottom: 20,
    elevation: 4,
    borderRadius: 12,
  },
  recentMoodHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  recentMoodText: {
    marginLeft: 15,
  },
  moodText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  timestamp: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  statsCard: {
    marginBottom: 20,
    elevation: 4,
    borderRadius: 12,
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
    color: '#1f2937',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
  },
  quickActions: {
    padding: 20,
    borderRadius: 12,
    elevation: 2,
    marginBottom: 20,
  },
  sectionTitle: {
    marginBottom: 15,
    color: '#1f2937',
  },
  actionButtons: {
    gap: 12,
  },
  actionButton: {
    borderRadius: 8,
  },
  buttonContent: {
    paddingVertical: 8,
  },
  infoCard: {
    elevation: 4,
    borderRadius: 12,
    marginBottom: 30,
  },
  stepContainer: {
    marginTop: 15,
  },
  step: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  stepIcon: {
    backgroundColor: '#e0e7ff',
  },
  stepText: {
    marginLeft: 15,
    fontSize: 16,
    flex: 1,
  },
});