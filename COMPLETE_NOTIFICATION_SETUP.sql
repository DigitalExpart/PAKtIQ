-- ============================================
-- COMPLETE NOTIFICATION SETUP
-- Run this ENTIRE file in Supabase SQL Editor
-- This creates everything needed for notifications
-- ============================================

-- ============================================
-- STEP 1: Create notifications table
-- ============================================
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN (
        'password_changed',
        'pakt_created',
        'milestone_achieved',
        'milestone_missed',
        'milestone_upcoming',
        'pakt_completed',
        'achievement',
        'reminder',
        'streak_milestone',
        'welcome'
    )),
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    read BOOLEAN DEFAULT false,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON public.notifications(read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON public.notifications(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_type ON public.notifications(type);

-- Enable Row Level Security (RLS)
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for notifications
DROP POLICY IF EXISTS "Users can view their own notifications" ON public.notifications;
CREATE POLICY "Users can view their own notifications"
    ON public.notifications FOR SELECT
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own notifications" ON public.notifications;
CREATE POLICY "Users can update their own notifications"
    ON public.notifications FOR UPDATE
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own notifications" ON public.notifications;
CREATE POLICY "Users can insert their own notifications"
    ON public.notifications FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_notifications_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
DROP TRIGGER IF EXISTS update_notifications_updated_at ON public.notifications;
CREATE TRIGGER update_notifications_updated_at
    BEFORE UPDATE ON public.notifications
    FOR EACH ROW
    EXECUTE FUNCTION update_notifications_updated_at();

-- ============================================
-- STEP 2: Create notification functions
-- ============================================

-- Function to send reminder notifications
CREATE OR REPLACE FUNCTION send_reminder_notifications()
RETURNS void AS $$
DECLARE
  reminder_record RECORD;
  current_time_val TIME;
  current_day TEXT;
  should_send BOOLEAN;
  notification_title TEXT;
  notification_message TEXT;
  milestone_count INTEGER;
BEGIN
  -- Get current time and day
  current_time_val := CURRENT_TIME;
  current_day := TO_CHAR(CURRENT_DATE, 'Dy'); -- Returns 'Mon', 'Tue', etc.
  
  -- Loop through all enabled reminders
  FOR reminder_record IN 
    SELECT r.*, p.name as pakt_name, p.status as pakt_status
    FROM reminders r
    INNER JOIN pakts p ON r.pakt_id = p.id
    WHERE r.enabled = true
    AND p.status = 'active'
  LOOP
    should_send := false;
    
    -- Check if reminder time matches (within 1 minute window)
    -- Note: reminder_record.time is TEXT, so we parse it
    IF ABS(EXTRACT(EPOCH FROM (current_time_val - reminder_record.time::TIME)) / 60) <= 1 THEN
      -- Check frequency
      IF reminder_record.frequency = 'daily' THEN
        should_send := true;
      ELSIF reminder_record.frequency = 'weekly' THEN
        -- Weekly reminders on Monday at the set time
        IF current_day = 'Mon' THEN
          should_send := true;
        END IF;
      ELSIF reminder_record.frequency = 'custom' THEN
        -- Check if today is in the selected days
        IF reminder_record.days IS NOT NULL AND current_day = ANY(reminder_record.days) THEN
          should_send := true;
        END IF;
      END IF;
    END IF;
    
    -- If should send, create notification
    IF should_send THEN
      -- Get count of incomplete milestones for this pakt
      SELECT COUNT(*)
      INTO milestone_count
      FROM milestones
      WHERE pakt_id = reminder_record.pakt_id
      AND completed = false
      AND due_date >= CURRENT_DATE;
      
      -- Create notification based on milestone count
      IF milestone_count > 0 THEN
        notification_title := 'Pakt Reminder: ' || reminder_record.pakt_name;
        notification_message := 'You have ' || milestone_count || ' milestone' || 
          CASE WHEN milestone_count > 1 THEN 's' ELSE '' END || 
          ' to work on today in "' || reminder_record.pakt_name || '"';
        
        -- Insert notification
        INSERT INTO notifications (user_id, type, title, message, metadata)
        VALUES (
          reminder_record.user_id,
          'reminder',
          notification_title,
          notification_message,
          jsonb_build_object(
            'pakt_id', reminder_record.pakt_id,
            'reminder_id', reminder_record.id,
            'milestone_count', milestone_count
          )
        );
      END IF;
    END IF;
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Function to send daily motivation notifications
CREATE OR REPLACE FUNCTION send_daily_motivation()
RETURNS void AS $$
DECLARE
  user_record RECORD;
  motivation_messages TEXT[] := ARRAY[
    'Every small step you take brings you closer to your goal. Keep going! 💪',
    'Today is a new opportunity to make progress. You''ve got this! 🌟',
    'Remember why you started. Your future self will thank you! ✨',
    'Progress, not perfection. Every effort counts! 🎯',
    'You are stronger than your excuses. Keep pushing forward! 💫',
    'Small progress is still progress. Celebrate every win! 🎉',
    'Your commitment to growth is inspiring. Keep it up! 🌱',
    'Every day is a chance to get better. Make today count! ⭐',
    'You''re building the life you want, one Pakt at a time! 🏗️',
    'Believe in yourself. You have what it takes to succeed! 💎',
    'Consistency beats intensity. Keep showing up! 🔥',
    'Your goals are within reach. Keep moving forward! 🚀',
    'Every milestone you complete is proof of your strength! 💪',
    'Don''t wait for motivation. Create it through action! ⚡',
    'You''re not just dreaming—you''re doing! Keep it up! 🌈'
  ];
  random_message TEXT;
  current_hour INTEGER;
BEGIN
  -- Get current hour (send motivation at 8 AM)
  current_hour := EXTRACT(HOUR FROM CURRENT_TIME);
  
  -- Only send at 8 AM
  IF current_hour = 8 THEN
    -- Loop through users who have daily motivation enabled
    FOR user_record IN
      SELECT p.id as user_id
      FROM profiles p
      WHERE (p.notification_preferences->>'daily_motivation' = 'true')
      OR (p.notification_preferences IS NULL) -- Default to enabled if no preferences set
    LOOP
      -- Select random motivation message
      random_message := motivation_messages[1 + floor(random() * array_length(motivation_messages, 1))::int];
      
      -- Check if user already received motivation today
      IF NOT EXISTS (
        SELECT 1 FROM notifications
        WHERE user_id = user_record.user_id
        AND type = 'reminder'
        AND message LIKE '%motivation%'
        AND created_at::date = CURRENT_DATE
      ) THEN
        -- Insert daily motivation notification
        INSERT INTO notifications (user_id, type, title, message, metadata)
        VALUES (
          user_record.user_id,
          'reminder',
          'Daily Motivation 💫',
          random_message,
          jsonb_build_object('motivation', true, 'date', CURRENT_DATE)
        );
      END IF;
    END LOOP;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Function to check and notify about upcoming milestones
CREATE OR REPLACE FUNCTION check_upcoming_milestones()
RETURNS void AS $$
DECLARE
  milestone_record RECORD;
  days_until INTEGER;
  notification_sent BOOLEAN;
BEGIN
  -- Check milestones that are due soon (within 3 days) and not completed
  FOR milestone_record IN
    SELECT 
      m.*,
      p.name as pakt_name,
      p.user_id,
      (m.due_date::date - CURRENT_DATE) as days_until_due
    FROM milestones m
    INNER JOIN pakts p ON m.pakt_id = p.id
    WHERE m.completed = false
    AND p.status = 'active'
    AND m.due_date::date >= CURRENT_DATE
    AND m.due_date::date <= CURRENT_DATE + INTERVAL '3 days'
  LOOP
    days_until := milestone_record.days_until_due;
    
    -- Check if notification already sent for this milestone today
    notification_sent := EXISTS (
      SELECT 1 FROM notifications
      WHERE user_id = milestone_record.user_id
      AND type = 'milestone_upcoming'
      AND metadata->>'milestone_id' = milestone_record.id::text
      AND created_at::date = CURRENT_DATE
    );
    
    -- Send notification if not already sent
    IF NOT notification_sent THEN
      IF days_until = 0 THEN
        -- Due today
        INSERT INTO notifications (user_id, type, title, message, metadata)
        VALUES (
          milestone_record.user_id,
          'milestone_upcoming',
          'Milestone Due Today! ⏰',
          '"' || milestone_record.name || '" in "' || milestone_record.pakt_name || '" is due today!',
          jsonb_build_object(
            'milestone_id', milestone_record.id,
            'pakt_id', milestone_record.pakt_id,
            'days_until', 0
          )
        );
      ELSIF days_until = 1 THEN
        -- Due tomorrow
        INSERT INTO notifications (user_id, type, title, message, metadata)
        VALUES (
          milestone_record.user_id,
          'milestone_upcoming',
          'Milestone Due Tomorrow',
          '"' || milestone_record.name || '" in "' || milestone_record.pakt_name || '" is due tomorrow.',
          jsonb_build_object(
            'milestone_id', milestone_record.id,
            'pakt_id', milestone_record.pakt_id,
            'days_until', 1
          )
        );
      ELSIF days_until <= 3 THEN
        -- Due in 2-3 days
        INSERT INTO notifications (user_id, type, title, message, metadata)
        VALUES (
          milestone_record.user_id,
          'milestone_upcoming',
          'Milestone Deadline Approaching',
          '"' || milestone_record.name || '" in "' || milestone_record.pakt_name || '" is due in ' || days_until || ' days.',
          jsonb_build_object(
            'milestone_id', milestone_record.id,
            'pakt_id', milestone_record.pakt_id,
            'days_until', days_until
          )
        );
      END IF;
    END IF;
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Function to check and notify about missed milestones
CREATE OR REPLACE FUNCTION check_missed_milestones()
RETURNS void AS $$
DECLARE
  milestone_record RECORD;
  notification_sent BOOLEAN;
BEGIN
  -- Check milestones that are past due and not completed
  FOR milestone_record IN
    SELECT 
      m.*,
      p.name as pakt_name,
      p.user_id
    FROM milestones m
    INNER JOIN pakts p ON m.pakt_id = p.id
    WHERE m.completed = false
    AND p.status = 'active'
    AND m.due_date::date < CURRENT_DATE
  LOOP
    -- Check if notification already sent for this milestone
    notification_sent := EXISTS (
      SELECT 1 FROM notifications
      WHERE user_id = milestone_record.user_id
      AND type = 'milestone_missed'
      AND metadata->>'milestone_id' = milestone_record.id::text
    );
    
    -- Send notification if not already sent
    IF NOT notification_sent THEN
      INSERT INTO notifications (user_id, type, title, message, metadata)
      VALUES (
        milestone_record.user_id,
        'milestone_missed',
        'Milestone Missed',
        'The deadline for "' || milestone_record.name || '" in "' || milestone_record.pakt_name || '" has passed.',
        jsonb_build_object(
          'milestone_id', milestone_record.id,
          'pakt_id', milestone_record.pakt_id
        )
      );
    END IF;
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Master function that runs all notification checks
CREATE OR REPLACE FUNCTION process_all_notifications()
RETURNS void AS $$
BEGIN
  -- Send reminder notifications based on user preferences
  PERFORM send_reminder_notifications();
  
  -- Send daily motivation
  PERFORM send_daily_motivation();
  
  -- Check upcoming milestones
  PERFORM check_upcoming_milestones();
  
  -- Check missed milestones (run once per day at midnight)
  IF EXTRACT(HOUR FROM CURRENT_TIME) = 0 THEN
    PERFORM check_missed_milestones();
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION send_reminder_notifications() TO authenticated;
GRANT EXECUTE ON FUNCTION send_daily_motivation() TO authenticated;
GRANT EXECUTE ON FUNCTION check_upcoming_milestones() TO authenticated;
GRANT EXECUTE ON FUNCTION check_missed_milestones() TO authenticated;
GRANT EXECUTE ON FUNCTION process_all_notifications() TO authenticated;

-- Success message
DO $$
BEGIN
  RAISE NOTICE '✅ Notifications table created!';
  RAISE NOTICE '✅ All notification functions created successfully!';
  RAISE NOTICE '✅ You can now test with: SELECT process_all_notifications();';
END $$;
