import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Surface, Title, Button } from 'react-native-paper';
import { languageOptions } from '../data/musicDatabase';

const LanguageSelector = ({ selectedLanguage, onLanguageChange, style }) => {
  return (
    <Surface style={[styles.container, style]}>
      <Title style={styles.title}>Choose Language / भाषा चुनें</Title>
      <View style={styles.buttonContainer}>
        {languageOptions.map((option) => (
          <Button
            key={option.value}
            mode={selectedLanguage === option.value ? 'contained' : 'outlined'}
            onPress={() => onLanguageChange(option.value)}
            style={[
              styles.languageButton,
              selectedLanguage === option.value && styles.selectedButton
            ]}
            contentStyle={styles.buttonContent}
          >
            {option.flag} {option.label}
          </Button>
        ))}
      </View>
    </Surface>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    margin: 20,
    borderRadius: 12,
    elevation: 2,
  },
  title: {
    textAlign: 'center',
    marginBottom: 15,
    fontSize: 18,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: 10,
  },
  languageButton: {
    flex: 1,
    borderRadius: 8,
  },
  selectedButton: {
    backgroundColor: '#6366f1',
  },
  buttonContent: {
    paddingVertical: 8,
  },
});

export default LanguageSelector;