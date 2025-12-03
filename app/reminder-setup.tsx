import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, Switch } from 'react-native';
import { useRouter } from 'expo-router';

export default function ReminderSetup() {
  const router = useRouter();
  const [remindersEnabled, setRemindersEnabled] = useState(true);
  const [selectedFrequency, setSelectedFrequency] = useState('daily');
  const [selectedTime, setSelectedTime] = useState('morning');

  const frequencies = [
    { id: 'daily', label: 'Daily', icon: '📅' },
    { id: 'weekly', label: 'Weekly', icon: '📆' },
    { id: 'custom', label: 'Custom', icon: '⚙️' },
  ];

  const times = [
    { id: 'morning', label: 'Morning', time: '8:00 AM', icon: '🌅' },
    { id: 'afternoon', label: 'Afternoon', time: '2:00 PM', icon: '☀️' },
    { id: 'evening', label: 'Evening', time: '7:00 PM', icon: '🌙' },
  ];

  const handleComplete = () => {
    router.push('/dashboard');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Set Reminders</Text>
        <Text style={styles.subtitle}>Stay on track with smart notifications</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.toggleSection}>
          <View style={styles.toggleHeader}>
            <Text style={styles.toggleTitle}>Enable Reminders</Text>
            <Switch
              value={remindersEnabled}
              onValueChange={setRemindersEnabled}
              trackColor={{ false: '#CCC', true: '#9163F2' }}
              thumbColor="#FFFFFF"
            />
          </View>
          <Text style={styles.toggleSubtitle}>
            Get notified to check in on your progress
          </Text>
        </View>

        {remindersEnabled && (
          <>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Frequency</Text>
              <View style={styles.optionsGrid}>
                {frequencies.map((freq) => (
                  <TouchableOpacity
                    key={freq.id}
                    style={[
                      styles.optionCard,
                      selectedFrequency === freq.id && styles.selectedCard,
                    ]}
                    onPress={() => setSelectedFrequency(freq.id)}
                  >
                    <Text style={styles.optionIcon}>{freq.icon}</Text>
                    <Text style={[
                      styles.optionLabel,
                      selectedFrequency === freq.id && styles.selectedLabel,
                    ]}>
                      {freq.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Preferred Time</Text>
              {times.map((time) => (
                <TouchableOpacity
                  key={time.id}
                  style={[
                    styles.timeCard,
                    selectedTime === time.id && styles.selectedTimeCard,
                  ]}
                  onPress={() => setSelectedTime(time.id)}
                >
                  <Text style={styles.timeIcon}>{time.icon}</Text>
                  <View style={styles.timeInfo}>
                    <Text style={[
                      styles.timeLabel,
                      selectedTime === time.id && styles.selectedTimeLabel,
                    ]}>
                      {time.label}
                    </Text>
                    <Text style={styles.timeValue}>{time.time}</Text>
                  </View>
                  {selectedTime === time.id && (
                    <View style={styles.checkmark}>
                      <Text style={styles.checkmarkText}>✓</Text>
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.infoBox}>
              <Text style={styles.infoText}>
                💡 You can always adjust these settings later in your dashboard
              </Text>
            </View>
          </>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.completeButton}
          onPress={handleComplete}
        >
          <Text style={styles.completeButtonText}>
            {remindersEnabled ? 'Complete Setup' : 'Skip Reminders'}
          </Text>
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
  toggleSection: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 12,
    marginBottom: 24,
  },
  toggleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  toggleTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#3C2B63',
  },
  toggleSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#3C2B63',
    marginBottom: 12,
  },
  optionsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  optionCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E0E0E0',
  },
  selectedCard: {
    borderColor: '#9163F2',
    backgroundColor: '#F5F0FF',
  },
  optionIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  optionLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  selectedLabel: {
    color: '#9163F2',
    fontWeight: '600',
  },
  timeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#E0E0E0',
  },
  selectedTimeCard: {
    borderColor: '#9163F2',
    backgroundColor: '#F5F0FF',
  },
  timeIcon: {
    fontSize: 32,
    marginRight: 16,
  },
  timeInfo: {
    flex: 1,
  },
  timeLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
  },
  selectedTimeLabel: {
    color: '#9163F2',
    fontWeight: '600',
  },
  timeValue: {
    fontSize: 14,
    color: '#666',
  },
  checkmark: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#9163F2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmarkText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  infoBox: {
    backgroundColor: '#E8DEFF',
    padding: 16,
    borderRadius: 12,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  footer: {
    padding: 24,
    backgroundColor: '#FFFFFF',
  },
  completeButton: {
    backgroundColor: '#9163F2',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  completeButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
});

