import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Sun, Moon, Bell, Globe, CreditCard, Shield, FileText, ChevronRight } from 'lucide-react';
import { useSettings } from '../../hooks/useSettings';
import { useAuth } from '../../contexts/AuthContext';
import type { Screen } from '../../types';

type SettingsScreenLiveProps = {
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  onBack: () => void;
};

export default function SettingsScreenLive({ isDarkMode, onToggleDarkMode, onBack }: SettingsScreenLiveProps) {
  const { darkMode, loading, toggleDarkMode } = useSettings();
  const { user, signOut } = useAuth();
  const [isTogglingDarkMode, setIsTogglingDarkMode] = useState(false);

  const handleDarkModeToggle = async () => {
    setIsTogglingDarkMode(true);
    try {
      await toggleDarkMode(!darkMode);
      onToggleDarkMode(); // Update local UI immediately
    } catch (error) {
      console.error('Error toggling dark mode:', error);
      alert('Failed to update dark mode preference');
    } finally {
      setIsTogglingDarkMode(false);
    }
  };

  const bgGradient = isDarkMode 
    ? 'bg-gradient-to-br from-[#1a1625] via-[#2a1f3d] to-[#1a1625]'
    : 'bg-gradient-to-br from-[#9163F2] to-[#3C2B63]';
  
  const cardBg = isDarkMode ? 'bg-[#2a1f3d]' : 'bg-white';
  const textPrimary = isDarkMode ? 'text-white' : 'text-[#3C2B63]';
  const textSecondary = isDarkMode ? 'text-white/70' : 'text-[#3C2B63]/70';

  if (loading) {
    return (
      <div className={`min-h-screen ${bgGradient} flex items-center justify-center`}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-white border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${bgGradient} transition-colors`}>
      {/* Header */}
      <div className="px-6 pt-12 pb-6">
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={onBack}
          className="p-3 bg-white/10 backdrop-blur-lg rounded-full mb-6 hover:bg-white/20 transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-white" />
        </motion.button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h1 className="text-4xl text-white mb-2">Settings</h1>
          <p className="text-lg text-white/70">Customize your experience</p>
        </motion.div>
      </div>

      {/* Settings Content */}
      <div className="px-6 pb-24">
        {/* Appearance Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <h2 className="text-lg text-white/70 mb-3">Appearance</h2>
          <div className={`${cardBg} rounded-2xl p-5`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {darkMode ? (
                  <Moon className="w-6 h-6 text-[#9163F2]" />
                ) : (
                  <Sun className="w-6 h-6 text-[#FFD88A]" />
                )}
                <span className={`text-base ${textPrimary}`}>Dark Mode</span>
              </div>
              <button
                onClick={handleDarkModeToggle}
                disabled={isTogglingDarkMode}
                className={`w-14 h-8 rounded-full transition-all ${
                  darkMode ? 'bg-[#9163F2]' : 'bg-gray-300'
                } ${isTogglingDarkMode ? 'opacity-50' : ''}`}
              >
                <motion.div
                  className="w-6 h-6 bg-white rounded-full shadow-lg"
                  animate={{ x: darkMode ? 28 : 4 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  style={{ y: 4 }}
                />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Preferences Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-6"
        >
          <h2 className="text-lg text-white/70 mb-3">Preferences</h2>
          <div className={`${cardBg} rounded-2xl overflow-hidden`}>
            <button className="w-full p-5 flex items-center justify-between hover:bg-black/5 transition-colors">
              <div className="flex items-center gap-3">
                <Bell className={`w-6 h-6 ${textSecondary}`} />
                <span className={textPrimary}>Notifications</span>
              </div>
              <ChevronRight className={`w-5 h-5 ${textSecondary}`} />
            </button>

            <div className={`h-px ${isDarkMode ? 'bg-white/10' : 'bg-gray-200'}`} />

            <button className="w-full p-5 flex items-center justify-between hover:bg-black/5 transition-colors">
              <div className="flex items-center gap-3">
                <Globe className={`w-6 h-6 ${textSecondary}`} />
                <span className={textPrimary}>Language</span>
              </div>
              <div className="flex items-center gap-2">
                <span className={textSecondary}>English</span>
                <ChevronRight className={`w-5 h-5 ${textSecondary}`} />
              </div>
            </button>
          </div>
        </motion.div>

        {/* Account Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-6"
        >
          <h2 className="text-lg text-white/70 mb-3">Account</h2>
          <div className={`${cardBg} rounded-2xl overflow-hidden`}>
            <button className="w-full p-5 flex items-center justify-between hover:bg-black/5 transition-colors">
              <div className="flex items-center gap-3">
                <CreditCard className={`w-6 h-6 ${textSecondary}`} />
                <span className={textPrimary}>Manage Subscription</span>
              </div>
              <ChevronRight className={`w-5 h-5 ${textSecondary}`} />
            </button>

            <div className={`h-px ${isDarkMode ? 'bg-white/10' : 'bg-gray-200'}`} />

            <button className="w-full p-5 flex items-center justify-between hover:bg-black/5 transition-colors">
              <div className="flex items-center gap-3">
                <Shield className={`w-6 h-6 ${textSecondary}`} />
                <span className={textPrimary}>Privacy</span>
              </div>
              <ChevronRight className={`w-5 h-5 ${textSecondary}`} />
            </button>

            <div className={`h-px ${isDarkMode ? 'bg-white/10' : 'bg-gray-200'}`} />

            <button className="w-full p-5 flex items-center justify-between hover:bg-black/5 transition-colors">
              <div className="flex items-center gap-3">
                <FileText className={`w-6 h-6 ${textSecondary}`} />
                <span className={textPrimary}>Terms of Service</span>
              </div>
              <ChevronRight className={`w-5 h-5 ${textSecondary}`} />
            </button>
          </div>
        </motion.div>

        {/* User Info */}
        {user && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className={`${cardBg} rounded-2xl p-5 mb-6`}
          >
            <div className="text-sm ${textSecondary} mb-1">Signed in as</div>
            <div className={`text-base ${textPrimary}`}>{user.email}</div>
          </motion.div>
        )}

        {/* Sign Out Button */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          onClick={signOut}
          className="w-full bg-red-500/20 text-red-500 py-4 rounded-2xl hover:bg-red-500/30 transition-colors"
        >
          Sign Out
        </motion.button>

        {/* Version */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-center mt-6 text-white/50 text-sm"
        >
          PaktIQ v1.0.0
        </motion.div>
      </div>
    </div>
  );
}

