import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

export default function InsightsOverview() {
  const router = useRouter();

  const stats = {
    totalPakts: 5,
    activePakts: 3,
    completedPakts: 2,
    currentStreak: 12,
    longestStreak: 28,
    completionRate: 78,
  };

  const weeklyProgress = [
    { day: 'Mon', value: 85 },
    { day: 'Tue', value: 100 },
    { day: 'Wed', value: 75 },
    { day: 'Thu', value: 90 },
    { day: 'Fri', value: 100 },
    { day: 'Sat', value: 60 },
    { day: 'Sun', value: 95 },
  ];

  const categories = [
    { name: 'Health & Fitness', count: 2, color: '#FF6B6B', percentage: 40 },
    { name: 'Career', count: 1, color: '#4ECDC4', percentage: 20 },
    { name: 'Personal Growth', count: 1, color: '#95E1D3', percentage: 20 },
    { name: 'Finance', count: 1, color: '#FFD93D', percentage: 20 },
  ];

  const maxValue = Math.max(...weeklyProgress.map(d => d.value));

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Insights</Text>
        <Text style={styles.subtitle}>Track your progress and patterns</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.streakCard}>
          <View style={styles.streakMain}>
            <Text style={styles.streakIcon}>🔥</Text>
            <View>
              <Text style={styles.streakValue}>{stats.currentStreak} Days</Text>
              <Text style={styles.streakLabel}>Current Streak</Text>
            </View>
          </View>
          <View style={styles.streakDivider} />
          <View style={styles.streakSecondary}>
            <Text style={styles.streakSecondaryValue}>{stats.longestStreak}</Text>
            <Text style={styles.streakSecondaryLabel}>Longest Streak</Text>
          </View>
        </View>

        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{stats.totalPakts}</Text>
            <Text style={styles.statLabel}>Total Pakts</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{stats.activePakts}</Text>
            <Text style={styles.statLabel}>Active</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{stats.completedPakts}</Text>
            <Text style={styles.statLabel}>Completed</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{stats.completionRate}%</Text>
            <Text style={styles.statLabel}>Success Rate</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📊 Weekly Progress</Text>
          <View style={styles.chartCard}>
            <View style={styles.chart}>
              {weeklyProgress.map((item, index) => (
                <View key={index} style={styles.barContainer}>
                  <View style={styles.barWrapper}>
                    <View 
                      style={[
                        styles.bar, 
                        { 
                          height: `${(item.value / maxValue) * 100}%`,
                          backgroundColor: item.value === 100 ? '#9163F2' : '#E0E0E0'
                        }
                      ]} 
                    />
                  </View>
                  <Text style={styles.barLabel}>{item.day}</Text>
                </View>
              ))}
            </View>
            <View style={styles.chartLegend}>
              <Text style={styles.chartLegendText}>Daily task completion rate</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🎯 Category Breakdown</Text>
          <View style={styles.categoryCard}>
            {categories.map((category, index) => (
              <View key={index} style={styles.categoryItem}>
                <View style={styles.categoryInfo}>
                  <View style={[styles.categoryDot, { backgroundColor: category.color }]} />
                  <Text style={styles.categoryName}>{category.name}</Text>
                </View>
                <View style={styles.categoryStats}>
                  <Text style={styles.categoryCount}>{category.count} Pakt{category.count !== 1 ? 's' : ''}</Text>
                  <View style={styles.categoryBarContainer}>
                    <View 
                      style={[
                        styles.categoryBar, 
                        { width: `${category.percentage}%`, backgroundColor: category.color }
                      ]} 
                    />
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>💡 Insights</Text>
          <View style={styles.insightCard}>
            <Text style={styles.insightEmoji}>🌟</Text>
            <View style={styles.insightContent}>
              <Text style={styles.insightTitle}>Best Day: Friday</Text>
              <Text style={styles.insightText}>
                You have a 100% completion rate on Fridays!
              </Text>
            </View>
          </View>
          <View style={styles.insightCard}>
            <Text style={styles.insightEmoji}>📈</Text>
            <View style={styles.insightContent}>
              <Text style={styles.insightTitle}>Trending Up</Text>
              <Text style={styles.insightText}>
                Your completion rate improved by 15% this week
              </Text>
            </View>
          </View>
          <View style={styles.insightCard}>
            <Text style={styles.insightEmoji}>⏰</Text>
            <View style={styles.insightContent}>
              <Text style={styles.insightTitle}>Peak Performance</Text>
              <Text style={styles.insightText}>
                You're most productive in the morning hours
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F4F6',
  },
  header: {
    padding: 24,
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    fontSize: 16,
    color: '#9163F2',
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#3C2B63',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  content: {
    flex: 1,
    padding: 24,
  },
  streakCard: {
    backgroundColor: '#FFD88A',
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
    flexDirection: 'row',
    alignItems: 'center',
  },
  streakMain: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  streakIcon: {
    fontSize: 48,
    marginRight: 16,
  },
  streakValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#3C2B63',
  },
  streakLabel: {
    fontSize: 14,
    color: '#666',
  },
  streakDivider: {
    width: 1,
    height: 40,
    backgroundColor: 'rgba(60, 43, 99, 0.2)',
    marginHorizontal: 20,
  },
  streakSecondary: {
    alignItems: 'center',
  },
  streakSecondaryValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3C2B63',
  },
  streakSecondaryLabel: {
    fontSize: 12,
    color: '#666',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 12,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#9163F2',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#3C2B63',
    marginBottom: 16,
  },
  chartCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
  },
  chart: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 150,
    marginBottom: 16,
  },
  barContainer: {
    flex: 1,
    alignItems: 'center',
  },
  barWrapper: {
    width: '100%',
    height: 120,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  bar: {
    width: '70%',
    borderRadius: 4,
    minHeight: 8,
  },
  barLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 8,
  },
  chartLegend: {
    alignItems: 'center',
  },
  chartLegendText: {
    fontSize: 12,
    color: '#999',
  },
  categoryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
  },
  categoryItem: {
    marginBottom: 20,
  },
  categoryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    flex: 1,
  },
  categoryStats: {
    alignItems: 'flex-end',
  },
  categoryCount: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  categoryBarContainer: {
    width: width - 88,
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  categoryBar: {
    height: '100%',
    borderRadius: 4,
  },
  insightCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    marginBottom: 12,
  },
  insightEmoji: {
    fontSize: 32,
    marginRight: 16,
  },
  insightContent: {
    flex: 1,
  },
  insightTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3C2B63',
    marginBottom: 4,
  },
  insightText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
});

