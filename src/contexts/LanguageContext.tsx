import React, { createContext, useContext, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { changeLanguage } from '../lib/i18n';

interface LanguageContextType {
  currentLanguage: 'en' | 'es' | 'fr';
  changeLanguage: (lang: 'en' | 'es' | 'fr') => Promise<void>;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const { i18n, t } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState<'en' | 'es' | 'fr'>(
    (i18n.language && (i18n.language === 'en' || i18n.language === 'es' || i18n.language === 'fr')) 
      ? (i18n.language as 'en' | 'es' | 'fr')
      : 'en'
  );

  useEffect(() => {
    const updateLanguage = (lng: string) => {
      if (lng === 'en' || lng === 'es' || lng === 'fr') {
        setCurrentLanguage(lng as 'en' | 'es' | 'fr');
      }
    };

    // Update when i18n language changes
    updateLanguage(i18n.language);

    // Listen for language change events
    const handleLanguageChanged = (lng: string) => {
      updateLanguage(lng);
    };

    i18n.on('languageChanged', handleLanguageChanged);

    return () => {
      i18n.off('languageChanged', handleLanguageChanged);
    };
  }, [i18n]);

  const handleChangeLanguage = async (lang: 'en' | 'es' | 'fr') => {
    try {
    await changeLanguage(lang);
    setCurrentLanguage(lang);
    } catch (error) {
      console.error('Error changing language:', error);
    }
  };

  return (
    <LanguageContext.Provider
      value={{
        currentLanguage,
        changeLanguage: handleChangeLanguage,
        t,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
