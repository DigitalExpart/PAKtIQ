import { supabase } from '../lib/supabase';
import * as Notifications from 'expo-notifications';

/**
 * Service to send push notifications via Expo Push Notification service
 * This integrates with the database notifications to send actual push notifications
 */
export class PushNotificationSenderService {
  /**
   * Send push notification to a user's device
   */
  static async sendPushNotification(
    pushToken: string,
    title: string,
    body: string,
    data?: any
  ): Promise<void> {
    try {
      // Send via Expo Push Notification API
      const message = {
        to: pushToken,
        sound: 'default',
        title,
        body,
        data: data || {},
        badge: 1,
        priority: 'high',
        channelId: 'default', // Android channel
      };

      const response = await fetch('https://exp.host/--/api/v2/push/send', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Accept-Encoding': 'gzip, deflate',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(message),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Failed to send push notification: ${error}`);
      }

      const result = await response.json();
      console.log('Push notification sent:', result);
    } catch (error) {
      console.error('Error sending push notification:', error);
      throw error;
    }
  }

  /**
   * Send push notification to user by user_id
   */
  static async sendPushNotificationToUser(
    userId: string,
    title: string,
    body: string,
    data?: any
  ): Promise<void> {
    try {
      // Get user's push token
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('push_token')
        .eq('id', userId)
        .single();

      if (error) throw error;

      if (!profile?.push_token) {
        console.warn(`User ${userId} does not have a push token registered`);
        return;
      }

      await this.sendPushNotification(profile.push_token, title, body, data);
    } catch (error) {
      console.error('Error sending push notification to user:', error);
      throw error;
    }
  }

  /**
   * Send push notification when a database notification is created
   * This is called from the app when it detects a new notification
   */
  static async sendPushForDatabaseNotification(notification: any): Promise<void> {
    try {
      if (!notification.user_id) return;

      await this.sendPushNotificationToUser(
        notification.user_id,
        notification.title,
        notification.message,
        {
          type: notification.type,
          notification_id: notification.id,
          pakt_id: notification.metadata?.pakt_id,
          milestone_id: notification.metadata?.milestone_id,
          ...notification.metadata,
        }
      );
    } catch (error) {
      console.error('Error sending push for database notification:', error);
      // Don't throw - we don't want to break notification creation
    }
  }
}
