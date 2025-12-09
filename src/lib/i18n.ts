import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Import translations
import enTranslations from '../locales/en.json';
import esTranslations from '../locales/es.json';
import frTranslations from '../locales/fr.json';

// Translation resources
const resources = {
  en: {
    translation: enTranslations,
  },
  es: {
    translation: esTranslations,
  },
  fr: {
    translation: frTranslations,
  },
};

const LANGUAGE_STORAGE_KEY = '@resolute_plan_language';

// Get saved language or device language
const getInitialLanguage = async (): Promise<string> => {
  try {
    const savedLanguage = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'es' || savedLanguage === 'fr')) {
      return savedLanguage;
    }
    
    // Get device language
    const locale = Localization.locale || Localization.getLocales()?.[0]?.languageCode || 'en';
    const deviceLanguage = typeof locale === 'string' ? locale.split('-')[0] : 'en';
    
    // Map device language to supported languages
    if (deviceLanguage === 'es') return 'es';
    if (deviceLanguage === 'fr') return 'fr';
    return 'en'; // Default to English
  } catch (error) {
    console.error('Error getting language:', error);
    return 'en';
  }
};

// Initialize i18n synchronously first, then update language
i18n
    .use(initReactI18next)
    .init({
      resources,
    lng: 'en', // Default, will be updated below
      fallbackLng: 'en',
      compatibilityJSON: 'v3',
      interpolation: {
        escapeValue: false,
      },
    });

// Initialize with saved/device language
const initI18n = async () => {
  try {
    const language = await getInitialLanguage();
    await i18n.changeLanguage(language);
  } catch (error) {
    console.error('Error initializing language:', error);
  }
};

// Change language
export const changeLanguage = async (language: 'en' | 'es' | 'fr') => {
  try {
    await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, language);
    await i18n.changeLanguage(language);
    // Force a re-render by emitting a languageChanged event
    i18n.emit('languageChanged', language);
  } catch (error) {
    console.error('Error changing language:', error);
    throw error;
  }
};

// Initialize with saved language
initI18n();

export default i18n;
