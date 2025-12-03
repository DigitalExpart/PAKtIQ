import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';

const templates = [
  {
    id: '1',
    name: 'Marathon Training',
    category: 'Health & Fitness',
    icon: '🏃',
    color: '#FF6B6B',
    description: '16-week program to run your first marathon',
    milestones: ['Complete first 10K', 'Run half marathon distance', 'Long run 20+ miles', 'Complete marathon'],
    duration: '16 weeks',
    difficulty: 'Advanced',
  },
  {
    id: '2',
    name: 'Learn a New Language',
    category: 'Personal Growth',
    icon: '🗣️',
    color: '#4ECDC4',
    description: 'Become conversational in 12 weeks',
    milestones: ['Learn 100 words', 'Complete grammar basics', 'Practice daily conversations', 'Pass language test'],
    duration: '12 weeks',
    difficulty: 'Intermediate',
  },
  {
    id: '3',
    name: 'Save $10,000',
    category: 'Finance',
    icon: '💰',
    color: '#FFD93D',
    description: 'Build your emergency fund',
    milestones: ['Save $2,500', 'Save $5,000', 'Save $7,500', 'Reach $10,000'],
    duration: '12 months',
    difficulty: 'Intermediate',
  },
  {
    id: '4',
    name: 'Read 50 Books',
    category: 'Personal Growth',
    icon: '📚',
    color: '#95E1D3',
    description: 'Expand your knowledge and perspectives',
    milestones: ['Read 10 books', 'Read 25 books', 'Read 40 books', 'Complete 50 books'],
    duration: '52 weeks',
    difficulty: 'Beginner',
  },
  {
    id: '5',
    name: 'Launch Side Business',
    category: 'Career',
    icon: '🚀',
    color: '#AA96DA',
    description: 'Build and launch your first product',
    milestones: ['Validate idea', 'Build MVP', 'Get first customers', 'Reach $1K revenue'],
    duration: '6 months',
    difficulty: 'Advanced',
  },
  {
    id: '6',
    name: 'Daily Meditation',
    category: 'Wellness',
    icon: '🧘',
    color: '#FCBAD3',
    description: 'Build a consistent meditation practice',
    milestones: ['7-day streak', '30-day streak', '90-day streak', '365-day streak'],
    duration: '1 year',
    difficulty: 'Beginner',
  },
];

export default function TemplateLibrary() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Health & Fitness', 'Personal Growth', 'Finance', 'Career', 'Wellness'];

  const filteredTemplates = selectedCategory === 'All' 
    ? templates 
    : templates.filter(t => t.category === selectedCategory);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return '#4ECDC4';
      case 'Intermediate': return '#FFD93D';
      case 'Advanced': return '#FF6B6B';
      default: return '#666';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Template Library</Text>
        <Text style={styles.subtitle}>Start with proven goal templates</Text>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesScroll}>
        <View style={styles.categories}>
          {categories.map((category) => (
            <TouchableOpacity
              key={category}
              style={[
                styles.categoryChip,
                selectedCategory === category && styles.categoryChipActive,
              ]}
              onPress={() => setSelectedCategory(category)}
            >
              <Text style={[
                styles.categoryChipText,
                selectedCategory === category && styles.categoryChipTextActive,
              ]}>
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <ScrollView style={styles.content}>
        {filteredTemplates.map((template) => (
          <View key={template.id} style={styles.templateCard}>
            <View style={styles.templateHeader}>
              <View style={[styles.templateIcon, { backgroundColor: template.color }]}>
                <Text style={styles.templateIconText}>{template.icon}</Text>
              </View>
              <View style={styles.templateHeaderInfo}>
                <Text style={styles.templateName}>{template.name}</Text>
                <Text style={styles.templateCategory}>{template.category}</Text>
              </View>
            </View>

            <Text style={styles.templateDescription}>{template.description}</Text>

            <View style={styles.templateMeta}>
              <View style={styles.metaItem}>
                <Text style={styles.metaLabel}>Duration</Text>
                <Text style={styles.metaValue}>{template.duration}</Text>
              </View>
              <View style={styles.metaItem}>
                <Text style={styles.metaLabel}>Difficulty</Text>
                <Text style={[styles.metaValue, { color: getDifficultyColor(template.difficulty) }]}>
                  {template.difficulty}
                </Text>
              </View>
            </View>

            <View style={styles.milestonesSection}>
              <Text style={styles.milestonesTitle}>Key Milestones:</Text>
              {template.milestones.map((milestone, index) => (
                <View key={index} style={styles.milestoneItem}>
                  <Text style={styles.milestoneNumber}>{index + 1}</Text>
                  <Text style={styles.milestoneText}>{milestone}</Text>
                </View>
              ))}
            </View>

            <TouchableOpacity 
              style={styles.useButton}
              onPress={() => router.push('/pakt-naming')}
            >
              <Text style={styles.useButtonText}>Use This Template</Text>
            </TouchableOpacity>
          </View>
        ))}
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
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  categoriesScroll: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  categories: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    gap: 8,
  },
  categoryChip: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#F4F4F6',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  categoryChipActive: {
    backgroundColor: '#9163F2',
    borderColor: '#9163F2',
  },
  categoryChipText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  categoryChipTextActive: {
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
    padding: 24,
  },
  templateCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  templateHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  templateIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  templateIconText: {
    fontSize: 32,
  },
  templateHeaderInfo: {
    flex: 1,
  },
  templateName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#3C2B63',
    marginBottom: 4,
  },
  templateCategory: {
    fontSize: 14,
    color: '#9163F2',
  },
  templateDescription: {
    fontSize: 15,
    color: '#666',
    marginBottom: 16,
    lineHeight: 22,
  },
  templateMeta: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 24,
  },
  metaItem: {
    flex: 1,
  },
  metaLabel: {
    fontSize: 12,
    color: '#999',
    marginBottom: 4,
  },
  metaValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3C2B63',
  },
  milestonesSection: {
    marginBottom: 16,
  },
  milestonesTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3C2B63',
    marginBottom: 8,
  },
  milestoneItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  milestoneNumber: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#E8DEFF',
    color: '#9163F2',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 20,
    marginRight: 8,
  },
  milestoneText: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  useButton: {
    backgroundColor: '#9163F2',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  useButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

