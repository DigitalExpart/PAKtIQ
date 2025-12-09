import { supabase } from '../lib/supabase';

export interface DailyAnalytics {
  id: string;
  user_id: string;
  date: string;
  milestones_completed_today: number;
  pakts_worked_on_today: number;
  time_spent_minutes: number;
  current_streak: number;
  longest_streak: number;
  streak_active: boolean;
  completion_rate: number;
  total_milestones_completed: number;
  total_pakts_completed: number;
  badges_earned_total: number;
  badges_earned_today: number;
  created_at: string;
  updated_at: string;
}

export interface WeeklyActivity {
  user_id: string;
  date: string;
  activity_count: number;
  day_of_week: number;
  day_name: string;
}

export interface UserInsights {
  completionRate: number;
  milestonesDone: number;
  dayStreak: number;
  badgesEarned: number;
  weeklyActivity: number[];
  totalPaktsCompleted: number;
  longestStreak: number;
}

export class AnalyticsService {
  /**
   * Get or create today's analytics for user
   */
  static async getTodayAnalytics(userId: string): Promise<DailyAnalytics | null> {
    try {
      const today = new Date().toISOString().split('T')[0];

      // First, verify profile exists (to avoid foreign key constraint violation)
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', userId)
        .single();

      // If profile doesn't exist yet, return null (profile might still be creating)
      if (profileError || !profile) {
        console.warn('Profile not found for user, analytics will be created after profile is ready');
        return null;
      }

      // Try to get existing
      let { data, error } = await supabase
        .from('analytics')
        .select('*')
        .eq('user_id', userId)
        .eq('date', today)
        .single();

      // If doesn't exist, create it
      if (error || !data) {
        const { data: newData, error: createError } = await supabase
          .from('analytics')
          .insert({
            user_id: userId,
            date: today,
          })
          .select()
          .single();

        if (createError) {
          // If foreign key error, profile might still be creating - return null gracefully
          if (createError.code === '23503') {
            console.warn('Profile not ready yet, analytics will be created later');
            return null;
          }
          throw createError;
        }
        data = newData;
      }

      return data as DailyAnalytics;
    } catch (err: any) {
      // Catch any foreign key errors and return null gracefully
      if (err?.code === '23503') {
        console.warn('Foreign key violation in getTodayAnalytics, profile may not be ready');
        return null;
      }
      // Re-throw other errors
      throw err;
    }
  }

