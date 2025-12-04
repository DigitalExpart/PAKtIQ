import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Check, Bell, Calendar, Clock } from 'lucide-react';
import type { PaktData, ReminderSettings } from '../../types';
import { useNotifications } from '../../hooks/useNotifications';

type ReminderSetupLiveProps = {
  currentPakt: Partial<PaktData>;
  onUpdate: (data: Partial<PaktData>) => void;
  onComplete: () => void;
  onBack: () => void;
};

export default function ReminderSetupLive({ currentPakt, onUpdate, onComplete, onBack }: ReminderSetupLiveProps) {
  const [frequency, setFrequency] = useState<'daily' | 'weekly' | 'custom'>(
    currentPakt.reminders?.frequency || 'daily'
  );
  const [time, setTime] = useState(currentPakt.reminders?.time || '09:00');
  const [selectedDays, setSelectedDays] = useState<string[]>(
    currentPakt.reminders?.days || []
  );
  const [enabled, setEnabled] = useState(true);
  const [loading, setLoading] = useState(false);

  const { permissionGranted, scheduleReminder, requestPermissions } = useNotifications();

  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const toggleDay = (day: string) => {
    if (selectedDays.includes(day)) {
      setSelectedDays(selectedDays.filter(d => d !== day));
    } else {
      setSelectedDays([...selectedDays, day]);
    }
  };

  const handleComplete = async () => {
    setLoading(true);
    try {
      // Update pakt with reminder settings
      const reminders: ReminderSettings = {
        frequency,
        time,
        days: frequency === 'custom' ? selectedDays : undefined,
      };
      onUpdate({ reminders });

      // Schedule notification if enabled
      if (enabled && currentPakt.name) {
        if (!permissionGranted) {
          await requestPermissions();
        }

        // Schedule the notification
        // Note: This will be linked to the pakt after it's created
        // The actual notification identifier will be saved in the database
        await scheduleReminder(
          currentPakt.name,
          frequency,
          time,
          '', // Will be filled with actual pakt ID after creation
          frequency === 'custom' ? selectedDays : undefined
        );

        console.log('Reminder scheduled successfully!');
      }

      onComplete();
    } catch (error) {
      console.error('Error setting up reminders:', error);
      alert('Failed to schedule reminder. You can set it up later in settings.');
      onComplete(); // Still proceed even if notification fails
    } finally {
      setLoading(false);
    }
  };

  const isValid = frequency === 'custom' ? selectedDays.length > 0 : true;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F4F4F6] to-[#E8E8EA] py-12 px-6">
      <div className="container mx-auto max-w-md">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-[#3C2B63]/70 mb-4 hover:text-[#3C2B63]"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>
          <h1 className="text-4xl text-[#3C2B63] mb-3">Set Reminders</h1>
          <p className="text-lg text-[#3C2B63]/70">Stay on track with smart notifications</p>
        </motion.div>

        {/* Pakt Name Display */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-r from-[#9163F2] to-[#3C2B63] text-white rounded-2xl p-4 mb-8"
        >
          <div className="text-sm opacity-80 mb-1">Your Pakt:</div>
          <div className="text-xl">{currentPakt.name}</div>
          <div className="text-sm opacity-80 mt-2">
            {currentPakt.milestones?.length || 0} milestones
          </div>
        </motion.div>

        {/* Enable/Disable Toggle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-5 mb-6"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bell className="w-6 h-6 text-[#9163F2]" />
              <div>
                <div className="text-base text-[#3C2B63]">Enable Reminders</div>
                <div className="text-sm text-[#3C2B63]/70">Get notified to check in on your progress</div>
              </div>
            </div>
            <button
              onClick={() => setEnabled(!enabled)}
              className={`w-14 h-8 rounded-full transition-colors ${
                enabled ? 'bg-[#9163F2]' : 'bg-gray-300'
              }`}
            >
              <div
                className={`w-6 h-6 bg-white rounded-full transition-transform ${
                  enabled ? 'translate-x-7' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </motion.div>

        {enabled && (
          <>
            {/* Frequency Selection */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mb-6"
            >
              <label className="block text-base text-[#3C2B63] mb-3">Frequency</label>
              <div className="grid grid-cols-3 gap-3">
                {['daily', 'weekly', 'custom'].map((freq) => (
                  <button
                    key={freq}
                    onClick={() => setFrequency(freq as any)}
                    className={`p-4 rounded-2xl text-center transition-all ${
                      frequency === freq
                        ? 'bg-[#9163F2] text-white shadow-lg scale-105'
                        : 'bg-white text-[#3C2B63] hover:bg-gray-50'
                    }`}
                  >
                    <Calendar className="w-6 h-6 mx-auto mb-2" />
                    <div className="text-sm capitalize">{freq}</div>
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Time Selection */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-6"
            >
              <label className="block text-base text-[#3C2B63] mb-3">Preferred Time</label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: 'Morning', time: '08:00', icon: '🌅' },
                  { label: 'Afternoon', time: '14:00', icon: '☀️' },
                  { label: 'Evening', time: '19:00', icon: '🌙' },
                ].map(({ label, time: t, icon }) => (
                  <button
                    key={t}
                    onClick={() => setTime(t)}
                    className={`p-4 rounded-2xl text-center transition-all ${
                      time === t
                        ? 'bg-[#9163F2] text-white shadow-lg scale-105'
                        : 'bg-white text-[#3C2B63] hover:bg-gray-50'
                    }`}
                  >
                    <div className="text-2xl mb-1">{icon}</div>
                    <div className="text-sm">{label}</div>
                    <div className="text-xs opacity-70 mt-1">{t}</div>
                  </button>
                ))}
              </div>

              <div className="mt-4 bg-white rounded-2xl p-4">
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-[#9163F2]" />
                  <input
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="flex-1 text-[#3C2B63] bg-transparent outline-none"
                  />
                </div>
              </div>
            </motion.div>

            {/* Custom Days Selection */}
            {frequency === 'custom' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                transition={{ delay: 0.3 }}
                className="mb-6"
              >
                <label className="block text-base text-[#3C2B63] mb-3">Select Days</label>
                <div className="grid grid-cols-7 gap-2">
                  {days.map((day) => (
                    <button
                      key={day}
                      onClick={() => toggleDay(day)}
                      className={`aspect-square rounded-xl text-sm transition-all ${
                        selectedDays.includes(day)
                          ? 'bg-[#9163F2] text-white shadow-lg scale-105'
                          : 'bg-white text-[#3C2B63] hover:bg-gray-50'
                      }`}
                    >
                      {day}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </>
        )}

        {/* Complete Button */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          onClick={handleComplete}
          disabled={!isValid || loading}
          className="w-full bg-gradient-to-r from-[#9163F2] to-[#3C2B63] text-white py-4 rounded-2xl flex items-center justify-center gap-3 hover:shadow-2xl hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <span className="text-lg">Complete Setup</span>
              <Check className="w-5 h-5" />
            </>
          )}
        </motion.button>

        {!permissionGranted && enabled && (
          <p className="text-sm text-[#3C2B63]/70 text-center mt-4">
            📱 You'll be asked to allow notifications
          </p>
        )}
      </div>
    </div>
  );
}

