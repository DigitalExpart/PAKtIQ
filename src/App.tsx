import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import AuthScreen from './components/paktiq/AuthScreen';
import WelcomeScreen from './components/paktiq/WelcomeScreen';
import OnboardingFlow from './components/paktiq/OnboardingFlow';
import CategorySelection from './components/paktiq/CategorySelection';
import PaktNaming from './components/paktiq/PaktNaming';
import MilestoneBuilder from './components/paktiq/MilestoneBuilder';
import ReminderSetup from './components/paktiq/ReminderSetup';
import ReminderSetupLive from './components/paktiq/ReminderSetupLive';
import PaktDashboard from './components/paktiq/PaktDashboard';
import PaktDashboardLive from './components/paktiq/PaktDashboardLive';
import AchievementBoard from './components/paktiq/AchievementBoard';
import AchievementBoardLive from './components/paktiq/AchievementBoardLive';
import InsightsOverview from './components/paktiq/InsightsOverview';
import InsightsOverviewLive from './components/paktiq/InsightsOverviewLive';
import TemplateLibrary from './components/paktiq/TemplateLibrary';
import PremiumFeatures from './components/paktiq/PremiumFeatures';
import SettingsScreen from './components/paktiq/SettingsScreen';
import SettingsScreenLive from './components/paktiq/SettingsScreenLive';
import { usePakts } from './hooks';
import { PaktService, MilestoneService, ReminderService } from './services';
import type { Screen, PaktData } from './types';

// Loading component
function LoadingScreen() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#3C2B63] via-[#9163F2] to-[#3C2B63] flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-white text-2xl"
      >
        <div className="flex flex-col items-center gap-4">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 border-4 border-white border-t-transparent rounded-full"
          />
          <p>Loading PaktIQ...</p>
        </div>
      </motion.div>
    </div>
  );
}

function AppContent() {
  const { user, profile, loading: authLoading } = useAuth();
  const { pakts, loading: paktsLoading, createPakt, refetch } = usePakts();
  const [currentScreen, setCurrentScreen] = useState<Screen>('welcome');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [currentPakt, setCurrentPakt] = useState<Partial<PaktData>>({});

  // Check if onboarding is completed
  useEffect(() => {
    if (user && profile) {
      if (!profile.onboarding_completed) {
        setCurrentScreen('onboarding');
      } else {
        setCurrentScreen('dashboard');
      }
    }
  }, [user, profile]);

  const navigate = (screen: Screen) => {
    setCurrentScreen(screen);
  };

  const updatePaktData = (data: Partial<PaktData>) => {
    setCurrentPakt({ ...currentPakt, ...data });
  };

  const completePakt = async () => {
    if (!user || !currentPakt.name || !currentPakt.category) {
      console.error('Missing required data to create pakt');
      return;
    }

    try {
      // Create the pakt in the database
      const newPakt = await createPakt({
        user_id: user.id,
        name: currentPakt.name,
        description: currentPakt.description || '',
        target_outcome: currentPakt.targetOutcome || '',
        deadline: currentPakt.deadline || new Date().toISOString(),
        category: currentPakt.category,
      });

      // Create milestones if any
      if (currentPakt.milestones && currentPakt.milestones.length > 0) {
        for (let i = 0; i < currentPakt.milestones.length; i++) {
          const milestone = currentPakt.milestones[i];
          await MilestoneService.createMilestone({
            pakt_id: newPakt.id,
            user_id: user.id,
            name: milestone.name,
            due_date: milestone.dueDate,
            notes: milestone.notes || '',
            importance: milestone.importance || 3,
            completed: false,
            order_index: i,
          });
        }
      }

      // Create reminders if configured
      if (currentPakt.reminders) {
        await ReminderService.createReminder({
          pakt_id: newPakt.id,
          user_id: user.id,
          frequency: currentPakt.reminders.frequency,
          time: currentPakt.reminders.time,
          days: currentPakt.reminders.days || null,
        });
      }

      // Clear current pakt and navigate to dashboard
      setCurrentPakt({});
      await refetch(); // Refresh pakts list
      navigate('dashboard');
    } catch (error) {
      console.error('Error creating pakt:', error);
      alert('Failed to create pakt. Please try again.');
    }
  };

  // Show loading while checking auth
  if (authLoading) {
    return <LoadingScreen />;
  }

  // Show authentication screen if not authenticated
  if (!user) {
    // You can show welcome screen first, then auth screen
    if (currentScreen === 'welcome') {
      return <WelcomeScreen onGetStarted={() => setCurrentScreen('auth')} onExplore={() => setCurrentScreen('auth')} />;
    }
    return <AuthScreen onSuccess={() => setCurrentScreen('dashboard')} />;
  }

  const renderScreen = () => {
    switch (currentScreen) {
      case 'welcome':
        return <WelcomeScreen onGetStarted={() => setCurrentScreen('auth')} onExplore={() => setCurrentScreen('auth')} />;
      case 'onboarding':
        return <OnboardingFlow onComplete={() => navigate('categorySelection')} onSkip={() => navigate('dashboard')} />;
      case 'categorySelection':
        return <CategorySelection onSelect={(category) => { updatePaktData({ category }); navigate('paktNaming'); }} />;
      case 'paktNaming':
        return <PaktNaming currentPakt={currentPakt} onUpdate={updatePaktData} onContinue={() => navigate('milestoneBuilder')} onBack={() => navigate('categorySelection')} />;
      case 'milestoneBuilder':
        return <MilestoneBuilder currentPakt={currentPakt} onUpdate={updatePaktData} onContinue={() => navigate('reminderSetup')} onBack={() => navigate('paktNaming')} />;
      case 'reminderSetup':
        return <ReminderSetupLive currentPakt={currentPakt} onUpdate={updatePaktData} onComplete={completePakt} onBack={() => navigate('milestoneBuilder')} />;
      case 'dashboard':
        return <PaktDashboardLive onNavigate={navigate} isDarkMode={isDarkMode} />;
      case 'achievements':
        return <AchievementBoardLive onBack={() => navigate('dashboard')} isDarkMode={isDarkMode} />;
      case 'insights':
        return <InsightsOverviewLive onBack={() => navigate('dashboard')} isDarkMode={isDarkMode} />;
      case 'templates':
        return <TemplateLibrary onUseTemplate={(template) => { updatePaktData(template); navigate('paktNaming'); }} onBack={() => navigate('dashboard')} />;
      case 'premium':
        return <PremiumFeatures onBack={() => navigate('dashboard')} onUpgrade={() => navigate('dashboard')} />;
      case 'settings':
        return <SettingsScreenLive isDarkMode={isDarkMode} onToggleDarkMode={() => setIsDarkMode(!isDarkMode)} onBack={() => navigate('dashboard')} />;
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

// Main App component with AuthProvider wrapper
export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
