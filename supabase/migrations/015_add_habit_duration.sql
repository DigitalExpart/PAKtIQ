-- Add duration_weeks column to habits table
ALTER TABLE public.habits 
ADD COLUMN IF NOT EXISTS duration_weeks INTEGER DEFAULT NULL;

-- Add start_date column to track when habit cycle started
ALTER TABLE public.habits 
ADD COLUMN IF NOT EXISTS start_date DATE DEFAULT CURRENT_DATE;

-- Add index for better query performance
CREATE INDEX IF NOT EXISTS idx_habits_start_date ON public.habits(start_date);
