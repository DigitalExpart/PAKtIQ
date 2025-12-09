import * as Notifications from 'expo-notifications';
import { HabitService, Habit, HabitSchedule } from './habit.service';
import { NotificationService } from './notification.service';
import { supabase } from '../lib/supabase';
import { Platform } from 'react-native';

// Configure notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export class HabitNotificationService {
  /**
   * Schedule daily habit reminder notifications
   * This should be called when a habit is created or updated
   */
  static async scheduleHabitNotifications(habitId: string): Promise<void> {
    try {
      // Cancel existing notifications for this habit
      await this.cancelHabitNotifications(habitId);

      // Get habit and schedules
      const habit = await HabitService.getHabit(habitId);
      if (!habit || !habit.enabled) return;

      const schedules = await HabitService.getHabitSchedules(habitId);
      if (schedules.length === 0) return;

      // Get user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Check if user has daily habit reminders enabled
      const { SettingsService } = await import('./settings.service');
      const prefs = await SettingsService.getNotificationPreferences(user.id);
      if (!prefs.daily_habit_reminders) {
        console.log('Daily habit reminders disabled by user');
        return;
      }

      const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

      // Schedule notifications for each day
      for (const schedule of schedules) {
        if (!schedule.enabled) continue;

        const [hours, minutes] = schedule.time.split(':');
        const hour = parseInt(hours);
        const minute = parseInt(minutes);
        const minutesStr = minutes.padStart(2, '0');

        // Calculate next occurrence of this day
        const now = new Date();
        const today = now.getDay(); // 0 = Sunday, 1 = Monday, etc.
        let daysUntil = schedule.day_of_week - today;

        // If the day has passed this week, schedule for next week
        if (daysUntil < 0) {
          daysUntil += 7;
        }

        // If it's today and time hasn't passed, schedule for today
        if (daysUntil === 0) {
          const scheduleTime = new Date(now);
          scheduleTime.setHours(hour, minute, 0, 0);
          if (scheduleTime <= now) {
            daysUntil = 7; // Schedule for next week
          }
        }

        // Calculate notification date
        const notificationDate = new Date(now);
        notificationDate.setDate(now.getDate() + daysUntil);
        notificationDate.setHours(hour, minute, 0, 0);

        // Format time for display
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour % 12 || 12;
        const timeString = `${displayHour}:${minutesStr} ${ampm}`;
        const dayName = DAY_NAMES[schedule.day_of_week];

        // Schedule recurring notification
        const notificationId = await Notifications.scheduleNotificationAsync({
          content: {
            title: `⏰ Time for "${habit.name}"`,
            body: `Don't forget to complete your daily habit "${habit.name}" scheduled for ${timeString}`,
            data: {
              habitId,
              habitName: habit.name,
              type: 'daily_habit_reminder',
              day: dayName,
              time: schedule.time,
            },
            sound: true,
            badge: 1,
          },
          trigger: {
            weekday: schedule.day_of_week + 1, // 1 = Sunday, 2 = Monday, etc. (expo uses 1-7)
            hour,
            minute: parseInt(minutesStr),
            repeats: true,
          },
        });

        // Also create a notification in the database for the feed
        await NotificationService.notifyDailyHabitReminder(
          user.id,
          habit.name,
          habitId,
          timeString
        );

        console.log(`Scheduled notification for ${dayName} at ${timeString} (ID: ${notificationId})`);
      }
    } catch (error) {
      console.error('Error scheduling habit notifications:', error);
    }
  }

  /**
   * Cancel all notifications for a habit
   */
  static async cancelHabitNotifications(habitId: string): Promise<void> {
    try {
      // Get all scheduled notifications
      const allNotifications = await Notifications.getAllScheduledNotificationsAsync();
      
      // Cancel notifications that match this habit
      for (const notification of allNotifications) {
        if (notification.content.data?.habitId === habitId) {
          await Notifications.cancelScheduledNotificationAsync(notification.identifier);
        }
      }
    } catch (error) {
      console.error('Error canceling habit notifications:', error);
    }
  }

  /**
   * Schedule notifications for all active habits
   * Call this on app startup or when user logs in
   */
  static async scheduleAllHabitNotifications(): Promise<void> {
    try {
      const habits = await HabitService.getHabits();
      
      for (const habit of habits) {
        await this.scheduleHabitNotifications(habit.id);
      }
    } catch (error) {
      console.error('Error scheduling all habit notifications:', error);
    }
  }

  /**
   * Send notification when habit is completed
   */
  static async notifyHabitCompleted(habitId: string, userId: string): Promise<void> {
    try {
      const habit = await HabitService.getHabit(habitId);
      if (!habit) return;

      // Create notification in feed
      await NotificationService.notifyDailyHabitCompleted(userId, habit.name, habitId);

      // Send push notification
      await Notifications.scheduleNotificationAsync({
        content: {
          title: `✅ "${habit.name}" Completed!`,
          body: `Great job! You've completed your daily habit today. Keep up the momentum! 💪`,
          data: {
            habitId,
            habitName: habit.name,
            type: 'daily_habit_completed',
          },
          sound: true,
        },
        trigger: null, // Show immediately
      });
    } catch (error) {
      console.error('Error notifying habit completion:', error);
    }
  }

  /**
   * Send notification when habit is missed
   */
  static async notifyHabitMissed(habitId: string, userId: string): Promise<void> {
    try {
      const habit = await HabitService.getHabit(habitId);
      if (!habit) return;

      // Create notification in feed
      await NotificationService.notifyDailyHabitMissed(userId, habit.name, habitId);

      // Send push notification
      await Notifications.scheduleNotificationAsync({
        content: {
          title: `⏰ "${habit.name}" Missed`,
          body: `You missed your daily habit today. Don't worry, you can get back on track tomorrow!`,
          data: {
            habitId,
            habitName: habit.name,
            type: 'daily_habit_missed',
          },
          sound: true,
        },
        trigger: null, // Show immediately
      });
    } catch (error) {
      console.error('Error notifying habit missed:', error);
    }
  }

  /**
   * Setup notification channels for Android
   */
  static async setupNotificationChannels(): Promise<void> {
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('daily_habits', {
        name: 'Daily Habits',
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#9163F2',
        sound: 'default',
        enableVibrate: true,
        showBadge: true,
      });
    }
  }
}
