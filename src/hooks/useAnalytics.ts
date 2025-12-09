import { useState, useEffect } from 'react';
import { AnalyticsService, type UserInsights } from '../services/analytics.service';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

export function useAnalytics() {
  const { user, profile } = useAuth();
  const [insights, setInsights] = useState<UserInsights | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    loadInsights();
  }, [user, profile]);

  const loadInsights = async () => {
    if (!user) {
      setLoading(false);
      setInsights(null);
      return;
    }

    // Wait for profile to be created before loading analytics
    if (!profile) {
      // Profile might still be creating, wait a bit and retry
      const checkProfile = async () => {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('id')
          .eq('id', user.id)
          .single();
        
        if (profileData) {
          // Profile exists now, load analytics
          await loadInsights();
        } else {
          // Still no profile, set default insights
          setInsights({
            completionRate: 0,
            milestonesDone: 0,
            dayStreak: 0,
            badgesEarned: 0,
            weeklyActivity: [0, 0, 0, 0, 0, 0, 0],
            totalPaktsCompleted: 0,
            longestStreak: 0,
          });
          setLoading(false);
        }
      };
      
      // Wait 500ms then check for profile
      setTimeout(checkProfile, 500);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await AnalyticsService.getUserInsights(user.id);
      setInsights(data);
    } catch (err) {
      // Don't set error for foreign key violations - profile might still be creating
      const error = err as any;
      if (error?.code === '23503') {
        console.warn('Profile not ready yet, analytics will load after profile is created');
        // Set default insights instead of error
        setInsights({
          completionRate: 0,
          milestonesDone: 0,
          dayStreak: 0,
          badgesEarned: 0,
          weeklyActivity: [0, 0, 0, 0, 0, 0, 0],
          totalPaktsCompleted: 0,
          longestStreak: 0,
        });
        // Don't set error state for this - it's expected during signup
        setError(null);
      } else {
        setError(err as Error);
        console.error('Error loading analytics:', err);
      }
    } finally {
      setLoading(false);
    }
  };

  const recordMilestoneCompletion = async () => {
    if (!user) return;

    try {
      await AnalyticsService.recordMilestoneCompletion(user.id);
      // Refresh insights after recording
      await loadInsights();
    } catch (err) {
      console.error('Error recording milestone completion:', err);
    }
  };

  const recordTimeSpent = async (minutes: number) => {
    if (!user) return;

    try {
      await AnalyticsService.recordTimeSpent(user.id, minutes);
    } catch (err) {
      console.error('Error recording time spent:', err);
    }
  };

  return {
    insights,
    loading,
    error,
    recordMilestoneCompletion,
    recordTimeSpent,
    refresh: loadInsights,
  };
}

