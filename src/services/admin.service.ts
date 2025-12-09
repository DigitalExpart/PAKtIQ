import { supabase } from '../lib/supabase';

export interface AdminUser {
  id: string;
  user_id: string;
  role: 'super_admin' | 'admin' | 'moderator';
  permissions: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export class AdminService {
  /**
   * Check if user is admin
   */
  static async isAdmin(userId: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('admin_users')
        .select('id')
        .eq('user_id', userId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') return false;
        throw error;
      }

      return !!data;
    } catch (error) {
      console.error('Error checking admin status:', error);
      return false;
    }
  }

  /**
   * Get admin user details
   */
  static async getAdminUser(userId: string): Promise<AdminUser | null> {
    try {
      const { data, error } = await supabase
        .from('admin_users')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') return null;
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error getting admin user:', error);
      return null;
    }
  }

  /**
   * Get all users (admin only)
   */
  static async getAllUsers(): Promise<any[]> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  /**
   * Get all pakts (admin only)
   */
  static async getAllPakts(): Promise<any[]> {
    const { data, error } = await supabase
      .from('pakts')
      .select('*, profiles(email, full_name)')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  /**
   * Get app statistics (admin only)
   */
  static async getAppStats(): Promise<{
    totalUsers: number;
    activeUsers: number;
    totalPakts: number;
    completedPakts: number;
    totalMilestones: number;
    completedMilestones: number;
  }> {
    const [users, pakts, milestones] = await Promise.all([
      supabase.from('profiles').select('id, created_at', { count: 'exact' }),
      supabase.from('pakts').select('id, status', { count: 'exact' }),
      supabase.from('milestones').select('id, completed', { count: 'exact' }),
    ]);

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const { data: activeUsers } = await supabase
      .from('profiles')
      .select('id')
      .gte('updated_at', thirtyDaysAgo.toISOString());

    return {
      totalUsers: users.count || 0,
      activeUsers: activeUsers?.length || 0,
      totalPakts: pakts.count || 0,
      completedPakts: pakts.data?.filter((p: any) => p.status === 'completed').length || 0,
      totalMilestones: milestones.count || 0,
      completedMilestones: milestones.data?.filter((m: any) => m.completed).length || 0,
    };
  }
}