  /**
   * Get weekly activity for charts
   */
  static async getWeeklyActivity(userId: string): Promise<number[]> {
    try {
      // First verify profile exists
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', userId)
        .single();

      if (profileError || !profile) {
        // Profile doesn't exist yet, return empty array
        return [0, 0, 0, 0, 0, 0, 0];
      }

      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const { data, error } = await supabase
        .from('analytics')
        .select('date, milestones_completed_today')
        .eq('user_id', userId)
        .gte('date', sevenDaysAgo.toISOString().split('T')[0])
        .order('date', { ascending: true });

      if (error) {
        // If foreign key error, profile might still be creating
        if (error.code === '23503') {
          return [0, 0, 0, 0, 0, 0, 0];
        }
        throw error;
      }

      // Create array of 7 days with activity counts
      const activityMap = new Map<string, number>();
      data?.forEach(item => {
        activityMap.set(item.date, item.milestones_completed_today || 0);
      });

      // Fill in missing days with 0
      const activity: number[] = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        activity.push(activityMap.get(dateStr) || 0);
      }

      return activity;
    } catch (err: any) {
      // If any error occurs (including foreign key), return empty array
      if (err?.code === '23503') {
        return [0, 0, 0, 0, 0, 0, 0];
      }
      // For other errors, also return empty array to prevent breaking the app
      console.warn('Error getting weekly activity, returning defaults:', err);
      return [0, 0, 0, 0, 0, 0, 0];
    }
  }

  /**
   * Get comprehensive user insights
   */
  static async getUserInsights(userId: string): Promise<UserInsights> {
    try {
      // Get today's analytics (may return null if profile not ready)
      const today = await this.getTodayAnalytics(userId);
      
      // If analytics couldn't be created (profile not ready), return default values
      if (!today) {
        return {
          completionRate: 0,
          milestonesDone: 0,
          dayStreak: 0,
          badgesEarned: 0,
          weeklyActivity: [0, 0, 0, 0, 0, 0, 0],
          totalPaktsCompleted: 0,
          longestStreak: 0,
        };
      }

      // Get weekly activity (with error handling)
      let weeklyActivity: number[] = [0, 0, 0, 0, 0, 0, 0];
      try {
        weeklyActivity = await this.getWeeklyActivity(userId);
      } catch (err: any) {
        // If foreign key error, profile might still be creating
        if (err?.code === '23503') {
          console.warn('Profile not ready for weekly activity, using defaults');
        } else {
          console.warn('Error getting weekly activity:', err);
        }
      }

      // Calculate completion rate from actual data (with error handling)
      let totalMilestones = 0;
      let completedMilestones = 0;
      try {
        const { data: milestones } = await supabase
          .from('milestones')
          .select('id, completed')
          .eq('user_id', userId);

        totalMilestones = milestones?.length || 0;
        completedMilestones = milestones?.filter(m => m.completed).length || 0;
      } catch (err) {
        console.warn('Error getting milestones:', err);
      }

      const completionRate = totalMilestones > 0
        ? Math.round((completedMilestones / totalMilestones) * 100)
        : 0;

      // Get achievements count (with error handling)
      let badgesCount = 0;
      try {
        const { count } = await supabase
          .from('achievements')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', userId);
        badgesCount = count || 0;
      } catch (err) {
        console.warn('Error getting achievements:', err);
      }

      return {
        completionRate,
        milestonesDone: today?.total_milestones_completed || completedMilestones,
        dayStreak: today?.current_streak || 0,
        badgesEarned: badgesCount,
        weeklyActivity,
        totalPaktsCompleted: today?.total_pakts_completed || 0,
        longestStreak: today?.longest_streak || 0,
      };
    } catch (err: any) {
      // If any foreign key error occurs, return default values
      if (err?.code === '23503') {
        console.warn('Profile not ready yet, returning default insights');
        return {
          completionRate: 0,
          milestonesDone: 0,
          dayStreak: 0,
          badgesEarned: 0,
          weeklyActivity: [0, 0, 0, 0, 0, 0, 0],
          totalPaktsCompleted: 0,
          longestStreak: 0,
        };
      }
      // Re-throw other errors
      throw err;
    }
  }

  /**
   * Update analytics when milestone is completed
   */
  static async recordMilestoneCompletion(userId: string): Promise<void> {
    const today = await this.getTodayAnalytics(userId);
    if (!today) {
      // Profile might not be ready yet, silently skip
      return;
    }

    const { error } = await supabase
      .from('analytics')
      .update({
        milestones_completed_today: (today.milestones_completed_today || 0) + 1,
        total_milestones_completed: (today.total_milestones_completed || 0) + 1,
      })
      .eq('id', today.id);

    if (error) {
      // Don't throw for foreign key errors - profile might still be creating
      if (error.code === '23503') {
        console.warn('Profile not ready yet, milestone completion will be recorded later');
        return;
      }
      throw error;
    }

    // Update streak
    await this.updateStreak(userId);
  }

  /**
   * Update user streak
   */
  static async updateStreak(userId: string): Promise<void> {
    // Call the database function
    const { error } = await supabase.rpc('update_user_streak', {
      p_user_id: userId,
    });

    if (error) {
      // If function doesn't exist yet (migration not run), calculate manually
      const today = await this.getTodayAnalytics(userId);
      if (!today) return;

      // Simple streak calculation
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];

      const { data: yesterdayData } = await supabase
        .from('analytics')
        .select('current_streak, streak_active')
        .eq('user_id', userId)
        .eq('date', yesterdayStr)
        .single();

      let newStreak = 1;
      if (yesterdayData && yesterdayData.streak_active) {
        newStreak = (yesterdayData.current_streak || 0) + 1;
      }

      await supabase
        .from('analytics')
        .update({
          current_streak: newStreak,
          longest_streak: Math.max(today.longest_streak || 0, newStreak),
          streak_active: true,
        })
        .eq('id', today.id);
    }
  }

  /**
   * Record time spent on app
   */
  static async recordTimeSpent(userId: string, minutes: number): Promise<void> {
    const today = await this.getTodayAnalytics(userId);
    if (!today) {
      // Profile might not be ready yet, silently skip
      return;
    }

    const { error } = await supabase
      .from('analytics')
      .update({
        time_spent_minutes: (today.time_spent_minutes || 0) + minutes,
      })
      .eq('id', today.id);

    if (error) {
      // Don't throw for foreign key errors - profile might still be creating
      if (error.code === '23503') {
        console.warn('Profile not ready yet, time spent will be recorded later');
        return;
      }
      throw error;
    }
  }

  /**
   * Get all-time statistics
   */
  static async getAllTimeStats(userId: string) {
    const { data: allAnalytics } = await supabase
      .from('analytics')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false });

    if (!allAnalytics || allAnalytics.length === 0) {
      return {
        totalDaysActive: 0,
        totalTimeSpent: 0,
        averageCompletionRate: 0,
        bestStreak: 0,
      };
    }

    const totalDaysActive = allAnalytics.length;
    const totalTimeSpent = allAnalytics.reduce((sum, a) => sum + (a.time_spent_minutes || 0), 0);
    const avgRate = allAnalytics.reduce((sum, a) => sum + (a.completion_rate || 0), 0) / allAnalytics.length;
    const bestStreak = Math.max(...allAnalytics.map(a => a.longest_streak || 0));

    return {
      totalDaysActive,
      totalTimeSpent,
      averageCompletionRate: Math.round(avgRate),
      bestStreak,
    };
  }
}

