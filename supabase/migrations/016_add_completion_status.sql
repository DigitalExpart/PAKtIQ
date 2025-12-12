-- Add status column to habit_completions table
ALTER TABLE public.habit_completions 
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'completed' CHECK (status IN ('completed', 'missed'));

-- Update existing records to have 'completed' status
UPDATE public.habit_completions 
SET status = 'completed' 
WHERE status IS NULL;

-- Make status NOT NULL after updating existing records
ALTER TABLE public.habit_completions 
ALTER COLUMN status SET NOT NULL;

-- Add index for better query performance
CREATE INDEX IF NOT EXISTS idx_habit_completions_status ON public.habit_completions(status);
