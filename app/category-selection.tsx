import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { usePaktCreation } from '../src/contexts/PaktCreationContext';
import { useTheme } from '../src/contexts/ThemeContext';
import { useLanguage } from '../src/contexts/LanguageContext';

// Categories will be translated in the component
const categories = [
  { id: '1', key: 'healthFitness', icon: '💪', color: '#FF6B6B' },
  { id: '2', key: 'careerEducation', icon: '📚', color: '#4ECDC4' },
  { id: '3', key: 'finance', icon: '💰', color: '#FFD93D' },
  { id: '4', key: 'relationships', icon: '❤️', color: '#FF6B9D' },
  { id: '5', key: 'personalGrowth', icon: '🌱', color: '#95E1D3' },
  { id: '6', key: 'creativity', icon: '🎨', color: '#F38181' },
  { id: '7', key: 'productivity', icon: '⚡', color: '#AA96DA' },
  { id: '8', key: 'wellness', icon: '🧘', color: '#FCBAD3' },
];

export default function CategorySelection() {
  const router = useRouter();
  const { updatePaktData } = usePaktCreation();
  const { colors } = useTheme();
  const { t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const handleSelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
  };

  const handleContinue = () => {
    if (selectedCategory) {
      const category = categories.find(c => c.id === selectedCategory);
      if (category) {
        // Map translation key back to English name for database
        const categoryNameMap: Record<string, string> = {
          healthFitness: 'Health & Fitness',
          careerEducation: 'Career & Education',
          finance: 'Finance',
          relationships: 'Relationships',
          personalGrowth: 'Personal Growth',
          creativity: 'Creativity',
          productivity: 'Productivity',
          wellness: 'Wellness',
        };
        updatePaktData({ category: categoryNameMap[category.key] || category.key });
      }
      router.push('/resolve-naming');
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.surface }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={[styles.backButton, { color: colors.primary }]}>← {t('common.back')}</Text>
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text }]}>{t('categories.title')}</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>{t('categories.subtitle')}</Text>
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
              <Text style={styles.categoryName}>{t(`categories.${category.key}`)}</Text>
              {selectedCategory === category.id && (
                <View style={styles.checkmark}>
                  <Text style={styles.checkmarkText}>✓</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <View style={[styles.footer, { backgroundColor: colors.surface }]}>
        <TouchableOpacity
          style={[styles.continueButton, !selectedCategory && styles.disabledButton]}
          onPress={handleContinue}
          disabled={!selectedCategory}
        >
          <Text style={styles.continueButtonText}>{t('common.continue')}</Text>
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

