import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';

type CategorySelectionProps = {
  onSelect: (category: string) => void;
  navigation?: any;
};

export default function CategorySelection({ onSelect }: CategorySelectionProps) {
  const categories = ['Health', 'Career', 'Finance', 'Relationships', 'Learning', 'Other'];
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Choose a Category</Text>
        {categories.map((cat) => (
          <TouchableOpacity
            key={cat}
            style={styles.categoryButton}
            onPress={() => onSelect(cat)}
          >
            <Text style={styles.categoryText}>{cat}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F4F6',
  },
  content: {
    flex: 1,
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  categoryButton: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 12,
    marginBottom: 12,
  },
  categoryText: {
    fontSize: 18,
    fontWeight: '500',
  },
});

