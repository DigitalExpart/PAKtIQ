import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Dumbbell, DollarSign, BookOpen, Heart, Users, Calendar, ArrowRight, X } from 'lucide-react';
import { PaktData } from '../../App';

type TemplateLibraryProps = {
  onUseTemplate: (template: Partial<PaktData>) => void;
  onBack: () => void;
};

type Template = {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: any;
  color: string;
  gradient: string;
  duration: string;
  milestones: Array<{ name: string; dueDate: string; notes: string }>;
};

export default function TemplateLibrary({ onUseTemplate, onBack }: TemplateLibraryProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);

  const templates: Template[] = [
    {
      id: '1',
      name: 'Lose Weight',
      description: '12-week transformation program',
      category: 'fitness',
      icon: Dumbbell,
      color: '#FF6A6A',
      gradient: 'from-[#FF6A6A] to-[#FF8A8A]',
      duration: '12 weeks',
      milestones: [
        { name: 'Week 1-2: Establish routine', dueDate: '', notes: 'Exercise 3x per week' },
        { name: 'Week 3-4: Increase intensity', dueDate: '', notes: 'Add cardio sessions' },
        { name: 'Week 5-8: Build consistency', dueDate: '', notes: 'Track meals daily' },
        { name: 'Week 9-12: Final push', dueDate: '', notes: 'Reach target weight' },
      ],
    },
    {
      id: '2',
      name: 'Savings Challenge',
      description: 'Save $5,000 in 6 months',
      category: 'finance',
      icon: DollarSign,
      color: '#96E6B3',
      gradient: 'from-[#96E6B3] to-[#B6F6D3]',
      duration: '6 months',
      milestones: [
        { name: 'Month 1: Save $800', dueDate: '', notes: 'Cut unnecessary expenses' },
        { name: 'Month 2: Save $900', dueDate: '', notes: 'Automate savings' },
        { name: 'Month 3-4: Save $1,600', dueDate: '', notes: 'Find additional income' },
        { name: 'Month 5-6: Reach $5,000', dueDate: '', notes: 'Final milestone' },
      ],
    },
    {
      id: '3',
      name: 'Read 30 Minutes Daily',
      description: 'Build a consistent reading habit',
      category: 'learning',
      icon: BookOpen,
      color: '#9163F2',
      gradient: 'from-[#9163F2] to-[#B183F2]',
      duration: '8 weeks',
      milestones: [
        { name: 'Week 1-2: Start with 15 min', dueDate: '', notes: 'Choose engaging books' },
        { name: 'Week 3-4: Increase to 20 min', dueDate: '', notes: 'Set reading time' },
        { name: 'Week 5-6: Reach 30 min daily', dueDate: '', notes: 'Build the habit' },
        { name: 'Week 7-8: Maintain consistency', dueDate: '', notes: 'Track books read' },
      ],
    },
    {
      id: '4',
      name: 'Daily Gratitude',
      description: 'Practice gratitude every day',
      category: 'wellness',
      icon: Heart,
      color: '#FFD88A',
      gradient: 'from-[#FFD88A] to-[#FFE8AA]',
      duration: '30 days',
      milestones: [
        { name: 'Days 1-7: Morning gratitude', dueDate: '', notes: 'Write 3 things daily' },
        { name: 'Days 8-14: Add evening reflection', dueDate: '', notes: 'Review the day' },
        { name: 'Days 15-21: Share gratitude', dueDate: '', notes: 'Express to others' },
        { name: 'Days 22-30: Full practice', dueDate: '', notes: 'Complete 30 days' },
      ],
    },
    {
      id: '5',
      name: 'Relationship Check-In',
      description: 'Weekly quality time with partner',
      category: 'relationships',
      icon: Users,
      color: '#FF6A6A',
      gradient: 'from-[#FF6A6A] to-[#FF8A8A]',
      duration: '12 weeks',
      milestones: [
        { name: 'Weeks 1-3: Date nights', dueDate: '', notes: 'Schedule weekly dates' },
        { name: 'Weeks 4-6: Deep conversations', dueDate: '', notes: 'Discuss goals & dreams' },
        { name: 'Weeks 7-9: Try new activities', dueDate: '', notes: 'Explore together' },
        { name: 'Weeks 10-12: Celebrate growth', dueDate: '', notes: 'Review progress' },
      ],
    },
    {
      id: '6',
      name: 'Productivity Booster',
      description: 'Master time management',
      category: 'productivity',
      icon: Calendar,
      color: '#96E6B3',
      gradient: 'from-[#96E6B3] to-[#B6F6D3]',
      duration: '6 weeks',
      milestones: [
        { name: 'Week 1: Time audit', dueDate: '', notes: 'Track how you spend time' },
        { name: 'Week 2: Eliminate distractions', dueDate: '', notes: 'Remove time wasters' },
        { name: 'Week 3-4: Deep work blocks', dueDate: '', notes: 'Schedule focus time' },
        { name: 'Week 5-6: Optimize routine', dueDate: '', notes: 'Perfect your system' },
      ],
    },
  ];

  const handleUseTemplate = (template: Template) => {
    onUseTemplate({
      name: template.name,
      description: template.description,
      category: template.category,
      milestones: template.milestones.map((m, i) => ({
        id: `${Date.now()}-${i}`,
        name: m.name,
        dueDate: '',
        notes: m.notes,
        importance: 3,
        completed: false,
      })),
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F4F4F6] to-[#E8E8EA]">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#3C2B63] to-[#9163F2] text-white p-6">
        <div className="container mx-auto max-w-md">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="p-2 bg-white/10 backdrop-blur rounded-full hover:bg-white/20 transition-all"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-3xl mb-1">Template Library</h1>
              <p className="text-sm opacity-80">Quick-start your goals</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto max-w-md px-6 py-6">
        <div className="grid grid-cols-1 gap-4">
          {templates.map((template, index) => {
            const Icon = template.icon;
            return (
              <motion.div
                key={template.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-3xl p-6 shadow-lg hover:shadow-xl transition-all cursor-pointer"
                onClick={() => setSelectedTemplate(template)}
              >
                <div className="flex items-start gap-4">
                  <div className={`bg-gradient-to-br ${template.gradient} p-4 rounded-2xl flex-shrink-0`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl text-[#3C2B63] mb-1">{template.name}</h3>
                    <p className="text-sm text-[#3C2B63]/70 mb-3">{template.description}</p>
                    <div className="flex items-center gap-4 text-sm text-[#3C2B63]/60">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{template.duration}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span>{template.milestones.length} milestones</span>
                      </div>
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-[#3C2B63]/30 flex-shrink-0" />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Template Preview Modal */}
      <AnimatePresence>
        {selectedTemplate && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center p-6 z-50"
            onClick={() => setSelectedTemplate(null)}
          >
            <motion.div
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '100%', opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-t-3xl sm:rounded-3xl p-6 max-w-md w-full max-h-[80vh] overflow-y-auto shadow-2xl"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-start gap-4">
                  <div className={`bg-gradient-to-br ${selectedTemplate.gradient} p-4 rounded-2xl`}>
                    {React.createElement(selectedTemplate.icon, { className: 'w-8 h-8 text-white' })}
                  </div>
                  <div>
                    <h3 className="text-2xl text-[#3C2B63] mb-1">{selectedTemplate.name}</h3>
                    <p className="text-sm text-[#3C2B63]/70">{selectedTemplate.description}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedTemplate(null)}
                  className="text-[#3C2B63]/50 hover:text-[#3C2B63] transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Info */}
              <div className="flex items-center gap-6 mb-6 text-sm text-[#3C2B63]/70">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>{selectedTemplate.duration}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="capitalize">{selectedTemplate.category}</span>
                </div>
              </div>

              {/* Milestones Preview */}
              <div className="mb-6">
                <h4 className="text-lg text-[#3C2B63] mb-3">Included Milestones</h4>
                <div className="space-y-2">
                  {selectedTemplate.milestones.map((milestone, index) => (
                    <div
                      key={index}
                      className="bg-[#F4F4F6] rounded-2xl p-4"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-gradient-to-br from-[#9163F2] to-[#3C2B63] text-white rounded-full flex items-center justify-center text-sm flex-shrink-0">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <div className="text-sm text-[#3C2B63] mb-1">{milestone.name}</div>
                          <div className="text-xs text-[#3C2B63]/60">{milestone.notes}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Reminder Suggestion */}
              <div className="bg-gradient-to-br from-[#9163F2]/10 to-[#3C2B63]/10 rounded-2xl p-4 mb-6 border border-[#9163F2]/20">
                <div className="text-sm text-[#3C2B63]/70 mb-1">✨ Suggested</div>
                <div className="text-sm text-[#3C2B63]">Daily reminders at 9:00 AM</div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => handleUseTemplate(selectedTemplate)}
                className="w-full bg-gradient-to-r from-[#9163F2] to-[#3C2B63] text-white py-4 rounded-2xl hover:shadow-xl transition-all flex items-center justify-center gap-2"
              >
                <span>Use This Template</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
