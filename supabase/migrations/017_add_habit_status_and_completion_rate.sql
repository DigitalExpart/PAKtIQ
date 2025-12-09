-- Add status and completion_rate columns to habits table
ALTER TABLE public.habits
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed')),
ADD COLUMN IF NOT EXISTS completion_rate INTEGER DEFAULT 0 CHECK (completion_rate >= 0 AND completion_rate <= 100);

-- Update existing habits to have 'active' status
UPDATE public.habits
SET status = 'active'
WHERE status IS NULL;

-- Make status NOT NULL after updating existing records
ALTER TABLE public.habits
ALTER COLUMN status SET NOT NULL;

-- Add index for better query performance
CREATE INDEX IF NOT EXISTS idx_habits_status ON public.habits(status);
