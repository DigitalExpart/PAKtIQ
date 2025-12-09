import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { X, Check } from 'lucide-react-native';
import { useTheme } from '../src/contexts/ThemeContext';
import { useLanguage } from '../src/contexts/LanguageContext';

type Language = {
  code: 'en' | 'es' | 'fr';
  name: string;
  flag: string;
};

export default function LanguageScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { currentLanguage, changeLanguage, t } = useLanguage();
  const [selectedLanguage, setSelectedLanguage] = useState<'en' | 'es' | 'fr'>(currentLanguage);

  useEffect(() => {
    setSelectedLanguage(currentLanguage);
  }, [currentLanguage]);

  // Always show language names in English for clarity
  const languages: Language[] = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Spanish', flag: '🇪🇸' },
    { code: 'fr', name: 'French', flag: '🇫🇷' },
  ];

  const handleSelectLanguage = async (code: 'en' | 'es' | 'fr') => {
    setSelectedLanguage(code);
    await changeLanguage(code);
    setTimeout(() => {
      router.back();
    }, 300);
  };

  return (
    <View style={styles.overlay}>
      <View style={styles.modalContainer}>
        <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={[styles.title, { color: colors.text }]}>{t('language.selectLanguage')}</Text>
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => router.back()}
            >
              <X size={24} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* Language List */}
          <View style={styles.languageList}>
            {languages.map((language) => {
              const isSelected = selectedLanguage === language.code;
              return (
                <TouchableOpacity
                  key={language.code}
                  style={[
                    styles.languageItem,
                    { backgroundColor: colors.background },
                    isSelected && styles.languageItemSelected
                  ]}
                  onPress={() => handleSelectLanguage(language.code)}
                  activeOpacity={0.7}
                >
                  <View style={styles.languageLeft}>
                    <Text style={[
                      styles.languageCode,
                      { color: colors.textSecondary },
                      isSelected && styles.languageCodeSelected
                    ]}>
                      {language.code}
                    </Text>
                    <Text style={[
                      styles.languageName,
                      { color: colors.text },
                      isSelected && styles.languageNameSelected
                    ]}>
                      {language.name}
                    </Text>
                  </View>
                  
                  {isSelected && (
                    <Check size={24} color="#FFFFFF" strokeWidth={3} />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalContainer: {
    width: '100%',
    maxWidth: 400,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 24,
    elevation: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1625',
  },
  closeButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  languageList: {
    gap: 8,
  },
  languageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F4F4F6',
    borderRadius: 16,
    padding: 20,
  },
  languageItemSelected: {
    backgroundColor: '#9163F2',
  },
  languageLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  languageCode: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
    width: 32,
  },
  languageCodeSelected: {
    color: '#FFFFFF',
  },
  languageName: {
    fontSize: 16,
    color: '#1a1625',
    fontWeight: '500',
  },
  languageNameSelected: {
    color: '#FFFFFF',
  },
});

