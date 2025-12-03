import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';

const achievements = [
  { id: '1', title: 'First Step', description: 'Created your first Pakt', icon: '🎯', unlocked: true, date: '2 days ago' },
  { id: '2', title: 'Consistency King', description: 'Completed 7 days in a row', icon: '👑', unlocked: true, date: '1 day ago' },
  { id: '3', title: 'Milestone Master', description: 'Completed 5 milestones', icon: '🏆', unlocked: true, date: 'Today' },
  { id: '4', title: 'Early Bird', description: 'Complete a task before 8 AM', icon: '🌅', unlocked: false, progress: 3, total: 5 },
  { id: '5', title: 'Perfect Week', description: 'Complete all tasks for a week', icon: '⭐', unlocked: false, progress: 5, total: 7 },
  { id: '6', title: 'Social Star', description: 'Share 3 achievements', icon: '✨', unlocked: false, progress: 1, total: 3 },
  { id: '7', title: 'Overachiever', description: 'Complete 100 tasks', icon: '💪', unlocked: false, progress: 47, total: 100 },
  { id: '8', title: 'Commitment Pro', description: 'Maintain a 30-day streak', icon: '🔥', unlocked: false, progress: 12, total: 30 },
];

export default function AchievementBoard() {
  const router = useRouter();
  
  const unlockedAchievements = achievements.filter(a => a.unlocked);
  const lockedAchievements = achievements.filter(a => !a.unlocked);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Achievements</Text>
        <Text style={styles.subtitle}>Your progress and milestones</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.statsCard}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{unlockedAchievements.length}</Text>
            <Text style={styles.statLabel}>Unlocked</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{achievements.length}</Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>
              {Math.round((unlockedAchievements.length / achievements.length) * 100)}%
            </Text>
            <Text style={styles.statLabel}>Complete</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🏆 Unlocked</Text>
          {unlockedAchievements.map((achievement) => (
            <View key={achievement.id} style={styles.achievementCard}>
              <View style={styles.achievementIcon}>
                <Text style={styles.achievementIconText}>{achievement.icon}</Text>
              </View>
              <View style={styles.achievementInfo}>
                <Text style={styles.achievementTitle}>{achievement.title}</Text>
                <Text style={styles.achievementDescription}>{achievement.description}</Text>
                <Text style={styles.achievementDate}>Unlocked {achievement.date}</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🔒 In Progress</Text>
          {lockedAchievements.map((achievement) => (
            <View key={achievement.id} style={[styles.achievementCard, styles.lockedCard]}>
              <View style={[styles.achievementIcon, styles.lockedIcon]}>
                <Text style={styles.achievementIconText}>{achievement.icon}</Text>
              </View>
              <View style={styles.achievementInfo}>
                <Text style={styles.achievementTitle}>{achievement.title}</Text>
                <Text style={styles.achievementDescription}>{achievement.description}</Text>
                {achievement.progress !== undefined && achievement.total !== undefined && (
                  <View style={styles.progressContainer}>
                    <View style={styles.progressBar}>
                      <View 
                        style={[
                          styles.progressFill, 
                          { width: `${(achievement.progress / achievement.total) * 100}%` }
                        ]} 
                      />
                    </View>
                    <Text style={styles.progressText}>
                      {achievement.progress}/{achievement.total}
                    </Text>
                  </View>
                )}
              </View>
            </View>
          ))}
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
  statsCard: {
    backgroundColor: '#9163F2',
    borderRadius: 16,
    padding: 24,
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 24,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#FFD88A',
  },
  statDivider: {
    width: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
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
  achievementCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    marginBottom: 12,
  },
  lockedCard: {
    opacity: 0.7,
  },
  achievementIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#F5F0FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  lockedIcon: {
    backgroundColor: '#E0E0E0',
  },
  achievementIconText: {
    fontSize: 32,
  },
  achievementInfo: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#3C2B63',
    marginBottom: 4,
  },
  achievementDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  achievementDate: {
    fontSize: 12,
    color: '#9163F2',
    fontWeight: '500',
  },
  progressContainer: {
    marginTop: 8,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 4,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#9163F2',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    color: '#666',
  },
});

