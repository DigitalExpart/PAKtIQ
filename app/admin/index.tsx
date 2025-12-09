import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft, Users, FileText, BarChart3, Shield } from 'lucide-react-native';
import { useTheme } from '../../src/contexts/ThemeContext';
import { useAuth } from '../../src/contexts/AuthContext';
import { AdminService } from '../../src/services/admin.service';

export default function AdminDashboardScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAdminAccess();
  }, [user]);

  const checkAdminAccess = async () => {
    if (!user) {
      setIsAdmin(false);
      setLoading(false);
      return;
    }

    try {
      const adminStatus = await AdminService.isAdmin(user.id);
      setIsAdmin(adminStatus);

      if (adminStatus) {
        loadStats();
      } else {
        Alert.alert('Access Denied', 'You do not have admin access.', [
          { text: 'OK', onPress: () => router.back() },
        ]);
      }
    } catch (error) {
      console.error('Error checking admin access:', error);
      setIsAdmin(false);
      Alert.alert('Error', 'Failed to verify admin access.', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const appStats = await AdminService.getAppStats();
      setStats(appStats);
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  if (loading || isAdmin === null) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.textSecondary }]}>Checking access...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!isAdmin) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.accessDeniedContainer}>
          <Shield size={64} color={colors.textSecondary} />
          <Text style={[styles.accessDeniedText, { color: colors.text }]}>Access Denied</Text>
          <Text style={[styles.accessDeniedSubtext, { color: colors.textSecondary }]}>
            You need admin privileges to access this dashboard.
          </Text>
          <TouchableOpacity
            style={[styles.backButton, { backgroundColor: colors.primary }]}
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.surface }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Shield size={20} color={colors.primary} />
          <Text style={[styles.headerTitle, { color: colors.text }]}>Admin Dashboard</Text>
        </View>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Stats Overview */}
        {stats && (
          <View style={styles.statsSection}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>App Statistics</Text>
            <View style={styles.statsGrid}>
              <View style={[styles.statCard, { backgroundColor: colors.surface }]}>
                <Users size={24} color="#9163F2" />
                <Text style={[styles.statValue, { color: colors.text }]}>{stats.totalUsers}</Text>
                <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Total Users</Text>
              </View>
              <View style={[styles.statCard, { backgroundColor: colors.surface }]}>
                <Users size={24} color="#96E6B3" />
                <Text style={[styles.statValue, { color: colors.text }]}>{stats.activeUsers}</Text>
                <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Active Users</Text>
              </View>
              <View style={[styles.statCard, { backgroundColor: colors.surface }]}>
                <FileText size={24} color="#FFD88A" />
                <Text style={[styles.statValue, { color: colors.text }]}>{stats.totalPakts}</Text>
                <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Total Pakts</Text>
              </View>
              <View style={[styles.statCard, { backgroundColor: colors.surface }]}>
                <BarChart3 size={24} color="#FF6B6B" />
                <Text style={[styles.statValue, { color: colors.text }]}>{stats.completedPakts}</Text>
                <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Completed</Text>
              </View>
            </View>
          </View>
        )}

        {/* Admin Actions */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Quick Actions</Text>
          
          <TouchableOpacity
            style={[styles.actionCard, { backgroundColor: colors.surface }]}
            onPress={() => router.push('/admin/users')}
          >
            <View style={[styles.actionIcon, { backgroundColor: '#9163F220' }]}>
              <Users size={24} color="#9163F2" />
            </View>
            <View style={styles.actionContent}>
              <Text style={[styles.actionTitle, { color: colors.text }]}>User Management</Text>
              <Text style={[styles.actionSubtitle, { color: colors.textSecondary }]}>
                View and manage all users
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionCard, { backgroundColor: colors.surface }]}
            onPress={() => router.push('/admin/pakts')}
          >
            <View style={[styles.actionIcon, { backgroundColor: '#FFD88A20' }]}>
              <FileText size={24} color="#FFD88A" />
            </View>
            <View style={styles.actionContent}>
              <Text style={[styles.actionTitle, { color: colors.text }]}>Content Management</Text>
              <Text style={[styles.actionSubtitle, { color: colors.textSecondary }]}>
                View and moderate pakts
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionCard, { backgroundColor: colors.surface }]}
            onPress={() => router.push('/admin/analytics')}
          >
            <View style={[styles.actionIcon, { backgroundColor: '#96E6B320' }]}>
              <BarChart3 size={24} color="#96E6B3" />
            </View>
            <View style={styles.actionContent}>
              <Text style={[styles.actionTitle, { color: colors.text }]}>Analytics</Text>
              <Text style={[styles.actionSubtitle, { color: colors.textSecondary }]}>
                View detailed analytics and reports
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={{ height: 80 }} />
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  headerCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
  },
  accessDeniedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 48,
  },
  accessDeniedText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 24,
    marginBottom: 8,
  },
  accessDeniedSubtext: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 32,
  },
  backButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  statsSection: {
    padding: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  statValue: {
    fontSize: 32,
    fontWeight: 'bold',
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    textAlign: 'center',
  },
  section: {
    padding: 24,
    paddingTop: 0,
  },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  actionSubtitle: {
    fontSize: 12,
  },
});
