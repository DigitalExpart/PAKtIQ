import { supabase } from '../lib/supabase';
import type { Database } from '../types/database';

type Reminder = Database['public']['Tables']['reminders']['Row'];
type ReminderInsert = Database['public']['Tables']['reminders']['Insert'];
type ReminderUpdate = Database['public']['Tables']['reminders']['Update'];

export class ReminderService {
  /**
   * Get reminder for a pakt
   */
  static async getPaktReminder(paktId: string): Promise<Reminder | null> {
    const { data, error } = await supabase
      .from('reminders')
      .select('*')
      .eq('pakt_id', paktId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No reminder found
        return null;
      }
      throw error;
    }
    return data;
  }

  /**
   * Get all reminders for a user
   */
  static async getUserReminders(userId: string): Promise<Reminder[]> {
    const { data, error } = await supabase
      .from('reminders')
      .select('*')
      .eq('user_id', userId)
      .eq('enabled', true);

    if (error) throw error;
    return data || [];
  }

  /**
   * Create a reminder
   */
  static async createReminder(reminder: ReminderInsert): Promise<Reminder> {
    const { data, error } = await supabase
      .from('reminders')
      .insert(reminder)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Update a reminder
   */
  static async updateReminder(reminderId: string, updates: ReminderUpdate): Promise<Reminder> {
    const { data, error } = await supabase
      .from('reminders')
      .update(updates)
      .eq('id', reminderId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Toggle reminder enabled/disabled
   */
  static async toggleReminder(reminderId: string, enabled: boolean): Promise<Reminder> {
    return this.updateReminder(reminderId, { enabled });
  }

  /**
   * Delete a reminder
   */
  static async deleteReminder(reminderId: string): Promise<void> {
    const { error } = await supabase
      .from('reminders')
      .delete()
      .eq('id', reminderId);

    if (error) throw error;
  }

  /**
   * Create or update reminder for a pakt
   */
  static async upsertPaktReminder(
    paktId: string,
    userId: string,
    reminderData: Omit<ReminderInsert, 'pakt_id' | 'user_id'>
  ): Promise<Reminder> {
    const existing = await this.getPaktReminder(paktId);

    if (existing) {
      return this.updateReminder(existing.id, reminderData);
    } else {
      return this.createReminder({
        ...reminderData,
        pakt_id: paktId,
        user_id: userId,
      });
    }
  }
}

