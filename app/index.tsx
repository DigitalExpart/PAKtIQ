import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import Svg, { Circle, Path } from 'react-native-svg';

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Stats Cards at TOP */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>10K</Text>
            <Text style={styles.statPlus}>+</Text>
            <Text style={styles.statLabel}>Active Users</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>50K</Text>
            <Text style={styles.statPlus}>+</Text>
            <Text style={styles.statLabel}>Pakts{'\n'}Achieved</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>95%</Text>
            <Text style={styles.statLabel}>Success{'\n'}Rate</Text>
          </View>
        </View>

        {/* Progress Circle Icon in MIDDLE */}
        <View style={styles.progressIconContainer}>
          <Svg width="280" height="280" viewBox="0 0 280 280">
            {/* Green/Teal Arc (left side) */}
            <Path
              d="M 140 30 A 110 110 0 0 0 40 190"
              stroke="#95E1D3"
              strokeWidth="20"
              fill="none"
              strokeLinecap="round"
            />
            {/* Yellow/Orange Arc (right side) */}
            <Path
              d="M 140 30 A 110 110 0 0 1 240 190"
              stroke="#FFD88A"
              strokeWidth="20"
              fill="none"
              strokeLinecap="round"
            />
            {/* Inner Light Purple Arc (left bottom) */}
            <Path
              d="M 80 210 A 70 70 0 0 1 60 140"
              stroke="#B8A1E8"
              strokeWidth="16"
              fill="none"
              strokeLinecap="round"
              opacity="0.6"
            />
            {/* Inner Light Purple Arc (right bottom) */}
            <Path
              d="M 200 210 A 70 70 0 0 0 220 140"
              stroke="#B8A1E8"
              strokeWidth="16"
              fill="none"
              strokeLinecap="round"
              opacity="0.6"
            />
            {/* Large Sparkle */}
            <Path
              d="M 190 80 L 200 105 L 225 115 L 200 125 L 190 150 L 180 125 L 155 115 L 180 105 Z"
              fill="#FFD88A"
            />
            {/* Small Sparkle */}
            <Path
              d="M 215 125 L 221 138 L 234 144 L 221 150 L 215 163 L 209 150 L 196 144 L 209 138 Z"
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
    paddingTop: 30,
    paddingBottom: 100,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20,
    paddingHorizontal: 8,
  },
  statCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 24,
    paddingVertical: 32,
    paddingHorizontal: 12,
    flex: 1,
    marginHorizontal: 6,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  statValue: {
    fontSize: 38,
    fontWeight: 'bold',
    color: '#FFFFFF',
    letterSpacing: -1,
  },
  statPlus: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginVertical: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#FFFFFF',
    opacity: 0.8,
    textAlign: 'center',
    lineHeight: 16,
    marginTop: 8,
  },
  progressIconContainer: {
    marginVertical: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContainer: {
    width: '100%',
    paddingHorizontal: 20,
    marginTop: 16,
    marginBottom: 32,
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
    fontSize: 44,
    marginBottom: 10,
  },
  featureText: {
    fontSize: 14,
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
