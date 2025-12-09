-- =====================================================
-- Complete Avatar Bucket and Policies Setup
-- =====================================================
-- This script attempts to create the bucket AND set up policies
-- If you get permission errors, use the UI method instead
-- =====================================================

-- =====================================================
-- PART 1: Create Storage Bucket
-- =====================================================
-- Note: If this fails, create the bucket manually:
-- Storage > New Bucket > Name: avatars > Public: Yes

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'avatars',
  'avatars',
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/png', 'image/jpg', 'image/webp']
)
ON CONFLICT (id) DO UPDATE
SET 
  public = true,
  file_size_limit = 5242880,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];

-- =====================================================
-- PART 2: Create Helper Function (Optional)
-- =====================================================
-- If this fails due to permissions, skip to PART 3
-- The policies in PART 3 work without this function

CREATE OR REPLACE FUNCTION storage.user_owns_file(file_name text, user_id uuid)
RETURNS boolean AS $$
BEGIN
  RETURN file_name LIKE user_id::text || '-%';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- PART 3: Create Policies (Using Simple Expressions)
-- =====================================================
-- These policies work WITHOUT the helper function
-- They use direct SQL expressions instead

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can upload their own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view avatars" ON storage.objects;

-- Policy 1: Public View Access
-- Anyone can view avatar images
CREATE POLICY "Anyone can view avatars"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'avatars');

-- Policy 2: Users can upload their own avatar
-- Files must start with user's ID: userId-timestamp.ext
CREATE POLICY "Users can upload their own avatar"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'avatars' AND
  name LIKE auth.uid()::text || '-%'
);

-- Policy 3: Users can update their own avatar
CREATE POLICY "Users can update their own avatar"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'avatars' AND
  name LIKE auth.uid()::text || '-%'
)
WITH CHECK (
  bucket_id = 'avatars' AND
  name LIKE auth.uid()::text || '-%'
);

-- Policy 4: Users can delete their own avatar
CREATE POLICY "Users can delete their own avatar"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'avatars' AND
  name LIKE auth.uid()::text || '-%'
);

-- =====================================================
-- Verification (Optional)
-- =====================================================

-- Check if bucket exists:
-- SELECT * FROM storage.buckets WHERE id = 'avatars';

-- Check policies:
-- SELECT policyname, cmd, roles FROM pg_policies 
-- WHERE tablename = 'objects' AND schemaname = 'storage' 
-- AND policyname LIKE '%avatar%';
