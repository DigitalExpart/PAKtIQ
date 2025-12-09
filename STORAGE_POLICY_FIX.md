# 🔧 Storage Policy Fix - Permission Denied Error

## Problem

Users are getting this error when trying to upload profile images:
```
Error uploading image: [Error: Permission denied. Please check storage policies in Supabase.]
```

## Root Cause

The Supabase storage bucket `avatars` either:
1. Doesn't exist
2. Doesn't have proper Row Level Security (RLS) policies
3. Has incorrect policies that don't allow users to upload to their own folders

## Solution

Created migration `022_fix_storage_policies.sql` that:

1. **Creates the avatars bucket** if it doesn't exist
2. **Enables RLS** on storage.objects
3. **Drops old/conflicting policies** to start fresh
4. **Creates helper function** to check file ownership
5. **Creates 4 policies**:
   - Users can upload their own avatars (to their user ID folder)
   - Users can update their own avatars
   - Users can delete their own avatars
   - Public can view avatars (for displaying profile pictures)

## How to Apply the Fix

### Step 1: Run the Migration in Supabase

1. Go to your Supabase Dashboard: https://mirpnmrsjjmmiqbbawab.supabase.co
2. Click **SQL Editor** in the left sidebar
3. Click **New Query**
4. Open the file: `supabase/migrations/022_fix_storage_policies.sql`
5. Copy **ALL** contents and paste into the SQL Editor
6. Click **RUN** (or press Ctrl/Cmd + Enter)
7. You should see: **"Success. No rows returned"**

### Step 2: Verify the Bucket Exists

1. Go to **Storage** in the left sidebar
2. You should see an **"avatars"** bucket
3. If it doesn't exist, create it manually:
   - Click **New Bucket**
   - Name: `avatars`
   - Public: **Yes** (checked)
   - File size limit: `5242880` (5MB)
   - Allowed MIME types: `image/jpeg, image/png, image/gif, image/webp`
   - Click **Create**

### Step 3: Verify Policies

Run this query in SQL Editor to check policies:
```sql
SELECT policyname, cmd, roles 
FROM pg_policies 
WHERE tablename = 'objects' 
AND schemaname = 'storage' 
AND policyname LIKE '%avatar%';
```

You should see 4 policies:
- ✅ Users can upload their own avatars
- ✅ Users can update their own avatars
- ✅ Users can delete their own avatars
- ✅ Public can view avatars

### Step 4: Test

After running the migration:
1. Try uploading a profile image
2. Should work without permission errors
3. Image should appear in your profile

## What Changed

### Before:
- No storage policies or incorrect policies
- Users couldn't upload images
- Permission denied errors

### After:
- ✅ Bucket created automatically
- ✅ RLS enabled
- ✅ Users can upload to `{userId}/{filename}` path
- ✅ Users can only modify their own files
- ✅ Public can view all avatars

## File Structure

The storage service uploads files to:
```
avatars/
  └── {userId}/
      └── {timestamp}.{ext}
```

For example:
```
avatars/
  └── 123e4567-e89b-12d3-a456-426614174000/
      └── 1704067200000.jpg
```

## Files Modified

1. **`supabase/migrations/022_fix_storage_policies.sql`** - New migration file
2. **`src/services/storage.service.ts`** - Already configured to use correct path format

## Testing

After applying the fix, test these scenarios:

1. ✅ **Upload profile image** - Should work without errors
2. ✅ **Update profile image** - Should replace old image
3. ✅ **View profile image** - Should display correctly
4. ✅ **Delete profile image** - Should remove from storage
5. ✅ **No permission errors** - Check browser console

## Notes

- The bucket is **public** so profile images can be viewed without authentication
- Users can only upload/update/delete files in their own folder (named with their user ID)
- File size limit is 5MB
- Only image types are allowed (JPEG, PNG, GIF, WebP)
- The migration is **idempotent** - safe to run multiple times

## Troubleshooting

If you still get permission errors after running the migration:

1. **Check if bucket exists:**
   ```sql
   SELECT * FROM storage.buckets WHERE id = 'avatars';
   ```

2. **Check if RLS is enabled:**
   ```sql
   SELECT tablename, rowsecurity 
   FROM pg_tables 
   WHERE schemaname = 'storage' AND tablename = 'objects';
   ```
   Should show `rowsecurity = true`

3. **Check policies:**
   ```sql
   SELECT * FROM pg_policies 
   WHERE schemaname = 'storage' AND tablename = 'objects';
   ```

4. **Manually create bucket** if migration fails:
   - Go to Storage > New Bucket
   - Name: `avatars`
   - Public: Yes
   - Then re-run the migration
