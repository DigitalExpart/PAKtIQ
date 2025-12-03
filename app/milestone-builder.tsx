import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, TextInput, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';

interface Milestone {
  id: string;
  title: string;
  completed: boolean;
}

export default function MilestoneBuilder() {
  const router = useRouter();
  const [milestones, setMilestones] = useState<Milestone[]>([
    { id: '1', title: '', completed: false },
  ]);
  const [currentInput, setCurrentInput] = useState('');

  const addMilestone = () => {
    if (currentInput.trim()) {
      setMilestones([
        ...milestones,
        { id: Date.now().toString(), title: currentInput, completed: false },
      ]);
      setCurrentInput('');
    }
  };

  const removeMilestone = (id: string) => {
    setMilestones(milestones.filter(m => m.id !== id));
  };

  const handleContinue = () => {
    const validMilestones = milestones.filter(m => m.title.trim());
    if (validMilestones.length > 0) {
      router.push('/reminder-setup');
    }
  };

  const validMilestones = milestones.filter(m => m.title.trim());

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Build Milestones</Text>
        <Text style={styles.subtitle}>Break your goal into smaller, achievable steps</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.milestonesList}>
          {milestones.map((milestone, index) => (
            milestone.title && (
              <View key={milestone.id} style={styles.milestoneItem}>
                <View style={styles.milestoneNumber}>
                  <Text style={styles.milestoneNumberText}>{index + 1}</Text>
                </View>
                <Text style={styles.milestoneTitle}>{milestone.title}</Text>
                <TouchableOpacity onPress={() => removeMilestone(milestone.id)}>
                  <Text style={styles.removeButton}>✕</Text>
                </TouchableOpacity>
              </View>
            )
          ))}
        </View>

        <View style={styles.inputSection}>
          <TextInput
            style={styles.input}
            placeholder="Add a milestone..."
            value={currentInput}
            onChangeText={setCurrentInput}
            onSubmitEditing={addMilestone}
            returnKeyType="done"
          />
          <TouchableOpacity style={styles.addButton} onPress={addMilestone}>
            <Text style={styles.addButtonText}>+ Add</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.examplesSection}>
          <Text style={styles.examplesTitle}>📋 Example Milestones</Text>
          <Text style={styles.exampleItem}>• Research training programs</Text>
          <Text style={styles.exampleItem}>• Complete first week of training</Text>
          <Text style={styles.exampleItem}>• Run 5K without stopping</Text>
          <Text style={styles.exampleItem}>• Register for race</Text>
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            💡 Aim for 3-7 milestones that guide you from start to finish
          </Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Text style={styles.progressText}>{validMilestones.length} milestone{validMilestones.length !== 1 ? 's' : ''} added</Text>
        <TouchableOpacity
          style={[styles.continueButton, validMilestones.length === 0 && styles.disabledButton]}
          onPress={handleContinue}
          disabled={validMilestones.length === 0}
        >
          <Text style={styles.continueButtonText}>Continue</Text>
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
  milestonesList: {
    marginBottom: 24,
  },
  milestoneItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  milestoneNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#9163F2',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  milestoneNumberText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  milestoneTitle: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  removeButton: {
    fontSize: 20,
    color: '#FF6B6B',
    paddingHorizontal: 8,
  },
  inputSection: {
    flexDirection: 'row',
    marginBottom: 24,
    gap: 8,
  },
  input: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
  },
  addButton: {
    backgroundColor: '#9163F2',
    paddingHorizontal: 20,
    borderRadius: 12,
    justifyContent: 'center',
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  examplesSection: {
    backgroundColor: '#E8DEFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  examplesTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3C2B63',
    marginBottom: 8,
  },
  exampleItem: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  infoBox: {
    backgroundColor: '#FFF9E6',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
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
  progressText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 12,
  },
  continueButton: {
    backgroundColor: '#9163F2',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#CCC',
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
});

