-- Fix storage policies for avatars bucket
-- This ensures users can upload, update, and delete their own profile images
-- 
-- IMPORTANT: Create the bucket manually first if it doesn't exist:
-- 1. Go to Storage in Supabase Dashboard
-- 2. Click "New Bucket"
-- 3. Name: avatars
-- 4. Public: Yes (checked)
-- 5. File size limit: 5242880 (5MB)
-- 6. Allowed MIME types: image/jpeg, image/png, image/gif, image/webp
-- 7. Click "Create"
--
-- Then run this migration to set up the policies

-- Step 1: Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Users can upload their own avatars" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own avatars" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own avatars" ON storage.objects;
DROP POLICY IF EXISTS "Public can view avatars" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view avatars" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload their own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own avatar" ON storage.objects;

-- Step 2: Create policies for avatars bucket
-- File path format: {userId}/{filename}
-- Example: "123e4567-e89b-12d3-a456-426614174000/1704067200000.jpg"

-- Policy 1: Allow authenticated users to upload their own avatars
-- File must be in a folder named with their user ID
CREATE POLICY "Users can upload their own avatars"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'avatars' AND
  (string_to_array(name, '/'))[1] = auth.uid()::text
);

-- Policy 2: Allow authenticated users to update their own avatars
CREATE POLICY "Users can update their own avatars"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'avatars' AND
  (string_to_array(name, '/'))[1] = auth.uid()::text
)
WITH CHECK (
  bucket_id = 'avatars' AND
  (string_to_array(name, '/'))[1] = auth.uid()::text
);

-- Policy 3: Allow authenticated users to delete their own avatars
CREATE POLICY "Users can delete their own avatars"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'avatars' AND
  (string_to_array(name, '/'))[1] = auth.uid()::text
);

-- Policy 4: Allow public to view avatars (since bucket is public)
CREATE POLICY "Public can view avatars"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'avatars');

-- Step 3: Verify the setup (run these queries separately to check)
-- SELECT * FROM storage.buckets WHERE id = 'avatars';
-- SELECT policyname, cmd, roles FROM pg_policies 
-- WHERE tablename = 'objects' AND schemaname = 'storage' 
-- AND policyname LIKE '%avatar%';
