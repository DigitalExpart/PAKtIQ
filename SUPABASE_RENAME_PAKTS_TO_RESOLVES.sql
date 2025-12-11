-- ============================================
-- SUPABASE SQL: Rename pakts to resolves
-- ============================================
-- Run this script in your Supabase SQL Editor
-- This will rename the 'pakts' table to 'resolves' and update all references

-- Step 1: Rename table (handle both lowercase and capitalized versions)
DO $$
BEGIN
    -- Check if 'pakts' table exists (lowercase)
    IF EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND LOWER(table_name) = 'pakts'
    ) THEN
        -- Rename pakts to resolves (lowercase)
        EXECUTE 'ALTER TABLE IF EXISTS public.pakts RENAME TO resolves';
        RAISE NOTICE 'Table "pakts" renamed to "resolves"';
    -- Check if 'Resolves' table exists (capitalized)
    ELSIF EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'Resolves'
    ) THEN
        -- If Resolves (capitalized) exists, rename to resolves (lowercase)
        EXECUTE 'ALTER TABLE IF EXISTS public."Resolves" RENAME TO resolves';
        RAISE NOTICE 'Table "Resolves" renamed to "resolves"';
    ELSE
        RAISE NOTICE 'Table "pakts" or "Resolves" does not exist. Creating "resolves" table if needed.';
    END IF;
END $$;

-- Ensure resolves table exists with correct structure
CREATE TABLE IF NOT EXISTS public.resolves (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    target_outcome TEXT NOT NULL,
    deadline TIMESTAMP WITH TIME ZONE NOT NULL,
    category TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'archived')),
    progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Step 2: Rename columns in related tables (only if they exist)
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'milestones' 
        AND column_name = 'pakt_id'
    ) THEN
        ALTER TABLE public.milestones RENAME COLUMN pakt_id TO resolve_id;
        RAISE NOTICE 'Renamed column "pakt_id" to "resolve_id" in milestones table';
    END IF;
END $$;

DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'reminders' 
        AND column_name = 'pakt_id'
    ) THEN
        ALTER TABLE public.reminders RENAME COLUMN pakt_id TO resolve_id;
        RAISE NOTICE 'Renamed column "pakt_id" to "resolve_id" in reminders table';
    END IF;
END $$;

DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'activity_log' 
        AND column_name = 'pakt_id'
    ) THEN
        ALTER TABLE public.activity_log RENAME COLUMN pakt_id TO resolve_id;
        RAISE NOTICE 'Renamed column "pakt_id" to "resolve_id" in activity_log table';
    END IF;
END $$;

DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'journal_entries' 
        AND column_name = 'pakt_id'
    ) THEN
        ALTER TABLE public.journal_entries RENAME COLUMN pakt_id TO resolve_id;
        RAISE NOTICE 'Renamed column "pakt_id" to "resolve_id" in journal_entries table';
    END IF;
END $$;

-- Step 3: Update foreign key constraints (drop and recreate)
DO $$
BEGIN
    -- Update milestones foreign key
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'milestones_pakt_id_fkey') THEN
        ALTER TABLE public.milestones DROP CONSTRAINT milestones_pakt_id_fkey;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'milestones_resolve_id_fkey') THEN
        ALTER TABLE public.milestones ADD CONSTRAINT milestones_resolve_id_fkey 
            FOREIGN KEY (resolve_id) REFERENCES public.resolves(id) ON DELETE CASCADE;
    END IF;
END $$;

DO $$
BEGIN
    -- Update reminders foreign key
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'reminders_pakt_id_fkey') THEN
        ALTER TABLE public.reminders DROP CONSTRAINT reminders_pakt_id_fkey;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'reminders_resolve_id_fkey') THEN
        ALTER TABLE public.reminders ADD CONSTRAINT reminders_resolve_id_fkey 
            FOREIGN KEY (resolve_id) REFERENCES public.resolves(id) ON DELETE CASCADE;
    END IF;
END $$;

DO $$
BEGIN
    -- Update activity_log foreign key
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'activity_log_pakt_id_fkey') THEN
        ALTER TABLE public.activity_log DROP CONSTRAINT activity_log_pakt_id_fkey;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'activity_log_resolve_id_fkey') THEN
        ALTER TABLE public.activity_log ADD CONSTRAINT activity_log_resolve_id_fkey 
            FOREIGN KEY (resolve_id) REFERENCES public.resolves(id) ON DELETE CASCADE;
    END IF;
END $$;

