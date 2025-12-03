export interface MilestoneSuggestion {
  title: string;
  description: string;
  suggestedWeek: number; // Week number from start
  category: string;
}

export const milestoneSuggestions: Record<string, MilestoneSuggestion[]> = {
  health: [
    {
      title: 'Initial Health Assessment',
      description: 'Get baseline measurements and consult with healthcare provider',
      suggestedWeek: 1,
      category: 'health'
    },
    {
      title: 'Create Workout Routine',
      description: 'Design a sustainable exercise plan that fits your schedule',
      suggestedWeek: 1,
      category: 'health'
    },
    {
      title: 'First 2 Weeks Consistency',
      description: 'Complete 2 weeks of regular exercise without missing a day',
      suggestedWeek: 2,
      category: 'health'
    },
    {
      title: 'Nutrition Plan Setup',
      description: 'Meet with nutritionist or create meal plan',
      suggestedWeek: 3,
      category: 'health'
    },
    {
      title: 'First Month Milestone',
      description: 'Review progress and adjust goals if needed',
      suggestedWeek: 4,
      category: 'health'
    },
    {
      title: 'Build Exercise Habit',
      description: 'Complete 8 weeks of consistent training',
      suggestedWeek: 8,
      category: 'health'
    },
    {
      title: 'Mid-Point Assessment',
      description: 'Measure progress and celebrate achievements',
      suggestedWeek: 12,
      category: 'health'
    },
    {
      title: 'Advanced Goals',
      description: 'Increase intensity or add new challenges',
      suggestedWeek: 16,
      category: 'health'
    }
  ],
  finance: [
    {
      title: 'Financial Audit',
      description: 'Review all income, expenses, debts, and assets',
      suggestedWeek: 1,
      category: 'finance'
    },
    {
      title: 'Create Budget',
      description: 'Set up monthly budget and tracking system',
      suggestedWeek: 1,
      category: 'finance'
    },
    {
      title: 'Emergency Fund Start',
      description: 'Save first $500 for emergency fund',
      suggestedWeek: 4,
      category: 'finance'
    },
    {
      title: 'Debt Reduction Plan',
      description: 'Create strategy to pay down high-interest debt',
      suggestedWeek: 2,
      category: 'finance'
    },
    {
      title: 'First Quarter Review',
      description: 'Analyze spending patterns and adjust budget',
      suggestedWeek: 12,
      category: 'finance'
    },
    {
      title: 'Investment Research',
      description: 'Learn about investment options and start planning',
      suggestedWeek: 8,
      category: 'finance'
    },
    {
      title: 'Savings Goal 25%',
      description: 'Reach 25% of annual savings target',
      suggestedWeek: 12,
      category: 'finance'
    },
    {
      title: 'Mid-Year Financial Check',
      description: 'Review progress and adjust goals',
      suggestedWeek: 26,
      category: 'finance'
    }
  ],
  career: [
    {
      title: 'Define Career Goals',
      description: 'Clarify short-term and long-term career objectives',
      suggestedWeek: 1,
      category: 'career'
    },
    {
      title: 'Skills Assessment',
      description: 'Identify skills to develop and gaps to fill',
      suggestedWeek: 2,
      category: 'career'
    },
    {
      title: 'First Course/Training',
      description: 'Enroll in and complete first professional development course',
      suggestedWeek: 4,
      category: 'career'
    },
    {
      title: 'Network Expansion',
      description: 'Attend 2 networking events or connect with 10 professionals',
      suggestedWeek: 8,
      category: 'career'
    },
    {
      title: 'Portfolio/Resume Update',
      description: 'Update professional materials with recent achievements',
      suggestedWeek: 12,
      category: 'career'
    },
    {
      title: 'Mentor Connection',
      description: 'Find and establish relationship with a mentor',
      suggestedWeek: 6,
      category: 'career'
    },
    {
      title: 'Major Project Completion',
      description: 'Complete significant work project or personal portfolio piece',
      suggestedWeek: 16,
      category: 'career'
    },
    {
      title: 'Performance Review Prep',
      description: 'Document achievements and prepare for advancement discussion',
      suggestedWeek: 24,
      category: 'career'
    }
  ],
  personal: [
    {
      title: 'Set Personal Vision',
      description: 'Define what personal growth means to you',
      suggestedWeek: 1,
      category: 'personal'
    },
    {
      title: 'Daily Routine Established',
      description: 'Create and maintain a consistent daily routine',
      suggestedWeek: 3,
      category: 'personal'
    },
    {
      title: 'First Habit Formed',
      description: 'Successfully integrate one new positive habit',
      suggestedWeek: 4,
      category: 'personal'
    },
    {
      title: 'Self-Reflection Practice',
      description: 'Complete 30 days of journaling or meditation',
      suggestedWeek: 5,
      category: 'personal'
    },
    {
      title: 'Read First Book',
      description: 'Complete first book on personal development',
      suggestedWeek: 6,
      category: 'personal'
    },
    {
      title: 'Comfort Zone Challenge',
      description: 'Try 3 new experiences outside comfort zone',
      suggestedWeek: 8,
      category: 'personal'
    },
    {
      title: 'Personal Project Launch',
      description: 'Start passion project or creative endeavor',
      suggestedWeek: 12,
      category: 'personal'
    },
    {
      title: 'Growth Assessment',
      description: 'Reflect on changes and set new challenges',
      suggestedWeek: 20,
      category: 'personal'
    }
  ],
  education: [
    {
      title: 'Learning Goals Defined',
      description: 'Identify specific skills or subjects to master',
      suggestedWeek: 1,
      category: 'education'
    },
    {
      title: 'Course Enrollment',
      description: 'Enroll in first course or program',
      suggestedWeek: 1,
      category: 'education'
    },
    {
      title: 'Study Schedule Created',
      description: 'Establish consistent study routine',
      suggestedWeek: 2,
      category: 'education'
    },
    {
      title: 'First Module Complete',
      description: 'Finish first section or chapter',
      suggestedWeek: 4,
      category: 'education'
    },
    {
      title: 'Mid-Course Check',
      description: 'Review understanding and progress',
      suggestedWeek: 8,
      category: 'education'
    },
    {
      title: 'Practice Project',
      description: 'Apply learning to real-world project',
      suggestedWeek: 12,
      category: 'education'
    },
    {
      title: 'Course Completion',
      description: 'Finish primary learning material',
      suggestedWeek: 16,
      category: 'education'
    },
    {
      title: 'Certification/Assessment',
      description: 'Pass final exam or earn certificate',
      suggestedWeek: 20,
      category: 'education'
    }
  ],
  relationships: [
    {
      title: 'Communication Goals Set',
      description: 'Define how to improve relationship communication',
      suggestedWeek: 1,
      category: 'relationships'
    },
    {
      title: 'Quality Time Plan',
      description: 'Schedule regular quality time with loved ones',
      suggestedWeek: 2,
      category: 'relationships'
    },
    {
      title: 'First Monthly Gathering',
      description: 'Host or organize social event with friends/family',
      suggestedWeek: 4,
      category: 'relationships'
    },
    {
      title: 'Reconnect with Old Friends',
      description: 'Reach out to 5 people you\'ve lost touch with',
      suggestedWeek: 6,
      category: 'relationships'
    },
    {
      title: 'Relationship Check-in',
      description: 'Have meaningful conversation about relationship health',
      suggestedWeek: 8,
      category: 'relationships'
    },
    {
      title: 'New Social Circle',
      description: 'Join group or community to meet new people',
      suggestedWeek: 10,
      category: 'relationships'
    },
    {
      title: 'Gratitude Practice',
      description: 'Express appreciation to important people consistently',
      suggestedWeek: 12,
      category: 'relationships'
    },
    {
      title: 'Special Celebration',
      description: 'Plan meaningful celebration or trip with loved ones',
      suggestedWeek: 24,
      category: 'relationships'
    }
  ],
  other: [
    {
      title: 'Goal Clarification',
      description: 'Define specific, measurable objectives',
      suggestedWeek: 1,
      category: 'other'
    },
    {
      title: 'Action Plan Created',
      description: 'Break down goal into actionable steps',
      suggestedWeek: 1,
      category: 'other'
    },
    {
      title: 'First Week Success',
      description: 'Complete first week of consistent action',
      suggestedWeek: 1,
      category: 'other'
    },
    {
      title: 'First Month Milestone',
      description: 'Achieve initial progress marker',
      suggestedWeek: 4,
      category: 'other'
    },
    {
      title: 'Quarter Check-in',
      description: 'Review progress and adjust approach',
      suggestedWeek: 12,
      category: 'other'
    },
    {
      title: 'Halfway Point',
      description: 'Reach 50% of goal completion',
      suggestedWeek: 26,
      category: 'other'
    },
    {
      title: 'Final Push',
      description: 'Increase effort for completion',
      suggestedWeek: 44,
      category: 'other'
    },
    {
      title: 'Goal Achievement',
      description: 'Complete final steps and celebrate',
      suggestedWeek: 52,
      category: 'other'
    }
  ]
};

export function getMilestoneSuggestions(category: string): MilestoneSuggestion[] {
  return milestoneSuggestions[category] || milestoneSuggestions.other;
}

export function calculateMilestoneDate(resolutionCreatedAt: string, targetDate: string, suggestedWeek: number): string {
  const startDate = new Date(resolutionCreatedAt);
  const endDate = new Date(targetDate);
  const totalTime = endDate.getTime() - startDate.getTime();
  const totalWeeks = totalTime / (1000 * 60 * 60 * 24 * 7);
  
  // If suggested week is beyond target, adjust proportionally
  const adjustedWeek = Math.min(suggestedWeek, totalWeeks * 0.9);
  
  const milestoneDate = new Date(startDate);
  milestoneDate.setDate(milestoneDate.getDate() + (adjustedWeek * 7));
  
  return milestoneDate.toISOString();
}
