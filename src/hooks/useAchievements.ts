import { useState, useEffect } from 'react';
import { AchievementService } from '../services';
import type { Achievement } from '../types';
import { useAuth } from '../contexts/AuthContext';

export function useAchievements() {
  const { user } = useAuth();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchAchievements = async () => {
    if (!user) {
      setAchievements([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await AchievementService.getUserAchievements(user.id);
      setAchievements(data);
    } catch (err) {
      setError(err as Error);
      console.error('Error fetching achievements:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAchievements();
  }, [user]);

  return {
    achievements,
    loading,
    error,
    refetch: fetchAchievements,
  };
}

export function useRecentAchievements() {
  const { user } = useAuth();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchRecent = async () => {
      if (!user) {
        setAchievements([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const data = await AchievementService.getRecentAchievements(user.id);
        setAchievements(data);
      } catch (err) {
        setError(err as Error);
        console.error('Error fetching recent achievements:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecent();
  }, [user]);

  return { achievements, loading, error };
}

export function useAchievementCount() {
  const { user } = useAuth();
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchCount = async () => {
      if (!user) {
        setCount(0);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const achievementCount = await AchievementService.getAchievementCount(user.id);
        setCount(achievementCount);
      } catch (err) {
        setError(err as Error);
        console.error('Error fetching achievement count:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCount();
  }, [user]);

  return { count, loading, error };
}

