import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import Svg, { Circle, Path } from 'react-native-svg';

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Target/Bullseye Icon */}
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

        {/* Progress Circle Icon */}
        <View style={styles.progressIconContainer}>
          <Svg width="200" height="200" viewBox="0 0 200 200">
            {/* Yellow/Orange Arc (top right) */}
            <Path
              d="M 100 20 A 80 80 0 0 1 170 150"
              stroke="#FFD88A"
              strokeWidth="14"
              fill="none"
              strokeLinecap="round"
            />
            {/* Green Arc (top left) */}
            <Path
              d="M 100 20 A 80 80 0 0 0 30 150"
              stroke="#95E1D3"
              strokeWidth="14"
              fill="none"
              strokeLinecap="round"
            />
            {/* Inner Purple Arc (bottom right) */}
            <Path
              d="M 130 165 A 50 50 0 0 0 155 100"
              stroke="#B8A1E8"
              strokeWidth="12"
              fill="none"
              strokeLinecap="round"
            />
            {/* Inner Purple Arc (bottom left) */}
            <Path
              d="M 70 165 A 50 50 0 0 1 45 100"
              stroke="#B8A1E8"
              strokeWidth="12"
              fill="none"
              strokeLinecap="round"
            />
            {/* Large Sparkle */}
            <Path
              d="M 145 55 L 152 70 L 167 77 L 152 84 L 145 99 L 138 84 L 123 77 L 138 70 Z"
              fill="#FFD88A"
            />
            {/* Small Sparkle */}
            <Path
              d="M 162 90 L 166 98 L 174 102 L 166 106 L 162 114 L 158 106 L 150 102 L 158 98 Z"
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
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 100,
  },
  iconContainer: {
    marginBottom: 24,
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 56,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: 20,
    color: '#FFD88A',
    marginBottom: 16,
    textAlign: 'center',
    fontWeight: '500',
  },
  description: {
    fontSize: 15,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 36,
    opacity: 0.95,
    lineHeight: 22,
    paddingHorizontal: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 32,
    paddingHorizontal: 4,
  },
  statCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderRadius: 20,
    paddingVertical: 24,
    paddingHorizontal: 16,
    flex: 1,
    marginHorizontal: 6,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
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
    marginBottom: 32,
    marginTop: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContainer: {
    width: '100%',
    paddingHorizontal: 16,
    marginBottom: 40,
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
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  outlineButton: {
    backgroundColor: 'transparent',
    paddingVertical: 20,
    paddingHorizontal: 32,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    alignItems: 'center',
  },
  outlineButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: 0.3,
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
    fontSize: 36,
    marginBottom: 8,
  },
  featureText: {
    fontSize: 13,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  helpButton: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  helpButtonText: {
    color: '#FFFFFF',
    fontSize: 26,
    fontWeight: '600',
  },
});

