import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Moon, Sun, Bell, Globe, CreditCard, Shield, FileText, LogOut, ChevronRight, X, Check } from 'lucide-react';

type SettingsScreenProps = {
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  onBack: () => void;
};

export default function SettingsScreen({ isDarkMode, onToggleDarkMode, onBack }: SettingsScreenProps) {
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('English');

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Spanish', flag: '🇪🇸' },
    { code: 'fr', name: 'French', flag: '🇫🇷' },
    { code: 'de', name: 'German', flag: '🇩🇪' },
    { code: 'it', name: 'Italian', flag: '🇮🇹' },
  ];

  const settingsSections = [
    {
      title: 'Appearance',
      items: [
        { 
          icon: isDarkMode ? Moon : Sun, 
          label: 'Dark Mode', 
          type: 'toggle',
          value: isDarkMode,
          action: onToggleDarkMode,
        },
      ],
    },
    {
      title: 'Preferences',
      items: [
        { icon: Bell, label: 'Notifications', type: 'link', action: () => {} },
        { icon: Globe, label: 'Language', type: 'link', value: selectedLanguage, action: () => setShowLanguageModal(true) },
      ],
    },
    {
      title: 'Account',
      items: [
        { icon: CreditCard, label: 'Manage Subscription', type: 'link', action: () => {} },
        { icon: Shield, label: 'Privacy', type: 'link', action: () => {} },
        { icon: FileText, label: 'Terms of Service', type: 'link', action: () => {} },
      ],
    },
    {
      title: 'Actions',
      items: [
        { icon: LogOut, label: 'Log Out', type: 'button', color: 'text-[#FF6A6A]', action: () => {} },
      ],
    },
  ];

  const bgColor = isDarkMode ? 'bg-[#1a1625]' : 'bg-[#F4F4F6]';
  const cardBg = isDarkMode ? 'bg-[#2a1f3d]' : 'bg-white';
  const textPrimary = isDarkMode ? 'text-white' : 'text-[#3C2B63]';
  const textSecondary = isDarkMode ? 'text-white/70' : 'text-[#3C2B63]/70';

  return (
    <div className={`min-h-screen ${bgColor}`}>
      {/* Header */}
      <div className="bg-gradient-to-r from-[#3C2B63] to-[#9163F2] text-white p-6">
        <div className="container mx-auto max-w-md">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="p-2 bg-white/10 backdrop-blur rounded-full hover:bg-white/20 transition-all"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-3xl mb-1">Settings</h1>
              <p className="text-sm opacity-80">Customize your experience</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto max-w-md px-6 py-6 space-y-6">
        {settingsSections.map((section, sectionIndex) => (
          <motion.div
            key={sectionIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: sectionIndex * 0.1 }}
          >
            <h2 className={`text-sm ${textSecondary} mb-3 px-2`}>{section.title}</h2>
            <div className={`${cardBg} rounded-3xl shadow-lg overflow-hidden`}>
              {section.items.map((item, itemIndex) => {
                const Icon = item.icon;
                return (
                  <div key={itemIndex}>
                    {item.type === 'toggle' ? (
                      <button
                        onClick={item.action}
                        className={`w-full flex items-center justify-between p-4 hover:bg-opacity-50 transition-all ${
                          itemIndex !== section.items.length - 1 ? `border-b ${isDarkMode ? 'border-white/10' : 'border-gray-200'}` : ''
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Icon className={`w-5 h-5 ${item.color || textPrimary}`} />
                          <span className={item.color || textPrimary}>{item.label}</span>
                        </div>
                        <div
                          className={`w-12 h-6 rounded-full transition-all ${
                            item.value ? 'bg-gradient-to-r from-[#9163F2] to-[#3C2B63]' : 'bg-gray-300'
                          }`}
                        >
                          <div
                            className={`w-5 h-5 bg-white rounded-full shadow-lg transition-transform ${
                              item.value ? 'translate-x-6' : 'translate-x-0.5'
                            } mt-0.5`}
                          />
                        </div>
                      </button>
                    ) : item.type === 'link' ? (
                      <button
                        onClick={item.action}
                        className={`w-full flex items-center justify-between p-4 hover:bg-opacity-50 transition-all ${
                          itemIndex !== section.items.length - 1 ? `border-b ${isDarkMode ? 'border-white/10' : 'border-gray-200'}` : ''
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Icon className={`w-5 h-5 ${item.color || textPrimary}`} />
                          <span className={item.color || textPrimary}>{item.label}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {item.value && <span className={textSecondary}>{item.value}</span>}
                          <ChevronRight className={`w-5 h-5 ${textSecondary}`} />
                        </div>
                      </button>
                    ) : (
                      <button
                        onClick={item.action}
                        className={`w-full flex items-center gap-3 p-4 hover:bg-opacity-50 transition-all ${
                          itemIndex !== section.items.length - 1 ? `border-b ${isDarkMode ? 'border-white/10' : 'border-gray-200'}` : ''
                        }`}
                      >
                        <Icon className={`w-5 h-5 ${item.color || textPrimary}`} />
                        <span className={item.color || textPrimary}>{item.label}</span>
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </motion.div>
        ))}

        {/* App Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center pt-6"
        >
          <div className={`text-sm ${textSecondary} mb-2`}>PaktIQ Pro</div>
          <div className={`text-xs ${textSecondary}`}>Version 1.0.0</div>
        </motion.div>
      </div>

      {/* Language Selection Modal */}
      <AnimatePresence>
        {showLanguageModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-6 z-50"
            onClick={() => setShowLanguageModal(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className={`${cardBg} rounded-3xl p-6 max-w-sm w-full shadow-2xl`}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className={`text-2xl ${textPrimary}`}>Select Language</h3>
                <button
                  onClick={() => setShowLanguageModal(false)}
                  className={`${textSecondary} hover:${textPrimary} transition-colors`}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-2">
                {languages.map((language) => (
                  <button
                    key={language.code}
                    onClick={() => {
                      setSelectedLanguage(language.name);
                      setShowLanguageModal(false);
                    }}
                    className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all ${
                      selectedLanguage === language.name
                        ? 'bg-gradient-to-r from-[#9163F2] to-[#3C2B63] text-white'
                        : `${isDarkMode ? 'bg-white/10 hover:bg-white/20' : 'bg-[#F4F4F6] hover:bg-gray-200'} ${textPrimary}`
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{language.flag}</span>
                      <span>{language.name}</span>
                    </div>
                    {selectedLanguage === language.name && (
                      <Check className="w-5 h-5" />
                    )}
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
