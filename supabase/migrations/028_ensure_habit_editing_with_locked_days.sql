-- Migration: Ensure Habit Editing with Locked Past Days
-- This migration ensures all necessary database structures are in place
-- for editing habits where past completed/missed days are locked

-- ============================================
-- STEP 1: Ensure habit_completions has status column
-- ============================================

-- Add status column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'habit_completions' 
        AND column_name = 'status'
    ) THEN
        ALTER TABLE public.habit_completions 
        ADD COLUMN status TEXT DEFAULT 'completed' CHECK (status IN ('completed', 'missed'));
        
        -- Update existing records to have 'completed' status
        UPDATE public.habit_completions 
        SET status = 'completed' 
        WHERE status IS NULL;
        
        -- Make status NOT NULL after updating existing records
        ALTER TABLE public.habit_completions 
        ALTER COLUMN status SET NOT NULL;
    END IF;
END $$;

-- ============================================
-- STEP 2: Ensure habit_schedules table structure
-- ============================================

-- Ensure habit_schedules table exists with correct structure
CREATE TABLE IF NOT EXISTS public.habit_schedules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    habit_id UUID NOT NULL REFERENCES public.habits(id) ON DELETE CASCADE,
    day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
    time TEXT NOT NULL, -- Store as TEXT in HH:MM format (24-hour)
    enabled BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(habit_id, day_of_week)
);

-- Handle case where time column might exist as TIME type (from older migrations)
DO $$
BEGIN
    -- Check if time column exists and is TIME type, convert to TEXT
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'habit_schedules' 
        AND column_name = 'time'
        AND data_type = 'time without time zone'
    ) THEN
        -- Convert TIME to TEXT by casting to HH:MM format
        ALTER TABLE public.habit_schedules 
        ALTER COLUMN time TYPE TEXT USING time::TEXT;
    END IF;
END $$;

-- ============================================
-- STEP 3: Ensure habit_completions table structure
-- ============================================

-- Ensure habit_completions table exists
CREATE TABLE IF NOT EXISTS public.habit_completions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    habit_id UUID NOT NULL REFERENCES public.habits(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    completion_date DATE NOT NULL,
    status TEXT NOT NULL DEFAULT 'completed' CHECK (status IN ('completed', 'missed')),
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(habit_id, completion_date)
);

-- ============================================
-- STEP 4: Ensure habits table has all necessary columns
-- ============================================

DO $$ 
BEGIN
    -- Add duration_weeks if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'habits' 
        AND column_name = 'duration_weeks'
    ) THEN
        ALTER TABLE public.habits ADD COLUMN duration_weeks INTEGER;
    END IF;

    -- Add status if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'habits' 
        AND column_name = 'status'
    ) THEN
        ALTER TABLE public.habits ADD COLUMN status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'paused'));
    END IF;
END $$;

-- ============================================
-- STEP 5: Create/Update Indexes for Performance
-- ============================================

-- Indexes for habit_completions (critical for querying by date and status)
CREATE INDEX IF NOT EXISTS idx_habit_completions_habit_id ON public.habit_completions(habit_id);
CREATE INDEX IF NOT EXISTS idx_habit_completions_user_id ON public.habit_completions(user_id);
CREATE INDEX IF NOT EXISTS idx_habit_completions_date ON public.habit_completions(completion_date);
CREATE INDEX IF NOT EXISTS idx_habit_completions_status ON public.habit_completions(status);
-- Composite index for common query pattern: habit_id + completion_date + status
CREATE INDEX IF NOT EXISTS idx_habit_completions_habit_date_status 
    ON public.habit_completions(habit_id, completion_date, status);

-- Indexes for habit_schedules
CREATE INDEX IF NOT EXISTS idx_habit_schedules_habit_id ON public.habit_schedules(habit_id);
CREATE INDEX IF NOT EXISTS idx_habit_schedules_day ON public.habit_schedules(day_of_week);
CREATE INDEX IF NOT EXISTS idx_habit_schedules_enabled ON public.habit_schedules(enabled);

-- Indexes for habits
CREATE INDEX IF NOT EXISTS idx_habits_user_id ON public.habits(user_id);
CREATE INDEX IF NOT EXISTS idx_habits_status ON public.habits(status);

-- ============================================
-- STEP 6: Ensure RLS Policies are Correct
-- ============================================

-- Enable RLS if not already enabled
ALTER TABLE public.habits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.habit_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.habit_completions ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to recreate them correctly
DROP POLICY IF EXISTS "Users can view their own habit completions" ON public.habit_completions;
DROP POLICY IF EXISTS "Users can insert their own habit completions" ON public.habit_completions;
DROP POLICY IF EXISTS "Users can update their own habit completions" ON public.habit_completions;
DROP POLICY IF EXISTS "Users can delete their own habit completions" ON public.habit_completions;

