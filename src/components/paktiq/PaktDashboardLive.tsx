import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Target, Flame, Trophy, TrendingUp, CheckCircle2, Circle, Edit, Settings, Award, BarChart3, Library } from 'lucide-react';
import { usePakts, useMilestones, useAchievements, useAnalytics } from '../../hooks';
import { MilestoneService, ActivityService, AchievementService } from '../../services';
import { useAuth } from '../../contexts/AuthContext';
import type { Screen } from '../../types';
import { useNotifications } from '../../hooks/useNotifications';

type PaktDashboardLiveProps = {
  onNavigate: (screen: Screen) => void;
  isDarkMode: boolean;
};

export default function PaktDashboardLive({ onNavigate, isDarkMode }: PaktDashboardLiveProps) {
  const { user } = useAuth();
  const { pakts, loading: paktsLoading, refetch: refetchPakts } = usePakts();
  const { achievements } = useAchievements();
  const { analytics, loading: analyticsLoading } = useAnalytics();
  const [selectedPaktId, setSelectedPaktId] = useState<string | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const { sendMilestoneNotification, sendPaktCompletionNotification } = useNotifications();

  // Get milestones for selected pakt
  const { milestones, toggleMilestone, loading: milestonesLoading } = useMilestones(
    selectedPaktId || ''
  );

  const selectedPakt = pakts.find(p => p.id === selectedPaktId);

  useEffect(() => {
    if (pakts.length > 0 && !selectedPaktId) {
      setSelectedPaktId(pakts[0].id);
    }
  }, [pakts, selectedPaktId]);

  const handleCompleteMilestone = async (milestoneId: string, completed: boolean) => {
    if (!user || !selectedPakt) return;

    try {
      // Toggle milestone in backend
      await toggleMilestone(milestoneId, completed);

      // Show celebration
      if (completed) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 2000);

        // Send notification
        const milestone = milestones.find(m => m.id === milestoneId);
        if (milestone) {
          await sendMilestoneNotification(milestone.name, selectedPakt.name);
          
          // Log activity
          await ActivityService.logMilestoneCompleted(
            user.id,
            selectedPakt.id,
            milestoneId,
            milestone.name
          );

          // Check for achievements
          const totalCompleted = await MilestoneService.getUserMilestones(user.id);
          const completedCount = totalCompleted.filter(m => m.completed).length;
          await AchievementService.checkMilestoneAchievements(user.id, completedCount);
        }
      }

      // Refresh pakts to get updated progress
      await refetchPakts();

      // Check if pakt is now complete
      if (selectedPakt && selectedPakt.progress === 100) {
        await sendPaktCompletionNotification(selectedPakt.name);
      }
    } catch (error) {
      console.error('Error completing milestone:', error);
      alert('Failed to update milestone. Please try again.');
    }
  };

  // Calculate stats from real data
  const activePakts = pakts.filter(p => p.status === 'active');
  
  // Get real analytics data
  const completedToday = analytics?.milestones_completed_today || 0;
  const currentStreak = analytics?.current_streak || 0;

  const bgColor = isDarkMode ? 'bg-[#1a1625]' : 'bg-[#F4F4F6]';
  const cardBg = isDarkMode ? 'bg-[#2a1f3d]' : 'bg-white';
  const textPrimary = isDarkMode ? 'text-white' : 'text-[#3C2B63]';
  const textSecondary = isDarkMode ? 'text-white/70' : 'text-[#3C2B63]/70';

  if (paktsLoading || analyticsLoading) {
    return (
      <div className={`min-h-screen ${bgColor} flex items-center justify-center`}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-[#9163F2] border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (pakts.length === 0) {
    return (
      <div className={`min-h-screen ${bgColor} flex items-center justify-center px-6`}>
        <div className="text-center max-w-md">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="mb-6"
          >
            <Target className="w-24 h-24 mx-auto text-[#9163F2]" />
          </motion.div>
          <h2 className={`text-3xl ${textPrimary} mb-4`}>No Pakts Yet</h2>
          <p className={`text-lg ${textSecondary} mb-8`}>
            Create your first pakt to start your journey!
          </p>
          <button
            onClick={() => onNavigate('categorySelection')}
            className="bg-gradient-to-r from-[#9163F2] to-[#3C2B63] text-white px-8 py-4 rounded-2xl text-lg hover:scale-105 transition-transform"
          >
            Create First Pakt
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${bgColor} transition-colors pb-20`}>
      {/* Confetti Effect */}
      <AnimatePresence>
        {showConfetti && (
          <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
            {[...Array(30)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-3 h-3 rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: '-10%',
                  backgroundColor: ['#FF6A6A', '#96E6B3', '#9163F2', '#FFD88A'][i % 4],
                }}
                animate={{
                  y: ['0vh', '100vh'],
                  x: [0, (Math.random() - 0.5) * 200],
                  rotate: [0, 360],
                  opacity: [1, 0],
                }}
                transition={{ duration: 2, ease: 'easeOut' }}
              />
            ))}
          </div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="px-6 pt-12 pb-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className={`text-4xl ${textPrimary} mb-2`}>My Pakts</h1>
            <p className={`text-lg ${textSecondary}`}>
              {activePakts.length} active • {achievements.length} achievements
            </p>
          </div>
          <button
            onClick={() => onNavigate('settings')}
            className={`p-3 ${cardBg} rounded-2xl hover:scale-105 transition-transform`}
          >
            <Settings className={`w-6 h-6 ${textPrimary}`} />
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`${cardBg} rounded-2xl p-4 text-center`}
          >
            <Flame className="w-8 h-8 text-[#FF6A6A] mx-auto mb-2" />
            <div className={`text-2xl ${textPrimary} mb-1`}>{currentStreak}</div>
            <div className={`text-xs ${textSecondary}`}>Day Streak</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className={`${cardBg} rounded-2xl p-4 text-center`}
          >
            <Target className="w-8 h-8 text-[#9163F2] mx-auto mb-2" />
            <div className={`text-2xl ${textPrimary} mb-1`}>{activePakts.length}</div>
            <div className={`text-xs ${textSecondary}`}>Active Pakts</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className={`${cardBg} rounded-2xl p-4 text-center`}
          >
            <CheckCircle2 className="w-8 h-8 text-[#96E6B3] mx-auto mb-2" />
            <div className={`text-2xl ${textPrimary} mb-1`}>{completedToday}</div>
            <div className={`text-xs ${textSecondary}`}>Today</div>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-4 gap-3 mb-8">
          <button
            onClick={() => onNavigate('categorySelection')}
            className={`${cardBg} rounded-2xl p-4 flex flex-col items-center gap-2 hover:scale-105 transition-transform`}
          >
            <Plus className={`w-6 h-6 ${textPrimary}`} />
            <span className={`text-xs ${textSecondary}`}>New Pakt</span>
          </button>
          <button
            onClick={() => onNavigate('templates')}
            className={`${cardBg} rounded-2xl p-4 flex flex-col items-center gap-2 hover:scale-105 transition-transform`}
          >
            <Library className={`w-6 h-6 ${textPrimary}`} />
            <span className={`text-xs ${textSecondary}`}>Templates</span>
          </button>
          <button
            onClick={() => onNavigate('insights')}
            className={`${cardBg} rounded-2xl p-4 flex flex-col items-center gap-2 hover:scale-105 transition-transform`}
          >
            <BarChart3 className={`w-6 h-6 ${textPrimary}`} />
            <span className={`text-xs ${textSecondary}`}>Insights</span>
          </button>
          <button
            onClick={() => onNavigate('achievements')}
            className={`${cardBg} rounded-2xl p-4 flex flex-col items-center gap-2 hover:scale-105 transition-transform`}
          >
            <Award className={`w-6 h-6 ${textPrimary}`} />
            <span className={`text-xs ${textSecondary}`}>Awards</span>
          </button>
        </div>
      </div>

      {/* Active Pakts List */}
      <div className="px-6">
        <h2 className={`text-xl ${textPrimary} mb-4`}>Your Active Pakts</h2>
        <div className="space-y-4">
          {pakts.map((pakt, index) => (
            <motion.div
              key={pakt.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`${cardBg} rounded-3xl p-6 shadow-lg cursor-pointer`}
              onClick={() => setSelectedPaktId(pakt.id)}
            >
              {/* Pakt Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div
                    className="inline-block px-3 py-1 rounded-full text-xs mb-2 capitalize"
                    style={{
                      backgroundColor: `${['#FF6A6A', '#96E6B3', '#9163F2', '#FFD88A'][index % 4]}20`,
                      color: ['#FF6A6A', '#96E6B3', '#9163F2', '#FFD88A'][index % 4],
                    }}
                  >
                    {pakt.category}
                  </div>
                  <h3 className={`text-xl ${textPrimary} mb-2`}>{pakt.name}</h3>
                  <p className={`text-sm ${textSecondary}`}>{pakt.target_outcome}</p>
                </div>
              </div>

              {/* Progress */}
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="flex justify-between text-sm mb-2">
                    <span className={textSecondary}>Progress</span>
                    <span className={textPrimary}>{pakt.progress}%</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-[#9163F2] to-[#3C2B63]"
                      initial={{ width: 0 }}
                      animate={{ width: `${pakt.progress}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                </div>
                <div className={`text-2xl ${textPrimary}`}>{pakt.progress}%</div>
              </div>

              {/* Milestones Preview - Only show for selected pakt */}
              {selectedPaktId === pakt.id && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-4 pt-4 border-t border-gray-200"
                >
                  {milestonesLoading ? (
                    <div className="text-center py-4">Loading milestones...</div>
                  ) : (
                    <div className="space-y-2">
                      {milestones.map((milestone) => (
                        <div
                          key={milestone.id}
                          className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl"
                        >
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCompleteMilestone(milestone.id, !milestone.completed);
                            }}
                            className="flex-shrink-0"
                          >
                            {milestone.completed ? (
                              <CheckCircle2 className="w-6 h-6 text-[#96E6B3]" />
                            ) : (
                              <Circle className="w-6 h-6 text-gray-400" />
                            )}
                          </button>
                          <div className="flex-1">
                            <div className={`text-sm ${milestone.completed ? 'line-through text-gray-400' : textPrimary}`}>
                              {milestone.name}
                            </div>
                            {milestone.notes && (
                              <div className="text-xs text-gray-400 mt-1">{milestone.notes}</div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

