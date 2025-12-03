import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import Svg, { Circle, Path } from 'react-native-svg';

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Target Icon at TOP */}
        <View style={styles.iconContainer}>
          <Svg width="120" height="120" viewBox="0 0 120 120">
            <Circle cx="60" cy="60" r="55" stroke="#FFFFFF" strokeWidth="5" fill="none" opacity="0.8" />
            <Circle cx="60" cy="60" r="40" stroke="#FFFFFF" strokeWidth="5" fill="none" opacity="0.9" />
            <Circle cx="60" cy="60" r="25" stroke="#FFFFFF" strokeWidth="5" fill="none" />
            <Circle cx="60" cy="60" r="12" fill="#FFFFFF" />
          </Svg>
        </View>

        <Text style={styles.title}>PaktIQ</Text>
        <Text style={styles.subtitle}>Smart Commitment Tracking</Text>
        <Text style={styles.description}>
          Make commitments. Track progress. Achieve your goals{'\n'}with intelligence.
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

        {/* Progress Circle Icon */}
        <View style={styles.progressIconContainer}>
          <Svg width="240" height="240" viewBox="0 0 240 240">
            {/* Yellow/Orange Arc (outer top-left to bottom-right) */}
            <Path
              d="M 45 60 A 100 100 0 0 1 195 180"
              stroke="#FFD88A"
              strokeWidth="18"
              fill="none"
              strokeLinecap="round"
            />
            {/* Green/Teal Arc (inner top-left to right side) */}
            <Path
              d="M 60 75 A 85 85 0 0 1 180 165"
              stroke="#95E1D3"
              strokeWidth="18"
              fill="none"
              strokeLinecap="round"
            />
            {/* Light Purple Arc (bottom-right inner) */}
            <Path
              d="M 155 190 A 70 70 0 0 1 210 135"
              stroke="#B8A1E8"
              strokeWidth="16"
              fill="none"
              strokeLinecap="round"
              opacity="0.5"
            />
            {/* Light Purple Arc (bottom-left inner) */}
            <Path
              d="M 85 190 A 70 70 0 0 0 30 135"
              stroke="#B8A1E8"
              strokeWidth="16"
              fill="none"
              strokeLinecap="round"
              opacity="0.5"
            />
            {/* Large Sparkle (center-right) */}
            <Path
              d="M 155 90 L 163 110 L 183 118 L 163 126 L 155 146 L 147 126 L 127 118 L 147 110 Z"
              fill="#FFD88A"
            />
            {/* Small Sparkle */}
            <Path
              d="M 175 125 L 180 136 L 191 141 L 180 146 L 175 157 L 170 146 L 159 141 L 170 136 Z"
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
            <Text style={styles.gradientButtonText}>Start My First Pakt 'n</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.outlineButton} 
            onPress={() => router.push('/dashboard')}
          >
            <Text style={styles.outlineButtonText}>Explore Features</Text>
          </TouchableOpacity>
        </View>

        {/* Feature Icons at BOTTOM */}
        <View style={styles.featuresContainer}>
          <View style={styles.featureItem}>
            <Text style={styles.featureIcon}>📊</Text>
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
      </ScrollView>

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
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'space-evenly',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 100,
  },
  iconContainer: {
    marginTop: 10,
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 52,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: 20,
    color: '#FFD88A',
    marginBottom: 12,
    textAlign: 'center',
    fontWeight: '500',
  },
  description: {
    fontSize: 15,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 28,
    opacity: 0.95,
    lineHeight: 22,
    paddingHorizontal: 30,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 24,
    paddingHorizontal: 8,
  },
  statCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    paddingVertical: 24,
    paddingHorizontal: 12,
    flex: 1,
    marginHorizontal: 6,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
  },
  statValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  statLabel: {
    fontSize: 11,
    color: '#FFFFFF',
    opacity: 0.85,
    textAlign: 'center',
    lineHeight: 14,
  },
  progressIconContainer: {
    marginVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContainer: {
    width: '100%',
    paddingHorizontal: 20,
    marginTop: 12,
    marginBottom: 28,
  },
  gradientButton: {
    backgroundColor: '#FFD88A',
    paddingVertical: 20,
    paddingHorizontal: 32,
    borderRadius: 32,
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 6,
  },
  gradientButtonText: {
    color: '#3C2B63',
    fontSize: 19,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  outlineButton: {
    backgroundColor: 'transparent',
    paddingVertical: 20,
    paddingHorizontal: 32,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.35)',
    alignItems: 'center',
  },
  outlineButtonText: {
    color: '#FFFFFF',
    fontSize: 19,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  featuresContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingHorizontal: 30,
  },
  featureItem: {
    alignItems: 'center',
  },
  featureIcon: {
    fontSize: 40,
    marginBottom: 8,
  },
  featureText: {
    fontSize: 13,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  helpButton: {
    position: 'absolute',
    bottom: 28,
    right: 28,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(96, 77, 148, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  helpButtonText: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '600',
  },
});
