import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import Constants from 'expo-constants';

// Configure how notifications are handled when app is foregrounded
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export class NotificationService {
  /**
   * Request notification permissions from user
   */
  static async requestPermissions(): Promise<boolean> {
    if (!Device.isDevice) {
      console.log('Must use physical device for push notifications');
      return false;
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      console.log('Failed to get push notification permission');
      return false;
    }

    return true;
  }

  /**
   * Get push notification token
   */
  static async getPushToken(): Promise<string | null> {
    try {
      const projectId = Constants.expoConfig?.extra?.eas?.projectId;
      
      if (!projectId) {
        console.warn('Project ID not found for push notifications');
      }

      const token = await Notifications.getExpoPushTokenAsync({
        projectId,
      });

      return token.data;
    } catch (error) {
      console.error('Error getting push token:', error);
      return null;
    }
  }

  /**
   * Schedule a daily reminder notification
   */
  static async scheduleDailyReminder(
    paktName: string,
    time: string, // Format: "HH:MM"
    paktId: string
  ): Promise<string> {
    const [hours, minutes] = time.split(':').map(Number);

    const trigger: Notifications.DailyTriggerInput = {
      hour: hours,
      minute: minutes,
      repeats: true,
    };

    const identifier = await Notifications.scheduleNotificationAsync({
      content: {
        title: '🎯 Pakt Reminder',
        body: `Time to work on: ${paktName}`,
        data: { paktId, type: 'daily_reminder' },
        sound: true,
      },
      trigger,
    });

    return identifier;
  }

  /**
   * Schedule a weekly reminder notification
   */
  static async scheduleWeeklyReminder(
    paktName: string,
    time: string,
    weekday: number, // 1=Sunday, 2=Monday, etc.
    paktId: string
  ): Promise<string> {
    const [hours, minutes] = time.split(':').map(Number);

    const trigger: Notifications.WeeklyTriggerInput = {
      weekday,
      hour: hours,
      minute: minutes,
      repeats: true,
    };

    const identifier = await Notifications.scheduleNotificationAsync({
      content: {
        title: '🎯 Pakt Reminder',
        body: `Time to work on: ${paktName}`,
        data: { paktId, type: 'weekly_reminder' },
        sound: true,
      },
      trigger,
    });

    return identifier;
  }

  /**
   * Schedule custom reminders for specific days
   */
  static async scheduleCustomReminders(
    paktName: string,
    time: string,
    days: string[], // ['Mon', 'Tue', etc.]
    paktId: string
  ): Promise<string[]> {
    const dayMap: Record<string, number> = {
      Sun: 1,
      Mon: 2,
      Tue: 3,
      Wed: 4,
      Thu: 5,
      Fri: 6,
      Sat: 7,
    };

    const identifiers: string[] = [];

    for (const day of days) {
      const weekday = dayMap[day];
      if (weekday) {
        const identifier = await this.scheduleWeeklyReminder(
          paktName,
          time,
          weekday,
          paktId
        );
        identifiers.push(identifier);
      }
    }

    return identifiers;
  }

  /**
   * Cancel specific notification
   */
  static async cancelNotification(identifier: string): Promise<void> {
    await Notifications.cancelScheduledNotificationAsync(identifier);
  }

  /**
   * Cancel all scheduled notifications
   */
  static async cancelAllNotifications(): Promise<void> {
    await Notifications.cancelAllScheduledNotificationsAsync();
  }

  /**
   * Get all scheduled notifications
   */
  static async getAllScheduledNotifications() {
    return await Notifications.getAllScheduledNotificationsAsync();
  }

  /**
   * Send immediate notification (for testing or milestones)
   */
  static async sendImmediateNotification(
    title: string,
    body: string,
    data?: any
  ): Promise<string> {
    return await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data,
        sound: true,
      },
      trigger: null, // Send immediately
    });
  }

  /**
   * Send milestone completion celebration
   */
  static async sendMilestoneCompletionNotification(
    milestoneName: string,
    paktName: string
  ): Promise<void> {
    await this.sendImmediateNotification(
      '🎉 Milestone Completed!',
      `Great job completing "${milestoneName}" in ${paktName}!`,
      { type: 'milestone_complete' }
    );
  }

  /**
   * Send pakt completion celebration
   */
  static async sendPaktCompletionNotification(paktName: string): Promise<void> {
    await this.sendImmediateNotification(
      '🏆 Pakt Completed!',
      `Congratulations! You completed "${paktName}"!`,
      { type: 'pakt_complete' }
    );
  }

  /**
   * Initialize notification listeners
   */
  static setupNotificationListeners(
    onNotificationReceived?: (notification: Notifications.Notification) => void,
    onNotificationResponse?: (response: Notifications.NotificationResponse) => void
  ) {
    // Handle notification received while app is foregrounded
    const receivedSubscription = Notifications.addNotificationReceivedListener(
      (notification) => {
        console.log('Notification received:', notification);
        onNotificationReceived?.(notification);
      }
    );

    // Handle user interaction with notification
    const responseSubscription =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log('Notification response:', response);
        onNotificationResponse?.(response);
      });

    return {
      receivedSubscription,
      responseSubscription,
      remove: () => {
        receivedSubscription.remove();
        responseSubscription.remove();
      },
    };
  }
}