DO $$
BEGIN
    -- Update journal_entries foreign key
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'journal_entries_pakt_id_fkey') THEN
        ALTER TABLE public.journal_entries DROP CONSTRAINT journal_entries_pakt_id_fkey;
    END IF;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname LIKE 'journal_entries%resolve_id%') THEN
        -- Drop any existing resolve_id constraint
        ALTER TABLE public.journal_entries DROP CONSTRAINT IF EXISTS journal_entries_resolve_id_fkey;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'journal_entries_resolve_id_fkey') THEN
        ALTER TABLE public.journal_entries ADD CONSTRAINT journal_entries_resolve_id_fkey 
            FOREIGN KEY (resolve_id) REFERENCES public.resolves(id) ON DELETE SET NULL;
    END IF;
END $$;

-- Step 4: Update indexes
DROP INDEX IF EXISTS public.idx_pakts_user_id;
DROP INDEX IF EXISTS public.idx_pakts_status;
CREATE INDEX IF NOT EXISTS idx_resolves_user_id ON public.resolves(user_id);
CREATE INDEX IF NOT EXISTS idx_resolves_status ON public.resolves(status);

DROP INDEX IF EXISTS public.idx_milestones_pakt_id;
CREATE INDEX IF NOT EXISTS idx_milestones_resolve_id ON public.milestones(resolve_id);

DROP INDEX IF EXISTS public.idx_reminders_pakt_id;
CREATE INDEX IF NOT EXISTS idx_reminders_resolve_id ON public.reminders(resolve_id);

DROP INDEX IF EXISTS public.idx_activity_log_pakt_id;
CREATE INDEX IF NOT EXISTS idx_activity_log_resolve_id ON public.activity_log(resolve_id);

DROP INDEX IF EXISTS public.idx_journal_entries_pakt_id;
CREATE INDEX IF NOT EXISTS idx_journal_entries_resolve_id ON public.journal_entries(resolve_id);

-- Step 5: Update RLS policies
-- Drop all possible variations of policy names
DROP POLICY IF EXISTS "Users can view their own Resolves" ON public.resolves;
DROP POLICY IF EXISTS "Users can view their own pakts" ON public.resolves;
DROP POLICY IF EXISTS "Users can view their own resolves" ON public.resolves;
DROP POLICY IF EXISTS "users can view their own resolves" ON public.resolves;
DROP POLICY IF EXISTS "Users can create their own Resolves" ON public.resolves;
DROP POLICY IF EXISTS "Users can create their own pakts" ON public.resolves;
DROP POLICY IF EXISTS "Users can create their own resolves" ON public.resolves;
DROP POLICY IF EXISTS "users can create their own resolves" ON public.resolves;
DROP POLICY IF EXISTS "Users can update their own Resolves" ON public.resolves;
DROP POLICY IF EXISTS "Users can update their own pakts" ON public.resolves;
DROP POLICY IF EXISTS "Users can update their own resolves" ON public.resolves;
DROP POLICY IF EXISTS "users can update their own resolves" ON public.resolves;
DROP POLICY IF EXISTS "Users can delete their own Resolves" ON public.resolves;
DROP POLICY IF EXISTS "Users can delete their own pakts" ON public.resolves;
DROP POLICY IF EXISTS "Users can delete their own resolves" ON public.resolves;
DROP POLICY IF EXISTS "users can delete their own resolves" ON public.resolves;

-- Now create the policies (they should not exist after the drops above)
CREATE POLICY "Users can view their own resolves"
    ON public.resolves FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own resolves"
    ON public.resolves FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own resolves"
    ON public.resolves FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own resolves"
    ON public.resolves FOR DELETE
    USING (auth.uid() = user_id);

-- Step 6: Update triggers that reference the old table name
-- Drop old triggers (safely handle both table name variations)
DO $$
BEGIN
    -- Drop triggers on resolves table (lowercase)
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'resolves') THEN
        DROP TRIGGER IF EXISTS set_updated_at_pakts ON public.resolves;
        DROP TRIGGER IF EXISTS update_analytics_on_pakt ON public.resolves;
    END IF;
    
    -- Drop triggers on Resolves table (capitalized) - only if it exists
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'Resolves') THEN
        EXECUTE 'DROP TRIGGER IF EXISTS set_updated_at_pakts ON public."Resolves"';
        EXECUTE 'DROP TRIGGER IF EXISTS update_analytics_on_pakt ON public."Resolves"';
    END IF;
END $$;

-- Drop milestone trigger (this table should always exist)
DROP TRIGGER IF EXISTS update_pakt_progress_on_milestone_change ON public.milestones;

