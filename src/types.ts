import type { Database } from './types/database';

// Screen navigation types
export type Screen = 
  | 'welcome'
  | 'auth'
  | 'onboarding'
  | 'categorySelection'
  | 'paktNaming'
  | 'milestoneBuilder'
  | 'reminderSetup'
  | 'dashboard'
  | 'achievements'
  | 'insights'
  | 'templates'
  | 'premium'
  | 'settings';

// Database table types
export type Profile = Database['public']['Tables']['profiles']['Row'];
export type Pakt = Database['public']['Tables']['pakts']['Row'];
export type Milestone = Database['public']['Tables']['milestones']['Row'];
export type Reminder = Database['public']['Tables']['reminders']['Row'];
export type Achievement = Database['public']['Tables']['achievements']['Row'];
export type ActivityLog = Database['public']['Tables']['activity_log']['Row'];

// Insert types (for creating new records)
export type PaktInsert = Database['public']['Tables']['pakts']['Insert'];
export type MilestoneInsert = Database['public']['Tables']['milestones']['Insert'];
export type ReminderInsert = Database['public']['Tables']['reminders']['Insert'];
export type AchievementInsert = Database['public']['Tables']['achievements']['Insert'];
export type ActivityLogInsert = Database['public']['Tables']['activity_log']['Insert'];

// Update types (for updating existing records)
export type PaktUpdate = Database['public']['Tables']['pakts']['Update'];
export type MilestoneUpdate = Database['public']['Tables']['milestones']['Update'];
export type ReminderUpdate = Database['public']['Tables']['reminders']['Update'];
export type ProfileUpdate = Database['public']['Tables']['profiles']['Update'];

// Legacy types for backward compatibility with existing components
export type PaktData = {
  name: string;
  description: string;
  targetOutcome: string;
  deadline: string;
  category: string;
  milestones: LegacyMilestone[];
  reminders: ReminderSettings;
};

export type LegacyMilestone = {
  id: string;
  name: string;
  dueDate: string;
  notes: string;
  importance: number;
  completed: boolean;
};

export type ReminderSettings = {
  frequency: 'daily' | 'weekly' | 'custom';
  time: string;
  days?: string[];
};

// Category types
export type PaktCategory = 
  | 'health'
  | 'fitness'
  | 'career'
  | 'education'
  | 'finance'
  | 'relationships'
  | 'personal'
  | 'hobbies'
  | 'other';

// Status types
export type PaktStatus = 'active' | 'completed' | 'archived';

// Statistics types
export type PaktStats = {
  total: number;
  active: number;
  completed: number;
  archived: number;
  averageProgress: number;
};

export type MilestoneStats = {
  total: number;
  completed: number;
  pending: number;
  completionRate: number;
};

// User context types
export type UserContextType = {
  user: Profile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, fullName?: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (updates: ProfileUpdate) => Promise<void>;
};

