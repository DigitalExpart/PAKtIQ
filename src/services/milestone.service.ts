import { supabase } from '../lib/supabase';
import type { Database } from '../types/database';

type Milestone = Database['public']['Tables']['milestones']['Row'];
type MilestoneInsert = Database['public']['Tables']['milestones']['Insert'];
type MilestoneUpdate = Database['public']['Tables']['milestones']['Update'];

export class MilestoneService {
  /**
   * Get all milestones for a pakt
   */
  static async getPaktMilestones(paktId: string): Promise<Milestone[]> {
    const { data, error } = await supabase
      .from('milestones')
      .select('*')
      .eq('pakt_id', paktId)
      .order('order_index', { ascending: true });

    if (error) throw error;
    return data || [];
  }

  /**
   * Get all milestones for a user
   */
  static async getUserMilestones(userId: string): Promise<Milestone[]> {
    const { data, error } = await supabase
      .from('milestones')
      .select('*')
      .eq('user_id', userId)
      .order('due_date', { ascending: true });

    if (error) throw error;
    return data || [];
  }

  /**
   * Get a single milestone
   */
  static async getMilestone(milestoneId: string): Promise<Milestone | null> {
    const { data, error } = await supabase
      .from('milestones')
      .select('*')
      .eq('id', milestoneId)
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Get upcoming milestones (not completed, due within next 7 days)
   */
  static async getUpcomingMilestones(userId: string): Promise<Milestone[]> {
    const sevenDaysFromNow = new Date();
    sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);

    const { data, error } = await supabase
      .from('milestones')
      .select('*')
      .eq('user_id', userId)
      .eq('completed', false)
      .lte('due_date', sevenDaysFromNow.toISOString())
      .order('due_date', { ascending: true });

    if (error) throw error;
    return data || [];
  }

  /**
   * Get overdue milestones
   */
  static async getOverdueMilestones(userId: string): Promise<Milestone[]> {
    const now = new Date().toISOString();

    const { data, error } = await supabase
      .from('milestones')
      .select('*')
      .eq('user_id', userId)
      .eq('completed', false)
      .lt('due_date', now)
      .order('due_date', { ascending: true });

    if (error) throw error;
    return data || [];
  }

  /**
   * Create a new milestone
   */
  static async createMilestone(milestone: MilestoneInsert): Promise<Milestone> {
    const { data, error } = await supabase
      .from('milestones')
      .insert(milestone)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Create multiple milestones at once
   */
  static async createMilestones(milestones: MilestoneInsert[]): Promise<Milestone[]> {
    const { data, error } = await supabase
      .from('milestones')
      .insert(milestones)
      .select();

    if (error) throw error;
    return data || [];
  }

  /**
   * Update a milestone
   */
  static async updateMilestone(milestoneId: string, updates: MilestoneUpdate): Promise<Milestone> {
    const { data, error } = await supabase
      .from('milestones')
      .update(updates)
      .eq('id', milestoneId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Toggle milestone completion
   */
  static async toggleMilestone(milestoneId: string, completed: boolean): Promise<Milestone> {
    const updates: MilestoneUpdate = {
      completed,
      completed_at: completed ? new Date().toISOString() : null,
    };

    return this.updateMilestone(milestoneId, updates);
  }

  /**
   * Delete a milestone
   */
  static async deleteMilestone(milestoneId: string): Promise<void> {
    const { error } = await supabase
      .from('milestones')
      .delete()
      .eq('id', milestoneId);

    if (error) throw error;
  }

  /**
   * Reorder milestones
   */
  static async reorderMilestones(milestoneIds: string[]): Promise<void> {
    const updates = milestoneIds.map((id, index) => ({
      id,
      order_index: index,
    }));

    for (const update of updates) {
      await this.updateMilestone(update.id, { order_index: update.order_index });
    }
  }

  /**
   * Get milestone completion stats for a pakt
   */
  static async getMilestoneStats(paktId: string) {
    const milestones = await this.getPaktMilestones(paktId);
    
    return {
      total: milestones.length,
      completed: milestones.filter(m => m.completed).length,
      pending: milestones.filter(m => !m.completed).length,
      completionRate: milestones.length > 0
        ? Math.round((milestones.filter(m => m.completed).length / milestones.length) * 100)
        : 0,
    };
  }
}

