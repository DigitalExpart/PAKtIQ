import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Alert, ActivityIndicator, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Calendar, Save, Trash2 } from 'lucide-react-native';
// import DateTimePicker from '@react-native-community/datetimepicker';
import { PaktService } from '../src/services/pakt.service';
import { useTheme } from '../src/contexts/ThemeContext';

export default function EditPaktScreen() {
  const router = useRouter();
  const { paktId } = useLocalSearchParams();
  const { colors } = useTheme();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [paktName, setPaktName] = useState('');
  const [description, setDescription] = useState('');
  const [targetOutcome, setTargetOutcome] = useState('');
  const [deadline, setDeadline] = useState(new Date());
  const [category, setCategory] = useState('');
  // const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    loadPakt();
  }, []);

  const loadPakt = async () => {
    try {
      setLoading(true);
      const pakt = await PaktService.getPakt(paktId as string);
      if (pakt) {
        setPaktName(pakt.name);
        setDescription(pakt.description);
        setTargetOutcome(pakt.target_outcome);
        setDeadline(new Date(pakt.deadline));
        setCategory(pakt.category);
      }
    } catch (error) {
      console.error('Error loading pakt:', error);
      Alert.alert('Error', 'Failed to load pakt');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!paktName.trim()) {
      Alert.alert('Error', 'Please enter a pakt name');
      return;
    }

    try {
      setSaving(true);
      await PaktService.updatePakt(paktId as string, {
        name: paktName.trim(),
        description: description.trim(),
        target_outcome: targetOutcome.trim() || description.trim(),
        deadline: deadline.toISOString(),
        category: category || 'other',
      });
      
      Alert.alert('Success', 'Pakt updated successfully', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    } catch (error) {
      console.error('Error updating pakt:', error);
      Alert.alert('Error', 'Failed to update pakt');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Pakt',
      'Are you sure you want to delete this pakt? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await PaktService.deletePakt(paktId as string);
              Alert.alert('Success', 'Pakt deleted successfully', [
                { text: 'OK', onPress: () => router.replace('/dashboard') }
              ]);
            } catch (error) {
              console.error('Error deleting pakt:', error);
              Alert.alert('Error', 'Failed to delete pakt');
            }
          },
        },
      ]
    );
  };

  /*
  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setDeadline(selectedDate);
    }
  };
  */

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const dynamicStyles = {
    container: { ...styles.container, backgroundColor: colors.background },
    input: { ...styles.input, backgroundColor: colors.surface, color: colors.text, borderColor: colors.border },
    textArea: { ...styles.textArea },
    dateButton: { ...styles.dateButton, backgroundColor: colors.surface, borderColor: colors.border },
    dateButtonText: { ...styles.dateButtonText, color: colors.text },
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={dynamicStyles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color="#FFFFFF" />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>Edit Pakt</Text>
        
        <TouchableOpacity 
          style={styles.deleteButton}
          onPress={handleDelete}
        >
          <Trash2 size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.inputSection}>
          <Text style={styles.label}>Pakt Name *</Text>
          <TextInput
            style={dynamicStyles.input}
            placeholder="e.g., Run my first 5K"
            placeholderTextColor={colors.textSecondary}
            value={paktName}
            onChangeText={setPaktName}
          />
        </View>

        <View style={styles.inputSection}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[dynamicStyles.input, dynamicStyles.textArea]}
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
          <Text style={styles.label}>Target Outcome</Text>
          <TextInput
            style={dynamicStyles.input}
            placeholder="What do you want to achieve?"
            placeholderTextColor={colors.textSecondary}
            value={targetOutcome}
            onChangeText={setTargetOutcome}
          />
        </View>

        <View style={styles.inputSection}>
          <Text style={styles.label}>Deadline</Text>
          <View style={dynamicStyles.dateButton}>
            <Calendar size={20} color={colors.primary} />
            <Text style={dynamicStyles.dateButtonText}>{formatDate(deadline)}</Text>
          </View>
          {/* Date picker will be available after package installation
          <TouchableOpacity
            style={dynamicStyles.dateButton}
            onPress={() => setShowDatePicker(true)}
          >
            <Calendar size={20} color={colors.primary} />
            <Text style={dynamicStyles.dateButtonText}>{formatDate(deadline)}</Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={deadline}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={onDateChange}
              minimumDate={new Date()}
            />
          )}
          */}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.saveButton, saving && styles.saveButtonDisabled]}
          onPress={handleSave}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <>
              <Save size={20} color="#FFFFFF" />
              <Text style={styles.saveButtonText}>Save Changes</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    backgroundColor: '#9163F2',
    paddingTop: 20,
    paddingBottom: 20,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 107, 107, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
  },
  inputSection: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#9163F2',
    marginBottom: 8,
  },
  input: {
    borderWidth: 2,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    paddingTop: 16,
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  dateButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  footer: {
    padding: 24,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  saveButton: {
    backgroundColor: '#9163F2',
    paddingVertical: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
});
