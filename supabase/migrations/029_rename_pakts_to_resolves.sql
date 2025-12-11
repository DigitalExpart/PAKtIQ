-- Migration: Rename pakts table to resolves
-- This migration renames the 'pakts' table to 'resolves' and updates all related references

-- ============================================
-- STEP 1: Rename the table if it exists as 'pakts'
-- ============================================
DO $$
BEGIN
    -- Check if 'pakts' table exists (case-insensitive check)
    IF EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND LOWER(table_name) = 'pakts'
    ) THEN
        -- Rename pakts to resolves (lowercase)
        EXECUTE 'ALTER TABLE IF EXISTS public.pakts RENAME TO resolves';
        RAISE NOTICE 'Table "pakts" renamed to "resolves"';
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

-- ============================================
-- STEP 2: Ensure resolves table exists with correct structure
-- ============================================
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

-- ============================================
-- STEP 3: Rename pakt_id columns to resolve_id
-- ============================================

-- Rename pakt_id to resolve_id in milestones table
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

-- Rename pakt_id to resolve_id in reminders table
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

-- Rename pakt_id to resolve_id in activity_log table
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

-- ============================================
-- STEP 4: Update foreign key constraints
-- ============================================

-- Update milestones foreign key
DO $$
BEGIN
    -- Drop old foreign key if it exists
    IF EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_schema = 'public' 
        AND table_name = 'milestones' 
        AND constraint_name LIKE '%pakt%'
    ) THEN
        ALTER TABLE public.milestones DROP CONSTRAINT IF EXISTS milestones_pakt_id_fkey;
    END IF;
    
    -- Add new foreign key if resolve_id exists and constraint doesn't exist
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'milestones' 
        AND column_name = 'resolve_id'
    ) AND NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_schema = 'public' 
        AND table_name = 'milestones' 
        AND constraint_name = 'milestones_resolve_id_fkey'
    ) THEN
        ALTER TABLE public.milestones 
        ADD CONSTRAINT milestones_resolve_id_fkey 
        FOREIGN KEY (resolve_id) REFERENCES public.resolves(id) ON DELETE CASCADE;
    END IF;
END $$;

-- Update reminders foreign key
DO $$
BEGIN
    -- Drop old foreign key if it exists
    IF EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_schema = 'public' 
        AND table_name = 'reminders' 
        AND constraint_name LIKE '%pakt%'
    ) THEN
        ALTER TABLE public.reminders DROP CONSTRAINT IF EXISTS reminders_pakt_id_fkey;
    END IF;
    
    -- Add new foreign key if resolve_id exists and constraint doesn't exist
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'reminders' 
        AND column_name = 'resolve_id'
    ) AND NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_schema = 'public' 
        AND table_name = 'reminders' 
        AND constraint_name = 'reminders_resolve_id_fkey'
    ) THEN
        ALTER TABLE public.reminders 
        ADD CONSTRAINT reminders_resolve_id_fkey 
        FOREIGN KEY (resolve_id) REFERENCES public.resolves(id) ON DELETE CASCADE;
    END IF;
END $$;

-- Update activity_log foreign key
DO $$
BEGIN
    -- Drop old foreign key if it exists
    IF EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_schema = 'public' 
        AND table_name = 'activity_log' 
        AND constraint_name LIKE '%pakt%'
    ) THEN
        ALTER TABLE public.activity_log DROP CONSTRAINT IF EXISTS activity_log_pakt_id_fkey;
    END IF;
    
    -- Add new foreign key if resolve_id exists and constraint doesn't exist
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'activity_log' 
        AND column_name = 'resolve_id'
    ) AND NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_schema = 'public' 
        AND table_name = 'activity_log' 
        AND constraint_name = 'activity_log_resolve_id_fkey'
    ) THEN
        ALTER TABLE public.activity_log 
        ADD CONSTRAINT activity_log_resolve_id_fkey 
        FOREIGN KEY (resolve_id) REFERENCES public.resolves(id) ON DELETE CASCADE;
    END IF;
END $$;

-- ============================================
-- STEP 5: Update indexes
-- ============================================

-- Rename indexes
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

-- ============================================
-- STEP 6: Update RLS policies
-- ============================================

-- Drop old policies if they exist
DROP POLICY IF EXISTS "Users can view their own Resolves" ON public.resolves;
DROP POLICY IF EXISTS "Users can view their own pakts" ON public.resolves;
DROP POLICY IF EXISTS "Users can create their own Resolves" ON public.resolves;
DROP POLICY IF EXISTS "Users can create their own pakts" ON public.resolves;
DROP POLICY IF EXISTS "Users can update their own Resolves" ON public.resolves;
DROP POLICY IF EXISTS "Users can update their own pakts" ON public.resolves;
DROP POLICY IF EXISTS "Users can delete their own Resolves" ON public.resolves;
DROP POLICY IF EXISTS "Users can delete their own pakts" ON public.resolves;

-- Create new policies for resolves table
ALTER TABLE public.resolves ENABLE ROW LEVEL SECURITY;

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

-- ============================================
-- STEP 7: Update triggers and functions that reference pakts
-- ============================================

-- Note: Any triggers or functions that reference 'pakts' or 'pakt_id' 
-- will need to be updated separately. Check for:
-- - Progress calculation triggers
-- - Notification triggers
-- - Analytics triggers

-- ============================================
-- STEP 8: Migrate data if pakts table had data
-- ============================================

-- Copy data from old table to new table if needed
DO $$
BEGIN
    -- If pakts table still exists with data, copy to resolves
    IF EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND LOWER(table_name) = 'pakts'
    ) AND EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'resolves'
    ) THEN
        -- Only copy if resolves is empty
        IF NOT EXISTS (SELECT 1 FROM public.resolves LIMIT 1) THEN
            INSERT INTO public.resolves 
            SELECT * FROM public.pakts
            ON CONFLICT (id) DO NOTHING;
            RAISE NOTICE 'Copied data from pakts to resolves';
        END IF;
    END IF;
END $$;

-- ============================================
-- VERIFICATION
-- ============================================
-- After running this migration, verify:
-- 1. Table 'resolves' exists (lowercase)
-- 2. Columns 'resolve_id' exist in milestones, reminders, activity_log
-- 3. Foreign keys are properly set up
-- 4. Indexes are created
-- 5. RLS policies are active

