import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, Modal } from 'react-native';
import { useRouter } from 'expo-router';

export default function EditProfileScreen() {
  const router = useRouter();
  const [profile, setProfile] = useState({
    name: 'Alex Johnson',
    email: 'alex.johnson@email.com',
    bio: 'Committed to growth and achieving my goals one Pakt at a time.',
  });

  const updateField = (field: string, value: string) => {
    setProfile({ ...profile, [field]: value });
  };

  const handleSave = () => {
    // Save profile logic here
    console.log('Saving profile:', profile);
    router.back();
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <View style={styles.overlay}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {/* Title */}
            <Text style={styles.title}>Edit Profile</Text>

            {/* Form Fields */}
            <View style={styles.form}>
              {/* Name Field */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Name</Text>
                <TextInput
                  style={styles.input}
                  value={profile.name}
                  onChangeText={(text) => updateField('name', text)}
                  placeholder="Enter your name"
                  placeholderTextColor="#999"
                />
              </View>

              {/* Email Field */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Email</Text>
                <TextInput
                  style={styles.input}
                  value={profile.email}
                  onChangeText={(text) => updateField('email', text)}
                  placeholder="Enter your email"
                  placeholderTextColor="#999"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              {/* Bio Field */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Bio</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={profile.bio}
                  onChangeText={(text) => updateField('bio', text)}
                  placeholder="Tell us about yourself"
                  placeholderTextColor="#999"
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                />
              </View>
            </View>

            {/* Buttons */}
            <View style={styles.buttonContainer}>
              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={handleCancel}
                activeOpacity={0.7}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.saveButton}
                onPress={handleSave}
                activeOpacity={0.8}
              >
                <Text style={styles.saveButtonText}>Save Changes</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
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
  keyboardView: {
    width: '100%',
    maxWidth: 500,
  },
  modalContainer: {
    width: '100%',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 24,
    elevation: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a1625',
    marginBottom: 32,
  },
  form: {
    marginBottom: 32,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F4F4F6',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#1a1625',
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  textArea: {
    height: 100,
    paddingTop: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#9163F2',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: '#9163F2',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
