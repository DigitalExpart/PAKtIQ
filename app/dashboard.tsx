import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';

const mockPakts = [
  {
    id: '1',
    name: 'Run First 5K',
    category: 'Health & Fitness',
    icon: '🏃',
    color: '#FF6B6B',
    progress: 65,
    milestones: 4,
    completedMilestones: 2,
    dueDate: '3 weeks',
  },
  {
    id: '2',
    name: 'Learn Spanish',
    category: 'Personal Growth',
    icon: '🗣️',
    color: '#4ECDC4',
    progress: 42,
    milestones: 5,
    completedMilestones: 2,
    dueDate: '2 months',
  },
  {
    id: '3',
    name: 'Save $5,000',
    category: 'Finance',
    icon: '💰',
    color: '#FFD93D',
    progress: 78,
    milestones: 4,
    completedMilestones: 3,
    dueDate: '1 month',
  },
];

export default function DashboardScreen() {
  const router = useRouter();
  const [pakts] = useState(mockPakts);

  const stats = {
    streak: 12,
    totalPakts: pakts.length,
    completedToday: 5,
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content}>
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Welcome back! 👋</Text>
            <Text style={styles.name}>Keep up the great work</Text>
          </View>
          <TouchableOpacity 
            style={styles.settingsButton}
            onPress={() => router.push('/settings')}
          >
            <Text style={styles.settingsIcon}>⚙️</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statIcon}>🔥</Text>
            <Text style={styles.statValue}>{stats.streak}</Text>
            <Text style={styles.statLabel}>Day Streak</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statIcon}>🎯</Text>
            <Text style={styles.statValue}>{stats.totalPakts}</Text>
            <Text style={styles.statLabel}>Active Pakts</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statIcon}>✓</Text>
            <Text style={styles.statValue}>{stats.completedToday}</Text>
            <Text style={styles.statLabel}>Today</Text>
          </View>
        </View>

        <View style={styles.quickActions}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => router.push('/category-selection')}
          >
            <Text style={styles.actionIcon}>➕</Text>
            <Text style={styles.actionText}>New Pakt</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => router.push('/templates')}
          >
            <Text style={styles.actionIcon}>📋</Text>
            <Text style={styles.actionText}>Templates</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => router.push('/insights')}
          >
            <Text style={styles.actionIcon}>📊</Text>
            <Text style={styles.actionText}>Insights</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => router.push('/achievements')}
          >
            <Text style={styles.actionIcon}>🏆</Text>
            <Text style={styles.actionText}>Awards</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Active Pakts</Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>

          {pakts.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>🎯</Text>
              <Text style={styles.emptyTitle}>No Pakts Yet</Text>
              <Text style={styles.emptyText}>
                Create your first pakt to start tracking your goals
              </Text>
              <TouchableOpacity
                style={styles.createButton}
                onPress={() => router.push('/category-selection')}
              >
                <Text style={styles.createButtonText}>Create First Pakt</Text>
              </TouchableOpacity>
            </View>
          ) : (
            pakts.map((pakt) => (
              <TouchableOpacity key={pakt.id} style={styles.paktCard}>
                <View style={styles.paktHeader}>
                  <View style={[styles.paktIcon, { backgroundColor: pakt.color }]}>
                    <Text style={styles.paktIconText}>{pakt.icon}</Text>
                  </View>
                  <View style={styles.paktInfo}>
                    <Text style={styles.paktName}>{pakt.name}</Text>
                    <Text style={styles.paktCategory}>{pakt.category}</Text>
                  </View>
                  <View style={styles.paktProgress}>
                    <Text style={styles.progressValue}>{pakt.progress}%</Text>
                  </View>
                </View>

                <View style={styles.progressBar}>
                  <View 
                    style={[
                      styles.progressFill, 
                      { width: `${pakt.progress}%`, backgroundColor: pakt.color }
                    ]} 
                  />
                </View>

                <View style={styles.paktFooter}>
                  <Text style={styles.paktMilestones}>
                    {pakt.completedMilestones}/{pakt.milestones} milestones
                  </Text>
                  <Text style={styles.paktDue}>Due in {pakt.dueDate}</Text>
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Discover More</Text>
          
          <TouchableOpacity 
            style={styles.premiumBanner}
            onPress={() => router.push('/premium')}
          >
            <View>
              <Text style={styles.premiumBadge}>⭐ PREMIUM</Text>
              <Text style={styles.premiumTitle}>Unlock Premium Features</Text>
              <Text style={styles.premiumText}>
                Get unlimited pakts, AI coaching, and more
              </Text>
            </View>
            <Text style={styles.premiumArrow}>›</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <Text style={styles.navIconActive}>🏠</Text>
          <Text style={styles.navLabelActive}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.navItem}
          onPress={() => router.push('/insights')}
        >
          <Text style={styles.navIcon}>📊</Text>
          <Text style={styles.navLabel}>Insights</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.navItemCenter}
          onPress={() => router.push('/category-selection')}
        >
          <View style={styles.fabButton}>
            <Text style={styles.fabIcon}>+</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.navItem}
          onPress={() => router.push('/achievements')}
        >
          <Text style={styles.navIcon}>🏆</Text>
          <Text style={styles.navLabel}>Awards</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.navItem}
          onPress={() => router.push('/settings')}
        >
          <Text style={styles.navIcon}>⚙️</Text>
          <Text style={styles.navLabel}>Settings</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F4F6',
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#FFFFFF',
  },
  greeting: {
    fontSize: 16,
    color: '#666',
    marginBottom: 4,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3C2B63',
  },
  settingsButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F4F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingsIcon: {
    fontSize: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    padding: 16,
    paddingTop: 24,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  statIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3C2B63',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
  },
  quickActions: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  actionIcon: {
    fontSize: 28,
    marginBottom: 8,
  },
  actionText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  section: {
    padding: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#3C2B63',
  },
  seeAll: {
    fontSize: 14,
    color: '#9163F2',
    fontWeight: '500',
  },
  emptyState: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 40,
    alignItems: 'center',
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#3C2B63',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  createButton: {
    backgroundColor: '#9163F2',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  createButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  paktCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
  },
  paktHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  paktIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  paktIconText: {
    fontSize: 24,
  },
  paktInfo: {
    flex: 1,
  },
  paktName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#3C2B63',
    marginBottom: 4,
  },
  paktCategory: {
    fontSize: 14,
    color: '#666',
  },
  paktProgress: {
    alignItems: 'flex-end',
  },
  progressValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#9163F2',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 12,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  paktFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  paktMilestones: {
    fontSize: 14,
    color: '#666',
  },
  paktDue: {
    fontSize: 14,
    color: '#9163F2',
    fontWeight: '500',
  },
  premiumBanner: {
    backgroundColor: '#9163F2',
    borderRadius: 16,
    padding: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  premiumBadge: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFD88A',
    marginBottom: 8,
  },
  premiumTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  premiumText: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.9,
  },
  premiumArrow: {
    fontSize: 32,
    color: '#FFFFFF',
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  navItemCenter: {
    flex: 1,
    alignItems: 'center',
    marginTop: -20,
  },
  navIcon: {
    fontSize: 24,
    marginBottom: 4,
    opacity: 0.5,
  },
  navIconActive: {
    fontSize: 24,
    marginBottom: 4,
  },
  navLabel: {
    fontSize: 12,
    color: '#999',
  },
  navLabelActive: {
    fontSize: 12,
    color: '#9163F2',
    fontWeight: '600',
  },
  fabButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#9163F2',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#9163F2',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  fabIcon: {
    fontSize: 32,
    color: '#FFFFFF',
    fontWeight: '300',
  },
});

