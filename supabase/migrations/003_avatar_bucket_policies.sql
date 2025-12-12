-- =====================================================
-- Avatar Bucket Storage Policies Setup
-- =====================================================
-- This script sets up Row Level Security (RLS) policies
-- for the 'avatars' storage bucket.
--
-- Prerequisites:
-- 1. The 'avatars' bucket must already exist in Storage
-- 2. Run this as a database administrator or with proper permissions
--
-- File naming format: {userId}-{timestamp}.{ext}
-- Example: 550e8400-e29b-41d4-a716-446655440000-1701234567890.jpg
-- =====================================================

-- Step 1: Create helper function to check file ownership
-- This function checks if a filename starts with the user's ID
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

-- Policy 1: Users can upload their own avatar
-- Only authenticated users can upload files that start with their user ID
CREATE POLICY "Users can upload their own avatar"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'avatars' AND
  storage.user_owns_file(name, auth.uid())
);

-- Policy 2: Users can update their own avatar
-- Users can only update files that belong to them
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

-- Policy 3: Users can delete their own avatar
-- Users can only delete files that belong to them
CREATE POLICY "Users can delete their own avatar"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'avatars' AND
  storage.user_owns_file(name, auth.uid())
);

-- Policy 4: Anyone can view avatars (public bucket)
-- This makes all avatar images publicly accessible
CREATE POLICY "Anyone can view avatars"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'avatars');

-- =====================================================
-- Verification Queries (Optional - run these to verify)
-- =====================================================

-- Check if helper function exists:
-- SELECT storage.user_owns_file('test-file', '00000000-0000-0000-0000-000000000000'::uuid);

-- Check existing policies:
-- SELECT * FROM pg_policies WHERE tablename = 'objects' AND schemaname = 'storage';

-- Check bucket exists:
-- SELECT * FROM storage.buckets WHERE id = 'avatars';
