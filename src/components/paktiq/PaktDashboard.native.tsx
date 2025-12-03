import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { Screen } from '../../types';

type PaktDashboardProps = {
  pakts: any[];
  onNavigate: (screen: Screen) => void;
  isDarkMode: boolean;
  navigation?: any;
};

export default function PaktDashboard({ pakts, onNavigate, isDarkMode }: PaktDashboardProps) {
  return (
    <SafeAreaView style={[styles.container, isDarkMode && styles.darkContainer]}>
      <ScrollView style={styles.content}>
        <Text style={[styles.title, isDarkMode && styles.darkText]}>My Pakts</Text>
        {pakts.length === 0 ? (
          <Text style={[styles.emptyText, isDarkMode && styles.darkText]}>
            No pakts yet. Create one to get started!
          </Text>
        ) : (
          pakts.map((pakt, index) => (
            <View key={index} style={styles.paktCard}>
              <Text style={styles.paktName}>{pakt.name}</Text>
              <Text style={styles.paktCategory}>{pakt.category}</Text>
            </View>
          ))
        )}
        <TouchableOpacity
          style={styles.button}
          onPress={() => onNavigate('categorySelection')}
        >
          <Text style={styles.buttonText}>Create New Pakt</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => onNavigate('achievements')}
        >
          <Text style={styles.menuButtonText}>Achievements</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => onNavigate('insights')}
        >
          <Text style={styles.menuButtonText}>Insights</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => onNavigate('settings')}
        >
          <Text style={styles.menuButtonText}>Settings</Text>
        </TouchableOpacity>
      </ScrollView>
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
    marginBottom: 24,
  },
  darkText: {
    color: '#FFFFFF',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 48,
  },
  paktCard: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 12,
    marginBottom: 12,
  },
  paktName: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
  },
  paktCategory: {
    fontSize: 16,
    color: '#666',
  },
  button: {
    backgroundColor: '#9163F2',
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 24,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  menuButton: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    marginTop: 8,
  },
  menuButtonText: {
    fontSize: 18,
    color: '#333',
  },
});

