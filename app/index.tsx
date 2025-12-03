import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import Svg, { Circle, Path } from 'react-native-svg';

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Progress Circle Icon */}
        <View style={styles.iconContainer}>
          <Svg width="160" height="160" viewBox="0 0 180 180">
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
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    paddingTop: 60,
    paddingBottom: 100,
  },
  iconContainer: {
    marginBottom: 30,
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 22,
    color: '#FFD88A',
    marginBottom: 12,
    textAlign: 'center',
  },
  description: {
    fontSize: 15,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 32,
    opacity: 0.9,
    lineHeight: 22,
    paddingHorizontal: 30,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 40,
    paddingHorizontal: 10,
  },
  statCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 16,
    padding: 18,
    flex: 1,
    marginHorizontal: 6,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  statValue: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 6,
  },
  statLabel: {
    fontSize: 11,
    color: '#FFFFFF',
    opacity: 0.9,
    textAlign: 'center',
  },
  buttonContainer: {
    width: '100%',
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  gradientButton: {
    backgroundColor: '#FFD88A',
    paddingVertical: 18,
    paddingHorizontal: 32,
    borderRadius: 30,
    marginBottom: 14,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  gradientButtonText: {
    color: '#3C2B63',
    fontSize: 17,
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
    fontSize: 17,
    fontWeight: '600',
  },
  featuresContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingHorizontal: 50,
    marginTop: 8,
  },
  featureItem: {
    alignItems: 'center',
  },
  featureIcon: {
    fontSize: 30,
    marginBottom: 6,
  },
  featureText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  helpButton: {
    position: 'absolute',
    bottom: 30,
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

