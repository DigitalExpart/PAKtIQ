-- Migration: Ensure Habit and Milestone Edit Permissions
-- This migration ensures all necessary permissions and constraints are in place
-- for editing habits (including schedules) and milestones

-- ============================================
-- HABITS TABLE - Ensure all edit capabilities
-- ============================================

-- Ensure habits table has all necessary columns for editing
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

    -- Add start_date if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'habits' 
        AND column_name = 'start_date'
    ) THEN
        ALTER TABLE public.habits ADD COLUMN start_date TIMESTAMP WITH TIME ZONE;
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

    -- Add completion_rate if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'habits' 
        AND column_name = 'completion_rate'
    ) THEN
        ALTER TABLE public.habits ADD COLUMN completion_rate INTEGER DEFAULT 0 CHECK (completion_rate >= 0 AND completion_rate <= 100);
    END IF;
END $$;

-- Ensure habit_schedules table has proper constraints
DO $$
BEGIN
    -- Ensure UNIQUE constraint exists on (habit_id, day_of_week)
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'habit_schedules_habit_id_day_of_week_key'
    ) THEN
        ALTER TABLE public.habit_schedules 
        ADD CONSTRAINT habit_schedules_habit_id_day_of_week_key 
        UNIQUE(habit_id, day_of_week);
    END IF;
END $$;

-- Ensure habit_completions has status column for editing completion status
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
    END IF;
END $$;

-- ============================================
-- MILESTONES TABLE - Ensure all edit capabilities
-- ============================================

-- Ensure milestones table has all necessary columns (should already exist, but verify)
DO $$
BEGIN
    -- Ensure due_date constraint exists (milestone deadline should not exceed Resolve deadline)
    -- This is handled at application level, but we can add a check constraint if needed
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'milestones_due_date_check'
    ) THEN
        -- Note: We can't easily add a cross-table constraint here
        -- This validation is handled in the application layer
        NULL;
    END IF;
END $$;

-- ============================================
-- RLS POLICIES - Ensure all edit permissions exist
-- ============================================

-- Drop and recreate habits policies to ensure they're correct
DROP POLICY IF EXISTS "Users can view their own habits" ON public.habits;
DROP POLICY IF EXISTS "Users can insert their own habits" ON public.habits;
DROP POLICY IF EXISTS "Users can update their own habits" ON public.habits;
DROP POLICY IF EXISTS "Users can delete their own habits" ON public.habits;

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

-- Drop and recreate habit_schedules policies
DROP POLICY IF EXISTS "Users can view their own habit schedules" ON public.habit_schedules;
DROP POLICY IF EXISTS "Users can insert their own habit schedules" ON public.habit_schedules;
DROP POLICY IF EXISTS "Users can update their own habit schedules" ON public.habit_schedules;
DROP POLICY IF EXISTS "Users can delete their own habit schedules" ON public.habit_schedules;

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

-- Drop and recreate habit_completions policies
DROP POLICY IF EXISTS "Users can view their own habit completions" ON public.habit_completions;
DROP POLICY IF EXISTS "Users can insert their own habit completions" ON public.habit_completions;
DROP POLICY IF EXISTS "Users can update their own habit completions" ON public.habit_completions;
DROP POLICY IF EXISTS "Users can delete their own habit completions" ON public.habit_completions;

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

-- Ensure milestones policies exist (should already be there, but verify)
DROP POLICY IF EXISTS "Users can view their own milestones" ON public.milestones;
DROP POLICY IF EXISTS "Users can create their own milestones" ON public.milestones;
DROP POLICY IF EXISTS "Users can update their own milestones" ON public.milestones;
DROP POLICY IF EXISTS "Users can delete their own milestones" ON public.milestones;

CREATE POLICY "Users can view their own milestones"
    ON public.milestones FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own milestones"
    ON public.milestones FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own milestones"
    ON public.milestones FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own milestones"
    ON public.milestones FOR DELETE
    USING (auth.uid() = user_id);

-- ============================================
-- TRIGGERS - Ensure updated_at triggers exist
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

