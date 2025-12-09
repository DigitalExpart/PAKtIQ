-- Storage Policies for avatars bucket
-- Run this AFTER creating the bucket via Supabase Dashboard
-- This file contains only the policies, no bucket creation

-- Step 1: Create helper function to check file ownership
CREATE OR REPLACE FUNCTION storage.user_owns_file(file_name text, user_id uuid)
RETURNS boolean AS $$
BEGIN
  RETURN file_name LIKE user_id::text || '-%';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 2: Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Users can upload their own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view avatars" ON storage.objects;

-- Step 3: Create policies for the avatars bucket

-- Policy: Users can upload their own avatar
-- Files must start with their user ID (format: userId-timestamp.ext)
CREATE POLICY "Users can upload their own avatar"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'avatars' AND
  storage.user_owns_file(name, auth.uid())
);

-- Policy: Users can update their own avatar
CREATE POLICY "Users can update their own avatar"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'avatars' AND
  storage.user_owns_file(name, auth.uid())
)
WITH CHECK (
  bucket_id = 'avatars' AND
  storage.user_owns_file(name, auth.uid())
);

-- Policy: Users can delete their own avatar
CREATE POLICY "Users can delete their own avatar"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'avatars' AND
  storage.user_owns_file(name, auth.uid())
);

-- Policy: Anyone can view avatars (public bucket)
-- This makes the bucket public for viewing
CREATE POLICY "Anyone can view avatars"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'avatars');

