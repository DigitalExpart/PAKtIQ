import { supabase } from '../lib/supabase';
import type { Database } from '../types/database';

type Achievement = Database['public']['Tables']['achievements']['Row'];
type AchievementInsert = Database['public']['Tables']['achievements']['Insert'];

export class AchievementService {
  /**
   * Get all achievements for a user
   */
  static async getUserAchievements(userId: string): Promise<Achievement[]> {
    const { data, error } = await supabase
      .from('achievements')
      .select('*')
      .eq('user_id', userId)
      .order('earned_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  /**
   * Get recent achievements (last 7 days)
   */
  static async getRecentAchievements(userId: string): Promise<Achievement[]> {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const { data, error } = await supabase
      .from('achievements')
      .select('*')
      .eq('user_id', userId)
      .gte('earned_at', sevenDaysAgo.toISOString())
      .order('earned_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  /**
   * Award an achievement to a user
   */
  static async awardAchievement(achievement: AchievementInsert): Promise<Achievement> {
    const { data, error } = await supabase
      .from('achievements')
      .insert(achievement)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Check if user has a specific achievement type
   */
  static async hasAchievement(userId: string, type: string): Promise<boolean> {
    const { data, error } = await supabase
      .from('achievements')
      .select('id')
      .eq('user_id', userId)
      .eq('type', type)
      .limit(1);

    if (error) throw error;
    return (data?.length ?? 0) > 0;
  }

  /**
   * Get achievement count by type
   */
  static async getAchievementCount(userId: string): Promise<number> {
    const { count, error } = await supabase
      .from('achievements')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId);

    if (error) throw error;
    return count ?? 0;
  }

  /**
   * Check and award milestones-based achievements
   */
  static async checkMilestoneAchievements(
    userId: string,
    completedMilestonesCount: number
  ): Promise<Achievement[]> {
    const newAchievements: Achievement[] = [];

    const milestones = [
      { count: 1, type: 'first_milestone', title: 'First Step', description: 'Completed your first milestone', icon: '🎯' },
      { count: 10, type: 'milestone_10', title: 'Getting Started', description: 'Completed 10 milestones', icon: '⭐' },
      { count: 25, type: 'milestone_25', title: 'On a Roll', description: 'Completed 25 milestones', icon: '🔥' },
      { count: 50, type: 'milestone_50', title: 'Half Century', description: 'Completed 50 milestones', icon: '💯' },
      { count: 100, type: 'milestone_100', title: 'Century Club', description: 'Completed 100 milestones', icon: '🏆' },
    ];

    for (const milestone of milestones) {
      if (completedMilestonesCount >= milestone.count) {
        const hasIt = await this.hasAchievement(userId, milestone.type);
        if (!hasIt) {
          const achievement = await this.awardAchievement({
            user_id: userId,
            type: milestone.type,
            title: milestone.title,
            description: milestone.description,
            icon: milestone.icon,
            metadata: { milestones_completed: completedMilestonesCount },
          });
          newAchievements.push(achievement);
        }
      }
    }

    return newAchievements;
  }

  /**
   * Check and award pakt-based achievements
   */
  static async checkPaktAchievements(
    userId: string,
    completedPaktsCount: number
  ): Promise<Achievement[]> {
    const newAchievements: Achievement[] = [];

    const pakts = [
      { count: 1, type: 'first_pakt', title: 'Committed', description: 'Completed your first Pakt', icon: '🎉' },
      { count: 5, type: 'pakt_5', title: 'Dedicated', description: 'Completed 5 Pakts', icon: '💪' },
      { count: 10, type: 'pakt_10', title: 'Achiever', description: 'Completed 10 Pakts', icon: '🌟' },
      { count: 25, type: 'pakt_25', title: 'Champion', description: 'Completed 25 Pakts', icon: '👑' },
    ];

    for (const pakt of pakts) {
      if (completedPaktsCount >= pakt.count) {
        const hasIt = await this.hasAchievement(userId, pakt.type);
        if (!hasIt) {
          const achievement = await this.awardAchievement({
            user_id: userId,
            type: pakt.type,
            title: pakt.title,
            description: pakt.description,
            icon: pakt.icon,
            metadata: { pakts_completed: completedPaktsCount },
          });
          newAchievements.push(achievement);
        }
      }
    }

    return newAchievements;
  }
}

