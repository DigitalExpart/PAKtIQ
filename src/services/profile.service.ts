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
   * Creates profile if it doesn't exist
   */
  static async updateProfile(userId: string, updates: ProfileUpdate): Promise<Profile> {
    // First check if profile exists
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', userId)
      .single();

    if (!existingProfile) {
      // Profile doesn't exist, create it first
      // Get user email from auth.users
      const { data: authUser } = await supabase.auth.getUser();
      const email = authUser?.user?.email || '';
      
      const { data: newProfile, error: createError } = await supabase
        .from('profiles')
        .insert({
          id: userId,
          email: email,
          ...updates,
        })
        .select()
        .single();

      if (createError) throw createError;
      return newProfile;
    }

    // Profile exists, update it
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      // If update fails because profile was deleted, try to create it
      if (error.code === 'PGRST116') {
        const { data: authUser } = await supabase.auth.getUser();
        const email = authUser?.user?.email || '';
        
        const { data: newProfile, error: createError } = await supabase
          .from('profiles')
          .insert({
            id: userId,
            email: email,
            ...updates,
          })
          .select()
          .single();

        if (createError) throw createError;
        return newProfile;
      }
      throw error;
    }
    
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

