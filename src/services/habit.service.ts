import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

export interface Habit {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  category?: string;
  enabled: boolean;
  duration_weeks?: number | null;
  start_date?: string | null;
  status?: 'active' | 'completed';
  completion_rate?: number;
  created_at: string;
  updated_at: string;
}

export interface HabitSchedule {
  id: string;
  habit_id: string;
  day_of_week: number; // 0 = Sunday, 1 = Monday, etc.
  time: string; // HH:MM format
  enabled: boolean;
  created_at: string;
  updated_at: string;
}

export interface HabitCompletion {
  id: string;
  habit_id: string;
  user_id: string;
  completion_date: string; // YYYY-MM-DD format
  completed_at: string;
  status: 'completed' | 'missed';
  notes?: string;
  created_at: string;
}

export interface CreateHabitData {
  name: string;
  description?: string;
  category?: string;
  duration_weeks?: number;
  schedules: {
    day_of_week: number;
    time: string;
  }[];
}

export class HabitService {
  /**
   * Create a new habit with schedules
   */
  static async createHabit(data: CreateHabitData): Promise<Habit> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    // Create habit
    const { data: habit, error: habitError } = await supabase
      .from('habits')
      .insert({
        user_id: user.id,
        name: data.name,
        description: data.description,
        category: data.category,
        duration_weeks: data.duration_weeks || null,
        start_date: new Date().toISOString().split('T')[0],
        enabled: true,
      })
      .select()
      .single();

    if (habitError) throw habitError;
    if (!habit) throw new Error('Failed to create habit');

    // Create schedules
    if (data.schedules.length > 0) {
      const schedules = data.schedules.map(schedule => ({
        habit_id: habit.id,
        day_of_week: schedule.day_of_week,
        time: schedule.time,
        enabled: true,
      }));

      const { error: scheduleError } = await supabase
        .from('habit_schedules')
        .insert(schedules);

      if (scheduleError) {
        // Rollback: delete the habit if schedules fail
        await supabase.from('habits').delete().eq('id', habit.id);
        throw scheduleError;
      }
    }

    // Schedule notifications for the new habit
    try {
      const { HabitNotificationService } = await import('./habit-notification.service');
      await HabitNotificationService.scheduleHabitNotifications(habit.id);
    } catch (error) {
      console.error('Error scheduling habit notifications:', error);
      // Don't fail habit creation if notification scheduling fails
    }

