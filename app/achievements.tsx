import React, { useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions, ActivityIndicator, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft, Target, Flame, Trophy, TrendingUp, Star, Award, Lock } from 'lucide-react-native';
import { useAchievements } from '../src/hooks/useAchievements';
import { useTheme } from '../src/contexts/ThemeContext';
import { useLanguage } from '../src/contexts/LanguageContext';
import BottomTabBar from '../src/components/BottomTabBar';

// Dark mode background color for comparison
const DARK_BG = '#121212';

const { width: screenWidth } = Dimensions.get('window');
const CARD_GAP = 16; // Increased spacing between cards
const HORIZONTAL_PADDING = 24;
const cardWidth = (screenWidth - (HORIZONTAL_PADDING * 2) - (CARD_GAP * 2)) / 3;

export default function AchievementScreen() {
  const router = useRouter();
  const { achievements, loading } = useAchievements();
  const { colors } = useTheme();
  const { t } = useLanguage();

  // Animated values for collapsible header
  const scrollY = useRef(new Animated.Value(0)).current;
  const HEADER_MAX_HEIGHT = 180;
  const HEADER_MIN_HEIGHT = 80;
  const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;
  
  // Animated header styles
  const headerHeight = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
    extrapolate: 'clamp',
  });
  
  const headerPadding = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [20, 12],
    extrapolate: 'clamp',
  });
  
  const subtitleOpacity = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE / 2],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });
  
  const subtitleHeight = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [24, 0],
    extrapolate: 'clamp',
  });
  
  const titleFontSize = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [32, 20],
    extrapolate: 'clamp',
  });
  
  const progressBarOpacity = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE / 2],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });
  
  const progressBarHeight = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [6, 0],
    extrapolate: 'clamp',
  });
  
  const backButtonSize = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [40, 36],
    extrapolate: 'clamp',
  });

  // All possible achievements
  const ALL_ACHIEVEMENTS = [
    // Milestone achievements
    { type: 'first_milestone', title: 'First Step', description: 'Complete your first milestone', icon: '🎯' },
    { type: 'milestone_10', title: 'Getting Started', description: 'Complete 10 milestones', icon: '⭐' },
    { type: 'milestone_25', title: 'On a Roll', description: 'Complete 25 milestones', icon: '🔥' },
    { type: 'milestone_50', title: 'Half Century', description: 'Complete 50 milestones', icon: '💯' },
    { type: 'milestone_100', title: 'Century Club', description: 'Complete 100 milestones', icon: '🏆' },
    // Resolve achievements
    { type: 'first_pakt', title: 'Committed', description: 'Complete your first Resolve', icon: '🎉' },
    { type: 'pakt_5', title: 'Dedicated', description: 'Complete 5 Resolves', icon: '💪' },
    { type: 'pakt_10', title: 'Achiever', description: 'Complete 10 Resolves', icon: '🌟' },
    { type: 'pakt_25', title: 'Champion', description: 'Complete 25 Resolves', icon: '👑' },
  ];

  // Icon mapping for achievements
  const getIconForAchievement = (title: string) => {
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes('first') || lowerTitle.includes('beginner')) return Target;
    if (lowerTitle.includes('streak') || lowerTitle.includes('warrior')) return Flame;
    if (lowerTitle.includes('milestone') || lowerTitle.includes('master') || lowerTitle.includes('century')) return Trophy;
    if (lowerTitle.includes('trend') || lowerTitle.includes('progress')) return TrendingUp;
    if (lowerTitle.includes('star') || lowerTitle.includes('achiever')) return Star;
    if (lowerTitle.includes('committed') || lowerTitle.includes('dedicated')) return Target;
    if (lowerTitle.includes('champion')) return Award;
    return Award;
  };

  // Color mapping - theme-aware with vibrant colors
  const getColorForAchievement = (index: number, isDark: boolean) => {
    if (isDark) {
      // Dark mode colors - vibrant with good contrast
      const darkColors = [
        { bgColor: 'rgba(145, 99, 242, 0.15)', iconBg: '#9163F2', iconColor: '#FFFFFF', glow: '#9163F2' },
        { bgColor: 'rgba(255, 107, 107, 0.15)', iconBg: '#FF6B6B', iconColor: '#FFFFFF', glow: '#FF6B6B' },
        { bgColor: 'rgba(255, 216, 138, 0.15)', iconBg: '#FFD88A', iconColor: '#1a1625', glow: '#FFD88A' },
        { bgColor: 'rgba(78, 205, 196, 0.15)', iconBg: '#4ECDC4', iconColor: '#FFFFFF', glow: '#4ECDC4' },
        { bgColor: 'rgba(150, 230, 179, 0.15)', iconBg: '#96E6B3', iconColor: '#1a1625', glow: '#96E6B3' },
        { bgColor: 'rgba(255, 154, 158, 0.15)', iconBg: '#FF9A9E', iconColor: '#FFFFFF', glow: '#FF9A9E' },
        { bgColor: 'rgba(147, 165, 207, 0.15)', iconBg: '#93A5CF', iconColor: '#FFFFFF', glow: '#93A5CF' },
        { bgColor: 'rgba(255, 183, 77, 0.15)', iconBg: '#FFB74D', iconColor: '#1a1625', glow: '#FFB74D' },
        { bgColor: 'rgba(186, 104, 200, 0.15)', iconBg: '#BA68C8', iconColor: '#FFFFFF', glow: '#BA68C8' },
      ];
      return darkColors[index % darkColors.length];
    } else {
      // Light mode colors - bright and vibrant
      const lightColors = [
        { bgColor: '#E9DFFF', iconBg: '#9163F2', iconColor: '#FFFFFF', glow: '#9163F2' },
        { bgColor: '#FFE5E5', iconBg: '#FF6B6B', iconColor: '#FFFFFF', glow: '#FF6B6B' },
        { bgColor: '#FFF4E0', iconBg: '#FFD88A', iconColor: '#3C2B63', glow: '#FFD88A' },
        { bgColor: '#E5F6FF', iconBg: '#4ECDC4', iconColor: '#FFFFFF', glow: '#4ECDC4' },
        { bgColor: '#F0FFE5', iconBg: '#96E6B3', iconColor: '#1a1625', glow: '#96E6B3' },
        { bgColor: '#FFE8F0', iconBg: '#FF9A9E', iconColor: '#FFFFFF', glow: '#FF9A9E' },
        { bgColor: '#E8F0FF', iconBg: '#93A5CF', iconColor: '#FFFFFF', glow: '#93A5CF' },
        { bgColor: '#FFF8E1', iconBg: '#FFB74D', iconColor: '#3C2B63', glow: '#FFB74D' },
        { bgColor: '#F3E5F5', iconBg: '#BA68C8', iconColor: '#FFFFFF', glow: '#BA68C8' },
      ];
      return lightColors[index % lightColors.length];
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  // Check if dark mode
  const isDarkMode = colors.background === DARK_BG;

  // Get earned achievements from database
  const earnedBadges = achievements.map((achievement, index) => ({
    id: achievement.id,
    title: achievement.title,
    date: formatDate(achievement.earned_at),
    icon: getIconForAchievement(achievement.title),
    ...getColorForAchievement(index, isDarkMode),
  }));

  // Get locked achievements (ones not yet earned)
  const earnedTypes = new Set(achievements.map(a => a.type));
  const lockedBadges = ALL_ACHIEVEMENTS
    .filter(a => !earnedTypes.has(a.type))
    .map((achievement) => ({
      id: achievement.type,
      title: achievement.title,
      status: achievement.description,
      icon: getIconForAchievement(achievement.title),
    }));

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.textSecondary }]}>Loading achievements...</Text>
        </View>
      </View>
    );
  }



  const totalBadges = earnedBadges.length + lockedBadges.length;
  const earnedCount = earnedBadges.length;
  const progressPercentage = (earnedCount / totalBadges) * 100;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Fixed Animated Header - collapses on scroll */}
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
              borderRadius: backButtonSize.interpolate({
                inputRange: [36, 40],
                outputRange: [18, 20],
              }),
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <ArrowLeft size={24} color="#FFFFFF" />
          </Animated.View>
        </TouchableOpacity>
        
        <View style={styles.headerContent}>
          <Animated.Text 
            style={[
              styles.headerTitle,
              { fontSize: titleFontSize }
            ]}
          >
            {t('achievements.title')}
          </Animated.Text>
          <Animated.View
            style={{
              opacity: subtitleOpacity,
              height: subtitleHeight,
              marginTop: subtitleOpacity.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 8],
              }),
            }}
          >
            <Text style={styles.headerSubtitle}>
              {earnedCount} {t('achievements.ofEarned')} {totalBadges} {t('achievements.earned')}
            </Text>
          </Animated.View>
        </View>

        {/* Progress Bar - fades out on scroll */}
        <Animated.View 
          style={[
            styles.progressBarContainer,
            {
              opacity: progressBarOpacity,
              height: progressBarHeight,
              marginTop: progressBarOpacity.interpolate({
                inputRange: [0, 1],
                outputRange: [8, 0],
              }),
            }
          ]}
        >
          <View 
            style={[styles.progressBar, { width: `${progressPercentage}%` }]} 
          />
        </Animated.View>
      </Animated.View>

      <Animated.ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: HEADER_MAX_HEIGHT + 24 } // Add space for header + extra spacing
        ]}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      >
        {/* Earned Badges Section */}
        {earnedBadges.length > 0 && (
          <View style={[styles.section, { marginTop: 32 }]}>
            <View style={styles.sectionHeader}>
              <Trophy size={24} color={colors.primary} />
              <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('achievements.earnedBadges')}</Text>
            </View>
          
          <View style={styles.badgesGrid}>
            {earnedBadges.map((badge) => {
              const IconComponent = badge.icon;
              return (
                <View 
                  key={badge.id} 
                  style={[
                    styles.badgeCard, 
                    { 
                      backgroundColor: badge.bgColor,
                      borderColor: badge.glow,
                      borderWidth: isDarkMode ? 1 : 0,
                    }
                  ]}
                >
                  <View 
                    style={[
                      styles.badgeIconContainer, 
                      { 
                        backgroundColor: badge.iconBg,
                        shadowColor: badge.glow,
                      }
                    ]}
                  >
                    <IconComponent size={36} color={badge.iconColor} strokeWidth={2.5} />
                  </View>
                  <Text style={[styles.badgeTitle, { color: colors.text }]}>{badge.title}</Text>
                  <Text style={[styles.badgeDate, { color: colors.textSecondary }]}>{badge.date}</Text>
                </View>
              );
            })}
          </View>
        </View>
        )}

        {/* Locked Badges Section */}
        {lockedBadges.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Lock size={24} color={colors.textSecondary} />
              <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>{t('achievements.lockedBadges')}</Text>
            </View>
          
            <View style={styles.badgesGrid}>
            {lockedBadges.map((badge, index) => {
              const IconComponent = badge.icon;
              const lockedBgColor = isDarkMode 
                ? 'rgba(60, 60, 60, 0.5)' 
                : 'rgba(240, 240, 240, 0.6)';
              const lockedIconBg = isDarkMode 
                ? 'rgba(100, 100, 100, 0.3)' 
                : 'rgba(200, 200, 200, 0.5)';
              
              return (
                <View 
                  key={badge.id} 
                  style={[
                    styles.lockedBadgeCard, 
                    { 
                      backgroundColor: lockedBgColor,
                      borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
                      borderWidth: 1,
                      opacity: 0.7,
                    }
                  ]}
                >
                  <View style={[styles.lockedBadgeIconContainer, { backgroundColor: lockedIconBg }]}>
                    <IconComponent 
                      size={36} 
                      color={isDarkMode ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)'} 
                      strokeWidth={2.5} 
                    />
                    <View style={styles.lockOverlay}>
                      <Lock size={20} color={isDarkMode ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.4)'} />
                    </View>
                  </View>
                  <Text style={[styles.lockedBadgeTitle, { color: colors.textSecondary }]}>{badge.title}</Text>
                  <Text style={[styles.lockedBadgeStatus, { color: colors.textSecondary }]} numberOfLines={2}>
                    {badge.status}
                  </Text>
                </View>
              );
            })}
            </View>
          </View>
        )}

        {/* Motivational Message - At bottom of scrollable content */}
        <View style={[styles.motivationCard, { backgroundColor: colors.surface }]}>
          <Text style={styles.motivationEmoji}>🌟</Text>
          <Text style={[styles.motivationText, { color: colors.textSecondary }]}>
            Keep going! Complete more Resolves to unlock new badges
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
    backgroundColor: '#F4F4F6',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F4F4F6',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  header: {
    backgroundColor: '#9163F2',
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
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
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#FFD88A',
    borderRadius: 4,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: HORIZONTAL_PADDING,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 40,
    marginTop: 8, // Add spacing between sections
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  badgesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: CARD_GAP,
  },
  badgeCard: {
    width: cardWidth,
    aspectRatio: 0.85,
    borderRadius: 24,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 8,
    marginBottom: 4,
  },
  badgeIconContainer: {
    width: 68,
    height: 68,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  badgeTitle: {
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 4,
    letterSpacing: -0.2,
    lineHeight: 18,
  },
  badgeDate: {
    fontSize: 11,
    textAlign: 'center',
    fontWeight: '500',
    opacity: 0.8,
  },
  lockedBadgeCard: {
    width: cardWidth,
    aspectRatio: 0.85,
    borderRadius: 24,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
    marginBottom: 4,
  },
  lockedBadgeIconContainer: {
    width: 68,
    height: 68,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    position: 'relative',
  },
  lockedBadgeTitle: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 4,
    letterSpacing: -0.2,
    lineHeight: 18,
  },
  lockedBadgeStatus: {
    fontSize: 11,
    textAlign: 'center',
    fontWeight: '500',
    opacity: 0.7,
    lineHeight: 14,
  },
  lockOverlay: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  motivationCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 28,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    marginTop: 64,
  },
  motivationEmoji: {
    fontSize: 56,
    marginBottom: 16,
  },
  motivationText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    fontWeight: '500',
  },
});
