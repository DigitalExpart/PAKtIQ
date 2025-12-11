-- ============================================
-- SUPABASE SQL SETUP FOR HABIT EDITING WITH LOCKED DAYS
-- ============================================
-- Run this SQL in your Supabase SQL Editor
-- This ensures all database structures are in place for editing habits
-- where past completed/missed days are locked from editing
-- ============================================

-- STEP 1: Ensure habit_completions has status column
-- ============================================
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
        
        UPDATE public.habit_completions 
        SET status = 'completed' 
        WHERE status IS NULL;
        
        ALTER TABLE public.habit_completions 
        ALTER COLUMN status SET NOT NULL;
    END IF;
END $$;

-- STEP 2: Ensure habit_schedules table exists and time column is TEXT
-- ============================================
CREATE TABLE IF NOT EXISTS public.habit_schedules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    habit_id UUID NOT NULL REFERENCES public.habits(id) ON DELETE CASCADE,
    day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
    time TEXT NOT NULL,
    enabled BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(habit_id, day_of_week)
);

-- Convert TIME column to TEXT if it exists as TIME type
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'habit_schedules' 
        AND column_name = 'time'
        AND data_type = 'time without time zone'
    ) THEN
        ALTER TABLE public.habit_schedules 
        ALTER COLUMN time TYPE TEXT USING time::TEXT;
    END IF;
END $$;

-- STEP 3: Ensure habit_completions table exists
-- ============================================
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

-- STEP 4: Create Performance Indexes
-- ============================================
CREATE INDEX IF NOT EXISTS idx_habit_completions_habit_id ON public.habit_completions(habit_id);
CREATE INDEX IF NOT EXISTS idx_habit_completions_user_id ON public.habit_completions(user_id);
CREATE INDEX IF NOT EXISTS idx_habit_completions_date ON public.habit_completions(completion_date);
CREATE INDEX IF NOT EXISTS idx_habit_completions_status ON public.habit_completions(status);
CREATE INDEX IF NOT EXISTS idx_habit_completions_habit_date_status 
    ON public.habit_completions(habit_id, completion_date, status);

CREATE INDEX IF NOT EXISTS idx_habit_schedules_habit_id ON public.habit_schedules(habit_id);
CREATE INDEX IF NOT EXISTS idx_habit_schedules_day ON public.habit_schedules(day_of_week);
CREATE INDEX IF NOT EXISTS idx_habit_schedules_enabled ON public.habit_schedules(enabled);

-- STEP 5: Enable Row Level Security
-- ============================================
ALTER TABLE public.habits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.habit_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.habit_completions ENABLE ROW LEVEL SECURITY;

-- STEP 6: Create/Update RLS Policies
-- ============================================
-- Drop existing policies
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

-- Create policies for habit_completions
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

-- Create policies for habit_schedules
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

-- Create policies for habits
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

-- STEP 7: Create Update Triggers
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_habits_updated_at ON public.habits;
CREATE TRIGGER update_habits_updated_at 
    BEFORE UPDATE ON public.habits
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_habit_schedules_updated_at ON public.habit_schedules;
CREATE TRIGGER update_habit_schedules_updated_at 
    BEFORE UPDATE ON public.habit_schedules
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- STEP 8: Add Documentation Comments
-- ============================================
COMMENT ON TABLE public.habit_completions IS 'Daily completion records for habits. Status can be "completed" or "missed". Past days with status are locked from editing.';
COMMENT ON COLUMN public.habit_completions.status IS 'Status: "completed" or "missed". Past days with this status cannot have their schedule edited.';
COMMENT ON COLUMN public.habit_completions.completion_date IS 'Date of completion. Used to determine if a day is in the past for locking purposes.';
COMMENT ON TABLE public.habit_schedules IS 'Schedule for each day of the week for a habit. Users can edit times for present and future days only.';
COMMENT ON COLUMN public.habit_schedules.time IS 'Time in HH:MM format (24-hour) for the reminder on this day';
COMMENT ON COLUMN public.habit_schedules.day_of_week IS 'Day of week: 0=Sunday, 1=Monday, 2=Tuesday, 3=Wednesday, 4=Thursday, 5=Friday, 6=Saturday';

-- ============================================
-- VERIFICATION QUERIES (Optional)
-- ============================================
-- Uncomment these to verify everything is set up correctly:

-- Check status column exists
-- SELECT column_name, data_type, is_nullable, column_default
-- FROM information_schema.columns 
-- WHERE table_schema = 'public' 
-- AND table_name = 'habit_completions'
-- AND column_name = 'status';

-- Check indexes
-- SELECT indexname, indexdef 
-- FROM pg_indexes 
-- WHERE schemaname = 'public' 
-- AND tablename IN ('habit_completions', 'habit_schedules')
-- ORDER BY tablename, indexname;

-- Check policies
-- SELECT schemaname, tablename, policyname, cmd
-- FROM pg_policies 
-- WHERE schemaname = 'public'
-- AND tablename IN ('habits', 'habit_schedules', 'habit_completions')
-- ORDER BY tablename, policyname;

