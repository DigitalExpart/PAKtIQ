import { supabase } from '../lib/supabase';
import type { ProfileUpdate } from '../types';

export interface NotificationPreferences {
  enabled: boolean;
  push_enabled: boolean;
  email_enabled: boolean;
  pakt_reminders: boolean;
  milestone_deadlines: boolean;
  streak_protection: boolean;
  daily_motivation: boolean;
  weekly_progress: boolean;
  achievement_alerts: boolean;
  quiet_hours_start: string;
  quiet_hours_end: string;
}

export class SettingsService {
  /**
   * Toggle dark mode for user
   */
  static async toggleDarkMode(userId: string, enabled: boolean): Promise<void> {
    const { error } = await supabase
      .from('profiles')
      .update({ dark_mode: enabled })
      .eq('id', userId);

    if (error) throw error;
  }

  /**
   * Get user's dark mode preference
   */
  static async getDarkMode(userId: string): Promise<boolean> {
    const { data, error } = await supabase
      .from('profiles')
      .select('dark_mode')
      .eq('id', userId)
      .single();

    if (error) throw error;
    return data?.dark_mode ?? false;
  }

  /**
   * Update notification preferences
   */
  static async updateNotificationPreferences(
    userId: string,
    preferences: Partial<NotificationPreferences>
  ): Promise<void> {
    // Get current preferences
    const { data: profile } = await supabase
      .from('profiles')
      .select('notification_preferences')
      .eq('id', userId)
      .single();

    const currentPrefs = (profile?.notification_preferences as NotificationPreferences) || {};
    const updatedPrefs = { ...currentPrefs, ...preferences };

    const { error } = await supabase
      .from('profiles')
      .update({ notification_preferences: updatedPrefs })
      .eq('id', userId);

    if (error) throw error;
  }

  /**
   * Get notification preferences
   */
  static async getNotificationPreferences(userId: string): Promise<NotificationPreferences> {
    const { data, error } = await supabase
      .from('profiles')
      .select('notification_preferences')
      .eq('id', userId)
      .single();

    if (error) throw error;

    return (data?.notification_preferences as NotificationPreferences) || {
      enabled: true,
      push_enabled: true,
      email_enabled: false,
      pakt_reminders: true,
      milestone_deadlines: true,
      streak_protection: true,
      daily_motivation: false,
      weekly_progress: true,
      achievement_alerts: true,
      quiet_hours_start: '22:00',
      quiet_hours_end: '08:00',
    };
  }

  /**
   * Update quiet hours
   */
  static async updateQuietHours(
    userId: string,
    start: string,
    end: string
  ): Promise<void> {
    await this.updateNotificationPreferences(userId, {
      quiet_hours_start: start,
      quiet_hours_end: end,
    });
  }

  /**
   * Get all user settings
   */
  static async getAllSettings(userId: string) {
    const { data, error } = await supabase
      .from('profiles')
      .select('dark_mode, notification_preferences, premium, onboarding_completed')
      .eq('id', userId)
      .single();

    if (error) throw error;

    return {
      darkMode: data?.dark_mode ?? false,
      notificationPreferences: (data?.notification_preferences as NotificationPreferences) || {},
      premium: data?.premium ?? false,
      onboardingCompleted: data?.onboarding_completed ?? false,
    };
  }
}

