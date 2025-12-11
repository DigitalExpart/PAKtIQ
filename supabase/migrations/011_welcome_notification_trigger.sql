-- Create function to send welcome notification when profile is created
CREATE OR REPLACE FUNCTION send_welcome_notification()
RETURNS TRIGGER AS $$
DECLARE
  user_name TEXT;
BEGIN
  -- Get user's name from profile or use email
  user_name := COALESCE(NEW.full_name, split_part(NEW.email, '@', 1));
  
  -- Create welcome notification
  INSERT INTO public.notifications (user_id, type, title, message, metadata)
  VALUES (
    NEW.id,
    'welcome',
    '🎉 Welcome to resolviq!',
    'Hi ' || user_name || '! Welcome to resolviq. We''re excited to help you achieve your goals. Start by creating your first Resolve and breaking it down into milestones. Let''s make this year your best one yet! 💪',
    jsonb_build_object('welcome', true, 'created_at', CURRENT_TIMESTAMP)
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to send welcome notification when profile is created
DROP TRIGGER IF EXISTS welcome_notification_on_profile_create ON public.profiles;
CREATE TRIGGER welcome_notification_on_profile_create
  AFTER INSERT ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION send_welcome_notification();

-- Grant execute permission
GRANT EXECUTE ON FUNCTION send_welcome_notification() TO authenticated;
