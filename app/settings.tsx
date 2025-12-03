import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, Switch } from 'react-native';
import { useRouter } from 'expo-router';

export default function SettingsScreen() {
  const router = useRouter();
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [weeklyReport, setWeeklyReport] = useState(true);
  const [soundEffects, setSoundEffects] = useState(true);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Settings</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notifications</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Push Notifications</Text>
              <Text style={styles.settingDescription}>Get reminders about your pakts</Text>
            </View>
            <Switch
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{ false: '#CCC', true: '#9163F2' }}
              thumbColor="#FFFFFF"
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Weekly Progress Report</Text>
              <Text style={styles.settingDescription}>Receive weekly summaries</Text>
            </View>
            <Switch
              value={weeklyReport}
              onValueChange={setWeeklyReport}
              trackColor={{ false: '#CCC', true: '#9163F2' }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Appearance</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Dark Mode</Text>
              <Text style={styles.settingDescription}>Use dark theme</Text>
            </View>
            <Switch
              value={darkMode}
              onValueChange={setDarkMode}
              trackColor={{ false: '#CCC', true: '#9163F2' }}
              thumbColor="#FFFFFF"
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Sound Effects</Text>
              <Text style={styles.settingDescription}>Play sounds for actions</Text>
            </View>
            <Switch
              value={soundEffects}
              onValueChange={setSoundEffects}
              trackColor={{ false: '#CCC', true: '#9163F2' }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          
          <TouchableOpacity style={styles.settingButton}>
            <Text style={styles.settingButtonText}>Edit Profile</Text>
            <Text style={styles.settingButtonIcon}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingButton}>
            <Text style={styles.settingButtonText}>Privacy Settings</Text>
            <Text style={styles.settingButtonIcon}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingButton}>
            <Text style={styles.settingButtonText}>Data & Storage</Text>
            <Text style={styles.settingButtonIcon}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingButton}>
            <Text style={styles.settingButtonText}>Connected Apps</Text>
            <Text style={styles.settingButtonIcon}>›</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Subscription</Text>
          
          <View style={styles.premiumCard}>
            <View style={styles.premiumHeader}>
              <Text style={styles.premiumBadge}>⭐ FREE PLAN</Text>
            </View>
            <Text style={styles.premiumText}>
              Upgrade to Premium for unlimited pakts and advanced features
            </Text>
            <TouchableOpacity 
              style={styles.upgradeButton}
              onPress={() => router.push('/premium')}
            >
              <Text style={styles.upgradeButtonText}>View Premium Features</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>
          
          <TouchableOpacity style={styles.settingButton}>
            <Text style={styles.settingButtonText}>Help Center</Text>
            <Text style={styles.settingButtonIcon}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingButton}>
            <Text style={styles.settingButtonText}>Contact Support</Text>
            <Text style={styles.settingButtonIcon}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingButton}>
            <Text style={styles.settingButtonText}>Report a Bug</Text>
            <Text style={styles.settingButtonIcon}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingButton}>
            <Text style={styles.settingButtonText}>Rate Us</Text>
            <Text style={styles.settingButtonIcon}>›</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Legal</Text>
          
          <TouchableOpacity style={styles.settingButton}>
            <Text style={styles.settingButtonText}>Terms of Service</Text>
            <Text style={styles.settingButtonIcon}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingButton}>
            <Text style={styles.settingButtonText}>Privacy Policy</Text>
            <Text style={styles.settingButtonIcon}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingButton}>
            <Text style={styles.settingButtonText}>Licenses</Text>
            <Text style={styles.settingButtonIcon}>›</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.dangerSection}>
          <TouchableOpacity style={styles.dangerButton}>
            <Text style={styles.dangerButtonText}>Log Out</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.dangerButton}>
            <Text style={styles.dangerButtonText}>Delete Account</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.versionSection}>
          <Text style={styles.versionText}>PaktIQ v1.0.0</Text>
          <Text style={styles.versionSubtext}>Made with ❤️ for achievers</Text>
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
  },
  content: {
    flex: 1,
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#999',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 12,
  },
  settingItem: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  settingInfo: {
    flex: 1,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    color: '#666',
  },
  settingButton: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  settingButtonText: {
    fontSize: 16,
    color: '#333',
  },
  settingButtonIcon: {
    fontSize: 24,
    color: '#CCC',
  },
  premiumCard: {
    backgroundColor: '#9163F2',
    borderRadius: 12,
    padding: 20,
  },
  premiumHeader: {
    marginBottom: 12,
  },
  premiumBadge: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFD88A',
  },
  premiumText: {
    fontSize: 15,
    color: '#FFFFFF',
    lineHeight: 22,
    marginBottom: 16,
  },
  upgradeButton: {
    backgroundColor: '#FFD88A',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  upgradeButtonText: {
    color: '#3C2B63',
    fontSize: 16,
    fontWeight: '600',
  },
  dangerSection: {
    marginTop: 24,
    paddingHorizontal: 24,
  },
  dangerButton: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#FF6B6B',
  },
  dangerButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FF6B6B',
  },
  versionSection: {
    marginTop: 32,
    marginBottom: 48,
    alignItems: 'center',
  },
  versionText: {
    fontSize: 14,
    color: '#999',
    marginBottom: 4,
  },
  versionSubtext: {
    fontSize: 12,
    color: '#CCC',
  },
});

