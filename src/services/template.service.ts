import { supabase } from '../lib/supabase';

export interface PaktTemplate {
  id: string;
  user_id?: string; // null for global templates, user_id for personal templates
  name: string;
  description: string;
  category: string;
  icon?: string;
  color?: string;
  is_public: boolean;
  target_outcome: string;
  estimated_duration_days: number;
  milestones: Array<{
    name: string;
    notes: string;
    importance: number;
    days_offset: number; // Days from pakt start
  }>;
  created_at?: string;
  updated_at?: string;
}

export class TemplateService {
  /**
   * Get global/public templates
   */
  static async getPublicTemplates(): Promise<PaktTemplate[]> {
    // For now, return hardcoded templates
    // In production, these would come from a templates table
    return [
      {
        id: '1',
        name: 'Lose Weight',
        description: '12-week transformation program',
        category: 'fitness',
        icon: '💪',
        color: '#FF6A6A',
        is_public: true,
        target_outcome: 'Lose 20 pounds and improve fitness',
        estimated_duration_days: 84,
        milestones: [
          { name: 'Week 1-2: Establish routine', notes: 'Exercise 3x per week', importance: 3, days_offset: 14 },
          { name: 'Week 3-4: Increase intensity', notes: 'Add cardio sessions', importance: 4, days_offset: 28 },
          { name: 'Week 5-8: Build consistency', notes: 'Track meals daily', importance: 4, days_offset: 56 },
          { name: 'Week 9-12: Final push', notes: 'Reach target weight', importance: 5, days_offset: 84 },
        ],
      },
      {
        id: '2',
        name: 'Savings Challenge',
        description: 'Save $5,000 in 6 months',
        category: 'finance',
        icon: '💰',
        color: '#96E6B3',
        is_public: true,
        target_outcome: 'Save $5,000 for emergency fund',
        estimated_duration_days: 180,
        milestones: [
          { name: 'Month 1: Save $800', notes: 'Cut unnecessary expenses', importance: 4, days_offset: 30 },
          { name: 'Month 2: Save $800', notes: 'Find additional income', importance: 4, days_offset: 60 },
          { name: 'Month 3: Save $800', notes: 'Maintain momentum', importance: 4, days_offset: 90 },
          { name: 'Month 4-6: Final $2,600', notes: 'Reach $5,000 goal', importance: 5, days_offset: 180 },
        ],
      },
      {
        id: '3',
        name: 'Learn New Language',
        description: 'Become conversational in 6 months',
        category: 'education',
        icon: '📚',
        color: '#9163F2',
        is_public: true,
        target_outcome: 'Hold basic conversations confidently',
        estimated_duration_days: 180,
        milestones: [
          { name: 'Month 1: Learn basics', notes: 'Master 500 common words', importance: 4, days_offset: 30 },
          { name: 'Month 2-3: Grammar foundation', notes: 'Complete grammar course', importance: 4, days_offset: 90 },
          { name: 'Month 4-5: Practice speaking', notes: '30 min daily conversation', importance: 5, days_offset: 150 },
          { name: 'Month 6: Fluency test', notes: 'Pass B1 level exam', importance: 5, days_offset: 180 },
        ],
      },
      {
        id: '4',
        name: 'Relationship Goals',
        description: 'Strengthen relationships in 3 months',
        category: 'relationships',
        icon: '❤️',
        color: '#FF6A6A',
        is_public: true,
        target_outcome: 'Build deeper connections with loved ones',
        estimated_duration_days: 90,
        milestones: [
          { name: 'Week 1-2: Quality time', notes: 'Schedule weekly date nights', importance: 4, days_offset: 14 },
          { name: 'Week 3-6: Communication', notes: 'Practice active listening', importance: 5, days_offset: 42 },
          { name: 'Week 7-10: New experiences', notes: 'Try 3 new activities together', importance: 4, days_offset: 70 },
          { name: 'Week 11-12: Reflection', notes: 'Celebrate improvements', importance: 3, days_offset: 90 },
        ],
      },
    ];
  }

  /**
   * Get user's custom templates
   */
  static async getUserTemplates(userId: string): Promise<PaktTemplate[]> {
    // This would query a templates table
    // For now, return empty array
    return [];
  }

  /**
   * Create custom template from existing pakt
   */
  static async createTemplateFromPakt(
    userId: string,
    paktId: string,
    name: string,
    description: string,
    isPublic: boolean = false
  ): Promise<PaktTemplate | null> {
    // This would:
    // 1. Get the pakt data
    // 2. Get its milestones
    // 3. Create a template entry in templates table
    // 4. Return the template
    
    // For now, just log
    console.log('Template creation would happen here');
    return null;
  }

  /**
   * Apply template to create a new pakt
   */
  static prepareTemplateForPakt(template: PaktTemplate): Partial<any> {
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + template.estimated_duration_days);

    return {
      name: template.name,
      description: template.description,
      targetOutcome: template.target_outcome,
      deadline: endDate.toISOString(),
      category: template.category,
      milestones: template.milestones.map((m, index) => {
        const dueDate = new Date(startDate);
        dueDate.setDate(dueDate.getDate() + m.days_offset);
        
        return {
          id: `temp-${index}`,
          name: m.name,
          dueDate: dueDate.toISOString(),
          notes: m.notes,
          importance: m.importance,
          completed: false,
        };
      }),
    };
  }
}

