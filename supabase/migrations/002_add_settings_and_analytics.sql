-- Add dark mode and notification preferences to profiles
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS dark_mode BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS notification_preferences JSONB DEFAULT '{
  "enabled": true,
  "push_enabled": true,
  "email_enabled": false,
  "pakt_reminders": true,
  "milestone_deadlines": true,
  "streak_protection": true,
  "daily_motivation": false,
  "weekly_progress": true,
  "achievement_alerts": true,
  "quiet_hours_start": "22:00",
  "quiet_hours_end": "08:00"
}'::jsonb;

-- Create analytics table for tracking user statistics
CREATE TABLE IF NOT EXISTS public.analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    
    -- Daily statistics
    milestones_completed_today INTEGER DEFAULT 0,
    pakts_worked_on_today INTEGER DEFAULT 0,
    time_spent_minutes INTEGER DEFAULT 0,
    
    -- Streak tracking
    current_streak INTEGER DEFAULT 0,
    longest_streak INTEGER DEFAULT 0,
    streak_active BOOLEAN DEFAULT false,
    
    -- Completion metrics
    completion_rate DECIMAL(5,2) DEFAULT 0,
    total_milestones_completed INTEGER DEFAULT 0,
    total_pakts_completed INTEGER DEFAULT 0,
    
    -- Badges and achievements
    badges_earned_total INTEGER DEFAULT 0,
    badges_earned_today INTEGER DEFAULT 0,
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    
    -- Unique constraint: one analytics record per user per day
    UNIQUE(user_id, date)
);

-- Create indexes for analytics
CREATE INDEX IF NOT EXISTS idx_analytics_user_id ON public.analytics(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_date ON public.analytics(date);
CREATE INDEX IF NOT EXISTS idx_analytics_user_date ON public.analytics(user_id, date);

-- Enable RLS for analytics
ALTER TABLE public.analytics ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for analytics
CREATE POLICY "Users can view their own analytics"
    ON public.analytics FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own analytics"
    ON public.analytics FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own analytics"
    ON public.analytics FOR UPDATE
    USING (auth.uid() = user_id);

-- Create trigger for analytics updated_at
CREATE TRIGGER set_updated_at_analytics
    BEFORE UPDATE ON public.analytics
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- Function to get or create today's analytics
CREATE OR REPLACE FUNCTION public.get_or_create_analytics(p_user_id UUID)
RETURNS public.analytics AS $$
DECLARE
    v_analytics public.analytics;
BEGIN
    -- Try to get today's analytics
    SELECT * INTO v_analytics
    FROM public.analytics
    WHERE user_id = p_user_id AND date = CURRENT_DATE;
    
    -- If not found, create it
    IF v_analytics IS NULL THEN
        INSERT INTO public.analytics (user_id, date)
        VALUES (p_user_id, CURRENT_DATE)
        RETURNING * INTO v_analytics;
    END IF;
    
    RETURN v_analytics;
END;
$$ LANGUAGE plpgsql;

-- Function to update streak when user completes activity
CREATE OR REPLACE FUNCTION public.update_user_streak(p_user_id UUID)
RETURNS void AS $$
DECLARE
    v_yesterday DATE := CURRENT_DATE - INTERVAL '1 day';
    v_yesterday_analytics public.analytics;
    v_today_analytics public.analytics;
BEGIN
    -- Get or create today's analytics
    SELECT * INTO v_today_analytics FROM public.get_or_create_analytics(p_user_id);
    
    -- Get yesterday's analytics
    SELECT * INTO v_yesterday_analytics
    FROM public.analytics
    WHERE user_id = p_user_id AND date = v_yesterday;
    
    -- Calculate streak
    IF v_yesterday_analytics IS NOT NULL AND v_yesterday_analytics.streak_active THEN
        -- Continue streak
        UPDATE public.analytics
        SET 
            current_streak = v_yesterday_analytics.current_streak + 1,
            longest_streak = GREATEST(longest_streak, v_yesterday_analytics.current_streak + 1),
            streak_active = true
        WHERE user_id = p_user_id AND date = CURRENT_DATE;
    ELSE
        -- Start new streak
        UPDATE public.analytics
        SET 
            current_streak = 1,
            longest_streak = GREATEST(longest_streak, 1),
            streak_active = true
        WHERE user_id = p_user_id AND date = CURRENT_DATE;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Function to calculate completion rate
CREATE OR REPLACE FUNCTION public.calculate_completion_rate(p_user_id UUID)
RETURNS DECIMAL AS $$
DECLARE
    v_total_milestones INTEGER;
    v_completed_milestones INTEGER;
    v_rate DECIMAL(5,2);
BEGIN
    -- Count total milestones
    SELECT COUNT(*) INTO v_total_milestones
    FROM public.milestones
    WHERE user_id = p_user_id;
    
    IF v_total_milestones = 0 THEN
        RETURN 0;
    END IF;
    
    -- Count completed milestones
    SELECT COUNT(*) INTO v_completed_milestones
    FROM public.milestones
    WHERE user_id = p_user_id AND completed = true;
    
    -- Calculate rate
    v_rate := ROUND((v_completed_milestones::DECIMAL / v_total_milestones::DECIMAL) * 100, 2);
    
    RETURN v_rate;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update analytics when milestone is completed
CREATE OR REPLACE FUNCTION public.update_analytics_on_milestone_complete()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.completed = true AND (OLD.completed = false OR OLD.completed IS NULL) THEN
        -- Update today's analytics
        INSERT INTO public.analytics (
            user_id, 
            date, 
            milestones_completed_today,
            total_milestones_completed,
            completion_rate
        )
        VALUES (
            NEW.user_id,
            CURRENT_DATE,
            1,
            1,
            public.calculate_completion_rate(NEW.user_id)
        )
        ON CONFLICT (user_id, date) 
        DO UPDATE SET
            milestones_completed_today = public.analytics.milestones_completed_today + 1,
            total_milestones_completed = public.analytics.total_milestones_completed + 1,
            completion_rate = public.calculate_completion_rate(NEW.user_id);
        
        -- Update streak
        PERFORM public.update_user_streak(NEW.user_id);
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for analytics update on milestone completion
CREATE TRIGGER update_analytics_on_milestone
    AFTER INSERT OR UPDATE ON public.milestones
    FOR EACH ROW
    EXECUTE FUNCTION public.update_analytics_on_milestone_complete();

-- Trigger to update analytics when pakt is completed
CREATE OR REPLACE FUNCTION public.update_analytics_on_pakt_complete()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
        -- Update today's analytics
        INSERT INTO public.analytics (
            user_id, 
            date, 
            total_pakts_completed
        )
        VALUES (
            NEW.user_id,
            CURRENT_DATE,
            1
        )
        ON CONFLICT (user_id, date) 
        DO UPDATE SET
            total_pakts_completed = public.analytics.total_pakts_completed + 1;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for analytics update on pakt completion
CREATE TRIGGER update_analytics_on_pakt
    AFTER UPDATE ON public.pakts
    FOR EACH ROW
    EXECUTE FUNCTION public.update_analytics_on_pakt_complete();

-- Create view for weekly activity (for charts)
CREATE OR REPLACE VIEW public.weekly_activity AS
SELECT 
    user_id,
    date,
    milestones_completed_today as activity_count,
    EXTRACT(DOW FROM date) as day_of_week,
    TO_CHAR(date, 'Dy') as day_name
FROM public.analytics
WHERE date >= CURRENT_DATE - INTERVAL '7 days'
ORDER BY date;

