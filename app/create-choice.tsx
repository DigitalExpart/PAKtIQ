import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Target, Calendar } from 'lucide-react-native';
import { useTheme } from '../src/contexts/ThemeContext';
import { useLanguage } from '../src/contexts/LanguageContext';
import BottomTabBar from '../src/components/BottomTabBar';

export default function CreateChoiceScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { t } = useLanguage();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>{t('createChoice.title')}</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            {t('createChoice.subtitle')}
          </Text>
        </View>

        <View style={styles.optionsContainer}>
          {/* Create Pakt Option */}
          <TouchableOpacity
            style={[styles.optionCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
            onPress={() => router.push('/category-selection')}
            activeOpacity={0.8}
          >
            <View style={[styles.iconContainer, { backgroundColor: colors.primary + '20' }]}>
              <Target size={32} color={colors.primary} />
            </View>
            <Text style={[styles.optionTitle, { color: colors.text }]}>{t('createChoice.createPakt')}</Text>
            <Text style={[styles.optionDescription, { color: colors.textSecondary }]}>
              {t('createChoice.createPaktDesc')}
            </Text>
          </TouchableOpacity>

          {/* Create Daily Habit Option */}
          <TouchableOpacity
            style={[styles.optionCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
            onPress={() => router.push('/habit-create')}
            activeOpacity={0.8}
          >
            <View style={[styles.iconContainer, { backgroundColor: '#4ECDC4' + '20' }]}>
              <Calendar size={32} color="#4ECDC4" />
            </View>
            <Text style={[styles.optionTitle, { color: colors.text }]}>{t('createChoice.createDailyHabit')}</Text>
            <Text style={[styles.optionDescription, { color: colors.textSecondary }]}>
              {t('createChoice.createDailyHabitDesc')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <BottomTabBar />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
  },
  optionsContainer: {
    gap: 20,
  },
  optionCard: {
    padding: 24,
    borderRadius: 20,
    borderWidth: 2,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  optionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  optionDescription: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
});
