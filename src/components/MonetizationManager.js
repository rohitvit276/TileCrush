import React, { useState, useEffect } from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, Alert, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Import in-app purchases only on native platforms
let InAppPurchases = null;
if (Platform.OS !== 'web') {
  try {
    InAppPurchases = require('expo-in-app-purchases');
  } catch (error) {
    console.log('In-app purchases not available in this environment');
  }
}

export const MonetizationManager = ({ children }) => {
  const [isPremium, setIsPremium] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [adCounter, setAdCounter] = useState(0);
  const [loading, setLoading] = useState(true);

  // Premium subscription product ID
  const PREMIUM_PRODUCT_ID = 'rock_crush_premium_monthly';

  useEffect(() => {
    initializeMonetization();
  }, []);

  const initializeMonetization = async () => {
    try {
      // Check premium status
      const premiumStatus = await AsyncStorage.getItem('isPremium');
      setIsPremium(premiumStatus === 'true');

      // Initialize in-app purchases only on native platforms
      if (InAppPurchases && Platform.OS !== 'web') {
        await InAppPurchases.connectAsync();
        
        // Get available products
        const { responseCode, results } = await InAppPurchases.getProductsAsync([PREMIUM_PRODUCT_ID]);
        
        if (responseCode === InAppPurchases.IAPResponseCode.OK) {
          console.log('Available products:', results);
        }
      } else {
        console.log('Running in test mode - in-app purchases simulated');
      }

      setLoading(false);
    } catch (error) {
      console.log('Error initializing monetization:', error);
      setLoading(false);
    }
  };

  const purchasePremium = async () => {
    try {
      setLoading(true);
      
      // Test mode for web and development
      if (!InAppPurchases || Platform.OS === 'web') {
        // Simulate successful purchase for testing
        setTimeout(() => {
          setIsPremium(true);
          AsyncStorage.setItem('isPremium', 'true');
          setShowUpgradeModal(false);
          setLoading(false);
          
          Alert.alert(
            'Premium Activated! (Test Mode)',
            'Thank you for upgrading to Rock Crush Premium! Enjoy ad-free gameplay, unlimited hints, and exclusive features.',
            [{ text: 'Awesome!', style: 'default' }]
          );
        }, 1500);
        return;
      }
      
      // Real purchase flow for production
      const { responseCode, results } = await InAppPurchases.purchaseItemAsync(PREMIUM_PRODUCT_ID);
      
      if (responseCode === InAppPurchases.IAPResponseCode.OK) {
        // Purchase successful
        setIsPremium(true);
        await AsyncStorage.setItem('isPremium', 'true');
        setShowUpgradeModal(false);
        
        Alert.alert(
          'Premium Activated!',
          'Thank you for upgrading to Rock Crush Premium! Enjoy ad-free gameplay, unlimited hints, and exclusive features.',
          [{ text: 'Awesome!', style: 'default' }]
        );
      } else {
        Alert.alert('Purchase Failed', 'Unable to complete purchase. Please try again.');
      }
    } catch (error) {
      console.log('Purchase error:', error);
      Alert.alert('Purchase Error', 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const restorePurchases = async () => {
    try {
      setLoading(true);
      
      // Test mode for web and development
      if (!InAppPurchases || Platform.OS === 'web') {
        // Check if user has premium in local storage for testing
        const premiumStatus = await AsyncStorage.getItem('isPremium');
        if (premiumStatus === 'true') {
          Alert.alert('Premium Restored (Test Mode)', 'Your premium subscription has been restored!');
        } else {
          Alert.alert('No Purchases Found (Test Mode)', 'No premium purchases found to restore.');
        }
        setLoading(false);
        return;
      }
      
      // Real restore flow for production
      const { responseCode, results } = await InAppPurchases.getPurchaseHistoryAsync();
      
      if (responseCode === InAppPurchases.IAPResponseCode.OK) {
        const premiumPurchase = results.find(purchase => 
          purchase.productId === PREMIUM_PRODUCT_ID && !purchase.acknowledged
        );
        
        if (premiumPurchase) {
          setIsPremium(true);
          await AsyncStorage.setItem('isPremium', 'true');
          Alert.alert('Premium Restored', 'Your premium subscription has been restored!');
        } else {
          Alert.alert('No Purchases Found', 'No premium purchases found to restore.');
        }
      }
    } catch (error) {
      console.log('Restore error:', error);
      Alert.alert('Restore Failed', 'Unable to restore purchases.');
    } finally {
      setLoading(false);
    }
  };

  const showInterstitialAd = () => {
    if (isPremium) return Promise.resolve();

    return new Promise((resolve) => {
      // Increment ad counter
      const newCounter = adCounter + 1;
      setAdCounter(newCounter);

      // Show ad at the end of every game for free users
      // Simulate ad display
      Alert.alert(
        'Game Complete - Advertisement',
        'This is where an end-of-game ad would show. In production, this would be a real ad from AdMob.',
        [
          { 
            text: 'Upgrade to Remove Ads', 
            onPress: () => {
              setShowUpgradeModal(true);
              resolve();
            },
            style: 'default'
          },
          { 
            text: 'Continue Playing', 
            onPress: resolve,
            style: 'cancel'
          }
        ]
      );
    });
  };

  const shouldShowBannerAd = () => {
    return false; // Disabled banner ads - only end-of-game ads now
  };

  const getHintLimit = () => {
    return isPremium ? -1 : 3; // Unlimited for premium, 3 for free
  };

  const canUseHint = (hintsUsed) => {
    if (isPremium) return true;
    return hintsUsed < 3;
  };

  return (
    <>
      {children({ 
        isPremium,
        showInterstitialAd,
        shouldShowBannerAd,
        getHintLimit,
        canUseHint,
        showUpgradeModal: () => setShowUpgradeModal(true)
      })}

      {/* Upgrade Modal */}
      <Modal
        visible={showUpgradeModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowUpgradeModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>🚀 Upgrade to Premium</Text>
            
            <Text style={styles.modalSubtitle}>
              Unlock the full Rock Crush experience!
            </Text>

            <View style={styles.featuresContainer}>
              <Text style={styles.feature}>✨ No ads between games</Text>
              <Text style={styles.feature}>💡 Unlimited hints</Text>
              <Text style={styles.feature}>🎯 Exclusive rock themes</Text>
              <Text style={styles.feature}>📊 Advanced statistics</Text>
              <Text style={styles.feature}>🏆 Premium achievements</Text>
              <Text style={styles.feature}>🔄 Priority support</Text>
            </View>

            <Text style={styles.priceText}>$2.99/month</Text>

            <View style={styles.buttonContainer}>
              <TouchableOpacity 
                style={styles.premiumButton}
                onPress={purchasePremium}
                disabled={loading}
              >
                <Text style={styles.premiumButtonText}>
                  {loading ? 'Processing...' : 'Subscribe Now'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.restoreButton}
                onPress={restorePurchases}
                disabled={loading}
              >
                <Text style={styles.restoreButtonText}>Restore Purchases</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={() => setShowUpgradeModal(false)}
              >
                <Text style={styles.cancelButtonText}>Maybe Later</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.disclaimerText}>
              Cancel anytime. Auto-renewal can be turned off in Account Settings.
            </Text>
          </View>
        </View>
      </Modal>

      {/* Banner Ad Placeholder */}
      {shouldShowBannerAd() && (
        <View style={styles.bannerAdContainer}>
          <Text style={styles.bannerAdText}>
            📱 Advertisement Space • 
            <Text 
              style={styles.upgradeLink}
              onPress={() => setShowUpgradeModal(true)}
            >
              {' '}Remove Ads
            </Text>
          </Text>
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#fff',
    margin: 20,
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    maxWidth: 400,
    width: '90%',
  },
  modalTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ff6b6b',
    marginBottom: 10,
    textAlign: 'center',
  },
  modalSubtitle: {
    fontSize: 18,
    color: '#333',
    marginBottom: 25,
    textAlign: 'center',
  },
  featuresContainer: {
    alignSelf: 'stretch',
    marginBottom: 25,
  },
  feature: {
    fontSize: 16,
    color: '#555',
    marginBottom: 8,
    paddingLeft: 10,
  },
  priceText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ff6b6b',
    marginBottom: 25,
  },
  buttonContainer: {
    alignSelf: 'stretch',
    gap: 10,
  },
  premiumButton: {
    backgroundColor: '#ff6b6b',
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
  },
  premiumButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  restoreButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    borderRadius: 20,
    alignItems: 'center',
  },
  restoreButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelButton: {
    paddingVertical: 10,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
  },
  disclaimerText: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    marginTop: 15,
    lineHeight: 16,
  },
  bannerAdContainer: {
    backgroundColor: '#f0f0f0',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    alignItems: 'center',
  },
  bannerAdText: {
    fontSize: 14,
    color: '#666',
  },
  upgradeLink: {
    color: '#ff6b6b',
    fontWeight: 'bold',
  },
});