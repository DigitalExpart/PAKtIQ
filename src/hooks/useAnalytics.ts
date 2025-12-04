import { useState, useEffect } from 'react';
import { AnalyticsService, type UserInsights } from '../services/analytics.service';
import { useAuth } from '../contexts/AuthContext';

export function useAnalytics() {
  const { user } = useAuth();
  const [insights, setInsights] = useState<UserInsights | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    loadInsights();
  }, [user]);

  const loadInsights = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await AnalyticsService.getUserInsights(user.id);
      setInsights(data);
    } catch (err) {
      setError(err as Error);
      console.error('Error loading analytics:', err);
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

