/**
 * Example App.tsx showing how to integrate Supabase backend
 * 
 * This demonstrates:
 * 1. Wrapping the app with AuthProvider
 * 2. Using authentication state
 * 3. Conditional rendering based on auth status
 */

import React from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import WelcomeScreen from './components/paktiq/WelcomeScreen';
import PaktDashboard from './components/paktiq/PaktDashboard';

function AppContent() {
  const { user, loading } = useAuth();

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#3C2B63] via-[#9163F2] to-[#3C2B63] flex items-center justify-center">
        <div className="text-white text-2xl">Loading...</div>
      </div>
    );
  }

  // Show WelcomeScreen if not authenticated
  if (!user) {
    return (
      <WelcomeScreen
        onGetStarted={() => {
          // Navigate to sign up or onboarding
          console.log('Get started clicked');
        }}
        onExplore={() => {
          // Navigate to features
          console.log('Explore clicked');
        }}
      />
    );
  }

  // Show main dashboard if authenticated
  return <PaktDashboard />;
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

