import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import WelcomeScreen from './components/paktiq/WelcomeScreen';
import OnboardingFlow from './components/paktiq/OnboardingFlow';
import CategorySelection from './components/paktiq/CategorySelection';
import PaktNaming from './components/paktiq/PaktNaming';
import MilestoneBuilder from './components/paktiq/MilestoneBuilder';
import ReminderSetup from './components/paktiq/ReminderSetup';
import PaktDashboard from './components/paktiq/PaktDashboard';
import AchievementBoard from './components/paktiq/AchievementBoard';
import InsightsOverview from './components/paktiq/InsightsOverview';
import TemplateLibrary from './components/paktiq/TemplateLibrary';
import PremiumFeatures from './components/paktiq/PremiumFeatures';
import SettingsScreen from './components/paktiq/SettingsScreen';

export type Screen = 
  | 'welcome'
  | 'onboarding'
  | 'categorySelection'
  | 'paktNaming'
  | 'milestoneBuilder'
  | 'reminderSetup'
  | 'dashboard'
  | 'achievements'
  | 'insights'
  | 'templates'
  | 'premium'
  | 'settings';

export type PaktData = {
  name: string;
  description: string;
  targetOutcome: string;
  deadline: string;
  category: string;
  milestones: Milestone[];
  reminders: ReminderSettings;
};

export type Milestone = {
  id: string;
  name: string;
  dueDate: string;
  notes: string;
  importance: number;
  completed: boolean;
};

export type ReminderSettings = {
  frequency: 'daily' | 'weekly' | 'custom';
  time: string;
  days?: string[];
};

function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('welcome');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [currentPakt, setCurrentPakt] = useState<Partial<PaktData>>({});
  const [pakts, setPakts] = useState<PaktData[]>([]);

  const navigate = (screen: Screen) => {
    setCurrentScreen(screen);
  };

  const updatePaktData = (data: Partial<PaktData>) => {
    setCurrentPakt({ ...currentPakt, ...data });
  };

  const completePakt = () => {
    if (currentPakt.name && currentPakt.category) {
      setPakts([...pakts, currentPakt as PaktData]);
      setCurrentPakt({});
      navigate('dashboard');
    }
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'welcome':
        return <WelcomeScreen onGetStarted={() => navigate('onboarding')} onExplore={() => navigate('templates')} />;
      case 'onboarding':
        return <OnboardingFlow onComplete={() => navigate('categorySelection')} onSkip={() => navigate('dashboard')} />;
      case 'categorySelection':
        return <CategorySelection onSelect={(category) => { updatePaktData({ category }); navigate('paktNaming'); }} />;
      case 'paktNaming':
        return <PaktNaming currentPakt={currentPakt} onUpdate={updatePaktData} onContinue={() => navigate('milestoneBuilder')} onBack={() => navigate('categorySelection')} />;
      case 'milestoneBuilder':
        return <MilestoneBuilder currentPakt={currentPakt} onUpdate={updatePaktData} onContinue={() => navigate('reminderSetup')} onBack={() => navigate('paktNaming')} />;
      case 'reminderSetup':
        return <ReminderSetup currentPakt={currentPakt} onUpdate={updatePaktData} onComplete={completePakt} onBack={() => navigate('milestoneBuilder')} />;
      case 'dashboard':
        return <PaktDashboard pakts={pakts} onNavigate={navigate} isDarkMode={isDarkMode} />;
      case 'achievements':
        return <AchievementBoard onBack={() => navigate('dashboard')} isDarkMode={isDarkMode} />;
      case 'insights':
        return <InsightsOverview pakts={pakts} onBack={() => navigate('dashboard')} isDarkMode={isDarkMode} />;
      case 'templates':
        return <TemplateLibrary onUseTemplate={(template) => { updatePaktData(template); navigate('paktNaming'); }} onBack={() => navigate('dashboard')} />;
      case 'premium':
        return <PremiumFeatures onBack={() => navigate('dashboard')} onUpgrade={() => navigate('dashboard')} />;
      case 'settings':
        return <SettingsScreen isDarkMode={isDarkMode} onToggleDarkMode={() => setIsDarkMode(!isDarkMode)} onBack={() => navigate('dashboard')} />;
      default:
        return <WelcomeScreen onGetStarted={() => navigate('onboarding')} onExplore={() => navigate('templates')} />;
    }
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-[#1a1625]' : 'bg-[#F4F4F6]'} transition-colors duration-300`}>
      <AnimatePresence mode="wait">
        <motion.div
          key={currentScreen}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {renderScreen()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default App;
