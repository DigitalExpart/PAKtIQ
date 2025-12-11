-- ============================================
-- SUPABASE SQL: Rename pakts to resolves
-- ============================================
-- Run this script in your Supabase SQL Editor
-- This will rename the 'pakts' table to 'resolves' and update all references

-- Step 1: Rename table
ALTER TABLE IF EXISTS public.pakts RENAME TO resolves;
-- OR if table is capitalized:
-- ALTER TABLE IF EXISTS public."Resolves" RENAME TO resolves;

-- Step 2: Rename columns in related tables
ALTER TABLE IF EXISTS public.milestones RENAME COLUMN pakt_id TO resolve_id;
ALTER TABLE IF EXISTS public.reminders RENAME COLUMN pakt_id TO resolve_id;
ALTER TABLE IF EXISTS public.activity_log RENAME COLUMN pakt_id TO resolve_id;

-- Step 3: Update foreign key constraints (drop and recreate)
ALTER TABLE public.milestones DROP CONSTRAINT IF EXISTS milestones_pakt_id_fkey;
ALTER TABLE public.milestones ADD CONSTRAINT milestones_resolve_id_fkey 
    FOREIGN KEY (resolve_id) REFERENCES public.resolves(id) ON DELETE CASCADE;

ALTER TABLE public.reminders DROP CONSTRAINT IF EXISTS reminders_pakt_id_fkey;
ALTER TABLE public.reminders ADD CONSTRAINT reminders_resolve_id_fkey 
    FOREIGN KEY (resolve_id) REFERENCES public.resolves(id) ON DELETE CASCADE;

ALTER TABLE public.activity_log DROP CONSTRAINT IF EXISTS activity_log_pakt_id_fkey;
ALTER TABLE public.activity_log ADD CONSTRAINT activity_log_resolve_id_fkey 
    FOREIGN KEY (resolve_id) REFERENCES public.resolves(id) ON DELETE CASCADE;

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

-- Step 5: Update RLS policies
DROP POLICY IF EXISTS "Users can view their own Resolves" ON public.resolves;
DROP POLICY IF EXISTS "Users can view their own pakts" ON public.resolves;
DROP POLICY IF EXISTS "Users can create their own Resolves" ON public.resolves;
DROP POLICY IF EXISTS "Users can create their own pakts" ON public.resolves;
DROP POLICY IF EXISTS "Users can update their own Resolves" ON public.resolves;
DROP POLICY IF EXISTS "Users can update their own pakts" ON public.resolves;
DROP POLICY IF EXISTS "Users can delete their own Resolves" ON public.resolves;
DROP POLICY IF EXISTS "Users can delete their own pakts" ON public.resolves;

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

-- Done! The table is now renamed from 'pakts' to 'resolves'

