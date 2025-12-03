import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';

const categories = [
  { id: '1', name: 'Health & Fitness', icon: '💪', color: '#FF6B6B' },
  { id: '2', name: 'Career & Education', icon: '📚', color: '#4ECDC4' },
  { id: '3', name: 'Finance', icon: '💰', color: '#FFD93D' },
  { id: '4', name: 'Relationships', icon: '❤️', color: '#FF6B9D' },
  { id: '5', name: 'Personal Growth', icon: '🌱', color: '#95E1D3' },
  { id: '6', name: 'Creativity', icon: '🎨', color: '#F38181' },
  { id: '7', name: 'Productivity', icon: '⚡', color: '#AA96DA' },
  { id: '8', name: 'Wellness', icon: '🧘', color: '#FCBAD3' },
];

export default function CategorySelection() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const handleSelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
  };

  const handleContinue = () => {
    if (selectedCategory) {
      router.push('/pakt-naming');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Choose a Category</Text>
        <Text style={styles.subtitle}>What area of life do you want to improve?</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.grid}>
          {categories.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryCard,
                { backgroundColor: category.color },
                selectedCategory === category.id && styles.selectedCard,
              ]}
              onPress={() => handleSelect(category.id)}
            >
              <Text style={styles.categoryIcon}>{category.icon}</Text>
              <Text style={styles.categoryName}>{category.name}</Text>
              {selectedCategory === category.id && (
                <View style={styles.checkmark}>
                  <Text style={styles.checkmarkText}>✓</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.continueButton, !selectedCategory && styles.disabledButton]}
          onPress={handleContinue}
          disabled={!selectedCategory}
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
    padding: 16,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryCard: {
    width: '48%',
    aspectRatio: 1,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  selectedCard: {
    borderWidth: 3,
    borderColor: '#3C2B63',
  },
  categoryIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  checkmark: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#3C2B63',
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmarkText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
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

