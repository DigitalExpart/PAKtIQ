import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Platform, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { usePaktCreation } from '../src/contexts/PaktCreationContext';
import { Calendar } from 'lucide-react-native';
import { useTheme } from '../src/contexts/ThemeContext';
import { useLanguage } from '../src/contexts/LanguageContext';

// Conditional import for DateTimePicker
let DateTimePicker: any = null;
try {
  DateTimePicker = require('@react-native-community/datetimepicker').default;
} catch (e) {
  console.warn('DateTimePicker not available, using fallback');
}

export default function PaktNaming() {
  const router = useRouter();
  const { updatePaktData } = usePaktCreation();
  const { colors } = useTheme();
  const { t } = useLanguage();
  const [paktName, setPaktName] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState(new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)); // 90 days from now
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [tempDate, setTempDate] = useState(new Date(Date.now() + 90 * 24 * 60 * 60 * 1000));

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
      updatePaktData({ 
        name: paktName.trim(), 
        description: description.trim() || undefined,
        targetDate: deadline.toISOString()
      });
      router.push('/milestone-builder');
    }
  };

  const onDateChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }
    if (selectedDate) {
      setTempDate(selectedDate);
      if (Platform.OS === 'android') {
        setDeadline(selectedDate);
      }
    }
  };

  const handleDateConfirm = () => {
    setDeadline(tempDate);
    setShowDatePicker(false);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.surface }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={[styles.backButton, { color: colors.primary }]}>← Back</Text>
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text }]}>{t('paktNaming.title')}</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>{t('paktNaming.subtitle')}</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.inputSection}>
          <Text style={[styles.label, { color: colors.text }]}>{t('paktNaming.paktName')}</Text>
          <TextInput
            style={[styles.input, { backgroundColor: colors.surface, color: colors.text, borderColor: colors.border }]}
            placeholder={t('paktNaming.paktNamePlaceholder')}
            placeholderTextColor={colors.textSecondary}
            value={paktName}
            onChangeText={setPaktName}
            autoFocus
          />
        </View>

        <View style={styles.inputSection}>
          <Text style={[styles.label, { color: colors.text }]}>Description (Optional)</Text>
          <TextInput
            style={[styles.input, styles.textArea, { backgroundColor: colors.surface, color: colors.text, borderColor: colors.border }]}
            placeholder="Add more details about your goal..."
            placeholderTextColor={colors.textSecondary}
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        <View style={styles.inputSection}>
          <Text style={[styles.label, { color: colors.text }]}>{t('paktNaming.deadline')}</Text>
          <TouchableOpacity
            style={[styles.dateButton, { backgroundColor: colors.surface, borderColor: colors.border }]}
            onPress={() => {
              setTempDate(deadline);
              setShowDatePicker(true);
            }}
          >
            <Calendar size={20} color={colors.primary} />
            <Text style={[styles.dateButtonText, { color: colors.text }]}>{formatDate(deadline)}</Text>
          </TouchableOpacity>
          
          {/* Date Picker Modal for iOS */}
          {showDatePicker && Platform.OS === 'ios' && DateTimePicker && (
            <Modal
              visible={showDatePicker}
              transparent
              animationType="slide"
              onRequestClose={() => setShowDatePicker(false)}
            >
              <View style={styles.datePickerModal}>
                <View style={[styles.datePickerContainer, { backgroundColor: colors.surface }]}>
                  <View style={styles.datePickerHeader}>
                    <TouchableOpacity onPress={() => setShowDatePicker(false)}>
                      <Text style={[styles.datePickerCancel, { color: colors.primary }]}>Cancel</Text>
                    </TouchableOpacity>
                    <Text style={[styles.datePickerTitle, { color: colors.text }]}>Select Deadline</Text>
                    <TouchableOpacity onPress={handleDateConfirm}>
                      <Text style={[styles.datePickerDone, { color: colors.primary }]}>Done</Text>
                    </TouchableOpacity>
                  </View>
                  <DateTimePicker
                    value={tempDate}
                    mode="date"
                    display="spinner"
                    onChange={(event, date) => {
                      if (date) setTempDate(date);
                    }}
                    minimumDate={new Date()}
                    textColor={colors.text}
                  />
                </View>
              </View>
            </Modal>
          )}
          
          {/* Date Picker for Android */}
          {showDatePicker && Platform.OS === 'android' && DateTimePicker && (
            <DateTimePicker
              value={deadline}
              mode="date"
              display="default"
              onChange={onDateChange}
              minimumDate={new Date()}
            />
          )}
          
          {/* Fallback Date Input when DateTimePicker is not available */}
          {showDatePicker && !DateTimePicker && (
            <Modal
              visible={showDatePicker}
              transparent
              animationType="slide"
              onRequestClose={() => setShowDatePicker(false)}
            >
              <View style={styles.datePickerModal}>
                <View style={[styles.datePickerContainer, { backgroundColor: colors.surface }]}>
                  <View style={styles.datePickerHeader}>
                    <TouchableOpacity onPress={() => setShowDatePicker(false)}>
                      <Text style={[styles.datePickerCancel, { color: colors.primary }]}>Cancel</Text>
                    </TouchableOpacity>
                    <Text style={[styles.datePickerTitle, { color: colors.text }]}>Select Deadline</Text>
                    <TouchableOpacity onPress={handleDateConfirm}>
                      <Text style={[styles.datePickerDone, { color: colors.primary }]}>Done</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.fallbackDateInput}>
                    <Text style={[styles.fallbackLabel, { color: colors.text }]}>Date (YYYY-MM-DD):</Text>
                    <TextInput
                      style={[styles.fallbackInput, { backgroundColor: colors.background, color: colors.text, borderColor: colors.border }]}
                      value={tempDate.toISOString().split('T')[0]}
                      onChangeText={(text) => {
                        const date = new Date(text);
                        if (!isNaN(date.getTime()) && date >= new Date()) {
                          setTempDate(date);
                        }
                      }}
                      placeholder="YYYY-MM-DD"
                      placeholderTextColor={colors.textSecondary}
                    />
                  </View>
                </View>
              </View>
            </Modal>
          )}
        </View>

        <View style={styles.suggestionsSection}>
          <Text style={[styles.suggestionsTitle, { color: colors.text }]}>💡 {t('paktNaming.popularIdeas')}</Text>
          <View style={styles.suggestionsGrid}>
            {suggestions.map((suggestion, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.suggestionChip, { backgroundColor: colors.surface, borderColor: colors.primary }]}
                onPress={() => setPaktName(suggestion)}
              >
                <Text style={[styles.suggestionText, { color: colors.primary }]}>{suggestion}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={[styles.tipsSection, { backgroundColor: colors.primaryLight }]}>
          <Text style={[styles.tipsTitle, { color: colors.text }]}>✨ Tips for a Great Pakt</Text>
          <Text style={[styles.tipItem, { color: colors.textSecondary }]}>• Be specific and measurable</Text>
          <Text style={[styles.tipItem, { color: colors.textSecondary }]}>• Make it challenging but achievable</Text>
          <Text style={[styles.tipItem, { color: colors.textSecondary }]}>• Focus on one clear outcome</Text>
        </View>
      </ScrollView>

      <View style={[styles.footer, { backgroundColor: colors.surface }]}>
        <TouchableOpacity
          style={[styles.continueButton, !paktName.trim() && styles.disabledButton]}
          onPress={handleContinue}
          disabled={!paktName.trim()}
        >
          <Text style={styles.continueButtonText}>{t('paktNaming.continue')}</Text>
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
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  dateButtonText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
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
  datePickerModal: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  datePickerContainer: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 20,
  },
  datePickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  datePickerCancel: {
    fontSize: 16,
    fontWeight: '600',
  },
  datePickerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  datePickerDone: {
    fontSize: 16,
    fontWeight: '600',
  },
  fallbackDateInput: {
    padding: 20,
  },
  fallbackLabel: {
    fontSize: 14,
    marginBottom: 8,
    fontWeight: '500',
  },
  fallbackInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
});