-- Ensure triggers exist for milestones (should already exist, but verify)
DROP TRIGGER IF EXISTS set_updated_at_milestones ON public.milestones;
CREATE TRIGGER set_updated_at_milestones
    BEFORE UPDATE ON public.milestones
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- If handle_updated_at doesn't exist, create it
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- INDEXES - Ensure performance indexes exist
-- ============================================

-- Indexes for habits
CREATE INDEX IF NOT EXISTS idx_habits_user_id ON public.habits(user_id);
CREATE INDEX IF NOT EXISTS idx_habits_enabled ON public.habits(enabled);
CREATE INDEX IF NOT EXISTS idx_habits_status ON public.habits(status);

-- Indexes for habit_schedules
CREATE INDEX IF NOT EXISTS idx_habit_schedules_habit_id ON public.habit_schedules(habit_id);
CREATE INDEX IF NOT EXISTS idx_habit_schedules_day ON public.habit_schedules(day_of_week);
CREATE INDEX IF NOT EXISTS idx_habit_schedules_enabled ON public.habit_schedules(enabled);

-- Indexes for habit_completions
CREATE INDEX IF NOT EXISTS idx_habit_completions_habit_id ON public.habit_completions(habit_id);
CREATE INDEX IF NOT EXISTS idx_habit_completions_user_id ON public.habit_completions(user_id);
CREATE INDEX IF NOT EXISTS idx_habit_completions_date ON public.habit_completions(completion_date);
CREATE INDEX IF NOT EXISTS idx_habit_completions_status ON public.habit_completions(status);

-- Indexes for milestones (should already exist, but verify)
CREATE INDEX IF NOT EXISTS idx_milestones_pakt_id ON public.milestones(pakt_id);
CREATE INDEX IF NOT EXISTS idx_milestones_user_id ON public.milestones(user_id);
CREATE INDEX IF NOT EXISTS idx_milestones_completed ON public.milestones(completed);
CREATE INDEX IF NOT EXISTS idx_milestones_due_date ON public.milestones(due_date);
CREATE INDEX IF NOT EXISTS idx_milestones_order_index ON public.milestones(order_index);

-- ============================================
-- COMMENTS - Document the tables and columns
-- ============================================

COMMENT ON TABLE public.habits IS 'Daily habits that users can track and edit';
COMMENT ON TABLE public.habit_schedules IS 'Schedule for each day of the week for a habit. Users can add/remove days and change times.';
COMMENT ON TABLE public.habit_completions IS 'Daily completion records for habits. Status can be edited between completed and missed.';
COMMENT ON TABLE public.milestones IS 'Milestones for Resolves. Users can edit name, due_date, notes, and order.';

COMMENT ON COLUMN public.habit_schedules.day_of_week IS 'Day of week: 0=Sunday, 1=Monday, 2=Tuesday, 3=Wednesday, 4=Thursday, 5=Friday, 6=Saturday';
COMMENT ON COLUMN public.habit_schedules.time IS 'Time in HH:MM format for the reminder on this day';
COMMENT ON COLUMN public.habit_schedules.enabled IS 'Whether this schedule entry is active (can be toggled to add/remove days)';
COMMENT ON COLUMN public.habit_completions.status IS 'Status: completed or missed. Can be edited to change completion status.';
COMMENT ON COLUMN public.milestones.order_index IS 'Order of milestone within the Resolve. Can be edited to reorder milestones.';

-- ============================================
-- VERIFICATION QUERIES (for testing)
-- ============================================

-- Uncomment these to verify the migration worked:
-- SELECT table_name, column_name, data_type 
-- FROM information_schema.columns 
-- WHERE table_schema = 'public' 
-- AND table_name IN ('habits', 'habit_schedules', 'habit_completions', 'milestones')
-- ORDER BY table_name, ordinal_position;

-- SELECT schemaname, tablename, policyname 
-- FROM pg_policies 
-- WHERE tablename IN ('habits', 'habit_schedules', 'habit_completions', 'milestones')
-- ORDER BY tablename, policyname;



