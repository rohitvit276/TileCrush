import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { PaperProvider } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

// Import screens
import HomeScreen from './src/screens/HomeScreen';
import MoodDetectionScreen from './src/screens/MoodDetectionScreen';
import MusicRecommendationsScreen from './src/screens/MusicRecommendationsScreen';
import MoodHistoryScreen from './src/screens/MoodHistoryScreen';
import SettingsScreen from './src/screens/SettingsScreen';

// Import theme
import { theme } from './src/theme/theme';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <PaperProvider theme={theme}>
      <NavigationContainer>
        <StatusBar style="light" backgroundColor="#6366f1" />
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;

              if (route.name === 'Home') {
                iconName = focused ? 'home' : 'home-outline';
              } else if (route.name === 'Detect Mood') {
                iconName = focused ? 'camera' : 'camera-outline';
              } else if (route.name === 'Music') {
                iconName = focused ? 'musical-notes' : 'musical-notes-outline';
              } else if (route.name === 'History') {
                iconName = focused ? 'analytics' : 'analytics-outline';
              } else if (route.name === 'Settings') {
                iconName = focused ? 'settings' : 'settings-outline';
              }

              return <Ionicons name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: '#6366f1',
            tabBarInactiveTintColor: 'gray',
            headerStyle: {
              backgroundColor: '#6366f1',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          })}
        >
          <Tab.Screen 
            name="Home" 
            component={HomeScreen}
            options={{ title: 'Music Mood Mapper' }}
          />
          <Tab.Screen 
            name="Detect Mood" 
            component={MoodDetectionScreen}
            options={{ title: 'Detect Your Mood' }}
          />
          <Tab.Screen 
            name="Music" 
            component={MusicRecommendationsScreen}
            options={{ title: 'Music for You' }}
          />
          <Tab.Screen 
            name="History" 
            component={MoodHistoryScreen}
            options={{ title: 'Mood History' }}
          />
          <Tab.Screen 
            name="Settings" 
            component={SettingsScreen}
            options={{ title: 'Settings' }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}