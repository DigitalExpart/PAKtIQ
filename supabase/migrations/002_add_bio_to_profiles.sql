-- Add bio field to profiles table
-- This migration adds a bio field to store user biography/description

-- Add bio column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS bio TEXT;

-- Add comment to document the field
COMMENT ON COLUMN public.profiles.bio IS 'User biography or description (max 500 characters)';

