import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, FlatList, Linking, Alert } from 'react-native';
import { Card, Title, Text, Button, Surface, Chip, Avatar, Searchbar } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { moodColors } from '../theme/theme';
import { getMoodSongs, getAllSongs, languageOptions } from '../data/musicDatabase';
import LanguageSelector from '../components/LanguageSelector';

// Legacy database for backward compatibility
const legacyMusicDatabase = {
  happy: [
    { id: 1, title: "Happy", artist: "Pharrell Williams", genre: "Pop", spotify: "spotify:track:60nZcImufyMA1MKQY3dcCH", youtube: "ZbZSe6N_BXs" },
    { id: 2, title: "Good as Hell", artist: "Lizzo", genre: "Pop", spotify: "spotify:track:1PVzeHeNMg2HSS8nOcbBaL", youtube: "SmbmeOgWsqE" },
    { id: 3, title: "Can't Stop the Feeling!", artist: "Justin Timberlake", genre: "Pop", spotify: "spotify:track:4bHsxqR3GMrXTxEPLuK5ue", youtube: "ru0K8uYEZWw" },
    { id: 4, title: "Walking on Sunshine", artist: "Katrina and the Waves", genre: "Pop", spotify: "spotify:track:05wIrZSwuaVWhcv5FfqeH0", youtube: "iPUmE-tne5U" },
    { id: 5, title: "Don't Worry Be Happy", artist: "Bobby McFerrin", genre: "Reggae", spotify: "spotify:track:6ejkqvGiTlHd8uQyNcYAWX", youtube: "d-diB65scQU" },
  ],
  calm: [
    { id: 6, title: "Weightless", artist: "Marconi Union", genre: "Ambient", spotify: "spotify:track:6p0q6zNVgbOi6YfhXKGdZf", youtube: "UfcAVejslrU" },
    { id: 7, title: "Clair de Lune", artist: "Claude Debussy", genre: "Classical", spotify: "spotify:track:4Nd5HJn4EExnLmHtClk4QV", youtube: "CvFH_6DNRCY" },
    { id: 8, title: "Mad World", artist: "Gary Jules", genre: "Alternative", spotify: "spotify:track:4Mw9Gcu1LT7JaWXzr0Q62z", youtube: "4N3N1MlvVc4" },
    { id: 9, title: "The Night We Met", artist: "Lord Huron", genre: "Indie Folk", spotify: "spotify:track:0RiRZpuVRbi7oqRdSMwhQY", youtube: "KtlgYxa6BMU" },
    { id: 10, title: "Holocene", artist: "Bon Iver", genre: "Indie Folk", spotify: "spotify:track:2JMcU3A8HgrjqoVkm1BqlP", youtube: "TWcyIpul8OE" },
  ],
  excited: [
    { id: 11, title: "Uptown Funk", artist: "Mark Ronson ft. Bruno Mars", genre: "Funk", spotify: "spotify:track:32OlwWuMpZ6b0aN2RZOeMS", youtube: "OPf0YbXqDm0" },
    { id: 12, title: "I Gotta Feeling", artist: "The Black Eyed Peas", genre: "Pop", spotify: "spotify:track:4uLU6hMCjMI75M1A2tKUQC", youtube: "uSD4vsh1zDA" },
    { id: 13, title: "Pump It", artist: "The Black Eyed Peas", genre: "Hip Hop", spotify: "spotify:track:3URxKF1bxVUH3pUfm9r9vE", youtube: "ZaI2IlHwmgQ" },
    { id: 14, title: "Thunder", artist: "Imagine Dragons", genre: "Pop Rock", spotify: "spotify:track:1zB4vmk8tFRmM9UULNzbLB", youtube: "fKopy74weus" },
    { id: 15, title: "Levitating", artist: "Dua Lipa", genre: "Pop", spotify: "spotify:track:463CkQjx2Zk1yXoBuierM9", youtube: "TUVcZfQe-Kw" },
  ],
  sad: [
    { id: 16, title: "Hurt", artist: "Johnny Cash", genre: "Country", spotify: "spotify:track:2m3ObA3wvkBRjUsf8Zmbxz", youtube: "8AHCfZTRGiI" },
    { id: 17, title: "Mad World", artist: "Gary Jules", genre: "Alternative", spotify: "spotify:track:4Mw9Gcu1LT7JaWXzr0Q62z", youtube: "4N3N1MlvVc4" },
    { id: 18, title: "Black", artist: "Pearl Jam", genre: "Grunge", spotify: "spotify:track:4RA3F2WGsZKuxny4qTLXNz", youtube: "5ChbxMVgGV4" },
    { id: 19, title: "Tears in Heaven", artist: "Eric Clapton", genre: "Rock", spotify: "spotify:track:4bHsxqR3GMrXTxEPLuK5ue", youtube: "JxPj3GAYYZ0" },
    { id: 20, title: "Everybody Hurts", artist: "R.E.M.", genre: "Alternative Rock", spotify: "spotify:track:0qYTZCo5Bwh1nsUFGZP3zn", youtube: "5rOiW_xY-kc" },
  ],
  energetic: [
    { id: 21, title: "Eye of the Tiger", artist: "Survivor", genre: "Rock", spotify: "spotify:track:2HHtWyy5CgaQbC7XSoOb0e", youtube: "btPJPFnesV4" },
    { id: 22, title: "Stronger", artist: "Kanye West", genre: "Hip Hop", spotify: "spotify:track:0NhOmTiGHTzpoaXjZqagSJ", youtube: "PsO6ZnUZI0g" },
    { id: 23, title: "Till I Collapse", artist: "Eminem", genre: "Hip Hop", spotify: "spotify:track:4xkOaSrkexMciUUogZKVNi", youtube: "_Yhyp-_hX2s" },
    { id: 24, title: "Don't Stop Me Now", artist: "Queen", genre: "Rock", spotify: "spotify:track:5T8EDUDqKcs6OSOwQlwMlf", youtube: "HgzGwKwLmgM" },
    { id: 25, title: "Pump It Up", artist: "Elvis Costello", genre: "New Wave", spotify: "spotify:track:7rSfbKa4P2bFUZ4yNoG8xT", youtube: "EmMRSqXQn3w" },
  ],
  peaceful: [
    { id: 26, title: "Aqueous Transmission", artist: "Incubus", genre: "Alternative Rock", spotify: "spotify:track:1gJnBbWnkTnVw8niqk7dWI", youtube: "3k0-sGqxIiQ" },
    { id: 27, title: "Samsara", artist: "Audiomachine", genre: "Cinematic", spotify: "spotify:track:2vbHYcUDrA8B9Bfb8kLsqX", youtube: "QiSokgUgQfw" },
    { id: 28, title: "On Nature", artist: "Max Richter", genre: "Neoclassical", spotify: "spotify:track: ", youtube: "k-X1AKcPF3Y" },
    { id: 29, title: "River", artist: "Leon Bridges", genre: "Soul", spotify: "spotify:track:4gphxUgq0SCSOClUBJOHaS", youtube: "0Hegd4xNfRo" },
    { id: 30, title: "The Swan", artist: "Camille Saint-Saëns", genre: "Classical", spotify: "spotify:track:2Foc5Q5nqNiosCNqttzHof", youtube: "u8s7h7sboQw" },
  ],
  neutral: [
    { id: 31, title: "Fluorescent Adolescent", artist: "Arctic Monkeys", genre: "Indie Rock", spotify: "spotify:track:4qS6lbKRKMjhww4a96MdYj", youtube: "ma9I9VBKPiw" },
    { id: 32, title: "Mr. Brightside", artist: "The Killers", genre: "Alternative Rock", spotify: "spotify:track:003vvx7Niy0ywjVN9WqfLx", youtube: "gGdGFtwCNBE" },
    { id: 33, title: "Take Me Out", artist: "Franz Ferdinand", genre: "Indie Rock", spotify: "spotify:track:0J9paBmImIBXGiKyOstd4P", youtube: "Ijk4j-r7qPA" },
    { id: 34, title: "Seven Nation Army", artist: "The White Stripes", genre: "Alternative Rock", spotify: "spotify:track:3dPQuX8Gs42Y7b454ybpMR", youtube: "0J2QdDbelmY" },
    { id: 35, title: "Use Somebody", artist: "Kings of Leon", genre: "Alternative Rock", spotify: "spotify:track:6b8Be6ljOzmkOmFslEb23P", youtube: "gnhXHvRoUd0" },
  ],
};

