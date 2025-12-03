import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, TextInput, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';

export default function PaktNaming() {
  const router = useRouter();
  const [paktName, setPaktName] = useState('');
  const [description, setDescription] = useState('');

  const suggestions = [
    'Run a Marathon',
    'Learn Spanish',
    'Save $10,000',
    'Read 50 Books',
    'Meditate Daily',
    'Build a Side Project',
  ];

  const handleContinue = () => {
    if (paktName.trim()) {
      router.push('/milestone-builder');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Name Your Pakt</Text>
        <Text style={styles.subtitle}>Give your commitment a clear, actionable name</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.inputSection}>
          <Text style={styles.label}>Pakt Name *</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., Run my first 5K"
            value={paktName}
            onChangeText={setPaktName}
            autoFocus
          />
        </View>

        <View style={styles.inputSection}>
          <Text style={styles.label}>Description (Optional)</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Add more details about your goal..."
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        <View style={styles.suggestionsSection}>
          <Text style={styles.suggestionsTitle}>💡 Popular Ideas</Text>
          <View style={styles.suggestionsGrid}>
            {suggestions.map((suggestion, index) => (
              <TouchableOpacity
                key={index}
                style={styles.suggestionChip}
                onPress={() => setPaktName(suggestion)}
              >
                <Text style={styles.suggestionText}>{suggestion}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.tipsSection}>
          <Text style={styles.tipsTitle}>✨ Tips for a Great Pakt</Text>
          <Text style={styles.tipItem}>• Be specific and measurable</Text>
          <Text style={styles.tipItem}>• Make it challenging but achievable</Text>
          <Text style={styles.tipItem}>• Focus on one clear outcome</Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.continueButton, !paktName.trim() && styles.disabledButton]}
          onPress={handleContinue}
          disabled={!paktName.trim()}
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
  inputSection: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3C2B63',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#333',
  },
  textArea: {
    height: 100,
    paddingTop: 16,
  },
  suggestionsSection: {
    marginBottom: 24,
  },
  suggestionsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#3C2B63',
    marginBottom: 12,
  },
  suggestionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  suggestionChip: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#9163F2',
  },
  suggestionText: {
    color: '#9163F2',
    fontSize: 14,
    fontWeight: '500',
  },
  tipsSection: {
    backgroundColor: '#E8DEFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3C2B63',
    marginBottom: 8,
  },
  tipItem: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  footer: {
    padding: 24,
    backgroundColor: '#FFFFFF',
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

