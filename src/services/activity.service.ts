import { supabase } from '../lib/supabase';
import type { Database } from '../types/database';

type ActivityLog = Database['public']['Tables']['activity_log']['Row'];
type ActivityLogInsert = Database['public']['Tables']['activity_log']['Insert'];

export class ActivityService {
  /**
   * Log an activity
   */
  static async logActivity(activity: ActivityLogInsert): Promise<ActivityLog> {
    const { data, error } = await supabase
      .from('activity_log')
      .insert(activity)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Get user's activity log
   */
  static async getUserActivity(userId: string, limit = 50): Promise<ActivityLog[]> {
    const { data, error } = await supabase
      .from('activity_log')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  }

  /**
   * Get activity for a specific pakt
   */
  static async getPaktActivity(paktId: string, limit = 50): Promise<ActivityLog[]> {
    const { data, error } = await supabase
      .from('activity_log')
      .select('*')
      .eq('pakt_id', paktId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  }

  /**
   * Log pakt creation
   */
  static async logPaktCreated(
    userId: string,
    paktId: string,
    paktName: string
  ): Promise<ActivityLog> {
    return this.logActivity({
      user_id: userId,
      pakt_id: paktId,
      action_type: 'pakt_created',
      description: `Created pakt: ${paktName}`,
    });
  }

  /**
   * Log pakt completion
   */
  static async logPaktCompleted(
    userId: string,
    paktId: string,
    paktName: string
  ): Promise<ActivityLog> {
    return this.logActivity({
      user_id: userId,
      pakt_id: paktId,
      action_type: 'pakt_completed',
      description: `Completed pakt: ${paktName}`,
    });
  }

  /**
   * Log milestone completion
   */
  static async logMilestoneCompleted(
    userId: string,
    paktId: string,
    milestoneId: string,
    milestoneName: string
  ): Promise<ActivityLog> {
    return this.logActivity({
      user_id: userId,
      pakt_id: paktId,
      milestone_id: milestoneId,
      action_type: 'milestone_completed',
      description: `Completed milestone: ${milestoneName}`,
    });
  }

  /**
   * Log milestone created
   */
  static async logMilestoneCreated(
    userId: string,
    paktId: string,
    milestoneId: string,
    milestoneName: string
  ): Promise<ActivityLog> {
    return this.logActivity({
      user_id: userId,
      pakt_id: paktId,
      milestone_id: milestoneId,
      action_type: 'milestone_created',
      description: `Created milestone: ${milestoneName}`,
    });
  }

  /**
   * Get activity stats for a user
   */
  static async getActivityStats(userId: string) {
    const activities = await this.getUserActivity(userId, 1000);

    const stats = {
      total: activities.length,
      byType: activities.reduce((acc, activity) => {
        acc[activity.action_type] = (acc[activity.action_type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      last7Days: activities.filter(activity => {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        return new Date(activity.created_at) >= sevenDaysAgo;
      }).length,
    };

    return stats;
  }
}