export default function MusicRecommendationsScreen({ route }) {
  const [selectedMood, setSelectedMood] = useState(route?.params?.mood || 'neutral');
  const [selectedLanguage, setSelectedLanguage] = useState('english');
  const [searchQuery, setSearchQuery] = useState('');
  const [recommendations, setRecommendations] = useState([]);
  const [filteredRecommendations, setFilteredRecommendations] = useState([]);

  useEffect(() => {
    loadLanguagePreference();
  }, []);

  useEffect(() => {
    loadRecommendations();
  }, [selectedMood, selectedLanguage]);

  useEffect(() => {
    filterRecommendations();
  }, [searchQuery, recommendations]);

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

  const loadRecommendations = () => {
    const moodSongs = getMoodSongs(selectedLanguage, selectedMood);
    setRecommendations(moodSongs);
  };

  const filterRecommendations = () => {
    if (!searchQuery.trim()) {
      setFilteredRecommendations(recommendations);
      return;
    }

    const filtered = recommendations.filter(song =>
      song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      song.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
      song.genre.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredRecommendations(filtered);
  };

  const openSpotify = (spotifyUri) => {
    const spotifyUrl = `https://open.spotify.com/track/${spotifyUri.split(':')[2]}`;
    Linking.canOpenURL(spotifyUrl).then(supported => {
      if (supported) {
        Linking.openURL(spotifyUrl);
      } else {
        Alert.alert('Spotify not available', 'Please install Spotify to play this song.');
      }
    });
  };

  const openYouTube = (videoId) => {
    const youtubeUrl = `https://www.youtube.com/watch?v=${videoId}`;
    Linking.canOpenURL(youtubeUrl).then(supported => {
      if (supported) {
        Linking.openURL(youtubeUrl);
      } else {
        Alert.alert('YouTube not available', 'Please install YouTube to play this song.');
      }
    });
  };

  const renderMoodSelector = () => (
    <Surface style={styles.moodSelector}>
      <Title style={styles.selectorTitle}>Select Mood / मूड चुनें</Title>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.moodChips}>
        {Object.keys(legacyMusicDatabase).map((mood) => (
          <Chip
            key={mood}
            selected={selectedMood === mood}
            onPress={() => setSelectedMood(mood)}
            style={[
              styles.moodChip,
              selectedMood === mood && { backgroundColor: moodColors[mood] }
            ]}
            textStyle={selectedMood === mood && { color: 'white' }}
          >
            {mood.charAt(0).toUpperCase() + mood.slice(1)}
          </Chip>
        ))}
      </ScrollView>
    </Surface>
  );

  const renderSongCard = ({ item, index }) => (
    <Animatable.View animation="fadeInUp" delay={index * 100}>
      <Card style={styles.songCard}>
        <Card.Content>
          <View style={styles.songHeader}>
            <Avatar.Icon 
              size={50} 
              icon="music-note" 
              style={{ backgroundColor: moodColors[selectedMood] }}
            />
            <View style={styles.songInfo}>
              <Title style={styles.songTitle}>{item.title}</Title>
              <Text style={styles.songArtist}>{item.artist}</Text>
              <Chip size="small" style={styles.genreChip}>
                {item.genre}
              </Chip>
            </View>
          </View>
          
          <View style={styles.songActions}>
            <Button
              mode="contained"
              icon="spotify"
              onPress={() => openSpotify(item.spotify)}
              style={[styles.actionButton, { backgroundColor: '#1DB954' }]}
              compact
            >
              Spotify
            </Button>
            <Button
              mode="contained"
              icon="youtube"
              onPress={() => openYouTube(item.youtube)}
              style={[styles.actionButton, { backgroundColor: '#FF0000' }]}
              compact
            >
              YouTube
            </Button>
          </View>
        </Card.Content>
      </Card>
    </Animatable.View>
  );

  const getLanguageLabel = () => {
    const lang = languageOptions.find(l => l.value === selectedLanguage);
    return lang ? lang.label : 'English';
  };

  return (
    <View style={styles.container}>
      <LanguageSelector
        selectedLanguage={selectedLanguage}
        onLanguageChange={handleLanguageChange}
      />
      
      {renderMoodSelector()}
      
      <Surface style={styles.searchContainer}>
        <Searchbar
          placeholder={selectedLanguage === 'hindi' ? 
            "गाने, कलाकार या शैली खोजें..." : 
            "Search songs, artists, or genres..."
          }
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchBar}
          icon="magnify"
          clearIcon="close"
        />
      </Surface>

      <View style={styles.content}>
        <View style={styles.headerSection}>
          <Title style={styles.sectionTitle}>
            {selectedLanguage === 'hindi' ? 
              `${selectedMood.charAt(0).toUpperCase() + selectedMood.slice(1)} मूड के लिए संगीत` :
              `Music for ${selectedMood.charAt(0).toUpperCase() + selectedMood.slice(1)} Mood`
            }
          </Title>
          <Text style={styles.sectionSubtitle}>
            {selectedLanguage === 'hindi' ? 
              `${filteredRecommendations.length} गाने मिले (${getLanguageLabel()})` :
              `${filteredRecommendations.length} songs found (${getLanguageLabel()})`
            }
          </Text>
        </View>

        <FlatList
          data={filteredRecommendations}
          renderItem={renderSongCard}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.songsList}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Ionicons name="musical-notes-outline" size={64} color="#ccc" />
              <Text style={styles.emptyText}>
                {searchQuery ? 
                  (selectedLanguage === 'hindi' ? 'कोई गाना आपकी खोज से मेल नहीं खाता' : 'No songs match your search') :
                  (selectedLanguage === 'hindi' ? 'कोई सिफारिश उपलब्ध नहीं' : 'No recommendations available')
                }
              </Text>
              {searchQuery && (
                <Button mode="outlined" onPress={() => setSearchQuery('')}>
                  {selectedLanguage === 'hindi' ? 'खोज साफ़ करें' : 'Clear Search'}
                </Button>
              )}
            </View>
          }
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafafa',
  },
  moodSelector: {
    margin: 20,
    marginBottom: 10,
    padding: 15,
    borderRadius: 12,
    elevation: 2,
  },
  selectorTitle: {
    fontSize: 18,
    marginBottom: 10,
  },
  moodChips: {
    paddingHorizontal: 5,
    gap: 8,
  },
  moodChip: {
    marginRight: 8,
  },
  searchContainer: {
    marginHorizontal: 20,
    marginBottom: 10,
    borderRadius: 12,
    elevation: 2,
  },
  searchBar: {
    elevation: 0,
    backgroundColor: 'transparent',
  },
  content: {
    flex: 1,
    marginHorizontal: 20,
  },
  headerSection: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  songsList: {
    paddingBottom: 20,
  },
  songCard: {
    marginBottom: 12,
    elevation: 2,
    borderRadius: 12,
  },
  songHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  songInfo: {
    marginLeft: 15,
    flex: 1,
  },
  songTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  songArtist: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  genreChip: {
    alignSelf: 'flex-start',
    backgroundColor: '#e0e7ff',
  },
  songActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: 10,
  },
  actionButton: {
    flex: 1,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    marginTop: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
});