-- Recreate triggers with correct table reference
CREATE TRIGGER set_updated_at_resolves
    BEFORE UPDATE ON public.resolves
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_analytics_on_resolve
    AFTER UPDATE ON public.resolves
    FOR EACH ROW
    WHEN (OLD.status IS DISTINCT FROM NEW.status AND NEW.status = 'completed')
    EXECUTE FUNCTION public.update_analytics_on_pakt_complete();

-- Step 6.5: Drop old functions that reference the old table name (before recreating)
-- First drop triggers that depend on these functions, then drop the functions
DROP TRIGGER IF EXISTS milestone_deadline_check_insert ON public.milestones;
DROP TRIGGER IF EXISTS milestone_deadline_check_update ON public.milestones;

-- Now drop the functions (they can be dropped now that triggers are gone)
DROP FUNCTION IF EXISTS public.calculate_pakt_progress(UUID);
DROP FUNCTION IF EXISTS public.update_pakt_progress();
DROP FUNCTION IF EXISTS public.check_milestone_deadline();
DROP FUNCTION IF EXISTS send_reminder_notifications();
DROP FUNCTION IF EXISTS check_upcoming_milestones();
DROP FUNCTION IF EXISTS check_missed_milestones();

-- Step 7: Update functions that reference old table/column names
-- Update calculate_pakt_progress function to calculate_resolve_progress
CREATE OR REPLACE FUNCTION public.calculate_resolve_progress(resolve_uuid UUID)
RETURNS INTEGER AS $$
DECLARE
    total_milestones INTEGER;
    completed_milestones INTEGER;
    progress INTEGER;
BEGIN
    SELECT COUNT(*) INTO total_milestones
    FROM public.milestones
    WHERE resolve_id = resolve_uuid;

    IF total_milestones = 0 THEN
        RETURN 0;
    END IF;

    SELECT COUNT(*) INTO completed_milestones
    FROM public.milestones
    WHERE resolve_id = resolve_uuid AND completed = true;

    progress := ROUND((completed_milestones::DECIMAL / total_milestones::DECIMAL) * 100);
    
    RETURN progress;
END;
$$ LANGUAGE plpgsql;

-- Update update_pakt_progress function to update_resolve_progress
CREATE OR REPLACE FUNCTION public.update_resolve_progress()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.resolves
    SET progress = public.calculate_resolve_progress(
        CASE 
            WHEN TG_OP = 'DELETE' THEN OLD.resolve_id
            ELSE NEW.resolve_id
        END
    )
    WHERE id = CASE 
        WHEN TG_OP = 'DELETE' THEN OLD.resolve_id
        ELSE NEW.resolve_id
    END;
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Update update_analytics_on_pakt_complete function to use resolves table
CREATE OR REPLACE FUNCTION public.update_analytics_on_pakt_complete()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.analytics (user_id, total_pakts_completed)
    VALUES (NEW.user_id, 1)
    ON CONFLICT (user_id) DO UPDATE SET
        total_pakts_completed = public.analytics.total_pakts_completed + 1;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Now create the trigger that uses update_resolve_progress function (after function is created)
CREATE TRIGGER update_resolve_progress_on_milestone_change
    AFTER INSERT OR UPDATE OR DELETE ON public.milestones
    FOR EACH ROW
    EXECUTE FUNCTION public.update_resolve_progress();

-- Step 7.5: Update milestone deadline constraint function
-- Update check_milestone_deadline function
CREATE OR REPLACE FUNCTION check_milestone_deadline()
RETURNS TRIGGER AS $$
BEGIN
  -- Check if milestone due_date exceeds the parent Resolve's deadline
  IF EXISTS (
    SELECT 1 
    FROM public.resolves 
    WHERE id = NEW.resolve_id 
    AND NEW.due_date > deadline
  ) THEN
    RAISE EXCEPTION 'Milestone due_date (%) cannot exceed the Resolve deadline', NEW.due_date;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Ensure milestone deadline triggers exist
DROP TRIGGER IF EXISTS milestone_deadline_check_insert ON public.milestones;
DROP TRIGGER IF EXISTS milestone_deadline_check_update ON public.milestones;

CREATE TRIGGER milestone_deadline_check_insert
  BEFORE INSERT ON public.milestones
  FOR EACH ROW
  EXECUTE FUNCTION check_milestone_deadline();

CREATE TRIGGER milestone_deadline_check_update
  BEFORE UPDATE ON public.milestones
  FOR EACH ROW
  WHEN (OLD.due_date IS DISTINCT FROM NEW.due_date OR OLD.resolve_id IS DISTINCT FROM NEW.resolve_id)
  EXECUTE FUNCTION check_milestone_deadline();

