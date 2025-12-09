-- Create function to send push notification when a notification is created
-- This requires Expo Push Notification service integration
-- For now, this creates the notification in the database
-- The app will poll or use real-time subscriptions to fetch new notifications

-- Function to trigger push notification (called after notification is created)
CREATE OR REPLACE FUNCTION trigger_push_notification()
RETURNS TRIGGER AS $$
DECLARE
  user_push_token TEXT;
BEGIN
  -- Get user's push token
  SELECT push_token INTO user_push_token
  FROM profiles
  WHERE id = NEW.user_id;

  -- If user has push token, we would send push notification here
  -- This would typically call an external service (Expo Push API)
  -- For now, the notification is stored and the app will fetch it
  
  -- In production, you would:
  -- 1. Call Expo Push API with the token and notification data
  -- 2. Or use Supabase Edge Function to send push notifications
  -- 3. Or use a service like OneSignal, Firebase Cloud Messaging, etc.

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to call push notification function
DROP TRIGGER IF EXISTS send_push_on_notification ON public.notifications;
CREATE TRIGGER send_push_on_notification
  AFTER INSERT ON public.notifications
  FOR EACH ROW
  EXECUTE FUNCTION trigger_push_notification();

-- Note: For actual push notifications, you'll need to:
-- 1. Set up Expo Push Notification service
-- 2. Create a Supabase Edge Function or external service to send push notifications
-- 3. Call that service from the trigger or from your app when notifications are created
