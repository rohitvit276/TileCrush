import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Provider as PaperProvider } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { View, StyleSheet } from 'react-native';

// Import screens
import GameScreen from './src/screens/GameScreen';
import MenuScreen from './src/screens/MenuScreen';
import LeaderboardScreen from './src/screens/LeaderboardScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import StoreScreen from './src/screens/StoreScreen';

// Import theme
import { gameTheme } from './src/theme/gameTheme';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <PaperProvider theme={gameTheme}>
      <NavigationContainer>
        <StatusBar style="light" backgroundColor="#1a1a2e" />
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;

              if (route.name === 'Play') {
                iconName = focused ? 'play-circle' : 'play-circle-outline';
              } else if (route.name === 'Menu') {
                iconName = focused ? 'home' : 'home-outline';
              } else if (route.name === 'Leaderboard') {
                iconName = focused ? 'trophy' : 'trophy-outline';
              } else if (route.name === 'Store') {
                iconName = focused ? 'storefront' : 'storefront-outline';
              } else if (route.name === 'Settings') {
                iconName = focused ? 'settings' : 'settings-outline';
              }

              return <Ionicons name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: '#ff6b6b',
            tabBarInactiveTintColor: 'gray',
            tabBarStyle: {
              backgroundColor: '#1a1a2e',
              borderTopColor: '#ff6b6b',
              borderTopWidth: 1,
            },
            headerStyle: {
              backgroundColor: '#1a1a2e',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          })}
        >
          <Tab.Screen 
            name="Menu" 
            component={MenuScreen} 
            options={{ title: 'Temple Runner' }}
          />
          <Tab.Screen 
            name="Play" 
            component={GameScreen} 
            options={{ title: 'Play Game' }}
          />
          <Tab.Screen 
            name="Store" 
            component={StoreScreen} 
            options={{ title: 'Character Store' }}
          />
          <Tab.Screen 
            name="Leaderboard" 
            component={LeaderboardScreen} 
            options={{ title: 'Leaderboard' }}
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