    return habit;
  }

  /**
   * Get all habits for the current user (only active ones within duration)
   * Also handles weekly cycle resets
   */
  static async getHabits(): Promise<Habit[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('habits')
      .select('*')
      .eq('user_id', user.id)
      .eq('enabled', true)
      .order('created_at', { ascending: false });

    if (error) throw error;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Process each habit for weekly cycle reset
    const processedHabits = await Promise.all((data || []).map(async (habit) => {
      if (!habit.start_date) return habit;
      
      const startDate = new Date(habit.start_date);
      startDate.setHours(0, 0, 0, 0);
      
      // Calculate weeks since start
      const diffTime = today.getTime() - startDate.getTime();
      const diffWeeks = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 7));
      
      // If a week has passed, reset the start_date to start of current week
      if (diffWeeks >= 1) {
        const newStartDate = new Date(today);
        // Set to start of current week (Sunday)
        const dayOfWeek = today.getDay();
        newStartDate.setDate(today.getDate() - dayOfWeek);
        newStartDate.setHours(0, 0, 0, 0);
        
        // Update habit start_date
        await supabase
          .from('habits')
          .update({ start_date: newStartDate.toISOString().split('T')[0] })
          .eq('id', habit.id);
        
        // Delete old completion records (older than current week)
        const weekStart = newStartDate.toISOString().split('T')[0];
        await supabase
          .from('habit_completions')
          .delete()
          .eq('habit_id', habit.id)
          .lt('completion_date', weekStart);
        
        return { ...habit, start_date: newStartDate.toISOString().split('T')[0] };
      }
      
      return habit;
    }));
    
    // Check each habit for auto-completion and calculate completion rate
    const habitsWithStatus = await Promise.all(processedHabits.map(async (habit) => {
      if (!habit.duration_weeks || !habit.start_date) {
        // No duration limit - keep active
        if (habit.status !== 'active') {
          await supabase
            .from('habits')
            .update({ status: 'active', completion_rate: null })
            .eq('id', habit.id);
        }
        return { ...habit, status: 'active' as const };
      }
      
      const startDate = new Date(habit.start_date);
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + (habit.duration_weeks * 7));
      endDate.setHours(23, 59, 59, 999);
      
      // Check if habit duration has ended
      if (today > endDate && habit.status !== 'completed') {
        // Calculate completion rate
        const completionRate = await this.calculateCompletionRate(habit.id, startDate, endDate);
        
        // Auto-complete the habit
        await supabase
          .from('habits')
          .update({ 
            status: 'completed',
            completion_rate: completionRate,
            enabled: false 
          })
          .eq('id', habit.id);
        
        return { ...habit, status: 'completed' as const, completion_rate: completionRate };
      }
      
      // Still active
      if (habit.status !== 'active') {
        await supabase
          .from('habits')
          .update({ status: 'active', completion_rate: null })
          .eq('id', habit.id);
      }
      
      return { ...habit, status: 'active' as const };
    }));
    
    // Return only active habits
    return habitsWithStatus.filter(habit => habit.status === 'active');
  }

  /**
   * Get completed habits
   */
  static async getCompletedHabits(): Promise<Habit[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    try {
      const { data, error } = await supabase
        .from('habits')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'completed')
        .order('updated_at', { ascending: false });

      if (error) {
        // If status column doesn't exist, return empty array (migration not run yet)
        if (error.code === '42703' || error.message?.includes('status')) {
          console.warn('Status column not found. Please run migration 017_add_habit_status_and_completion_rate.sql');
          return [];
        }
        throw error;
      }
      return data || [];
    } catch (error: any) {
      // Gracefully handle missing status column
      if (error.code === '42703' || error.message?.includes('status')) {
        console.warn('Status column not found. Please run migration 017_add_habit_status_and_completion_rate.sql');
        return [];
      }
      throw error;
    }
  }

  /**
   * Calculate completion rate for a habit based on completed vs missed days
   */
  static async calculateCompletionRate(habitId: string, startDate: Date, endDate: Date): Promise<number> {
    // Get all scheduled days within the duration period
    const { data: schedules } = await supabase
      .from('habit_schedules')
      .select('day_of_week')
      .eq('habit_id', habitId)
      .eq('enabled', true);

    if (!schedules || schedules.length === 0) return 0;

    // Calculate total scheduled days
    let totalScheduledDays = 0;
    const currentDate = new Date(startDate);
    
    while (currentDate <= endDate) {
      const dayOfWeek = currentDate.getDay();
      if (schedules.some(s => s.day_of_week === dayOfWeek)) {
        totalScheduledDays++;
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }

    if (totalScheduledDays === 0) return 0;

    // Get all completions (both completed and missed) within the duration
    const startDateStr = startDate.toISOString().split('T')[0];
    const endDateStr = endDate.toISOString().split('T')[0];
    
    const { data: completions } = await supabase
      .from('habit_completions')
      .select('status')
      .eq('habit_id', habitId)
      .gte('completion_date', startDateStr)
      .lte('completion_date', endDateStr);

    if (!completions || completions.length === 0) return 0;

    // Count completed days
    const completedDays = completions.filter(c => c.status === 'completed').length;
    
    // Calculate percentage
    const rate = Math.round((completedDays / totalScheduledDays) * 100);
    return Math.min(100, Math.max(0, rate));
  }

  /**
   * Check if habit is still active (within duration)
   */
  static isHabitActive(habit: Habit): boolean {
    if (!habit.duration_weeks || !habit.start_date) return true;
    
    const today = new Date();
    const startDate = new Date(habit.start_date);
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + (habit.duration_weeks * 7));
    
    return today <= endDate;
  }

  /**
   * Get current week number for a habit (1-based)
   */
  static getCurrentWeek(habit: Habit): number {
    if (!habit.start_date) return 1;
    
    const today = new Date();
    const startDate = new Date(habit.start_date);
    const diffTime = today.getTime() - startDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const weekNumber = Math.floor(diffDays / 7) + 1;
    
    return Math.max(1, weekNumber);
  }

  /**
   * Get a single habit by ID
   */
  static async getHabit(habitId: string): Promise<Habit | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('habits')
      .select('*')
      .eq('id', habitId)
      .eq('user_id', user.id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; // Not found
      throw error;
    }

    return data;
  }

  /**
   * Get schedules for a habit
   */
  static async getHabitSchedules(habitId: string): Promise<HabitSchedule[]> {
    const { data, error } = await supabase
      .from('habit_schedules')
      .select('*')
      .eq('habit_id', habitId)
      .eq('enabled', true)
      .order('day_of_week', { ascending: true });

    if (error) throw error;
    return data || [];
  }

  /**
   * Update a habit
   */
  static async updateHabit(habitId: string, updates: Partial<Habit>): Promise<Habit> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('habits')
      .update(updates)
      .eq('id', habitId)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) throw error;
    if (!data) throw new Error('Habit not found');

    // Reschedule notifications if habit was updated (schedules might have changed)
    try {
      const { HabitNotificationService } = await import('./habit-notification.service');
      await HabitNotificationService.scheduleHabitNotifications(habitId);
    } catch (error) {
      console.error('Error rescheduling habit notifications:', error);
      // Don't fail if notification scheduling fails
    }

    return data;
  }

  /**
   * Delete a habit (soft delete by setting enabled to false)
   */
  static async deleteHabit(habitId: string): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { error } = await supabase
      .from('habits')
      .update({ enabled: false })
      .eq('id', habitId)
      .eq('user_id', user.id);

    if (error) throw error;
  }

  /**
   * Mark a habit as completed for a specific date (upsert to handle duplicates)
   */
  static async completeHabit(habitId: string, date: string, notes?: string): Promise<HabitCompletion> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    // Use upsert to handle duplicate key errors
    const { data, error } = await supabase
      .from('habit_completions')
      .upsert({
        habit_id: habitId,
        user_id: user.id,
        completion_date: date,
        notes,
        status: 'completed',
        completed_at: new Date().toISOString(),
      }, {
        onConflict: 'habit_id,completion_date'
      })
      .select()
      .single();

    if (error) throw error;
    if (!data) throw new Error('Failed to create completion');

    // Send notification for habit completion
    try {
      const { HabitNotificationService } = await import('./habit-notification.service');
      await HabitNotificationService.notifyHabitCompleted(habitId, user.id);
    } catch (error) {
      console.error('Error sending completion notification:', error);
      // Don't fail if notification fails
    }

    return data;
  }

  /**
   * Mark a habit as missed for a specific date
   */
  static async markHabitMissed(habitId: string, date: string): Promise<HabitCompletion> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    // Use upsert to handle duplicate key errors
    const { data, error } = await supabase
      .from('habit_completions')
      .upsert({
        habit_id: habitId,
        user_id: user.id,
        completion_date: date,
        status: 'missed',
        completed_at: new Date().toISOString(),
      }, {
        onConflict: 'habit_id,completion_date'
      })
      .select()
      .single();

    if (error) throw error;
    if (!data) throw new Error('Failed to mark as missed');

    // Send notification for habit missed
    try {
      const { HabitNotificationService } = await import('./habit-notification.service');
      await HabitNotificationService.notifyHabitMissed(habitId, user.id);
    } catch (error) {
      console.error('Error sending missed notification:', error);
      // Don't fail if notification fails
    }

    return data;
  }

  /**
   * Update habit status for a specific date (completed or missed)
   */
  static async updateHabitStatus(habitId: string, date: string, status: 'completed' | 'missed', notes?: string): Promise<HabitCompletion> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('habit_completions')
      .upsert({
        habit_id: habitId,
        user_id: user.id,
        completion_date: date,
        status,
        notes,
        completed_at: new Date().toISOString(),
      }, {
        onConflict: 'habit_id,completion_date'
      })
      .select()
      .single();

    if (error) throw error;
    if (!data) throw new Error('Failed to update status');
    return data;
  }

  /**
   * Unmark a habit as completed for a specific date
   */
  static async uncompleteHabit(habitId: string, date: string): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { error } = await supabase
      .from('habit_completions')
      .delete()
      .eq('habit_id', habitId)
      .eq('user_id', user.id)
      .eq('completion_date', date);

    if (error) throw error;
  }

  /**
   * Get completions for a habit
   */
  static async getHabitCompletions(habitId: string, startDate?: string, endDate?: string): Promise<HabitCompletion[]> {
    let query = supabase
      .from('habit_completions')
      .select('*')
      .eq('habit_id', habitId)
      .order('completion_date', { ascending: false });

    if (startDate) {
      query = query.gte('completion_date', startDate);
    }
    if (endDate) {
      query = query.lte('completion_date', endDate);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  }

  /**
   * Auto-mark missed habits for yesterday if they weren't completed
   * This should be called daily to mark habits as missed
   */
  static async autoMarkMissedHabits(): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(0, 0, 0, 0);
    const yesterdayDate = yesterday.toISOString().split('T')[0];

    // Get all active habits
    const { data: habits, error: habitsError } = await supabase
      .from('habits')
      .select('id')
      .eq('user_id', user.id)
      .eq('enabled', true);

    if (habitsError) throw habitsError;
    if (!habits || habits.length === 0) return;

    // For each habit, check if it was scheduled yesterday and if it was completed
    for (const habit of habits) {
      // Get schedules for yesterday's day of week
      const dayOfWeek = yesterday.getDay();
      const { data: schedules } = await supabase
        .from('habit_schedules')
        .select('*')
        .eq('habit_id', habit.id)
        .eq('day_of_week', dayOfWeek)
        .eq('enabled', true);

      if (!schedules || schedules.length === 0) continue;

      // Check if habit was completed yesterday
      const { data: completions } = await supabase
        .from('habit_completions')
        .select('*')
        .eq('habit_id', habit.id)
        .eq('completion_date', yesterdayDate);

      // If scheduled but not completed, mark as missed
      if (!completions || completions.length === 0) {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          await this.markHabitMissed(habit.id, yesterdayDate);
          // Notification is sent automatically by markHabitMissed
        }
      }
    }
  }

  /**
   * Get habit completion streak
   */
  static async getHabitStreak(habitId: string): Promise<number> {
    const completions = await this.getHabitCompletions(habitId);
    if (completions.length === 0) return 0;

    // Sort by date descending
    const sorted = completions.sort((a, b) => 
      new Date(b.completion_date).getTime() - new Date(a.completion_date).getTime()
    );

    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let checkDate = new Date(today);
    const completionDates = new Set(
      sorted.map(c => {
        const d = new Date(c.completion_date);
        d.setHours(0, 0, 0, 0);
        return d.getTime();
      })
    );

    // Check if today is completed
    if (!completionDates.has(checkDate.getTime())) {
      checkDate.setDate(checkDate.getDate() - 1);
    }

    while (completionDates.has(checkDate.getTime())) {
      streak++;
      checkDate.setDate(checkDate.getDate() - 1);
    }

    return streak;
  }
}
