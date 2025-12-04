import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import Svg, { Circle } from 'react-native-svg';

export default function WelcomeScreen() {
  const router = useRouter();
  
  // Animation values matching web version
  const glowAnim1 = useRef(new Animated.Value(1)).current;
  const glowAnim2 = useRef(new Animated.Value(1)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoTranslate = useRef(new Animated.Value(-20)).current;
  const heroOpacity = useRef(new Animated.Value(0)).current;
  const heroTranslate = useRef(new Animated.Value(20)).current;
  const statsOpacity = useRef(new Animated.Value(0)).current;
  const statsTranslate = useRef(new Animated.Value(20)).current;
  const illustrationOpacity = useRef(new Animated.Value(0)).current;
  const illustrationScale = useRef(new Animated.Value(0.8)).current;
  const circleProgress1 = useRef(new Animated.Value(502)).current;
  const circleProgress2 = useRef(new Animated.Value(377)).current;
  const buttonsOpacity = useRef(new Animated.Value(0)).current;
  const buttonsTranslate = useRef(new Animated.Value(20)).current;
  const featuresOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Background glow animations (continuous loops)
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim1, {
          toValue: 1.2,
          duration: 4000,
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim1, {
          toValue: 1,
          duration: 4000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim2, {
          toValue: 1.3,
          duration: 5000,
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim2, {
          toValue: 1,
          duration: 5000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Sequential entrance animations matching web version
    // Logo animation (initial)
    Animated.parallel([
      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(logoTranslate, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();

    // Hero text (delay: 0.2s = 200ms)
    Animated.parallel([
      Animated.timing(heroOpacity, {
        toValue: 1,
        duration: 500,
        delay: 200,
        useNativeDriver: true,
      }),
      Animated.timing(heroTranslate, {
        toValue: 0,
        duration: 500,
        delay: 200,
        useNativeDriver: true,
      }),
    ]).start();

    // Stats (delay: 0.4s = 400ms)
    Animated.parallel([
      Animated.timing(statsOpacity, {
        toValue: 1,
        duration: 500,
        delay: 400,
        useNativeDriver: true,
      }),
      Animated.timing(statsTranslate, {
        toValue: 0,
        duration: 500,
        delay: 400,
        useNativeDriver: true,
      }),
    ]).start();

    // Illustration (delay: 0.6s = 600ms)
    Animated.parallel([
      Animated.timing(illustrationOpacity, {
        toValue: 1,
        duration: 500,
        delay: 600,
        useNativeDriver: true,
      }),
      Animated.timing(illustrationScale, {
        toValue: 1,
        duration: 500,
        delay: 600,
        useNativeDriver: true,
      }),
    ]).start();

    // Circle progress animations (delay: 0.8s and 1s)
    Animated.timing(circleProgress1, {
        toValue: 125,
        duration: 2000,
        delay: 800,
        useNativeDriver: true,
    }).start();

    Animated.timing(circleProgress2, {
        toValue: 94,
        duration: 2000,
        delay: 1000,
        useNativeDriver: true,
    }).start();

    // Buttons (delay: 1s = 1000ms)
    Animated.parallel([
      Animated.timing(buttonsOpacity, {
        toValue: 1,
        duration: 500,
        delay: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(buttonsTranslate, {
        toValue: 0,
        duration: 500,
        delay: 1000,
        useNativeDriver: true,
      }),
    ]).start();

    // Features (delay: 1.2s = 1200ms)
    Animated.timing(featuresOpacity, {
      toValue: 1,
      duration: 500,
      delay: 1200,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <View style={styles.container}>
      {/* Animated Background Glows */}
      <Animated.View 
        style={[
          styles.glowBubble1,
          {
            transform: [{ scale: glowAnim1 }],
            opacity: glowAnim1.interpolate({
              inputRange: [1, 1.2],
              outputRange: [0.2, 0.3],
            }),
          }
        ]} 
      />
      <Animated.View 
        style={[
          styles.glowBubble2,
          {
            transform: [{ scale: glowAnim2 }],
            opacity: glowAnim2.interpolate({
              inputRange: [1, 1.3],
              outputRange: [0.2, 0.3],
            }),
          }
        ]} 
      />

      <SafeAreaView style={styles.safeArea}>
        <ScrollView 
          contentContainerStyle={styles.scrollContent} 
          showsVerticalScrollIndicator={false}
        >
          {/* Logo/Target Icon */}
          <Animated.View 
            style={[
              styles.logoContainer, 
              { 
                opacity: logoOpacity, 
                transform: [{ translateY: logoTranslate }] 
              }
            ]}
          >
            <View style={styles.logoWrapper}>
              <Animated.View 
                style={[
                  styles.logoGlow,
                  {
                    transform: [{ 
                      scale: glowAnim1.interpolate({
                        inputRange: [1, 1.2],
                        outputRange: [1, 1.1],
                      })
                    }],
                  }
                ]}
              />
              <Text style={styles.targetIcon}>🎯</Text>
            </View>
          </Animated.View>

          {/* Hero Text */}
          <Animated.View 
            style={[
              styles.heroContainer, 
              { 
                opacity: heroOpacity, 
                transform: [{ translateY: heroTranslate }] 
              }
            ]}
          >
            <Text style={styles.title}>PaktIQ</Text>
            <Text style={styles.subtitle}>Smart Commitment Tracking</Text>
            <Text style={styles.description}>
              Make commitments. Track progress. Achieve your goals with intelligence.
            </Text>
          </Animated.View>

          {/* Stats Cards */}
          <Animated.View 
            style={[
              styles.statsContainer, 
              { 
                opacity: statsOpacity, 
                transform: [{ translateY: statsTranslate }] 
              }
            ]}
          >
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
          </Animated.View>

          {/* Illustration - Progress Circles */}
          <Animated.View 
            style={[
              styles.illustrationContainer, 
              { 
                opacity: illustrationOpacity, 
                transform: [{ scale: illustrationScale }] 
              }
            ]}
          >
            <View style={styles.progressCircles}>
              <Svg width="256" height="256" viewBox="0 0 200 200">
                {/* Outer circle */}
                <Circle
                  cx="100"
                  cy="100"
                  r="80"
                  stroke="#FFD88A"
                  strokeWidth="8"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray="502"
                  strokeDashoffset="125"
                />
                {/* Inner circle */}
                <Circle
                  cx="100"
                  cy="100"
                  r="60"
                  stroke="#96E6B3"
                  strokeWidth="6"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray="377"
                  strokeDashoffset="94"
                />
              </Svg>
              <View style={styles.sparkleCenter}>
                <Text style={styles.sparkleIcon}>✨</Text>
              </View>
            </View>
          </Animated.View>

          {/* CTA Buttons */}
          <Animated.View 
            style={[
              styles.buttonContainer, 
              { 
                opacity: buttonsOpacity, 
                transform: [{ translateY: buttonsTranslate }] 
              }
            ]}
          >
            <TouchableOpacity 
              style={styles.primaryButton} 
              onPress={() => router.push('/auth')}
              activeOpacity={0.8}
            >
              <Text style={styles.primaryButtonText}>Start My First Pakt</Text>
              <Text style={styles.arrow}>→</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.secondaryButton} 
              onPress={() => router.push('/auth')}
              activeOpacity={0.8}
            >
              <Text style={styles.secondaryButtonText}>Explore Features</Text>
            </TouchableOpacity>
          </Animated.View>

          {/* Features Highlight */}
          <Animated.View 
            style={[
              styles.featuresContainer, 
              { opacity: featuresOpacity }
            ]}
          >
            <View style={styles.featureItem}>
              <Text style={[styles.featureIcon, { color: '#96E6B3' }]}>📈</Text>
              <Text style={styles.featureText}>Track Progress</Text>
            </View>
            <View style={styles.featureItem}>
              <Text style={[styles.featureIcon, { color: '#FFD88A' }]}>🏆</Text>
              <Text style={styles.featureText}>Earn Badges</Text>
            </View>
            <View style={styles.featureItem}>
              <Text style={[styles.featureIcon, { color: '#FF6A6A' }]}>🎯</Text>
              <Text style={styles.featureText}>Hit Goals</Text>
            </View>
          </Animated.View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#3C2B63',
  },
  glowBubble1: {
    position: 'absolute',
    top: 80,
    left: 40,
    width: 128,
    height: 128,
    backgroundColor: '#FFD88A',
    borderRadius: 64,
  },
  glowBubble2: {
    position: 'absolute',
    bottom: 128,
    right: 40,
    width: 160,
    height: 160,
    backgroundColor: '#96E6B3',
    borderRadius: 80,
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 48,
    paddingBottom: 48,
    alignItems: 'center',
    maxWidth: 448,
    width: '100%',
    alignSelf: 'center',
  },
  logoContainer: {
    marginBottom: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoWrapper: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoGlow: {
    position: 'absolute',
    width: 64,
    height: 64,
    backgroundColor: '#FFD88A',
    borderRadius: 32,
    opacity: 0.5,
  },
  targetIcon: {
    fontSize: 64,
    zIndex: 10,
  },
  heroContainer: {
    alignItems: 'center',
    marginBottom: 48,
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 24,
    color: '#FFD88A',
    marginBottom: 16,
    textAlign: 'center',
    fontWeight: '600',
  },
  description: {
    fontSize: 18,
    color: '#FFFFFF',
    textAlign: 'center',
    opacity: 0.9,
    lineHeight: 28,
    paddingHorizontal: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 48,
    gap: 16,
  },
  statCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 12,
    flex: 1,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 10,
    color: '#FFFFFF',
    opacity: 0.8,
    textAlign: 'center',
  },
  illustrationContainer: {
    marginBottom: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressCircles: {
    width: 256,
    height: 256,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sparkleCenter: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -24 }, { translateY: -24 }],
  },
  sparkleIcon: {
    fontSize: 48,
  },
  buttonContainer: {
    width: '100%',
    marginBottom: 48,
    gap: 16,
  },
  primaryButton: {
    backgroundColor: '#FFD88A',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  primaryButtonText: {
    color: '#3C2B63',
    fontSize: 18,
    fontWeight: '700',
    marginRight: 12,
  },
  arrow: {
    color: '#3C2B63',
    fontSize: 20,
    fontWeight: 'bold',
  },
  secondaryButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  featuresContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 20,
    gap: 16,
  },
  featureItem: {
    flex: 1,
    alignItems: 'center',
    gap: 8,
  },
  featureIcon: {
    fontSize: 24,
  },
  featureText: {
    fontSize: 12,
    color: '#FFFFFF',
    opacity: 0.8,
    textAlign: 'center',
  },
});
