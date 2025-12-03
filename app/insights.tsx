import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, TrendingUp, Target, Calendar, Award, BarChart3, Clock } from 'lucide-react-native';
import Svg, { Circle } from 'react-native-svg';

export default function InsightsScreen() {
  const router = useRouter();

  const stats = [
    { 
      icon: TrendingUp, 
      value: '87%', 
      label: 'Completion Rate',
      colors: ['#9163F2', '#5A4180'],
    },
    { 
      icon: Target, 
      value: '27', 
      label: 'Milestones Done',
      colors: ['#FF6B6B', '#FF8E53'],
    },
    { 
      icon: Calendar, 
      value: '7', 
      label: 'Day Streak',
      colors: ['#7C3AED', '#9163F2'],
    },
    { 
      icon: Award, 
      value: '12', 
      label: 'Badges Earned',
      colors: ['#FFB84D', '#FFA533'],
    },
  ];

  const weeklyData = [
    { day: 'Mon', value: 4 },
    { day: 'Tue', value: 3 },
    { day: 'Wed', value: 5 },
    { day: 'Thu', value: 2 },
    { day: 'Fri', value: 6 },
    { day: 'Sat', value: 3 },
    { day: 'Sun', value: 4 },
  ];

  const maxValue = Math.max(...weeklyData.map(d => d.value));

  const categories = [
    { name: 'Fitness', count: 5, percentage: 60, color: '#FF6B6B' },
    { name: 'Finance', count: 3, percentage: 40, color: '#96E6B3' },
    { name: 'Learning', count: 4, percentage: 50, color: '#9163F2' },
    { name: 'Wellness', count: 2, percentage: 30, color: '#FFB84D' },
  ];

  const productivityTimes = [
    { time: 'Morning (6AM - 12PM)', percentage: 65, color: '#FFD88A' },
    { time: 'Afternoon (12PM - 6PM)', percentage: 45, color: '#96E6B3' },
    { time: 'Evening (6PM - 12AM)', percentage: 30, color: '#9163F2' },
  ];

  const consistencyScore = 92;

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
          <Text style={styles.headerTitle}>Insights</Text>
          <Text style={styles.headerSubtitle}>Your progress analytics</Text>
        </View>
      </View>

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <View key={index} style={styles.statCard}>
                <View style={[styles.statIconContainer, { 
                  backgroundColor: `${stat.colors[0]}20` 
                }]}>
                  <IconComponent size={24} color={stat.colors[0]} strokeWidth={2.5} />
                </View>
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            );
          })}
        </View>

        {/* Weekly Activity Chart */}
        <View style={styles.section}>
          <View style={styles.chartCard}>
            <View style={styles.chartHeader}>
              <BarChart3 size={20} color="#9163F2" />
              <Text style={styles.chartTitle}>Weekly Activity</Text>
            </View>
            
            <View style={styles.chart}>
              {weeklyData.map((item, index) => (
                <View key={index} style={styles.barContainer}>
                  <View style={styles.barWrapper}>
                    <View 
                      style={[
                        styles.bar, 
                        { 
                          height: `${(item.value / maxValue) * 100}%`,
                        }
                      ]} 
                    />
                  </View>
                  <Text style={styles.barLabel}>{item.day}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Category Breakdown */}
        <View style={styles.section}>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Category Breakdown</Text>
            
            {categories.map((category, index) => (
              <View key={index} style={styles.categoryRow}>
                <View style={styles.categoryLeft}>
                  <Text style={styles.categoryName}>{category.name}</Text>
                  <Text style={styles.categoryCount}>{category.count} Pakts</Text>
                </View>
                <View style={styles.categoryBarContainer}>
                  <View 
                    style={[
                      styles.categoryBar, 
                      { 
                        width: `${category.percentage}%`,
                        backgroundColor: category.color 
                      }
                    ]} 
                  />
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Best Productivity Times */}
        <View style={styles.section}>
          <View style={styles.card}>
            <View style={styles.cardHeaderRow}>
              <Clock size={20} color="#FFD88A" />
              <Text style={styles.cardTitle}>Best Productivity Times</Text>
            </View>
            
            {productivityTimes.map((time, index) => (
              <View key={index} style={styles.timeRow}>
                <View style={styles.timeLeft}>
                  <Text style={styles.timeText}>{time.time}</Text>
                  <Text style={styles.timePercentage}>{time.percentage}%</Text>
                </View>
                <View style={styles.timeBarContainer}>
                  <View 
                    style={[
                      styles.timeBar, 
                      { 
                        width: `${time.percentage}%`,
                        backgroundColor: time.color 
                      }
                    ]} 
                  />
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Consistency Score */}
        <View style={styles.section}>
          <View style={styles.consistencyCard}>
            <View style={styles.consistencyLeft}>
              <Text style={styles.consistencyTitle}>Consistency Score</Text>
              <Text style={styles.consistencyScore}>{consistencyScore}</Text>
              <Text style={styles.consistencyText}>Excellent! Keep it up!</Text>
            </View>
            
            <View style={styles.consistencyRight}>
              <Svg width="100" height="100" viewBox="0 0 100 100">
                {/* Background circle */}
                <Circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="rgba(255, 216, 138, 0.3)"
                  strokeWidth="8"
                  fill="none"
                />
                {/* Progress circle */}
                <Circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="#FFD88A"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={`${(consistencyScore / 100) * 251.2} 251.2`}
                  strokeDashoffset="0"
                  strokeLinecap="round"
                  transform="rotate(-90 50 50)"
                />
              </Svg>
            </View>
          </View>
        </View>

        {/* AI Insights Coming Soon */}
        <View style={styles.section}>
          <View style={styles.aiCard}>
            <Text style={styles.aiEmoji}>🤖</Text>
            <Text style={styles.aiTitle}>AI Insights Coming Soon</Text>
            <Text style={styles.aiText}>
              Get personalized suggestions and optimize your Pakt strategy with AI
            </Text>
            <TouchableOpacity style={styles.aiButton}>
              <Text style={styles.aiButtonText}>Join Waitlist</Text>
            </TouchableOpacity>
          </View>
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
    paddingBottom: 32,
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 24,
  },
  statCard: {
    width: '47%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  statIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  statValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1a1625',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 13,
    color: '#666',
    textAlign: 'center',
  },
  section: {
    marginBottom: 24,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1625',
    marginBottom: 20,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
  },
  chartCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  chartHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 24,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1625',
  },
  chart: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 150,
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
    backgroundColor: '#9163F2',
    borderRadius: 6,
    minHeight: 8,
  },
  barLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 12,
  },
  categoryRow: {
    marginBottom: 20,
  },
  categoryLeft: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 15,
    fontWeight: '500',
    color: '#1a1625',
  },
  categoryCount: {
    fontSize: 14,
    color: '#666',
  },
  categoryBarContainer: {
    height: 8,
    backgroundColor: '#F0F0F0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  categoryBar: {
    height: '100%',
    borderRadius: 4,
  },
  timeRow: {
    marginBottom: 20,
  },
  timeLeft: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  timeText: {
    fontSize: 14,
    color: '#1a1625',
  },
  timePercentage: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  timeBarContainer: {
    height: 8,
    backgroundColor: '#F0F0F0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  timeBar: {
    height: '100%',
    borderRadius: 4,
  },
  consistencyCard: {
    backgroundColor: '#9163F2',
    borderRadius: 20,
    padding: 32,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  consistencyLeft: {
    flex: 1,
  },
  consistencyTitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 8,
  },
  consistencyScore: {
    fontSize: 56,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  consistencyText: {
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  consistencyRight: {
    marginLeft: 24,
  },
  aiCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 32,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  aiEmoji: {
    fontSize: 48,
    marginBottom: 16,
  },
  aiTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1a1625',
    marginBottom: 12,
    textAlign: 'center',
  },
  aiText: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  aiButton: {
    backgroundColor: '#9163F2',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 25,
  },
  aiButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
