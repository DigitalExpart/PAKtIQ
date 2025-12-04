import { supabase } from '../lib/supabase';
import type { Database } from '../types/database';

type Pakt = Database['public']['Tables']['pakts']['Row'];
type PaktInsert = Database['public']['Tables']['pakts']['Insert'];
type PaktUpdate = Database['public']['Tables']['pakts']['Update'];

export class PaktService {
  /**
   * Get all pakts for the current user
   */
  static async getUserPakts(userId: string): Promise<Pakt[]> {
    const { data, error } = await supabase
      .from('pakts')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  /**
   * Get a single pakt by ID
   */
  static async getPakt(paktId: string): Promise<Pakt | null> {
    const { data, error } = await supabase
      .from('pakts')
      .select('*')
      .eq('id', paktId)
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Get pakts by status
   */
  static async getPaktsByStatus(
    userId: string,
    status: 'active' | 'completed' | 'archived'
  ): Promise<Pakt[]> {
    const { data, error } = await supabase
      .from('pakts')
      .select('*')
      .eq('user_id', userId)
      .eq('status', status)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  /**
   * Get pakts by category
   */
  static async getPaktsByCategory(userId: string, category: string): Promise<Pakt[]> {
    const { data, error } = await supabase
      .from('pakts')
      .select('*')
      .eq('user_id', userId)
      .eq('category', category)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  /**
   * Create a new pakt
   */
  static async createPakt(pakt: PaktInsert): Promise<Pakt> {
    const { data, error } = await supabase
      .from('pakts')
      .insert(pakt)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Update a pakt
   */
  static async updatePakt(paktId: string, updates: PaktUpdate): Promise<Pakt> {
    const { data, error } = await supabase
      .from('pakts')
      .update(updates)
      .eq('id', paktId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Delete a pakt
   */
  static async deletePakt(paktId: string): Promise<void> {
    const { error } = await supabase
      .from('pakts')
      .delete()
      .eq('id', paktId);

    if (error) throw error;
  }

  /**
   * Mark pakt as completed
   */
  static async completePakt(paktId: string): Promise<Pakt> {
    return this.updatePakt(paktId, { status: 'completed', progress: 100 });
  }

  /**
   * Archive a pakt
   */
  static async archivePakt(paktId: string): Promise<Pakt> {
    return this.updatePakt(paktId, { status: 'archived' });
  }

  /**
   * Get user statistics
   */
  static async getUserStats(userId: string) {
    const pakts = await this.getUserPakts(userId);
    
    const stats = {
      total: pakts.length,
      active: pakts.filter(p => p.status === 'active').length,
      completed: pakts.filter(p => p.status === 'completed').length,
      archived: pakts.filter(p => p.status === 'archived').length,
      averageProgress: pakts.length > 0
        ? Math.round(pakts.reduce((sum, p) => sum + p.progress, 0) / pakts.length)
        : 0,
    };

    return stats;
  }
}

