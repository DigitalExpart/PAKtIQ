import 'react-native-gesture-handler';
import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { PaktData, Screen } from './src/types';

export type RootStackParamList = {
  welcome: undefined;
  onboarding: undefined;
  categorySelection: undefined;
  paktNaming: undefined;
  milestoneBuilder: undefined;
  reminderSetup: undefined;
  dashboard: undefined;
  achievements: undefined;
  insights: undefined;
  templates: undefined;
  premium: undefined;
  settings: undefined;
};

// Create Stack navigator FIRST, before any component imports
// Use a defensive approach to ensure Stack is always defined
let Stack: ReturnType<typeof createStackNavigator>;
try {
  Stack = createStackNavigator();
  if (!Stack || !Stack.Navigator || !Stack.Screen) {
    console.error('Stack navigator created but invalid:', Stack);
    // Force create again
    Stack = createStackNavigator() as any;
  }
} catch (error) {
  console.error('Failed to create Stack navigator:', error);
  // Create a fallback - this should never happen but prevents crash
  Stack = createStackNavigator() as any;
}

// Import components - using dynamic imports to avoid module loading issues
let WelcomeScreen: any;
let OnboardingFlow: any;
let CategorySelection: any;
let PaktNaming: any;
let MilestoneBuilder: any;
let ReminderSetup: any;
let PaktDashboard: any;
let AchievementBoard: any;
let InsightsOverview: any;
let TemplateLibrary: any;
let PremiumFeatures: any;
let SettingsScreen: any;

try {
  WelcomeScreen = require('./src/components/paktiq/WelcomeScreen.native').default;
  OnboardingFlow = require('./src/components/paktiq/OnboardingFlow.native').default;
  CategorySelection = require('./src/components/paktiq/CategorySelection.native').default;
  PaktNaming = require('./src/components/paktiq/PaktNaming.native').default;
  MilestoneBuilder = require('./src/components/paktiq/MilestoneBuilder.native').default;
  ReminderSetup = require('./src/components/paktiq/ReminderSetup.native').default;
  PaktDashboard = require('./src/components/paktiq/PaktDashboard.native').default;
  AchievementBoard = require('./src/components/paktiq/AchievementBoard.native').default;
  InsightsOverview = require('./src/components/paktiq/InsightsOverview.native').default;
  TemplateLibrary = require('./src/components/paktiq/TemplateLibrary.native').default;
  PremiumFeatures = require('./src/components/paktiq/PremiumFeatures.native').default;
  SettingsScreen = require('./src/components/paktiq/SettingsScreen.native').default;
} catch (error) {
  console.error('Error loading components:', error);
}

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [currentPakt, setCurrentPakt] = useState<Partial<PaktData>>({});
  const [pakts, setPakts] = useState<PaktData[]>([]);

  const updatePaktData = (data: Partial<PaktData>) => {
    setCurrentPakt({ ...currentPakt, ...data });
  };

  const completePakt = () => {
    if (currentPakt.name && currentPakt.category) {
      setPakts([...pakts, currentPakt as PaktData]);
      setCurrentPakt({});
    }
  };

  return (
    <NavigationContainer>
      <SafeAreaView style={[styles.container, isDarkMode && styles.darkContainer]}>
        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
        <Stack.Navigator
          initialRouteName="welcome"
          screenOptions={{
            headerShown: false,
            cardStyle: { backgroundColor: isDarkMode ? '#1a1625' : '#F4F4F6' },
          }}
        >
          <Stack.Screen 
            name="welcome"
            component={WelcomeScreen}
            initialParams={{
              onGetStarted: () => {},
              onExplore: () => {},
            }}
          />
          <Stack.Screen name="onboarding">
            {(props) => (
              <OnboardingFlow
                {...props}
                onComplete={() => props.navigation.navigate('categorySelection')}
                onSkip={() => props.navigation.navigate('dashboard')}
              />
            )}
          </Stack.Screen>
          <Stack.Screen name="categorySelection">
            {(props) => (
              <CategorySelection
                {...props}
                onSelect={(category) => {
                  updatePaktData({ category });
                  props.navigation.navigate('paktNaming');
                }}
              />
            )}
          </Stack.Screen>
          <Stack.Screen name="paktNaming">
            {(props) => (
              <PaktNaming
                {...props}
                currentPakt={currentPakt}
                onUpdate={updatePaktData}
                onContinue={() => props.navigation.navigate('milestoneBuilder')}
                onBack={() => props.navigation.goBack()}
              />
            )}
          </Stack.Screen>
          <Stack.Screen name="milestoneBuilder">
            {(props) => (
              <MilestoneBuilder
                {...props}
                currentPakt={currentPakt}
                onUpdate={updatePaktData}
                onContinue={() => props.navigation.navigate('reminderSetup')}
                onBack={() => props.navigation.goBack()}
              />
            )}
          </Stack.Screen>
          <Stack.Screen name="reminderSetup">
            {(props) => (
              <ReminderSetup
                {...props}
                currentPakt={currentPakt}
                onUpdate={updatePaktData}
                onComplete={() => {
                  completePakt();
                  props.navigation.navigate('dashboard');
                }}
                onBack={() => props.navigation.goBack()}
              />
            )}
          </Stack.Screen>
          <Stack.Screen name="dashboard">
            {(props) => (
              <PaktDashboard
                {...props}
                pakts={pakts}
                onNavigate={(screen: Screen) => props.navigation.navigate(screen)}
                isDarkMode={isDarkMode}
              />
            )}
          </Stack.Screen>
          <Stack.Screen name="achievements">
            {(props) => (
              <AchievementBoard
                {...props}
                onBack={() => props.navigation.goBack()}
                isDarkMode={isDarkMode}
              />
            )}
          </Stack.Screen>
          <Stack.Screen name="insights">
            {(props) => (
              <InsightsOverview
                {...props}
                pakts={pakts}
                onBack={() => props.navigation.goBack()}
                isDarkMode={isDarkMode}
              />
            )}
          </Stack.Screen>
          <Stack.Screen name="templates">
            {(props) => (
              <TemplateLibrary
                {...props}
                onUseTemplate={(template) => {
                  updatePaktData(template);
                  props.navigation.navigate('paktNaming');
                }}
                onBack={() => props.navigation.goBack()}
              />
            )}
          </Stack.Screen>
          <Stack.Screen name="premium">
            {(props) => (
              <PremiumFeatures
                {...props}
                onBack={() => props.navigation.goBack()}
                onUpgrade={() => props.navigation.navigate('dashboard')}
              />
            )}
          </Stack.Screen>
          <Stack.Screen name="settings">
            {(props) => (
              <SettingsScreen
                {...props}
                isDarkMode={isDarkMode}
                onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
                onBack={() => props.navigation.goBack()}
              />
            )}
          </Stack.Screen>
        </Stack.Navigator>
      </SafeAreaView>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F4F6',
  },
  darkContainer: {
    backgroundColor: '#1a1625',
  },
});

export default App;