-- Step 8: Update notification scheduler functions that reference old table/column names
-- Update send_reminder_notifications function
CREATE OR REPLACE FUNCTION send_reminder_notifications()
RETURNS void AS $$
DECLARE
  reminder_record RECORD;
  resolve_record RECORD;
  milestone_record RECORD;
  v_current_time TIME;
  current_day TEXT;
  should_send BOOLEAN;
  notification_title TEXT;
  notification_message TEXT;
  upcoming_milestones TEXT[];
  milestone_count INTEGER;
BEGIN
  -- Get current time and day
  v_current_time := CURRENT_TIME;
  current_day := TO_CHAR(CURRENT_DATE, 'Dy'); -- Returns 'Mon', 'Tue', etc.
  
  -- Loop through all enabled reminders
  FOR reminder_record IN 
    SELECT r.*, p.name as resolve_name, p.status as resolve_status
    FROM reminders r
    INNER JOIN resolves p ON r.resolve_id = p.id
    WHERE r.enabled = true
    AND p.status = 'active'
  LOOP
    should_send := false;
    
    -- Check if reminder time matches (within 1 minute window)
    IF ABS(EXTRACT(EPOCH FROM (v_current_time - reminder_record.time::TIME)) / 60) <= 1 THEN
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
      -- Get upcoming/incomplete milestones for this Resolve
      SELECT 
        ARRAY_AGG(name ORDER BY due_date),
        COUNT(*)
      INTO upcoming_milestones, milestone_count
      FROM milestones
      WHERE resolve_id = reminder_record.resolve_id
      AND completed = false
      AND due_date >= CURRENT_DATE;
      
      -- Create notification based on milestone count
      IF milestone_count > 0 THEN
        notification_title := 'Resolve Reminder: ' || reminder_record.resolve_name;
        notification_message := 'You have ' || milestone_count || ' milestone' || 
          CASE WHEN milestone_count > 1 THEN 's' ELSE '' END || 
          ' to work on today in "' || reminder_record.resolve_name || '"';
        
        -- Insert notification
        INSERT INTO notifications (user_id, type, title, message, metadata)
        VALUES (
          reminder_record.user_id,
          'reminder',
          notification_title,
          notification_message,
          jsonb_build_object(
            'resolve_id', reminder_record.resolve_id,
            'reminder_id', reminder_record.id,
            'milestone_count', milestone_count
          )
        );
      END IF;
    END IF;
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Update check_upcoming_milestones function
CREATE OR REPLACE FUNCTION check_upcoming_milestones()
RETURNS void AS $$
DECLARE
  milestone_record RECORD;
BEGIN
  FOR milestone_record IN
    SELECT m.*, p.name as resolve_name, p.user_id
    FROM milestones m
    INNER JOIN resolves p ON m.resolve_id = p.id
    WHERE m.completed = false
    AND m.due_date BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '3 days'
    AND p.status = 'active'
  LOOP
    INSERT INTO notifications (user_id, type, title, message, metadata)
    VALUES (
      milestone_record.user_id,
      'milestone_reminder',
      'Upcoming Milestone: ' || milestone_record.name,
      'Your milestone "' || milestone_record.name || '" for "' || milestone_record.resolve_name || '" is due soon!',
      jsonb_build_object(
        'resolve_id', milestone_record.resolve_id,
        'milestone_id', milestone_record.id,
        'due_date', milestone_record.due_date
      )
    );
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Update check_missed_milestones function
CREATE OR REPLACE FUNCTION check_missed_milestones()
RETURNS void AS $$
DECLARE
  milestone_record RECORD;
BEGIN
  FOR milestone_record IN
    SELECT m.*, p.name as resolve_name, p.user_id
    FROM milestones m
    INNER JOIN resolves p ON m.resolve_id = p.id
    WHERE m.completed = false
    AND m.due_date < CURRENT_DATE
    AND p.status = 'active'
  LOOP
    INSERT INTO notifications (user_id, type, title, message, metadata)
    VALUES (
      milestone_record.user_id,
      'milestone_overdue',
      'Missed Milestone: ' || milestone_record.name,
      'Your milestone "' || milestone_record.name || '" for "' || milestone_record.resolve_name || '" was due ' || 
      TO_CHAR(milestone_record.due_date, 'Mon DD, YYYY'),
      jsonb_build_object(
        'resolve_id', milestone_record.resolve_id,
        'milestone_id', milestone_record.id,
        'due_date', milestone_record.due_date
      )
    );
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Done! The table is now renamed from 'pakts' to 'resolves' and all triggers/functions are updated

