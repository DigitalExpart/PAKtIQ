import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Switch } from 'react-native';

type SettingsScreenProps = {
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  onBack: () => void;
  navigation?: any;
};

export default function SettingsScreen({ isDarkMode, onToggleDarkMode, onBack }: SettingsScreenProps) {
  return (
    <SafeAreaView style={[styles.container, isDarkMode && styles.darkContainer]}>
      <View style={styles.content}>
        <Text style={[styles.title, isDarkMode && styles.darkText]}>Settings</Text>
        <View style={styles.settingRow}>
          <Text style={[styles.settingLabel, isDarkMode && styles.darkText]}>Dark Mode</Text>
          <Switch
            value={isDarkMode}
            onValueChange={onToggleDarkMode}
            trackColor={{ false: '#767577', true: '#9163F2' }}
            thumbColor={isDarkMode ? '#FFFFFF' : '#f4f3f4'}
          />
        </View>
        <TouchableOpacity style={styles.button} onPress={onBack}>
          <Text style={styles.buttonText}>Back</Text>
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
  darkContainer: {
    backgroundColor: '#1a1625',
  },
  content: {
    flex: 1,
    padding: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 32,
  },
  darkText: {
    color: '#FFFFFF',
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  settingLabel: {
    fontSize: 18,
    color: '#333',
  },
  button: {
    backgroundColor: '#9163F2',
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 32,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
});

