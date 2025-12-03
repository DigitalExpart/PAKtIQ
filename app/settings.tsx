import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, Switch } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Sun, Bell, Globe, CreditCard, Shield, FileText, LogOut, ChevronRight } from 'lucide-react-native';

export default function SettingsScreen() {
  const router = useRouter();
  const [darkMode, setDarkMode] = useState(false);

  return (
    <View style={styles.container}>
      {/* Header with gradient */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color="#FFFFFF" />
        </TouchableOpacity>
        
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Settings</Text>
          <Text style={styles.headerSubtitle}>Customize your experience</Text>
        </View>
      </View>

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Appearance Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Appearance</Text>
          
          <View style={styles.card}>
            <View style={styles.settingRow}>
              <View style={styles.settingLeft}>
                <Sun size={20} color="#666" />
                <Text style={styles.settingText}>Dark Mode</Text>
              </View>
              <Switch
                value={darkMode}
                onValueChange={setDarkMode}
                trackColor={{ false: '#E5E5E5', true: '#9163F2' }}
                thumbColor="#FFFFFF"
                ios_backgroundColor="#E5E5E5"
              />
            </View>
          </View>
        </View>

        {/* Preferences Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          
          <View style={styles.card}>
            <TouchableOpacity 
              style={[styles.menuRow, styles.menuRowBorder]}
              onPress={() => router.push('/notifications')}
            >
              <View style={styles.menuLeft}>
                <Bell size={20} color="#666" />
                <Text style={styles.menuText}>Notifications</Text>
              </View>
              <ChevronRight size={20} color="#CCC" />
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.menuRow}
              onPress={() => {/* Navigate to language */}}
            >
              <View style={styles.menuLeft}>
                <Globe size={20} color="#666" />
                <Text style={styles.menuText}>Language</Text>
              </View>
              <View style={styles.menuRight}>
                <Text style={styles.languageText}>English</Text>
                <ChevronRight size={20} color="#CCC" />
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Account Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          
          <View style={styles.card}>
            <TouchableOpacity 
              style={[styles.menuRow, styles.menuRowBorder]}
              onPress={() => router.push('/premium')}
            >
              <View style={styles.menuLeft}>
                <CreditCard size={20} color="#666" />
                <Text style={styles.menuText}>Manage Subscription</Text>
              </View>
              <ChevronRight size={20} color="#CCC" />
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.menuRow, styles.menuRowBorder]}
              onPress={() => {/* Navigate to privacy */}}
            >
              <View style={styles.menuLeft}>
                <Shield size={20} color="#666" />
                <Text style={styles.menuText}>Privacy</Text>
              </View>
              <ChevronRight size={20} color="#CCC" />
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.menuRow}
              onPress={() => {/* Navigate to terms */}}
            >
              <View style={styles.menuLeft}>
                <FileText size={20} color="#666" />
                <Text style={styles.menuText}>Terms of Service</Text>
              </View>
              <ChevronRight size={20} color="#CCC" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Actions Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Actions</Text>
          
          <TouchableOpacity 
            style={styles.logoutCard}
            onPress={() => {/* Handle logout */}}
          >
            <LogOut size={20} color="#FF6B6B" />
            <Text style={styles.logoutText}>Log Out</Text>
          </TouchableOpacity>
        </View>

        {/* Version Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerTitle}>PaktIQ Pro</Text>
          <Text style={styles.footerVersion}>Version 1.0.0</Text>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F4F6',
  },
  header: {
    backgroundColor: '#9163F2',
    paddingTop: 60,
    paddingBottom: 32,
    paddingHorizontal: 24,
    position: 'relative',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  headerContent: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 24,
  },
  section: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#666',
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  settingText: {
    fontSize: 16,
    color: '#1a1625',
    fontWeight: '500',
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
  },
  menuRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    flex: 1,
  },
  menuText: {
    fontSize: 16,
    color: '#1a1625',
    fontWeight: '400',
  },
  menuRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  languageText: {
    fontSize: 15,
    color: '#666',
  },
  logoutCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  logoutText: {
    fontSize: 16,
    color: '#FF6B6B',
    fontWeight: '500',
  },
  footer: {
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 16,
  },
  footerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
    marginBottom: 4,
  },
  footerVersion: {
    fontSize: 14,
    color: '#999',
  },
});

