import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Trophy, Star, Flame, Target, TrendingUp, Award, Lock, Share2, X } from 'lucide-react';

type AchievementBoardProps = {
  onBack: () => void;
  isDarkMode: boolean;
};

type Badge = {
  id: string;
  name: string;
  description: string;
  icon: any;
  color: string;
  gradient: string;
  earned: boolean;
  earnedDate?: string;
  requirement: string;
  category: string;
};

export default function AchievementBoard({ onBack, isDarkMode }: AchievementBoardProps) {
  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);

  const badges: Badge[] = [
    {
      id: '1',
      name: 'First Step',
      description: 'Created your first Pakt',
      icon: Target,
      color: '#9163F2',
      gradient: 'from-[#9163F2] to-[#3C2B63]',
      earned: true,
      earnedDate: '2025-01-15',
      requirement: 'Create 1 Pakt',
      category: 'Consistency',
    },
    {
      id: '2',
      name: 'Week Warrior',
      description: '7-day streak achieved',
      icon: Flame,
      color: '#FF6A6A',
      gradient: 'from-[#FF6A6A] to-[#FF8A8A]',
      earned: true,
      earnedDate: '2025-01-20',
      requirement: 'Maintain 7-day streak',
      category: 'Consistency',
    },
    {
      id: '3',
      name: 'Milestone Master',
      description: 'Completed 10 milestones',
      icon: Trophy,
      color: '#FFD88A',
      gradient: 'from-[#FFD88A] to-[#FFE8AA]',
      earned: true,
      earnedDate: '2025-01-25',
      requirement: 'Complete 10 milestones',
      category: 'Achievement',
    },
    {
      id: '4',
      name: 'Fitness Achiever',
      description: 'Complete a fitness Pakt',
      icon: TrendingUp,
      color: '#96E6B3',
      gradient: 'from-[#96E6B3] to-[#B6F6D3]',
      earned: false,
      requirement: 'Complete 1 fitness Pakt',
      category: 'Fitness Achiever',
    },
    {
      id: '5',
      name: 'Consistency King',
      description: '30-day streak achieved',
      icon: Star,
      color: '#FFD88A',
      gradient: 'from-[#FFD88A] to-[#FFE8AA]',
      earned: false,
      requirement: 'Maintain 30-day streak',
      category: 'Consistency',
    },
    {
      id: '6',
      name: 'Finance Warrior',
      description: 'Complete a finance Pakt',
      icon: Award,
      color: '#96E6B3',
      gradient: 'from-[#96E6B3] to-[#B6F6D3]',
      earned: false,
      requirement: 'Complete 1 finance Pakt',
      category: 'Finance Warrior',
    },
  ];

  const earnedBadges = badges.filter(b => b.earned);
  const lockedBadges = badges.filter(b => !b.earned);

  const bgColor = isDarkMode ? 'bg-[#1a1625]' : 'bg-[#F4F4F6]';
  const cardBg = isDarkMode ? 'bg-[#2a1f3d]' : 'bg-white';
  const textPrimary = isDarkMode ? 'text-white' : 'text-[#3C2B63]';
  const textSecondary = isDarkMode ? 'text-white/70' : 'text-[#3C2B63]/70';

  return (
    <div className={`min-h-screen ${bgColor}`}>
      {/* Header */}
      <div className="bg-gradient-to-r from-[#3C2B63] to-[#9163F2] text-white p-6">
        <div className="container mx-auto max-w-md">
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={onBack}
              className="p-2 bg-white/10 backdrop-blur rounded-full hover:bg-white/20 transition-all"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-3xl mb-1">Achievement Board</h1>
              <p className="text-sm opacity-80">
                {earnedBadges.length} of {badges.length} earned
              </p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="bg-white/10 backdrop-blur rounded-full h-3 overflow-hidden">
            <motion.div
              className="bg-gradient-to-r from-[#FFD88A] to-[#96E6B3] h-full"
              initial={{ width: 0 }}
              animate={{ width: `${(earnedBadges.length / badges.length) * 100}%` }}
              transition={{ duration: 1, delay: 0.5 }}
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto max-w-md px-6 py-6">
        {/* Earned Badges */}
        <div className="mb-8">
          <h2 className={`text-xl ${textPrimary} mb-4 flex items-center gap-2`}>
            <Trophy className="w-5 h-5 text-[#FFD88A]" />
            Earned Badges
          </h2>
          <div className="grid grid-cols-3 gap-4">
            {earnedBadges.map((badge, index) => {
              const Icon = badge.icon;
              return (
                <motion.button
                  key={badge.id}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1, type: 'spring' }}
                  onClick={() => setSelectedBadge(badge)}
                  className={`${cardBg} rounded-3xl p-6 shadow-lg hover:shadow-xl transition-all relative`}
                >
                  {/* Glow Effect */}
                  <div
                    className="absolute inset-0 rounded-3xl opacity-20 blur-xl"
                    style={{ backgroundColor: badge.color }}
                  />
                  
                  <div className="relative z-10">
                    <div
                      className={`bg-gradient-to-br ${badge.gradient} p-4 rounded-2xl mx-auto w-fit mb-3 shadow-lg`}
                    >
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <div className={`text-sm ${textPrimary} mb-1`}>{badge.name}</div>
                    <div className={`text-xs ${textSecondary}`}>
                      {new Date(badge.earnedDate!).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Locked Badges */}
        <div>
          <h2 className={`text-xl ${textPrimary} mb-4 flex items-center gap-2`}>
            <Lock className="w-5 h-5" />
            Locked Badges
          </h2>
          <div className="grid grid-cols-3 gap-4">
            {lockedBadges.map((badge, index) => {
              const Icon = badge.icon;
              return (
                <motion.button
                  key={badge.id}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: (earnedBadges.length + index) * 0.1, type: 'spring' }}
                  onClick={() => setSelectedBadge(badge)}
                  className={`${cardBg} rounded-3xl p-6 shadow-lg hover:shadow-xl transition-all opacity-60`}
                >
                  <div className="bg-gray-300 dark:bg-gray-700 p-4 rounded-2xl mx-auto w-fit mb-3">
                    <Icon className="w-8 h-8 text-gray-500" />
                  </div>
                  <div className={`text-sm ${textPrimary} mb-1`}>{badge.name}</div>
                  <div className={`text-xs ${textSecondary}`}>Locked</div>
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Badge Detail Modal */}
      <AnimatePresence>
        {selectedBadge && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-6 z-50"
            onClick={() => setSelectedBadge(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className={`${cardBg} rounded-3xl p-8 max-w-sm w-full shadow-2xl`}
            >
              <div className="flex justify-between items-start mb-6">
                <div className={`text-sm px-3 py-1 rounded-full ${isDarkMode ? 'bg-white/10' : 'bg-[#F4F4F6]'} ${textSecondary}`}>
                  {selectedBadge.category}
                </div>
                <button
                  onClick={() => setSelectedBadge(null)}
                  className={`${textSecondary} hover:${textPrimary} transition-colors`}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="text-center mb-6">
                <div
                  className={`bg-gradient-to-br ${selectedBadge.gradient} p-6 rounded-3xl mx-auto w-fit mb-4 shadow-xl`}
                >
                  {React.createElement(selectedBadge.icon, { className: 'w-16 h-16 text-white' })}
                </div>
                <h3 className={`text-2xl ${textPrimary} mb-2`}>{selectedBadge.name}</h3>
                <p className={`${textSecondary} mb-4`}>{selectedBadge.description}</p>
              </div>

              <div className={`${isDarkMode ? 'bg-white/10' : 'bg-[#F4F4F6]'} rounded-2xl p-4 mb-6`}>
                <div className={`text-sm ${textSecondary} mb-1`}>How to earn</div>
                <div className={`${textPrimary}`}>{selectedBadge.requirement}</div>
              </div>

              {selectedBadge.earned && (
                <>
                  <div className={`${isDarkMode ? 'bg-white/10' : 'bg-[#F4F4F6]'} rounded-2xl p-4 mb-6`}>
                    <div className={`text-sm ${textSecondary} mb-1`}>Earned on</div>
                    <div className={`${textPrimary}`}>
                      {new Date(selectedBadge.earnedDate!).toLocaleDateString('en-US', { 
                        month: 'long', 
                        day: 'numeric', 
                        year: 'numeric' 
                      })}
                    </div>
                  </div>

                  <button
                    className="w-full bg-gradient-to-r from-[#9163F2] to-[#3C2B63] text-white py-4 rounded-2xl hover:shadow-xl transition-all flex items-center justify-center gap-2"
                  >
                    <Share2 className="w-5 h-5" />
                    <span>Share Achievement</span>
                  </button>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
