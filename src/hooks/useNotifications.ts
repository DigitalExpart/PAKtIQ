import { useEffect, useState } from 'react';
import Constants from 'expo-constants';
import { supabase } from '../lib/supabase';
import { PushNotificationSenderService } from '../services/push-notification-sender.service';
import { NotificationService } from '../services/notification.service';
import { useAuth } from '../contexts/AuthContext';

// Check if running in Expo Go (push notifications don't work in Expo Go)
const isExpoGo = Constants.executionEnvironment === 'storeClient';

/**
 * Hook to listen for new notifications and send push notifications
 */
export function useNotifications() {
  const { user } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!user || isExpoGo) return;

    // Load initial unread count
    const loadUnreadCount = async () => {
      try {
        const count = await NotificationService.getUnreadCount(user.id);
        setUnreadCount(count);
      } catch (error) {
        console.error('Error loading unread count:', error);
      }
    };

    loadUnreadCount();

    // Subscribe to new notifications
    const channel = supabase
      .channel('notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user.id}`,
        },
        async (payload) => {
          console.log('New notification received:', payload.new);
          
          // Update unread count
          setUnreadCount((prev) => prev + 1);

          // Send push notification
          try {
            await PushNotificationSenderService.sendPushForDatabaseNotification(
              payload.new
            );
          } catch (error) {
            console.error('Error sending push notification:', error);
          }
        }
      )
      .subscribe();

    // Poll for new notifications every 30 seconds as backup
    const pollInterval = setInterval(async () => {
      try {
        const count = await NotificationService.getUnreadCount(user.id);
        setUnreadCount(count);
      } catch (error) {
        console.error('Error polling notifications:', error);
      }
    }, 30000);

    return () => {
      channel.unsubscribe();
      clearInterval(pollInterval);
    };
  }, [user]);

  return { unreadCount };
}
