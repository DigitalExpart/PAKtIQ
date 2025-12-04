-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT,
    avatar_url TEXT,
    onboarding_completed BOOLEAN DEFAULT false,
    premium BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create pakts table (resolutions/commitments)
CREATE TABLE IF NOT EXISTS public.pakts (
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

-- Create milestones table
CREATE TABLE IF NOT EXISTS public.milestones (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pakt_id UUID NOT NULL REFERENCES public.pakts(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    due_date TIMESTAMP WITH TIME ZONE NOT NULL,
    notes TEXT,
    importance INTEGER DEFAULT 1 CHECK (importance >= 1 AND importance <= 5),
    completed BOOLEAN DEFAULT false,
    completed_at TIMESTAMP WITH TIME ZONE,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create reminders table
CREATE TABLE IF NOT EXISTS public.reminders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pakt_id UUID NOT NULL REFERENCES public.pakts(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    frequency TEXT NOT NULL CHECK (frequency IN ('daily', 'weekly', 'custom')),
    time TEXT NOT NULL,
    days TEXT[],
    enabled BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create achievements table
CREATE TABLE IF NOT EXISTS public.achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    icon TEXT NOT NULL,
    earned_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    metadata JSONB
);

-- Create activity_log table
CREATE TABLE IF NOT EXISTS public.activity_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    pakt_id UUID REFERENCES public.pakts(id) ON DELETE CASCADE,
    milestone_id UUID REFERENCES public.milestones(id) ON DELETE CASCADE,
    action_type TEXT NOT NULL,
    description TEXT NOT NULL,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_pakts_user_id ON public.pakts(user_id);
CREATE INDEX IF NOT EXISTS idx_pakts_status ON public.pakts(status);
CREATE INDEX IF NOT EXISTS idx_milestones_pakt_id ON public.milestones(pakt_id);
CREATE INDEX IF NOT EXISTS idx_milestones_user_id ON public.milestones(user_id);
CREATE INDEX IF NOT EXISTS idx_milestones_completed ON public.milestones(completed);
CREATE INDEX IF NOT EXISTS idx_reminders_pakt_id ON public.reminders(pakt_id);
CREATE INDEX IF NOT EXISTS idx_achievements_user_id ON public.achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_log_user_id ON public.activity_log(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_log_pakt_id ON public.activity_log(pakt_id);

-- Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pakts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_log ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Users can view their own profile"
    ON public.profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id);

-- Create RLS policies for pakts
CREATE POLICY "Users can view their own pakts"
    ON public.pakts FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own pakts"
    ON public.pakts FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own pakts"
    ON public.pakts FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own pakts"
    ON public.pakts FOR DELETE
    USING (auth.uid() = user_id);

-- Create RLS policies for milestones
CREATE POLICY "Users can view their own milestones"
    ON public.milestones FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own milestones"
    ON public.milestones FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own milestones"
    ON public.milestones FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own milestones"
    ON public.milestones FOR DELETE
    USING (auth.uid() = user_id);

-- Create RLS policies for reminders
CREATE POLICY "Users can view their own reminders"
    ON public.reminders FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own reminders"
    ON public.reminders FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reminders"
    ON public.reminders FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reminders"
    ON public.reminders FOR DELETE
    USING (auth.uid() = user_id);

-- Create RLS policies for achievements
CREATE POLICY "Users can view their own achievements"
    ON public.achievements FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own achievements"
    ON public.achievements FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for activity_log
CREATE POLICY "Users can view their own activity log"
    ON public.activity_log FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own activity log"
    ON public.activity_log FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER set_updated_at_profiles
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at_pakts
    BEFORE UPDATE ON public.pakts
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at_milestones
    BEFORE UPDATE ON public.milestones
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at_reminders
    BEFORE UPDATE ON public.reminders
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- Create function to automatically create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, avatar_url)
    VALUES (
        NEW.id,
        NEW.email,
        NEW.raw_user_meta_data->>'full_name',
        NEW.raw_user_meta_data->>'avatar_url'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to create profile on new user signup
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- Create function to calculate pakt progress based on completed milestones
CREATE OR REPLACE FUNCTION public.calculate_pakt_progress(pakt_uuid UUID)
RETURNS INTEGER AS $$
DECLARE
    total_milestones INTEGER;
    completed_milestones INTEGER;
    progress INTEGER;
BEGIN
    SELECT COUNT(*) INTO total_milestones
    FROM public.milestones
    WHERE pakt_id = pakt_uuid;

    IF total_milestones = 0 THEN
        RETURN 0;
    END IF;

    SELECT COUNT(*) INTO completed_milestones
    FROM public.milestones
    WHERE pakt_id = pakt_uuid AND completed = true;

    progress := ROUND((completed_milestones::DECIMAL / total_milestones::DECIMAL) * 100);
    
    RETURN progress;
END;
$$ LANGUAGE plpgsql;

-- Create function to update pakt progress when milestone changes
CREATE OR REPLACE FUNCTION public.update_pakt_progress()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.pakts
    SET progress = public.calculate_pakt_progress(
        CASE 
            WHEN TG_OP = 'DELETE' THEN OLD.pakt_id
            ELSE NEW.pakt_id
        END
    )
    WHERE id = CASE 
        WHEN TG_OP = 'DELETE' THEN OLD.pakt_id
        ELSE NEW.pakt_id
    END;
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-update pakt progress
CREATE TRIGGER update_pakt_progress_on_milestone_change
    AFTER INSERT OR UPDATE OR DELETE ON public.milestones
    FOR EACH ROW
    EXECUTE FUNCTION public.update_pakt_progress();

