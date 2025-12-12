import { useState, useEffect } from 'react';
import { MilestoneService } from '../services';
import type { Milestone, MilestoneInsert, MilestoneUpdate } from '../types';
import { useAuth } from '../contexts/AuthContext';

export function useMilestones(paktId: string) {
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchMilestones = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await MilestoneService.getPaktMilestones(paktId);
      setMilestones(data);
    } catch (err) {
      setError(err as Error);
      console.error('Error fetching milestones:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (paktId) {
      fetchMilestones();
    }
  }, [paktId]);

  const createMilestone = async (milestone: MilestoneInsert): Promise<Milestone> => {
    const newMilestone = await MilestoneService.createMilestone(milestone);
    setMilestones(prev => [...prev, newMilestone]);
    return newMilestone;
  };

  const updateMilestone = async (milestoneId: string, updates: MilestoneUpdate): Promise<Milestone> => {
    const updatedMilestone = await MilestoneService.updateMilestone(milestoneId, updates);
    setMilestones(prev => prev.map(m => m.id === milestoneId ? updatedMilestone : m));
    return updatedMilestone;
  };

  const toggleMilestone = async (milestoneId: string, completed: boolean): Promise<Milestone> => {
    const toggledMilestone = await MilestoneService.toggleMilestone(milestoneId, completed);
    setMilestones(prev => prev.map(m => m.id === milestoneId ? toggledMilestone : m));
    return toggledMilestone;
  };

  const deleteMilestone = async (milestoneId: string): Promise<void> => {
    await MilestoneService.deleteMilestone(milestoneId);
    setMilestones(prev => prev.filter(m => m.id !== milestoneId));
  };

  const reorderMilestones = async (milestoneIds: string[]): Promise<void> => {
    await MilestoneService.reorderMilestones(milestoneIds);
    await fetchMilestones(); // Refetch to get updated order
  };

  return {
    milestones,
    loading,
    error,
    refetch: fetchMilestones,
    createMilestone,
    updateMilestone,
    toggleMilestone,
    deleteMilestone,
    reorderMilestones,
  };
}

export function useUpcomingMilestones() {
  const { user } = useAuth();
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchUpcoming = async () => {
      if (!user) {
        setMilestones([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const data = await MilestoneService.getUpcomingMilestones(user.id);
        setMilestones(data);
      } catch (err) {
        setError(err as Error);
        console.error('Error fetching upcoming milestones:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUpcoming();
  }, [user]);

  return { milestones, loading, error };
}

export function useOverdueMilestones() {
  const { user } = useAuth();
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchOverdue = async () => {
      if (!user) {
        setMilestones([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const data = await MilestoneService.getOverdueMilestones(user.id);
        setMilestones(data);
      } catch (err) {
        setError(err as Error);
        console.error('Error fetching overdue milestones:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOverdue();
  }, [user]);

  return { milestones, loading, error };
}

export function useMilestoneStats(paktId: string) {
  const [stats, setStats] = useState<{
    total: number;
    completed: number;
    pending: number;
    completionRate: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      if (!paktId) {
        setStats(null);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const data = await MilestoneService.getMilestoneStats(paktId);
        setStats(data);
      } catch (err) {
        setError(err as Error);
        console.error('Error fetching milestone stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [paktId]);

  return { stats, loading, error };
}

