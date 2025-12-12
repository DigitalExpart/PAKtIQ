-- Fix analytics triggers to check for profile existence before inserting
-- This prevents foreign key constraint violations when profile is still being created

-- Fix the milestone completion trigger function
CREATE OR REPLACE FUNCTION public.update_analytics_on_milestone_complete()
RETURNS TRIGGER AS $$
BEGIN
    -- Check if profile exists before trying to insert analytics
    IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE id = NEW.user_id) THEN
        -- Profile doesn't exist yet, skip analytics update
        RETURN NEW;
    END IF;

    IF NEW.completed = true AND (OLD.completed = false OR OLD.completed IS NULL) THEN
        -- Update today's analytics
        BEGIN
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
        EXCEPTION
            WHEN foreign_key_violation THEN
                -- Profile might still be creating, skip silently
                NULL;
        END;
        
        -- Update streak (only if profile exists)
        BEGIN
            PERFORM public.update_user_streak(NEW.user_id);
        EXCEPTION
            WHEN others THEN
                -- Silently skip if profile doesn't exist or other errors
                NULL;
        END;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Fix the Resolve completion trigger function
CREATE OR REPLACE FUNCTION public.update_analytics_on_pakt_complete()
RETURNS TRIGGER AS $$
BEGIN
    -- Check if profile exists before trying to insert analytics
    IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE id = NEW.user_id) THEN
        -- Profile doesn't exist yet, skip analytics update
        RETURN NEW;
    END IF;

    IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
        -- Update today's analytics
        BEGIN
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
        EXCEPTION
            WHEN foreign_key_violation THEN
                -- Profile might still be creating, skip silently
                NULL;
        END;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Fix the get_or_create_analytics function to check for profile
CREATE OR REPLACE FUNCTION public.get_or_create_analytics(p_user_id UUID)
RETURNS public.analytics AS $$
DECLARE
    v_analytics public.analytics;
BEGIN
    -- Check if profile exists first
    IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE id = p_user_id) THEN
        -- Profile doesn't exist, return NULL
        RETURN NULL;
    END IF;

    -- Try to get today's analytics
    SELECT * INTO v_analytics
    FROM public.analytics
    WHERE user_id = p_user_id AND date = CURRENT_DATE;
    
    -- If not found, create it
    IF v_analytics IS NULL THEN
        BEGIN
            INSERT INTO public.analytics (user_id, date)
            VALUES (p_user_id, CURRENT_DATE)
            RETURNING * INTO v_analytics;
        EXCEPTION
            WHEN foreign_key_violation THEN
                -- Profile might still be creating
                RETURN NULL;
        END;
    END IF;
    
    RETURN v_analytics;
END;
$$ LANGUAGE plpgsql;

-- Fix the update_user_streak function to check for profile
CREATE OR REPLACE FUNCTION public.update_user_streak(p_user_id UUID)
RETURNS void AS $$
DECLARE
    v_yesterday DATE := CURRENT_DATE - INTERVAL '1 day';
    v_yesterday_analytics public.analytics;
    v_today_analytics public.analytics;
BEGIN
    -- Check if profile exists first
    IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE id = p_user_id) THEN
        RETURN;
    END IF;

    -- Get or create today's analytics
    BEGIN
        SELECT * INTO v_today_analytics FROM public.get_or_create_analytics(p_user_id);
        IF v_today_analytics IS NULL THEN
            RETURN;
        END IF;
    EXCEPTION
        WHEN others THEN
            RETURN;
    END;
    
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
EXCEPTION
    WHEN others THEN
        -- Silently handle any errors
        NULL;
END;
$$ LANGUAGE plpgsql;

