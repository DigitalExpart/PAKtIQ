import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { useRouter } from 'expo-router';
import { X, Check } from 'lucide-react-native';

type Language = {
  code: string;
  name: string;
  flag: string;
};

export default function LanguageScreen() {
  const router = useRouter();
  const [selectedLanguage, setSelectedLanguage] = useState('US');

  const languages: Language[] = [
    { code: 'US', name: 'English', flag: '🇺🇸' },
    { code: 'ES', name: 'Spanish', flag: '🇪🇸' },
    { code: 'FR', name: 'French', flag: '🇫🇷' },
    { code: 'DE', name: 'German', flag: '🇩🇪' },
    { code: 'IT', name: 'Italian', flag: '🇮🇹' },
  ];

  const handleSelectLanguage = (code: string) => {
    setSelectedLanguage(code);
    // Save language preference
    setTimeout(() => {
      router.back();
    }, 300);
  };

  return (
    <View style={styles.overlay}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Select Language</Text>
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => router.back()}
            >
              <X size={24} color="#666" />
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
                    isSelected && styles.languageItemSelected
                  ]}
                  onPress={() => handleSelectLanguage(language.code)}
                  activeOpacity={0.7}
                >
                  <View style={styles.languageLeft}>
                    <Text style={[
                      styles.languageCode,
                      isSelected && styles.languageCodeSelected
                    ]}>
                      {language.code}
                    </Text>
                    <Text style={[
                      styles.languageName,
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

