import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Card, Title, Text, Button, Surface, Avatar, Chip } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import * as Animatable from 'react-native-animatable';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { gameColors } from '../theme/gameTheme';

export default function StoreScreen() {
  const [coins, setCoins] = useState(0);
  const [ownedCharacters, setOwnedCharacters] = useState(['default']);
  const [selectedCharacter, setSelectedCharacter] = useState('default');

  useEffect(() => {
    loadStoreData();
  }, []);

  const loadStoreData = async () => {
    try {
      const totalCoins = await AsyncStorage.getItem('totalCoins');
      const owned = await AsyncStorage.getItem('ownedCharacters');
      const selected = await AsyncStorage.getItem('selectedCharacter');
      
      setCoins(totalCoins ? parseInt(totalCoins) : 0);
      setOwnedCharacters(owned ? JSON.parse(owned) : ['default']);
      setSelectedCharacter(selected || 'default');
    } catch (error) {
      console.error('Error loading store data:', error);
    }
  };

  const characters = [
    {
      id: 'default',
      name: 'Temple Runner',
      description: 'The classic temple explorer',
      price: 0,
      icon: 'person',
      color: '#ff6b6b',
      rarity: 'Common',
    },
    {
      id: 'ninja',
      name: 'Shadow Ninja',
      description: 'Swift and silent warrior',
      price: 100,
      icon: 'people',
      color: '#2c2c54',
      rarity: 'Rare',
    },
    {
      id: 'knight',
      name: 'Temple Knight',
      description: 'Armored protector of ancient ruins',
      price: 200,
      icon: 'shield',
      color: '#ffd93d',
      rarity: 'Epic',
    },
    {
      id: 'wizard',
      name: 'Mystic Wizard',
      description: 'Master of ancient magic',
      price: 300,
      icon: 'flash',
      color: '#8b5cf6',
      rarity: 'Legendary',
    },
    {
      id: 'robot',
      name: 'Cyber Runner',
      description: 'High-tech temple explorer',
      price: 500,
      icon: 'hardware-chip',
      color: '#4ecdc4',
      rarity: 'Legendary',
    },
    {
      id: 'phoenix',
      name: 'Fire Phoenix',
      description: 'Mythical fire bird',
      price: 750,
      icon: 'flame',
      color: '#ff4757',
      rarity: 'Mythic',
    },
  ];

  const powerUps = [
    {
      id: 'magnet',
      name: 'Coin Magnet',
      description: 'Attracts nearby coins automatically',
      price: 50,
      icon: 'magnet',
      color: '#ffd93d',
      duration: 30,
    },
    {
      id: 'shield',
      name: 'Protection Shield',
      description: 'Protects from one obstacle hit',
      price: 75,
      icon: 'shield-checkmark',
      color: '#4ecdc4',
      duration: 15,
    },
    {
      id: 'boost',
      name: 'Speed Boost',
      description: 'Increases running speed temporarily',
      price: 100,
      icon: 'speedometer',
      color: '#ff6b6b',
      duration: 20,
    },
    {
      id: 'multiplier',
      name: 'Score Multiplier',
      description: 'Doubles score for limited time',
      price: 150,
      icon: 'trending-up',
      color: '#a55eea',
      duration: 25,
    },
  ];

  const buyCharacter = async (character) => {
    if (coins >= character.price && !ownedCharacters.includes(character.id)) {
      try {
        const newCoins = coins - character.price;
        const newOwned = [...ownedCharacters, character.id];
        
        await AsyncStorage.setItem('totalCoins', newCoins.toString());
        await AsyncStorage.setItem('ownedCharacters', JSON.stringify(newOwned));
        
        setCoins(newCoins);
        setOwnedCharacters(newOwned);
        
        Alert.alert(
          'Purchase Successful!',
          `You've unlocked ${character.name}!`,
          [{ text: 'OK' }]
        );
      } catch (error) {
        console.error('Error buying character:', error);
      }
    } else if (coins < character.price) {
      Alert.alert(
        'Insufficient Coins',
        `You need ${character.price - coins} more coins to buy ${character.name}.`,
        [{ text: 'OK' }]
      );
    }
  };

  const selectCharacter = async (characterId) => {
    try {
      await AsyncStorage.setItem('selectedCharacter', characterId);
      setSelectedCharacter(characterId);
      Alert.alert(
        'Character Selected!',
        `${characters.find(c => c.id === characterId)?.name} is now your active character.`,
        [{ text: 'OK' }]
      );
    } catch (error) {
      console.error('Error selecting character:', error);
    }
  };

  const buyPowerUp = async (powerUp) => {
    if (coins >= powerUp.price) {
      try {
        const newCoins = coins - powerUp.price;
        await AsyncStorage.setItem('totalCoins', newCoins.toString());
        
        // Add power-up to inventory (simplified - just show success)
        setCoins(newCoins);
        
        Alert.alert(
          'Power-Up Purchased!',
          `${powerUp.name} has been added to your inventory!`,
          [{ text: 'OK' }]
        );
      } catch (error) {
        console.error('Error buying power-up:', error);
      }
    } else {
      Alert.alert(
        'Insufficient Coins',
        `You need ${powerUp.price - coins} more coins to buy ${powerUp.name}.`,
        [{ text: 'OK' }]
      );
    }
  };

  const getRarityColor = (rarity) => {
    switch (rarity) {
      case 'Common': return '#94a3b8';
      case 'Rare': return '#3b82f6';
      case 'Epic': return '#8b5cf6';
      case 'Legendary': return '#f59e0b';
      case 'Mythic': return '#ef4444';
      default: return '#94a3b8';
    }
  };

  return (
    <ScrollView style={styles.container}>
      <LinearGradient colors={['#1a1a2e', '#16213e']} style={styles.gradient}>
        
        {/* Coins Display */}
        <Animatable.View animation="fadeInDown" duration={800}>
          <Surface style={styles.coinsCard}>
            <View style={styles.coinsHeader}>
              <Ionicons name="diamond" size={32} color="#ffd93d" />
              <View style={styles.coinsInfo}>
                <Title style={styles.coinsTitle}>Your Coins</Title>
                <Text style={styles.coinsAmount}>{coins} coins</Text>
              </View>
              <Button mode="outlined" style={styles.buyCoinsButton}>
                Buy More
              </Button>
            </View>
          </Surface>
        </Animatable.View>

        {/* Characters Section */}
        <Animatable.View animation="fadeInUp" duration={800} delay={200}>
          <Surface style={styles.sectionCard}>
            <Title style={styles.sectionTitle}>🏃 Characters</Title>
            <Text style={styles.sectionSubtitle}>Unlock new characters with unique abilities</Text>
            
            {characters.map((character, index) => {
              const isOwned = ownedCharacters.includes(character.id);
              const isSelected = selectedCharacter === character.id;
              
              return (
                <Animatable.View 
                  key={character.id}
                  animation="fadeInLeft" 
                  duration={600} 
                  delay={index * 100}
                >
                  <Card style={[
                    styles.itemCard,
                    isSelected && styles.selectedCard,
                    !isOwned && styles.lockedCard
                  ]}>
                    <Card.Content>
                      <View style={styles.itemHeader}>
                        <Avatar.Icon 
                          size={50} 
                          icon={character.icon} 
                          backgroundColor={character.color}
                        />
                        <View style={styles.itemInfo}>
                          <View style={styles.itemNameRow}>
                            <Text style={styles.itemName}>{character.name}</Text>
                            <Chip 
                              style={[styles.rarityChip, { backgroundColor: getRarityColor(character.rarity) }]}
                              textStyle={styles.rarityText}
                            >
                              {character.rarity}
                            </Chip>
                          </View>
                          <Text style={styles.itemDescription}>{character.description}</Text>
                          {character.price > 0 && (
                            <Text style={styles.itemPrice}>
                              <Ionicons name="diamond" size={14} color="#ffd93d" /> {character.price}
                            </Text>
                          )}
                        </View>
                        <View style={styles.itemActions}>
                          {isSelected && (
                            <Chip style={styles.selectedChip} textStyle={{ color: '#fff' }}>
                              ACTIVE
                            </Chip>
                          )}
                          {!isOwned ? (
                            <Button
                              mode="contained"
                              style={[styles.buyButton, { backgroundColor: character.color }]}
                              onPress={() => buyCharacter(character)}
                              disabled={coins < character.price}
                            >
                              Buy
                            </Button>
                          ) : !isSelected ? (
                            <Button
                              mode="outlined"
                              style={styles.selectButton}
                              onPress={() => selectCharacter(character.id)}
                            >
                              Select
                            </Button>
                          ) : null}
                        </View>
                      </View>
                    </Card.Content>
                  </Card>
                </Animatable.View>
              );
            })}
          </Surface>
        </Animatable.View>

        {/* Power-Ups Section */}
        <Animatable.View animation="fadeInUp" duration={800} delay={400}>
          <Surface style={styles.sectionCard}>
            <Title style={styles.sectionTitle}>⚡ Power-Ups</Title>
            <Text style={styles.sectionSubtitle}>Boost your performance with special abilities</Text>
            
            {powerUps.map((powerUp, index) => (
              <Animatable.View 
                key={powerUp.id}
                animation="fadeInRight" 
                duration={600} 
                delay={index * 100}
              >
                <Card style={styles.itemCard}>
                  <Card.Content>
                    <View style={styles.itemHeader}>
                      <Avatar.Icon 
                        size={50} 
                        icon={powerUp.icon} 
                        backgroundColor={powerUp.color}
                      />
                      <View style={styles.itemInfo}>
                        <Text style={styles.itemName}>{powerUp.name}</Text>
                        <Text style={styles.itemDescription}>{powerUp.description}</Text>
                        <Text style={styles.powerUpDuration}>
                          Duration: {powerUp.duration}s
                        </Text>
                        <Text style={styles.itemPrice}>
                          <Ionicons name="diamond" size={14} color="#ffd93d" /> {powerUp.price}
                        </Text>
                      </View>
                      <View style={styles.itemActions}>
                        <Button
                          mode="contained"
                          style={[styles.buyButton, { backgroundColor: powerUp.color }]}
                          onPress={() => buyPowerUp(powerUp)}
                          disabled={coins < powerUp.price}
                        >
                          Buy
                        </Button>
                      </View>
                    </View>
                  </Card.Content>
                </Card>
              </Animatable.View>
            ))}
          </Surface>
        </Animatable.View>

        {/* Daily Deals */}
        <Animatable.View animation="fadeInUp" duration={800} delay={600}>
          <Surface style={styles.sectionCard}>
            <Title style={styles.sectionTitle}>🔥 Daily Deals</Title>
            <Text style={styles.sectionSubtitle}>Limited time offers - Reset in 12:34:56</Text>
            
            <Card style={[styles.itemCard, styles.dealCard]}>
              <Card.Content>
                <View style={styles.dealHeader}>
                  <Text style={styles.dealBadge}>50% OFF</Text>
                  <Text style={styles.dealTitle}>Starter Pack</Text>
                </View>
                <Text style={styles.dealDescription}>
                  Get Shadow Ninja + 3 Power-Ups + 200 Bonus Coins
                </Text>
                <View style={styles.dealPricing}>
                  <Text style={styles.originalPrice}>
                    <Ionicons name="diamond" size={16} color="#666" /> 300
                  </Text>
                  <Text style={styles.dealPrice}>
                    <Ionicons name="diamond" size={16} color="#ffd93d" /> 150
                  </Text>
                </View>
                <Button
                  mode="contained"
                  style={styles.dealButton}
                  disabled={coins < 150}
                >
                  Claim Deal
                </Button>
              </Card.Content>
            </Card>
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
  coinsCard: {
    backgroundColor: 'rgba(22, 33, 62, 0.9)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    elevation: 8,
  },
  coinsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  coinsInfo: {
    flex: 1,
    marginLeft: 15,
  },
  coinsTitle: {
    color: '#fff',
    fontSize: 18,
  },
  coinsAmount: {
    color: '#ffd93d',
    fontSize: 24,
    fontWeight: 'bold',
  },
  buyCoinsButton: {
    borderColor: '#ffd93d',
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
    fontSize: 20,
    textAlign: 'center',
  },
  sectionSubtitle: {
    color: '#ccc',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
  },
  itemCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    marginBottom: 12,
    borderRadius: 12,
  },
  selectedCard: {
    borderWidth: 2,
    borderColor: '#ff6b6b',
    backgroundColor: 'rgba(255, 107, 107, 0.1)',
  },
  lockedCard: {
    opacity: 0.7,
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemInfo: {
    flex: 1,
    marginLeft: 15,
  },
  itemNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  itemName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  rarityChip: {
    marginLeft: 10,
  },
  rarityText: {
    color: '#fff',
    fontSize: 10,
  },
  itemDescription: {
    color: '#ccc',
    fontSize: 12,
    marginBottom: 5,
  },
  itemPrice: {
    color: '#ffd93d',
    fontSize: 14,
    fontWeight: 'bold',
  },
  powerUpDuration: {
    color: '#4ecdc4',
    fontSize: 12,
    marginBottom: 5,
  },
  itemActions: {
    alignItems: 'flex-end',
  },
  selectedChip: {
    backgroundColor: '#4ecdc4',
    marginBottom: 10,
  },
  buyButton: {
    borderRadius: 8,
  },
  selectButton: {
    borderColor: '#4ecdc4',
    borderRadius: 8,
  },
  dealCard: {
    borderWidth: 2,
    borderColor: '#ff6b6b',
    backgroundColor: 'rgba(255, 107, 107, 0.1)',
  },
  dealHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  dealBadge: {
    backgroundColor: '#ff6b6b',
    color: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    fontSize: 12,
    fontWeight: 'bold',
    marginRight: 10,
  },
  dealTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  dealDescription: {
    color: '#ccc',
    fontSize: 14,
    marginBottom: 15,
  },
  dealPricing: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  originalPrice: {
    color: '#666',
    fontSize: 16,
    textDecorationLine: 'line-through',
    marginRight: 15,
  },
  dealPrice: {
    color: '#ffd93d',
    fontSize: 20,
    fontWeight: 'bold',
  },
  dealButton: {
    backgroundColor: '#ff6b6b',
  },
});