import { useEffect, useState } from 'react';
import { NotificationService } from '../services/notification.service';
import * as Notifications from 'expo-notifications';

export function useNotifications() {
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [pushToken, setPushToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initializeNotifications();
  }, []);

  const initializeNotifications = async () => {
    try {
      setLoading(true);
      
      // Request permissions
      const granted = await NotificationService.requestPermissions();
      setPermissionGranted(granted);

      if (granted) {
        // Get push token
        const token = await NotificationService.getPushToken();
        setPushToken(token);
      }
    } catch (error) {
      console.error('Error initializing notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const scheduleReminder = async (
    paktName: string,
    frequency: 'daily' | 'weekly' | 'custom',
    time: string,
    paktId: string,
    days?: string[]
  ): Promise<string | string[] | null> => {
    if (!permissionGranted) {
      const granted = await NotificationService.requestPermissions();
      if (!granted) {
        alert('Please enable notifications to set reminders');
        return null;
      }
    }

    try {
      if (frequency === 'daily') {
        return await NotificationService.scheduleDailyReminder(paktName, time, paktId);
      } else if (frequency === 'weekly') {
        // Default to Monday if no days specified
        return await NotificationService.scheduleWeeklyReminder(paktName, time, 2, paktId);
      } else if (frequency === 'custom' && days && days.length > 0) {
        return await NotificationService.scheduleCustomReminders(
          paktName,
          time,
          days,
          paktId
        );
      }
      return null;
    } catch (error) {
      console.error('Error scheduling reminder:', error);
      throw error;
    }
  };

  const cancelReminder = async (identifier: string | string[]) => {
    try {
      if (Array.isArray(identifier)) {
        for (const id of identifier) {
          await NotificationService.cancelNotification(id);
        }
      } else {
        await NotificationService.cancelNotification(identifier);
      }
    } catch (error) {
      console.error('Error canceling reminder:', error);
      throw error;
    }
  };

  const sendMilestoneNotification = async (milestoneName: string, paktName: string) => {
    if (permissionGranted) {
      await NotificationService.sendMilestoneCompletionNotification(
        milestoneName,
        paktName
      );
    }
  };

  const sendPaktCompletionNotification = async (paktName: string) => {
    if (permissionGranted) {
      await NotificationService.sendPaktCompletionNotification(paktName);
    }
  };

  return {
    permissionGranted,
    pushToken,
    loading,
    scheduleReminder,
    cancelReminder,
    sendMilestoneNotification,
    sendPaktCompletionNotification,
    requestPermissions: initializeNotifications,
  };
}

