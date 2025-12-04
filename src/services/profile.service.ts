import { supabase } from '../lib/supabase';
import type { Database } from '../types/database';

type Profile = Database['public']['Tables']['profiles']['Row'];
type ProfileUpdate = Database['public']['Tables']['profiles']['Update'];

export class ProfileService {
  /**
   * Get current user's profile
   */
  static async getProfile(userId: string): Promise<Profile | null> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Update user profile
   */
  static async updateProfile(userId: string, updates: ProfileUpdate): Promise<Profile> {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Mark onboarding as completed
   */
  static async completeOnboarding(userId: string): Promise<void> {
    const { error } = await supabase
      .from('profiles')
      .update({ onboarding_completed: true })
      .eq('id', userId);

    if (error) throw error;
  }

  /**
   * Check if user has premium
   */
  static async hasPremium(userId: string): Promise<boolean> {
    const profile = await this.getProfile(userId);
    return profile?.premium ?? false;
  }

  /**
   * Upgrade to premium
   */
  static async upgradeToPremium(userId: string): Promise<void> {
    const { error } = await supabase
      .from('profiles')
      .update({ premium: true })
      .eq('id', userId);

    if (error) throw error;
  }
}

