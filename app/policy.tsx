import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft, Shield } from 'lucide-react-native';
import { useTheme } from '../src/contexts/ThemeContext';
import { useLanguage } from '../src/contexts/LanguageContext';
import BottomTabBar from '../src/components/BottomTabBar';

export default function PolicyScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { t } = useLanguage();

  // Animated values for collapsible header
  const scrollY = useRef(new Animated.Value(0)).current;
  const HEADER_MAX_HEIGHT = 140;
  const HEADER_MIN_HEIGHT = 70;
  const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;
  
  // Animated header styles
  const headerHeight = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
    extrapolate: 'clamp',
  });
  
  const headerPadding = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [16, 12],
    extrapolate: 'clamp',
  });
  
  const subtitleOpacity = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE / 2],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });
  
  const subtitleHeight = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [20, 0],
    extrapolate: 'clamp',
  });
  
  const titleFontSize = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [28, 20],
    extrapolate: 'clamp',
  });
  
  const backButtonSize = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [40, 36],
    extrapolate: 'clamp',
  });
  
  const iconContainerSize = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [64, 40],
    extrapolate: 'clamp',
  });
  
  const iconContainerBorderRadius = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [32, 20],
    extrapolate: 'clamp',
  });
  
  const iconContainerMarginBottom = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [16, 8],
    extrapolate: 'clamp',
  });
  
  const backButtonBorderRadius = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [20, 18],
    extrapolate: 'clamp',
  });
  
  const iconScale = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [1, 0.75],
    extrapolate: 'clamp',
  });
  
  const subtitleMarginTop = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
    outputRange: [8, 4, 0],
    extrapolate: 'clamp',
  });

  const policySections = [
    {
      title: t('policy.section1Title'),
      content: t('policy.section1Content'),
    },
    {
      title: t('policy.section2Title'),
      content: t('policy.section2Content'),
    },
    {
      title: t('policy.section3Title'),
      content: t('policy.section3Content'),
    },
    {
      title: t('policy.section4Title'),
      content: t('policy.section4Content'),
    },
    {
      title: t('policy.section5Title'),
      content: t('policy.section5Content'),
    },
    {
      title: t('policy.section6Title'),
      content: t('policy.section6Content'),
    },
    {
      title: t('policy.section7Title'),
      content: t('policy.section7Content'),
    },
    {
      title: t('policy.section8Title'),
      content: t('policy.section8Content'),
    },
    {
      title: t('policy.section9Title'),
      content: t('policy.section9Content'),
    },
    {
      title: t('policy.section10Title'),
      content: t('policy.section10Content'),
    },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Animated Header */}
      <Animated.View 
        style={[
          styles.header,
          {
            height: headerHeight,
            paddingHorizontal: headerPadding,
            paddingTop: headerPadding,
            paddingBottom: headerPadding,
          }
        ]}
      >
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Animated.View
            style={{
              width: backButtonSize,
              height: backButtonSize,
              borderRadius: backButtonBorderRadius,
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <ArrowLeft size={24} color="#FFFFFF" />
          </Animated.View>
        </TouchableOpacity>
        
        <View style={styles.headerContent}>
          <Animated.View
            style={{
              width: iconContainerSize,
              height: iconContainerSize,
              borderRadius: iconContainerBorderRadius,
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: iconContainerMarginBottom,
            }}
          >
            <Animated.View
              style={{
                transform: [{ scale: iconScale as any }] 
              }}
            >
              <Shield size={32} color="#FFFFFF" />
            </Animated.View>
          </Animated.View>
          
          <Animated.Text 
            style={[
              styles.headerTitle,
              { fontSize: titleFontSize }
            ]}
          >
            {t('policy.title')}
          </Animated.Text>
          
          <Animated.View
            style={{
              opacity: subtitleOpacity,
              height: subtitleHeight,
              marginTop: subtitleMarginTop,
            }}
          >
            <Text style={styles.headerSubtitle}>{t('policy.lastUpdated')}</Text>
          </Animated.View>
        </View>
      </Animated.View>

      {/* Content */}
      <Animated.ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      >
        {policySections.map((section, index) => (
          <View key={index} style={[styles.section, { backgroundColor: colors.surface }]}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              {section.title}
            </Text>
            <Text style={[styles.sectionContent, { color: colors.textSecondary }]}>
              {section.content}
            </Text>
          </View>
        ))}

        {/* Footer Note */}
        <View style={[styles.footerNote, { backgroundColor: colors.surface, borderLeftColor: colors.primary }]}>
          <Text style={[styles.footerText, { color: colors.textSecondary }]}>
            {t('policy.footerNote')}
          </Text>
        </View>

        <View style={{ height: 40 }} />
      </Animated.ScrollView>

      <BottomTabBar />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    backgroundColor: '#9163F2',
    justifyContent: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 16,
    left: 24,
    zIndex: 10,
  },
  headerContent: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  headerTitle: {
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
  },
  section: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  sectionContent: {
    fontSize: 15,
    lineHeight: 24,
  },
  footerNote: {
    borderRadius: 16,
    padding: 20,
    marginTop: 8,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  footerText: {
    fontSize: 14,
    lineHeight: 20,
    fontStyle: 'italic',
  },
});
