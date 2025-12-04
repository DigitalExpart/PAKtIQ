import { useState, useEffect } from 'react';
import { PaktService } from '../services';
import type { Pakt, PaktInsert, PaktUpdate } from '../types';
import { useAuth } from '../contexts/AuthContext';

export function usePakts() {
  const { user } = useAuth();
  const [pakts, setPakts] = useState<Pakt[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchPakts = async () => {
    if (!user) {
      setPakts([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await PaktService.getUserPakts(user.id);
      setPakts(data);
    } catch (err) {
      setError(err as Error);
      console.error('Error fetching pakts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPakts();
  }, [user]);

  const createPakt = async (pakt: PaktInsert): Promise<Pakt> => {
    const newPakt = await PaktService.createPakt(pakt);
    setPakts(prev => [newPakt, ...prev]);
    return newPakt;
  };

  const updatePakt = async (paktId: string, updates: PaktUpdate): Promise<Pakt> => {
    const updatedPakt = await PaktService.updatePakt(paktId, updates);
    setPakts(prev => prev.map(p => p.id === paktId ? updatedPakt : p));
    return updatedPakt;
  };

  const deletePakt = async (paktId: string): Promise<void> => {
    await PaktService.deletePakt(paktId);
    setPakts(prev => prev.filter(p => p.id !== paktId));
  };

  const completePakt = async (paktId: string): Promise<Pakt> => {
    const completedPakt = await PaktService.completePakt(paktId);
    setPakts(prev => prev.map(p => p.id === paktId ? completedPakt : p));
    return completedPakt;
  };

  const archivePakt = async (paktId: string): Promise<Pakt> => {
    const archivedPakt = await PaktService.archivePakt(paktId);
    setPakts(prev => prev.map(p => p.id === paktId ? archivedPakt : p));
    return archivedPakt;
  };

  return {
    pakts,
    loading,
    error,
    refetch: fetchPakts,
    createPakt,
    updatePakt,
    deletePakt,
    completePakt,
    archivePakt,
  };
}

export function usePaktsByStatus(status: 'active' | 'completed' | 'archived') {
  const { user } = useAuth();
  const [pakts, setPakts] = useState<Pakt[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchPakts = async () => {
      if (!user) {
        setPakts([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const data = await PaktService.getPaktsByStatus(user.id, status);
        setPakts(data);
      } catch (err) {
        setError(err as Error);
        console.error(`Error fetching ${status} pakts:`, err);
      } finally {
        setLoading(false);
      }
    };

    fetchPakts();
  }, [user, status]);

  return { pakts, loading, error };
}

export function usePaktStats() {
  const { user } = useAuth();
  const [stats, setStats] = useState<{
    total: number;
    active: number;
    completed: number;
    archived: number;
    averageProgress: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      if (!user) {
        setStats(null);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const data = await PaktService.getUserStats(user.id);
        setStats(data);
      } catch (err) {
        setError(err as Error);
        console.error('Error fetching pakt stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [user]);

  return { stats, loading, error };
}

