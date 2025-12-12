import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, TrendingUp, Target, Calendar, Award, BarChart3 } from 'lucide-react';
import { useAnalytics } from '../../hooks/useAnalytics';
import type { Screen } from '../../types';

type InsightsOverviewLiveProps = {
  onBack: () => void;
  isDarkMode: boolean;
};

export default function InsightsOverviewLive({ onBack, isDarkMode }: InsightsOverviewLiveProps) {
  const { insights, loading } = useAnalytics();

  const bgGradient = isDarkMode 
    ? 'bg-gradient-to-br from-[#1a1625] via-[#2a1f3d] to-[#1a1625]'
    : 'bg-gradient-to-br from-[#9163F2] to-[#3C2B63]';
  
  const cardBg = isDarkMode ? 'bg-[#2a1f3d]' : 'bg-white';
  const textPrimary = isDarkMode ? 'text-white' : 'text-[#3C2B63]';
  const textSecondary = isDarkMode ? 'text-white/70' : 'text-[#3C2B63]/70';

  if (loading) {
    return (
      <div className={`min-h-screen ${bgGradient} flex items-center justify-center`}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-white border-t-transparent rounded-full"
        />
      </div>
    );
  }

  const completionRate = insights?.completionRate || 0;
  const milestonesDone = insights?.milestonesDone || 0;
  const dayStreak = insights?.dayStreak || 0;
  const badgesEarned = insights?.badgesEarned || 0;
  const weeklyActivity = insights?.weeklyActivity || [0, 0, 0, 0, 0, 0, 0];

  // Calculate max value for chart scaling
  const maxActivity = Math.max(...weeklyActivity, 1);

  return (
    <div className={`min-h-screen ${bgGradient} transition-colors`}>
      {/* Header */}
      <div className="px-6 pt-12 pb-6">
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={onBack}
          className="p-3 bg-white/10 backdrop-blur-lg rounded-full mb-6 hover:bg-white/20 transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-white" />
        </motion.button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h1 className="text-4xl text-white mb-2">Insights</h1>
          <p className="text-lg text-white/70">Your progress analytics</p>
        </motion.div>
      </div>

      {/* Stats Grid */}
      <div className="px-6 pb-6">
        <div className="grid grid-cols-2 gap-4 mb-6">
          {/* Completion Rate */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className={`${cardBg} rounded-3xl p-6 text-center`}
          >
            <div className="w-16 h-16 mx-auto mb-4 bg-[#9163F2]/20 rounded-full flex items-center justify-center">
              <TrendingUp className="w-8 h-8 text-[#9163F2]" />
            </div>
            <div className={`text-4xl ${textPrimary} mb-2`}>{completionRate}%</div>
            <div className={`text-sm ${textSecondary}`}>Completion Rate</div>
          </motion.div>

          {/* Milestones Done */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className={`${cardBg} rounded-3xl p-6 text-center`}
          >
            <div className="w-16 h-16 mx-auto mb-4 bg-[#FF6A6A]/20 rounded-full flex items-center justify-center">
              <Target className="w-8 h-8 text-[#FF6A6A]" />
            </div>
            <div className={`text-4xl ${textPrimary} mb-2`}>{milestonesDone}</div>
            <div className={`text-sm ${textSecondary}`}>Milestones Done</div>
          </motion.div>

          {/* Day Streak */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className={`${cardBg} rounded-3xl p-6 text-center`}
          >
            <div className="w-16 h-16 mx-auto mb-4 bg-[#96E6B3]/20 rounded-full flex items-center justify-center">
              <Calendar className="w-8 h-8 text-[#96E6B3]" />
            </div>
            <div className={`text-4xl ${textPrimary} mb-2`}>{dayStreak}</div>
            <div className={`text-sm ${textSecondary}`}>Day Streak</div>
          </motion.div>

          {/* Badges Earned */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className={`${cardBg} rounded-3xl p-6 text-center`}
          >
            <div className="w-16 h-16 mx-auto mb-4 bg-[#FFD88A]/20 rounded-full flex items-center justify-center">
              <Award className="w-8 h-8 text-[#FFD88A]" />
            </div>
            <div className={`text-4xl ${textPrimary} mb-2`}>{badgesEarned}</div>
            <div className={`text-sm ${textSecondary}`}>Badges Earned</div>
          </motion.div>
        </div>

        {/* Weekly Activity Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className={`${cardBg} rounded-3xl p-6`}
        >
          <div className="flex items-center gap-3 mb-6">
            <BarChart3 className={`w-6 h-6 ${textPrimary}`} />
            <h2 className={`text-xl ${textPrimary}`}>Weekly Activity</h2>
          </div>

          {/* Chart */}
          <div className="flex items-end justify-between gap-2 h-48">
            {weeklyActivity.map((count, index) => {
              const height = maxActivity > 0 ? (count / maxActivity) * 100 : 0;
              const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
              const today = new Date().getDay();
              const dayIndex = (today - 6 + index + 7) % 7;

              return (
                <div key={index} className="flex-1 flex flex-col items-center gap-2">
                  <motion.div
                    className="w-full bg-gradient-to-t from-[#9163F2] to-[#3C2B63] rounded-t-lg"
                    initial={{ height: 0 }}
                    animate={{ height: `${Math.max(height, 10)}%` }}
                    transition={{ delay: 0.7 + index * 0.1, duration: 0.5 }}
                    style={{ minHeight: '8px' }}
                  />
                  <div className={`text-xs ${textSecondary}`}>{dayNames[dayIndex]}</div>
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div className={`mt-6 text-center text-sm ${textSecondary}`}>
            Milestones completed per day
          </div>
        </motion.div>

        {/* Motivational Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-6 bg-gradient-to-r from-[#FFD88A]/20 to-[#96E6B3]/20 backdrop-blur-lg rounded-3xl p-6"
        >
          <div className="text-center">
            <div className="text-2xl mb-2">
              {completionRate >= 80 ? '🎉' : completionRate >= 50 ? '🚀' : '💪'}
            </div>
            <div className="text-white text-lg mb-1">
              {completionRate >= 80
                ? "You're crushing it!"
                : completionRate >= 50
                ? 'Keep up the great work!'
                : 'You got this!'}
            </div>
            <div className="text-white/70 text-sm">
              {dayStreak > 0
                ? `${dayStreak} day streak! Keep it going!`
                : 'Complete a milestone today to start your streak!'}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

