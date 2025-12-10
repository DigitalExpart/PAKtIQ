import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { useTheme } from '../src/contexts/ThemeContext';
import { useLanguage } from '../src/contexts/LanguageContext';
import { useAuth } from '../src/contexts/AuthContext';
import { SuccessModal } from '../src/components/SuccessModal';
import { ErrorModal } from '../src/components/ErrorModal';

export default function EditProfileScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { t } = useLanguage();
  const { user, profile: userProfile, updateProfile, refreshProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [profile, setProfile] = useState({
    name: userProfile?.full_name || user?.email?.split('@')[0] || '',
    email: user?.email || '',
    bio: userProfile?.bio || '',
  });

  // Update profile when userProfile changes
  useEffect(() => {
    if (userProfile || user) {
      setProfile({
        name: userProfile?.full_name || user?.email?.split('@')[0] || '',
        email: user?.email || '',
        bio: userProfile?.bio || '',
      });
    }
  }, [userProfile, user]);

  const updateField = (field: string, value: string) => {
    setProfile({ ...profile, [field]: value });
  };

  const handleSave = async () => {
    if (!user) {
      setErrorMessage(t('editProfile.noUserError'));
      setShowErrorModal(true);
      return;
    }

    // Validate name field
    if (!profile.name || profile.name.trim().length === 0) {
      setErrorMessage(t('editProfile.nameRequired'));
      setShowErrorModal(true);
      return;
    }

    // Validate name length
    if (profile.name.trim().length > 100) {
      setErrorMessage(t('editProfile.nameTooLong'));
      setShowErrorModal(true);
      return;
    }

    // Validate bio length if provided
    if (profile.bio && profile.bio.length > 500) {
      setErrorMessage(t('editProfile.bioTooLong'));
      setShowErrorModal(true);
      return;
    }
    
    setLoading(true);
    try {
      await updateProfile({
        full_name: profile.name.trim(),
        bio: profile.bio.trim() || null,
      });
      // Refresh profile to get updated data
      await refreshProfile();
      setShowSuccessModal(true);
    } catch (error: any) {
      console.error('Error saving profile:', error);
      // Show user-friendly error message
      const errorMsg = error?.message || t('editProfile.updateError');
      setErrorMessage(errorMsg);
      setShowErrorModal(true);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        {/* Header */}
        <View style={[styles.header, { backgroundColor: colors.surface }]}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={handleCancel}
          >
            <ArrowLeft size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text }]}>{t('editProfile.title')}</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Form Fields */}
          <View style={styles.form}>
            {/* Name Field */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.text }]}>{t('editProfile.name')}</Text>
              <TextInput
                style={[styles.input, { backgroundColor: colors.surface, color: colors.text, borderColor: colors.border }]}
                value={profile.name}
                onChangeText={(text) => updateField('name', text)}
                placeholder={t('editProfile.namePlaceholder')}
                placeholderTextColor={colors.textSecondary}
              />
            </View>

            {/* Email Field */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.text }]}>{t('editProfile.email')}</Text>
              <TextInput
                style={[styles.input, { backgroundColor: colors.surface, color: colors.textSecondary, borderColor: colors.border }]}
                value={profile.email}
                editable={false}
                placeholder={t('editProfile.emailPlaceholder')}
                placeholderTextColor={colors.textSecondary}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              <Text style={[styles.helpText, { color: colors.textSecondary }]}>
                {t('editProfile.emailCannotChange')}
              </Text>
            </View>

            {/* Bio Field */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.text }]}>{t('editProfile.bio')}</Text>
              <TextInput
                style={[styles.input, styles.textArea, { backgroundColor: colors.surface, color: colors.text, borderColor: colors.border }]}
                value={profile.bio}
                onChangeText={(text) => updateField('bio', text)}
                placeholder={t('editProfile.bioPlaceholder')}
                placeholderTextColor={colors.textSecondary}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>
          </View>

          {/* Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={[styles.cancelButton, { backgroundColor: colors.surface, borderColor: colors.border }]}
              onPress={handleCancel}
              activeOpacity={0.7}
              disabled={loading}
            >
              <Text style={[styles.cancelButtonText, { color: colors.text }]}>{t('common.cancel')}</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.saveButton, { backgroundColor: colors.primary, opacity: loading ? 0.6 : 1 }]}
              onPress={handleSave}
              activeOpacity={0.8}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.saveButtonText}>{t('editProfile.saveChanges')}</Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Success Modal */}
      <SuccessModal
        visible={showSuccessModal}
        title={t('editProfile.successTitle')}
        message={t('editProfile.successMessage')}
        buttonText={t('common.ok')}
        onButtonPress={() => {
          setShowSuccessModal(false);
          router.back();
        }}
      />

      {/* Error Modal */}
      <ErrorModal
        visible={showErrorModal}
        title={t('editProfile.errorTitle')}
        message={errorMessage}
        buttonText={t('common.ok')}
        onButtonPress={() => setShowErrorModal(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
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
    marginBottom: 8,
  },
  input: {
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    borderWidth: 1,
  },
  textArea: {
    height: 100,
    paddingTop: 16,
  },
  helpText: {
    fontSize: 12,
    marginTop: 4,
    fontStyle: 'italic',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  cancelButton: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  saveButton: {
    flex: 1,
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
