import { useState, useEffect } from 'react';
import { HabitService, Habit, HabitSchedule, HabitCompletion } from '../services/habit.service';
import { useAuth } from '../contexts/AuthContext';

export function useHabits() {
  const { user } = useAuth();
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchHabits = async () => {
    if (!user) {
      setHabits([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await HabitService.getHabits();
      setHabits(data);
    } catch (err) {
      setError(err as Error);
      console.error('Error fetching habits:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHabits();
  }, [user]);

  const createHabit = async (data: Parameters<typeof HabitService.createHabit>[0]): Promise<Habit> => {
    const newHabit = await HabitService.createHabit(data);
    setHabits(prev => [newHabit, ...prev]);
    return newHabit;
  };

  const updateHabit = async (habitId: string, updates: Partial<Habit>): Promise<Habit> => {
    const updatedHabit = await HabitService.updateHabit(habitId, updates);
    setHabits(prev => prev.map(h => h.id === habitId ? updatedHabit : h));
    return updatedHabit;
  };

  const deleteHabit = async (habitId: string): Promise<void> => {
    await HabitService.deleteHabit(habitId);
    setHabits(prev => prev.filter(h => h.id !== habitId));
  };

  const completeHabit = async (habitId: string, date: string, notes?: string): Promise<HabitCompletion> => {
    return await HabitService.completeHabit(habitId, date, notes);
  };

  return {
    habits,
    loading,
    error,
    refetch: fetchHabits,
    createHabit,
    updateHabit,
    deleteHabit,
    completeHabit,
  };
}

export function useHabitSchedules(habitId: string) {
  const [schedules, setSchedules] = useState<HabitSchedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await HabitService.getHabitSchedules(habitId);
        setSchedules(data);
      } catch (err) {
        setError(err as Error);
        console.error('Error fetching habit schedules:', err);
      } finally {
        setLoading(false);
      }
    };

    if (habitId) {
      fetchSchedules();
    }
  }, [habitId]);

  return { schedules, loading, error };
}
