import { supabase } from '../lib/supabase';
import type { Database } from '../types/database';

type Resolve = Database['public']['Tables']['resolves']['Row'];
type ResolveInsert = Database['public']['Tables']['resolves']['Insert'];
type ResolveUpdate = Database['public']['Tables']['resolves']['Update'];

export class ResolveService {
  /**
   * Get all Resolves for the current user
   */
  static async getUserResolves(userId: string): Promise<Resolve[]> {
    const { data, error } = await supabase
      .from('resolves')
      .select(`
        *,
        milestones (
          id,
          name,
          due_date,
          notes,
          importance,
          completed,
          completed_at,
          order_index,
          created_at,
          updated_at
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    
    // Sort milestones by order_index for each Resolve
    if (data) {
      data.forEach((Resolve: any) => {
        if (Resolve.milestones) {
          Resolve.milestones.sort((a: any, b: any) => (a.order_index || 0) - (b.order_index || 0));
        }
      });
    }
    
    return data || [];
  }

  /**
   * Get a single Resolve by ID
   */
  static async getResolve(resolveId: string): Promise<Resolve | null> {
    const { data, error } = await supabase
      .from('resolves')
      .select(`
        *,
        milestones (
          id,
          name,
          due_date,
          notes,
          importance,
          completed,
          completed_at,
          order_index,
          created_at,
          updated_at
        )
      `)
      .eq('id', resolveId)
      .single();
    
    // Sort milestones by order_index if they exist
    if (data && (data as any).milestones) {
      (data as any).milestones.sort((a: any, b: any) => (a.order_index || 0) - (b.order_index || 0));
    }

    if (error) throw error;
    return data;
  }

  /**
   * Get Resolves by status
   */
  static async getResolvesByStatus(
    userId: string,
    status: 'active' | 'completed' | 'archived'
  ): Promise<Resolve[]> {
    const { data, error } = await supabase
      .from('resolves')
      .select(`
        *,
        milestones (
          id,
          name,
          due_date,
          notes,
          importance,
          completed,
          completed_at,
          order_index,
          created_at,
          updated_at
        )
      `)
      .eq('user_id', userId)
      .eq('status', status)
      .order('created_at', { ascending: false });

    if (error) throw error;
    
    // Sort milestones by order_index for each Resolve
    if (data) {
      data.forEach((Resolve: any) => {
        if (Resolve.milestones) {
          Resolve.milestones.sort((a: any, b: any) => (a.order_index || 0) - (b.order_index || 0));
        }
      });
    }
    
    return data || [];
  }

  /**
   * Get Resolves by category
   */
  static async getPaktsByCategory(userId: string, category: string): Promise<Resolve[]> {
    const { data, error } = await supabase
      .from('resolves')
      .select('*')
      .eq('user_id', userId)
      .eq('category', category)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  /**
   * Create a new Resolve
   */
  static async createResolve(Resolve: ResolveInsert): Promise<Resolve> {
    const { data, error } = await supabase
      .from('resolves')
      .insert(Resolve)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Update a Resolve
   */
  static async updateResolve(resolveId: string, updates: ResolveUpdate): Promise<Resolve> {
    const { data, error } = await supabase
      .from('resolves')
      .update(updates)
      .eq('id', resolveId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Delete a Resolve
   */
  static async deleteResolve(resolveId: string): Promise<void> {
    const { error } = await supabase
      .from('resolves')
      .delete()
      .eq('id', resolveId);

    if (error) throw error;
  }

  /**
   * Mark Resolve as completed
   */
  static async completeResolve(resolveId: string): Promise<Resolve> {
    return this.updateResolve(resolveId, { status: 'completed', progress: 100 });
  }

  /**
   * Archive a Resolve
   */
  static async archiveResolve(resolveId: string): Promise<Resolve> {
    return this.updateResolve(resolveId, { status: 'archived' });
  }

  /**
   * Get user statistics
   */
  static async getUserStats(userId: string) {
    const Resolves = await this.getUserResolves(userId);
    
    const stats = {
      total: Resolves.length,
      active: Resolves.filter(p => p.status === 'active').length,
      completed: Resolves.filter(p => p.status === 'completed').length,
      archived: Resolves.filter(p => p.status === 'archived').length,
      averageProgress: Resolves.length > 0
        ? Math.round(Resolves.reduce((sum, p) => sum + p.progress, 0) / Resolves.length)
        : 0,
    };

    return stats;
  }
}

