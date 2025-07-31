import React, { useState, useEffect } from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as InAppPurchases from 'expo-in-app-purchases';

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

      // Initialize in-app purchases
      await InAppPurchases.connectAsync();
      
      // Get available products
      const { responseCode, results } = await InAppPurchases.getProductsAsync([PREMIUM_PRODUCT_ID]);
      
      if (responseCode === InAppPurchases.IAPResponseCode.OK) {
        console.log('Available products:', results);
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

      // Show ad every 5 games for free users
      if (newCounter % 5 === 0) {
        // Simulate ad display
        Alert.alert(
          'Advertisement',
          'This is where an interstitial ad would show. In production, this would be a real ad from AdMob.',
          [
            { 
              text: 'Skip Ad (Premium)', 
              onPress: () => setShowUpgradeModal(true),
              style: 'default'
            },
            { 
              text: 'Continue', 
              onPress: resolve,
              style: 'cancel'
            }
          ]
        );
      } else {
        resolve();
      }
    });
  };

  const shouldShowBannerAd = () => {
    return !isPremium && adCounter > 0;
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
              <Text style={styles.feature}>✨ Ad-free gameplay</Text>
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