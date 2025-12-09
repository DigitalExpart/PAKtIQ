-- Create habits table for daily habit tracking
CREATE TABLE IF NOT EXISTS public.habits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    category TEXT,
    enabled BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create habit_schedules table for day-specific times
CREATE TABLE IF NOT EXISTS public.habit_schedules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    habit_id UUID NOT NULL REFERENCES public.habits(id) ON DELETE CASCADE,
    day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6), -- 0 = Sunday, 1 = Monday, etc.
    time TIME NOT NULL,
    enabled BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(habit_id, day_of_week)
);

-- Create habit_completions table for tracking daily completions
CREATE TABLE IF NOT EXISTS public.habit_completions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    habit_id UUID NOT NULL REFERENCES public.habits(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    completion_date DATE NOT NULL,
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(habit_id, completion_date)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_habits_user_id ON public.habits(user_id);
CREATE INDEX IF NOT EXISTS idx_habits_enabled ON public.habits(enabled);
CREATE INDEX IF NOT EXISTS idx_habit_schedules_habit_id ON public.habit_schedules(habit_id);
CREATE INDEX IF NOT EXISTS idx_habit_schedules_day ON public.habit_schedules(day_of_week);
CREATE INDEX IF NOT EXISTS idx_habit_completions_habit_id ON public.habit_completions(habit_id);
CREATE INDEX IF NOT EXISTS idx_habit_completions_user_id ON public.habit_completions(user_id);
CREATE INDEX IF NOT EXISTS idx_habit_completions_date ON public.habit_completions(completion_date);

-- Enable Row Level Security
ALTER TABLE public.habits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.habit_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.habit_completions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for habits
CREATE POLICY "Users can view their own habits"
    ON public.habits FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own habits"
    ON public.habits FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own habits"
    ON public.habits FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own habits"
    ON public.habits FOR DELETE
    USING (auth.uid() = user_id);

-- RLS Policies for habit_schedules
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

-- RLS Policies for habit_completions
CREATE POLICY "Users can view their own habit completions"
    ON public.habit_completions FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own habit completions"
    ON public.habit_completions FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own habit completions"
    ON public.habit_completions FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own habit completions"
    ON public.habit_completions FOR DELETE
    USING (auth.uid() = user_id);

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_habits_updated_at BEFORE UPDATE ON public.habits
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_habit_schedules_updated_at BEFORE UPDATE ON public.habit_schedules
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