DROP POLICY IF EXISTS "Users can view their own habit schedules" ON public.habit_schedules;
DROP POLICY IF EXISTS "Users can insert their own habit schedules" ON public.habit_schedules;
DROP POLICY IF EXISTS "Users can update their own habit schedules" ON public.habit_schedules;
DROP POLICY IF EXISTS "Users can delete their own habit schedules" ON public.habit_schedules;

DROP POLICY IF EXISTS "Users can view their own habits" ON public.habits;
DROP POLICY IF EXISTS "Users can insert their own habits" ON public.habits;
DROP POLICY IF EXISTS "Users can update their own habits" ON public.habits;
DROP POLICY IF EXISTS "Users can delete their own habits" ON public.habits;

-- Recreate RLS Policies for habit_completions
CREATE POLICY "Users can view their own habit completions"
    ON public.habit_completions FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own habit completions"
    ON public.habit_completions FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own habit completions"
    ON public.habit_completions FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own habit completions"
    ON public.habit_completions FOR DELETE
    USING (auth.uid() = user_id);

-- Recreate RLS Policies for habit_schedules
CREATE POLICY "Users can view their own habit schedules"
    ON public.habit_schedules FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.habits
            WHERE habits.id = habit_schedules.habit_id
            AND habits.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert their own habit schedules"
    ON public.habit_schedules FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.habits
            WHERE habits.id = habit_schedules.habit_id
            AND habits.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update their own habit schedules"
    ON public.habit_schedules FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.habits
            WHERE habits.id = habit_schedules.habit_id
            AND habits.user_id = auth.uid()
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.habits
            WHERE habits.id = habit_schedules.habit_id
            AND habits.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete their own habit schedules"
    ON public.habit_schedules FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM public.habits
            WHERE habits.id = habit_schedules.habit_id
            AND habits.user_id = auth.uid()
        )
    );

-- Recreate RLS Policies for habits
CREATE POLICY "Users can view their own habits"
    ON public.habits FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own habits"
    ON public.habits FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own habits"
    ON public.habits FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own habits"
    ON public.habits FOR DELETE
    USING (auth.uid() = user_id);

-- ============================================
-- STEP 7: Ensure Triggers Exist
-- ============================================

-- Create or replace function for updating updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Ensure triggers exist for habits
DROP TRIGGER IF EXISTS update_habits_updated_at ON public.habits;
CREATE TRIGGER update_habits_updated_at 
    BEFORE UPDATE ON public.habits
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Ensure triggers exist for habit_schedules
DROP TRIGGER IF EXISTS update_habit_schedules_updated_at ON public.habit_schedules;
CREATE TRIGGER update_habit_schedules_updated_at 
    BEFORE UPDATE ON public.habit_schedules
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- STEP 8: Add Comments for Documentation
-- ============================================

COMMENT ON TABLE public.habit_completions IS 'Daily completion records for habits. Status can be "completed" or "missed". Past days with status are locked from editing.';
COMMENT ON COLUMN public.habit_completions.status IS 'Status: "completed" or "missed". Past days with this status cannot have their schedule edited.';
COMMENT ON COLUMN public.habit_completions.completion_date IS 'Date of completion. Used to determine if a day is in the past for locking purposes.';
COMMENT ON TABLE public.habit_schedules IS 'Schedule for each day of the week for a habit. Users can edit times for present and future days only.';
COMMENT ON COLUMN public.habit_schedules.day_of_week IS 'Day of week: 0=Sunday, 1=Monday, 2=Tuesday, 3=Wednesday, 4=Thursday, 5=Friday, 6=Saturday';
COMMENT ON COLUMN public.habit_schedules.time IS 'Time in HH:MM format (24-hour) for the reminder on this day';

-- ============================================
-- VERIFICATION (Optional - uncomment to run)
-- ============================================

-- Verify status column exists
-- SELECT column_name, data_type, is_nullable, column_default
-- FROM information_schema.columns 
-- WHERE table_schema = 'public' 
-- AND table_name = 'habit_completions'
-- AND column_name = 'status';

-- Verify indexes exist
-- SELECT indexname, indexdef 
-- FROM pg_indexes 
-- WHERE schemaname = 'public' 
-- AND tablename IN ('habit_completions', 'habit_schedules')
-- ORDER BY tablename, indexname;

-- Verify policies exist
-- SELECT schemaname, tablename, policyname, cmd
-- FROM pg_policies 
-- WHERE schemaname = 'public'
-- AND tablename IN ('habits', 'habit_schedules', 'habit_completions')
-- ORDER BY tablename, policyname;

