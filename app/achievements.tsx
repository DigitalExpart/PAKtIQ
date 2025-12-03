import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Target, Flame, Trophy, TrendingUp, Star, Award, Lock } from 'lucide-react-native';

const { width: screenWidth } = Dimensions.get('window');
const cardWidth = (screenWidth - 48 - 28) / 3; // padding (24*2) + gaps (14*2) / 3 columns

export default function AchievementScreen() {
  const router = useRouter();

  const earnedBadges = [
    { 
      id: '1', 
      title: 'First Step', 
      date: 'Jan 15',
      icon: Target,
      bgColor: '#E9DFFF',
      iconBg: '#9163F2',
      iconColor: '#FFFFFF',
    },
    { 
      id: '2', 
      title: 'Week Warrior', 
      date: 'Jan 20',
      icon: Flame,
      bgColor: '#FFE5E5',
      iconBg: '#FF6B6B',
      iconColor: '#FFFFFF',
    },
    { 
      id: '3', 
      title: 'Milestone Master', 
      date: 'Jan 25',
      icon: Trophy,
      bgColor: '#FFF4E0',
      iconBg: '#FFD88A',
      iconColor: '#3C2B63',
    },
  ];

  const lockedBadges = [
    { 
      id: '4', 
      title: 'Fitness Achiever', 
      status: 'Locked',
      icon: TrendingUp,
    },
    { 
      id: '5', 
      title: 'Consistency King', 
      status: 'Locked',
      icon: Star,
    },
    { 
      id: '6', 
      title: 'Finance Warrior', 
      status: 'Locked',
      icon: Award,
    },
  ];

  const totalBadges = earnedBadges.length + lockedBadges.length;
  const earnedCount = earnedBadges.length;
  const progressPercentage = (earnedCount / totalBadges) * 100;

  return (
    <View style={styles.container}>
      {/* Header with gradient */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color="#FFFFFF" />
        </TouchableOpacity>
        
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Achievement Board</Text>
          <Text style={styles.headerSubtitle}>{earnedCount} of {totalBadges} earned</Text>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressBarContainer}>
          <View 
            style={[styles.progressBar, { width: `${progressPercentage}%` }]} 
          />
        </View>
      </View>

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Earned Badges Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionIcon}>🏆</Text>
            <Text style={styles.sectionTitle}>Earned Badges</Text>
          </View>
          
          <View style={styles.badgesGrid}>
            {earnedBadges.map((badge) => {
              const IconComponent = badge.icon;
              return (
                <View key={badge.id} style={[styles.badgeCard, { backgroundColor: badge.bgColor }]}>
                  <View style={[styles.badgeIconContainer, { backgroundColor: badge.iconBg }]}>
                    <IconComponent size={40} color={badge.iconColor} strokeWidth={2.2} />
                  </View>
                  <Text style={styles.badgeTitle}>{badge.title}</Text>
                  <Text style={styles.badgeDate}>{badge.date}</Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* Locked Badges Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Lock size={20} color="#666" />
            <Text style={[styles.sectionTitle, { color: '#666' }]}>Locked Badges</Text>
          </View>
          
          <View style={styles.badgesGrid}>
            {lockedBadges.map((badge) => {
              const IconComponent = badge.icon;
              return (
                <View key={badge.id} style={styles.lockedBadgeCard}>
                  <View style={styles.lockedBadgeIconContainer}>
                    <IconComponent size={40} color="#6B7280" strokeWidth={2.2} />
                  </View>
                  <Text style={styles.lockedBadgeTitle}>{badge.title}</Text>
                  <Text style={styles.lockedBadgeStatus}>{badge.status}</Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* Motivational Message */}
        <View style={styles.motivationCard}>
          <Text style={styles.motivationEmoji}>🌟</Text>
          <Text style={styles.motivationText}>
            Keep going! Complete more Pakts to unlock new badges
          </Text>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F4F6',
  },
  header: {
    backgroundColor: '#9163F2',
    paddingTop: 60,
    paddingBottom: 24,
    paddingHorizontal: 24,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  headerContent: {
    alignItems: 'center',
    marginBottom: 20,
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
    padding: 24,
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
    gap: 10,
  },
  sectionIcon: {
    fontSize: 22,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1625',
  },
  badgesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 14,
  },
  badgeCard: {
    width: cardWidth,
    aspectRatio: 0.9,
    borderRadius: 28,
    padding: 18,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 5,
  },
  badgeIconContainer: {
    width: 72,
    height: 72,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  badgeTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1a1625',
    textAlign: 'center',
    marginBottom: 6,
    letterSpacing: -0.3,
  },
  badgeDate: {
    fontSize: 13,
    color: '#666',
    textAlign: 'center',
    fontWeight: '500',
  },
  lockedBadgeCard: {
    width: cardWidth,
    aspectRatio: 0.9,
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    padding: 18,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
  lockedBadgeIconContainer: {
    width: 72,
    height: 72,
    borderRadius: 22,
    backgroundColor: '#3C4455',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  lockedBadgeTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#666',
    textAlign: 'center',
    marginBottom: 6,
    letterSpacing: -0.3,
  },
  lockedBadgeStatus: {
    fontSize: 13,
    color: '#999',
    textAlign: 'center',
    fontWeight: '500',
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
