import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useEffect, useRef } from 'react';
import * as Notifications from 'expo-notifications';
import { useRouter } from 'expo-router';
import { AuthProvider, useAuth } from '../src/contexts/AuthContext';
import { PaktCreationProvider } from '../src/contexts/PaktCreationContext';
import { ThemeProvider } from '../src/contexts/ThemeContext';
import { LanguageProvider } from '../src/contexts/LanguageContext';
import '../src/lib/i18n'; // Initialize i18n
import { PushNotificationService } from '../src/services/push-notification.service';
import { useNotifications } from '../src/hooks/useNotifications';

// Configure notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

function NotificationHandler() {
  const router = useRouter();
  const { user } = useAuth();
  const notificationListener = useRef<Notifications.Subscription | null>(null);
  const responseListener = useRef<Notifications.Subscription | null>(null);

  // Listen for new notifications and send push notifications
  useNotifications();

  // Schedule habit notifications when user is logged in
  useEffect(() => {
    if (user) {
      const setupHabitNotifications = async () => {
        try {
          const { HabitNotificationService } = await import('../src/services/habit-notification.service');
          await HabitNotificationService.setupNotificationChannels();
          await HabitNotificationService.scheduleAllHabitNotifications();
        } catch (error) {
          console.error('Error setting up habit notifications:', error);
        }
      };
      setupHabitNotifications();
    }
  }, [user]);

  useEffect(() => {
    // Listen for notifications received while app is foregrounded
    notificationListener.current = PushNotificationService.addNotificationReceivedListener(
      (notification) => {
        console.log('Push notification received:', notification);
      }
    );

    // Listen for user tapping on notification
    responseListener.current = PushNotificationService.addNotificationResponseReceivedListener(
      (response) => {
        const data = response.notification.request.content.data;
        console.log('Notification tapped:', data);

        // Navigate based on notification type
        if (data?.habitId) {
          router.push(`/habit-detail?id=${data.habitId}`);
        } else if (data?.pakt_id) {
          router.push(`/pakt-detail?id=${data.pakt_id}`);
        } else if (data?.type === 'pakt_created') {
          router.push('/dashboard');
        } else {
          router.push('/notifications-feed');
        }
      }
    );

    return () => {
      if (notificationListener.current) {
        notificationListener.current.remove();
      }
      if (responseListener.current) {
        responseListener.current.remove();
      }
    };
  }, [router]);

  return null;
}

function AppContent() {
  return (
    <PaktCreationProvider>
      <NotificationHandler />
      <Stack screenOptions={{ headerShown: false }} />
    </PaktCreationProvider>
  );
}

export default function Layout() {
  return (
    <SafeAreaProvider>
      <LanguageProvider>
        <ThemeProvider>
          <AuthProvider>
            <AppContent />
          </AuthProvider>
        </ThemeProvider>
      </LanguageProvider>
    </SafeAreaProvider>
  );
}

