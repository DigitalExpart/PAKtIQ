import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import Svg, { Circle, Path } from 'react-native-svg';

const { width, height } = Dimensions.get('window');

export default function WelcomeScreen() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(0);

  if (currentPage === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <TouchableOpacity 
          style={styles.skipButton}
          onPress={() => setCurrentPage(1)}
        >
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
        
        <View style={styles.content}>
          {/* Target Icon */}
          <View style={styles.iconContainer}>
            <Svg width="120" height="120" viewBox="0 0 120 120">
              <Circle cx="60" cy="60" r="55" stroke="#FFFFFF" strokeWidth="4" fill="none" />
              <Circle cx="60" cy="60" r="40" stroke="#FFFFFF" strokeWidth="4" fill="none" />
              <Circle cx="60" cy="60" r="25" stroke="#FFFFFF" strokeWidth="4" fill="none" />
              <Circle cx="60" cy="60" r="12" fill="#FFFFFF" />
            </Svg>
          </View>

          <Text style={styles.title}>PaktIQ</Text>
          <Text style={styles.subtitle}>Smart Commitment Tracking</Text>
          <Text style={styles.description}>
            Make commitments. Track progress. Achieve your goals with intelligence.
          </Text>

          {/* Stats Cards */}
          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>10K+</Text>
              <Text style={styles.statLabel}>Active Users</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>50K+</Text>
              <Text style={styles.statLabel}>Pakts Achieved</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>95%</Text>
              <Text style={styles.statLabel}>Success Rate</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity 
          style={styles.nextButton}
          onPress={() => setCurrentPage(1)}
        >
          <Text style={styles.nextButtonText}>Next</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity 
        style={styles.skipButton}
        onPress={() => router.push('/dashboard')}
      >
        <Text style={styles.skipText}>Skip</Text>
      </TouchableOpacity>

      <View style={styles.content}>
        {/* Progress Circle Icon */}
        <View style={styles.iconContainer}>
          <Svg width="180" height="180" viewBox="0 0 180 180">
            {/* Yellow Arc */}
            <Path
              d="M 90 20 A 70 70 0 0 1 150 140"
              stroke="#FFD88A"
              strokeWidth="12"
              fill="none"
              strokeLinecap="round"
            />
            {/* Green Arc */}
            <Path
              d="M 90 20 A 70 70 0 0 0 30 140"
              stroke="#95E1D3"
              strokeWidth="12"
              fill="none"
              strokeLinecap="round"
            />
            {/* Sparkle */}
            <Path
              d="M 140 50 L 145 60 L 155 65 L 145 70 L 140 80 L 135 70 L 125 65 L 135 60 Z"
              fill="#FFD88A"
            />
            <Path
              d="M 150 75 L 153 80 L 158 83 L 153 86 L 150 91 L 147 86 L 142 83 L 147 80 Z"
              fill="#FFD88A"
            />
          </Svg>
        </View>

        {/* Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={styles.gradientButton} 
            onPress={() => router.push('/onboarding')}
          >
            <Text style={styles.gradientButtonText}>Start My First Pakt →</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.outlineButton} 
            onPress={() => router.push('/dashboard')}
          >
            <Text style={styles.outlineButtonText}>Explore Features</Text>
          </TouchableOpacity>
        </View>

        {/* Feature Icons */}
        <View style={styles.featuresContainer}>
          <View style={styles.featureItem}>
            <Text style={styles.featureIcon}>📈</Text>
            <Text style={styles.featureText}>Track Progress</Text>
          </View>
          <View style={styles.featureItem}>
            <Text style={styles.featureIcon}>🏅</Text>
            <Text style={styles.featureText}>Earn Badges</Text>
          </View>
          <View style={styles.featureItem}>
            <Text style={styles.featureIcon}>🎯</Text>
            <Text style={styles.featureText}>Hit Goals</Text>
          </View>
        </View>
      </View>

      {/* Help Button */}
      <TouchableOpacity style={styles.helpButton}>
        <Text style={styles.helpButtonText}>?</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#9163F2',
  },
  skipButton: {
    position: 'absolute',
    top: 50,
    right: 24,
    zIndex: 10,
  },
  skipText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    paddingTop: 80,
  },
  iconContainer: {
    marginBottom: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 24,
    color: '#FFD88A',
    marginBottom: 16,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 40,
    opacity: 0.9,
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 20,
  },
  statCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 16,
    padding: 20,
    minWidth: 100,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#FFFFFF',
    opacity: 0.9,
    textAlign: 'center',
  },
  nextButton: {
    backgroundColor: '#FFD88A',
    paddingVertical: 16,
    paddingHorizontal: 48,
    borderRadius: 12,
    marginBottom: 40,
    alignSelf: 'center',
  },
  nextButtonText: {
    color: '#3C2B63',
    fontSize: 18,
    fontWeight: '600',
  },
  buttonContainer: {
    width: '100%',
    paddingHorizontal: 24,
    marginBottom: 40,
  },
  gradientButton: {
    background: 'linear-gradient(90deg, #FFD88A 0%, #95E1D3 100%)',
    backgroundColor: '#FFD88A',
    paddingVertical: 18,
    paddingHorizontal: 32,
    borderRadius: 30,
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  gradientButtonText: {
    color: '#3C2B63',
    fontSize: 18,
    fontWeight: '600',
  },
  outlineButton: {
    backgroundColor: 'transparent',
    paddingVertical: 18,
    paddingHorizontal: 32,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    alignItems: 'center',
  },
  outlineButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  featuresContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingHorizontal: 40,
  },
  featureItem: {
    alignItems: 'center',
  },
  featureIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  featureText: {
    fontSize: 13,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  helpButton: {
    position: 'absolute',
    bottom: 40,
    right: 24,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  helpButtonText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '600',
  },
});

