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
            {/* Green/Teal Arc (left side) */}
            <Path
              d="M 120 20 A 100 100 0 0 0 30 170"
              stroke="#95E1D3"
              strokeWidth="18"
              fill="none"
              strokeLinecap="round"
            />
            {/* Yellow/Orange Arc (right side) */}
            <Path
              d="M 120 20 A 100 100 0 0 1 210 170"
              stroke="#FFD88A"
              strokeWidth="18"
              fill="none"
              strokeLinecap="round"
            />
            {/* Inner Light Purple Arc (left bottom) */}
            <Path
              d="M 70 185 A 60 60 0 0 1 55 125"
              stroke="#B8A1E8"
              strokeWidth="14"
              fill="none"
              strokeLinecap="round"
              opacity="0.5"
            />
            {/* Inner Light Purple Arc (right bottom) */}
            <Path
              d="M 170 185 A 60 60 0 0 0 185 125"
              stroke="#B8A1E8"
              strokeWidth="14"
              fill="none"
              strokeLinecap="round"
              opacity="0.5"
            />
            {/* Large Sparkle */}
            <Path
              d="M 165 60 L 173 80 L 193 88 L 173 96 L 165 116 L 157 96 L 137 88 L 157 80 Z"
              fill="#FFD88A"
            />
            {/* Small Sparkle */}
            <Path
              d="M 185 105 L 190 116 L 201 121 L 190 126 L 185 137 L 180 126 L 169 121 L 180 116 Z"
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
