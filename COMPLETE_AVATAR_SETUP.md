# Complete Avatar Bucket Setup - SQL Script

This guide provides SQL code to create the bucket AND set up all policies in one go.

## Quick Setup

### Option 1: Run Complete SQL (If you have permissions)

1. **Go to Supabase SQL Editor**
   - Navigate to: https://mirpnmrsjjmmiqbbawab.supabase.co
   - Click **SQL Editor** → **New Query**

2. **Run the Complete Script**
   - Open: `supabase/migrations/004_complete_avatar_setup.sql`
   - Copy **ALL** contents
   - Paste into SQL Editor
   - Click **RUN**

3. **What it does:**
   - ✅ Creates the `avatars` bucket (or updates if exists)
   - ✅ Creates helper function (optional, can fail)
   - ✅ Creates 4 security policies using simple expressions

### Option 2: If You Get Permission Errors

If you get "permission denied for schema storage" errors:

#### Step 1: Create Bucket via UI
1. Go to **Storage** → **New Bucket**
2. Name: `avatars`
3. Public: **Yes** (toggle ON)
4. File size limit: `5242880` (5MB)
5. Allowed MIME types: `image/jpeg,image/png,image/jpg,image/webp`
6. Click **Create**

#### Step 2: Run Only Policies SQL
Run this SQL (policies only, no bucket creation):

```sql
-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can upload their own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view avatars" ON storage.objects;

-- Policy 1: Public View Access
CREATE POLICY "Anyone can view avatars"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'avatars');

-- Policy 2: Users can upload their own avatar
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
```

### Option 3: Use Storage Policies UI (No SQL Permissions Needed)

If SQL still fails, use the UI method (see `AVATAR_POLICIES_UI_SETUP.md`)

## What the Policies Do

1. **Public View**: Anyone can view avatar images (public bucket)
2. **Upload**: Authenticated users can upload files starting with their user ID
3. **Update**: Users can only update their own files
4. **Delete**: Users can only delete their own files

## File Naming Format

Files must be named: `{userId}-{timestamp}.{ext}`

Example: `550e8400-e29b-41d4-a716-446655440000-1701234567890.jpg`

This matches your `StorageService` implementation.

## Verification

After running the SQL:

1. **Check bucket exists:**
   ```sql
   SELECT * FROM storage.buckets WHERE id = 'avatars';
   ```

2. **Check policies exist:**
   ```sql
   SELECT policyname, cmd, roles 
   FROM pg_policies 
   WHERE tablename = 'objects' 
   AND schemaname = 'storage' 
   AND policyname LIKE '%avatar%';
   ```

3. **Or check via UI:**
   - Go to **Storage** → **avatars** bucket → **Policies** tab
   - You should see 4 policies listed

## Troubleshooting

### "permission denied for schema storage"
- Use **Option 2** (create bucket via UI, then run policies SQL)
- Or use **Option 3** (complete UI setup)

### "bucket already exists"
- That's fine! The SQL uses `ON CONFLICT DO UPDATE` to update settings
- Or skip the bucket creation part and run only policies

### Policies not working
- Verify bucket name is exactly `avatars` (case-sensitive)
- Check that file naming matches: `userId-timestamp.ext`
- Ensure user is authenticated when uploading

### Helper function fails
- That's okay! The policies work without it
- They use direct SQL expressions: `name LIKE auth.uid()::text || '-%'`
