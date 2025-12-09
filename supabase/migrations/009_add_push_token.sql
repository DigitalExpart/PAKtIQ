-- Add push_token column to profiles table for storing Expo push tokens
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS push_token TEXT;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_profiles_push_token ON public.profiles(push_token) WHERE push_token IS NOT NULL;
