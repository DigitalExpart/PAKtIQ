export type Screen = 
  | 'welcome'
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

export type PaktData = {
  name: string;
  description: string;
  targetOutcome: string;
  deadline: string;
  category: string;
  milestones: Milestone[];
  reminders: ReminderSettings;
};

export type Milestone = {
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

