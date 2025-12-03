import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, Switch } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Bell, BellOff, Clock, Target, Trophy, TrendingUp } from 'lucide-react-native';

export default function NotificationsScreen() {
  const router = useRouter();
  const [settings, setSettings] = useState({
    pushEnabled: true,
    emailEnabled: true,
    paktReminders: true,
    milestoneReminders: true,
    dailyMotivation: true,
    weeklyReports: true,
    achievements: true,
    streakReminders: true,
  });

  const toggleSetting = (key: string) => {
    setSettings({ ...settings, [key]: !settings[key] });
  };

  const notificationGroups = [
    {
      title: 'General',
      items: [
        {
          key: 'pushEnabled',
          icon: Bell,
          color: '#9163F2',
          title: 'Push Notifications',
          description: 'Receive push notifications on your device',
        },
        {
          key: 'emailEnabled',
          icon: Bell,
          color: '#FFD88A',
          title: 'Email Notifications',
          description: 'Receive notifications via email',
        },
      ],
    },
    {
      title: 'Pakt Reminders',
      items: [
        {
          key: 'paktReminders',
          icon: Target,
          color: '#9163F2',
          title: 'Pakt Reminders',
          description: 'Get reminded about your active Pakts',
        },
        {
          key: 'milestoneReminders',
          icon: Clock,
          color: '#96E6B3',
          title: 'Milestone Deadlines',
          description: 'Reminders for upcoming milestone deadlines',
        },
        {
          key: 'streakReminders',
          icon: TrendingUp,
          color: '#FF6B6B',
          title: 'Streak Protection',
          description: 'Alerts when your streak is at risk',
        },
      ],
    },
    {
      title: 'Progress & Motivation',
      items: [
        {
          key: 'dailyMotivation',
          icon: TrendingUp,
          color: '#FFD88A',
          title: 'Daily Motivation',
          description: 'Receive daily motivational messages',
        },
        {
          key: 'weeklyReports',
          icon: Trophy,
          color: '#96E6B3',
          title: 'Weekly Progress Reports',
          description: 'Summary of your weekly progress',
        },
        {
          key: 'achievements',
          icon: Trophy,
          color: '#FFD88A',
          title: 'Achievement Alerts',
          description: 'Celebrate when you unlock achievements',
        },
      ],
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color="#FFFFFF" />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>Notifications</Text>
        
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* All Notifications Toggle */}
        <View style={styles.masterToggle}>
          <View style={styles.masterToggleContent}>
            {settings.pushEnabled ? (
              <Bell size={24} color="#9163F2" />
            ) : (
              <BellOff size={24} color="#999" />
            )}
            <View style={styles.masterToggleText}>
              <Text style={styles.masterToggleTitle}>
                {settings.pushEnabled ? 'Notifications Enabled' : 'Notifications Disabled'}
              </Text>
              <Text style={styles.masterToggleDescription}>
                {settings.pushEnabled 
                  ? 'You will receive notifications based on your preferences below' 
                  : 'Enable to start receiving notifications'}
              </Text>
            </View>
          </View>
          <Switch
            value={settings.pushEnabled}
            onValueChange={() => toggleSetting('pushEnabled')}
            trackColor={{ false: '#E0E0E0', true: '#9163F2' }}
            thumbColor="#FFFFFF"
          />
        </View>

        {/* Notification Groups */}
        {notificationGroups.map((group, groupIndex) => (
          <View key={groupIndex} style={styles.section}>
            <Text style={styles.sectionTitle}>{group.title}</Text>
            {group.items.map((item, itemIndex) => {
              const IconComponent = item.icon;
              return (
                <View 
                  key={item.key} 
                  style={[
                    styles.notificationItem,
                    !settings.pushEnabled && styles.notificationItemDisabled
                  ]}
                >
                  <View style={[styles.iconContainer, { backgroundColor: `${item.color}20` }]}>
                    <IconComponent size={20} color={item.color} />
                  </View>
                  <View style={styles.notificationContent}>
                    <Text style={[
                      styles.notificationTitle,
                      !settings.pushEnabled && styles.textDisabled
                    ]}>
                      {item.title}
                    </Text>
                    <Text style={[
                      styles.notificationDescription,
                      !settings.pushEnabled && styles.textDisabled
                    ]}>
                      {item.description}
                    </Text>
                  </View>
                  <Switch
                    value={settings[item.key]}
                    onValueChange={() => toggleSetting(item.key)}
                    disabled={!settings.pushEnabled}
                    trackColor={{ false: '#E0E0E0', true: item.color }}
                    thumbColor="#FFFFFF"
                  />
                </View>
              );
            })}
          </View>
        ))}

        {/* Quiet Hours */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quiet Hours</Text>
          <TouchableOpacity 
            style={styles.quietHoursCard}
            disabled={!settings.pushEnabled}
          >
            <Clock size={20} color={settings.pushEnabled ? "#9163F2" : "#999"} />
            <View style={styles.quietHoursContent}>
              <Text style={[
                styles.quietHoursTitle,
                !settings.pushEnabled && styles.textDisabled
              ]}>
                Set Quiet Hours
              </Text>
              <Text style={[
                styles.quietHoursDescription,
                !settings.pushEnabled && styles.textDisabled
              ]}>
                Pause notifications during specific times
              </Text>
            </View>
            <Text style={[
              styles.quietHoursTime,
              !settings.pushEnabled && styles.textDisabled
            ]}>
              10 PM - 8 AM
            </Text>
          </TouchableOpacity>
        </View>

        {/* Test Notification */}
        <View style={styles.testSection}>
          <TouchableOpacity 
            style={[
              styles.testButton,
              !settings.pushEnabled && styles.testButtonDisabled
            ]}
            disabled={!settings.pushEnabled}
          >
            <Bell size={20} color={settings.pushEnabled ? "#9163F2" : "#999"} />
            <Text style={[
              styles.testButtonText,
              !settings.pushEnabled && styles.textDisabled
            ]}>
              Send Test Notification
            </Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 40 }} />
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
    backgroundColor: '#9163F2',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  masterToggle: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    padding: 20,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  masterToggleContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 12,
  },
  masterToggleText: {
    marginLeft: 16,
    flex: 1,
  },
  masterToggleTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1625',
    marginBottom: 4,
  },
  masterToggleDescription: {
    fontSize: 13,
    color: '#666',
    lineHeight: 18,
  },
  section: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1625',
    marginBottom: 12,
  },
  notificationItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  notificationItemDisabled: {
    opacity: 0.5,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  notificationContent: {
    flex: 1,
    marginRight: 12,
  },
  notificationTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1a1625',
    marginBottom: 2,
  },
  notificationDescription: {
    fontSize: 13,
    color: '#666',
    lineHeight: 18,
  },
  textDisabled: {
    color: '#999',
  },
  quietHoursCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  quietHoursContent: {
    flex: 1,
    marginLeft: 12,
  },
  quietHoursTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1a1625',
    marginBottom: 2,
  },
  quietHoursDescription: {
    fontSize: 13,
    color: '#666',
  },
  quietHoursTime: {
    fontSize: 14,
    fontWeight: '600',
    color: '#9163F2',
  },
  testSection: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  testButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    borderWidth: 2,
    borderColor: '#9163F2',
  },
  testButtonDisabled: {
    borderColor: '#E0E0E0',
  },
  testButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#9163F2',
  },
});

