import i18n from '../lib/i18n';

/**
 * Map category values from database to translation keys
 */
const categoryKeyMap: Record<string, string> = {
  'Health & Fitness': 'healthFitness',
  'Career & Education': 'careerEducation',
  'Finance': 'finance',
  'Relationships': 'relationships',
  'Personal Growth': 'personalGrowth',
  'Creativity': 'creativity',
  'Productivity': 'productivity',
  'Wellness': 'wellness',
  // Handle variations
  'Health': 'healthFitness',
  'Fitness': 'healthFitness',
  'Career': 'careerEducation',
  'Education': 'careerEducation',
  'Personal': 'personalGrowth',
  'Growth': 'personalGrowth',
};

/**
 * Translate category name
 */
export const translateCategory = (category: string | null | undefined): string => {
  if (!category) return '';
  
  const categoryKey = categoryKeyMap[category] || category.toLowerCase().replace(/\s+/g, '');
  const translationKey = `categories.${categoryKey}`;
  const translated = i18n.t(translationKey);
  
  // If translation doesn't exist, return original
  if (translated === translationKey) {
    return category;
  }
  
  return translated;
};

/**
 * Common Resolve name translations
 * Maps common English Resolve names to translation keys
 */
const commonResolveNames: Record<string, string> = {
  // English -> Translation Key
  'Book Reading': 'paktNames.bookReading',
  'Reading': 'paktNames.reading',
  'Read Books': 'paktNames.readBooks',
  'Read More': 'paktNames.readMore',
  'Healthy': 'paktNames.healthy',
  'Health': 'paktNames.health',
  'Exercise': 'paktNames.exercise',
  'Exercise Daily': 'paktNames.exerciseDaily',
  'Daily Exercise': 'paktNames.dailyExercise',
  'Workout': 'paktNames.workout',
  'Meditation': 'paktNames.meditation',
  'Meditate': 'paktNames.meditate',
  'Learn Language': 'paktNames.learnLanguage',
  'Learn New Language': 'paktNames.learnNewLanguage',
  'Save Money': 'paktNames.saveMoney',
  'Save More': 'paktNames.saveMore',
  'Write': 'paktNames.write',
  'Write Daily': 'paktNames.writeDaily',
  'Journal': 'paktNames.journal',
  'Practice Guitar': 'paktNames.practiceGuitar',
  'Practice Piano': 'paktNames.practicePiano',
  'Cook More': 'paktNames.cookMore',
  'Learn to Cook': 'paktNames.learnToCook',
  'Quit Smoking': 'paktNames.quitSmoking',
  'Drink Water': 'paktNames.drinkWater',
  'Sleep Better': 'paktNames.sleepBetter',
  'Wake Up Early': 'paktNames.wakeUpEarly',
  'Study': 'paktNames.study',
  'Study Daily': 'paktNames.studyDaily',
  'Practice': 'paktNames.practice',
  'Practice Daily': 'paktNames.practiceDaily',
  // Add more variations
  'Book reading': 'paktNames.bookReading',
  'book reading': 'paktNames.bookReading',
  'healthy': 'paktNames.healthy',
  'exercise': 'paktNames.exercise',
  'meditation': 'paktNames.meditation',
};

/**
 * Translate Resolve name
 * Tries to translate common Resolve names, falls back to original if not found
 */
export const translateResolveName = (name: string | null | undefined): string => {
  if (!name) return '';
  
  // Check if it's a common name we have translations for
  const translationKey = commonResolveNames[name];
  if (translationKey) {
    const translated = i18n.t(translationKey);
    // If translation exists (not the same as key), return it
    if (translated !== translationKey) {
      return translated;
    }
  }
  
  // Try case-insensitive match
  const nameLower = name.toLowerCase();
  for (const [englishName, key] of Object.entries(commonResolveNames)) {
    if (englishName.toLowerCase() === nameLower) {
      const translated = i18n.t(key);
      if (translated !== key) {
        return translated;
      }
    }
  }
  
  // No translation found, return original
  return name;
};
