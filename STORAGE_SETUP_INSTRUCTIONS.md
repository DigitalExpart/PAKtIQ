# 📦 Storage Setup Instructions - Avatar Upload Fix

## Problem

Getting "Permission denied" error when trying to upload profile images because:
1. The `avatars` storage bucket doesn't exist
2. Storage policies are not configured

## Solution

You need to do TWO things:

### Step 1: Create the Storage Bucket (Manual - Required First)

**You MUST do this first before running the SQL migration!**

1. Go to your Supabase Dashboard: https://mirpnmrsjjmmiqbbawab.supabase.co
2. Click **Storage** in the left sidebar
3. Click **New Bucket** button
4. Fill in the form:
   - **Name**: `avatars`
   - **Public bucket**: ✅ **Check this** (important!)
   - **File size limit**: `5242880` (5MB)
   - **Allowed MIME types**: 
     - `image/jpeg`
     - `image/png`
     - `image/gif`
     - `image/webp`
5. Click **Create**

### Step 2: Run the SQL Migration (After Bucket is Created)

1. Go to **SQL Editor** in the left sidebar
2. Click **New Query**
3. Open the file: `supabase/migrations/022_fix_storage_policies.sql`
4. Copy **ALL** contents and paste into the SQL Editor
5. Click **RUN** (or press Ctrl/Cmd + Enter)
6. You should see: **"Success. No rows returned"**

## Why Two Steps?

Supabase doesn't allow creating storage buckets via SQL in most cases due to permission restrictions. The bucket must be created through the Dashboard UI first, then the policies can be set up via SQL.

## Verify It Worked

After completing both steps, verify:

1. **Check bucket exists:**
   - Go to Storage
   - You should see "avatars" bucket listed

2. **Check policies:**
   - Go to SQL Editor
   - Run this query:
   ```sql
   SELECT policyname, cmd, roles 
   FROM pg_policies 
   WHERE tablename = 'objects' 
   AND schemaname = 'storage' 
   AND policyname LIKE '%avatar%';
   ```
   - You should see 4 policies listed

3. **Test upload:**
   - Try uploading a profile image in your app
   - Should work without permission errors!

## What the Policies Do

- ✅ **Users can upload their own avatars** - Users can only upload to `{userId}/{filename}` path
- ✅ **Users can update their own avatars** - Users can only update files in their own folder
- ✅ **Users can delete their own avatars** - Users can only delete files in their own folder
- ✅ **Public can view avatars** - Anyone can view profile images (for displaying in the app)

## File Path Format

Files are stored as:
```
avatars/
  └── {userId}/
      └── {timestamp}.{ext}
```

Example:
```
avatars/
  └── 123e4567-e89b-12d3-a456-426614174000/
      └── 1704067200000.jpg
```

This ensures users can only access their own files.

## Troubleshooting

### Error: "permission denied for schema storage"
- **Solution**: Make sure you created the bucket manually first (Step 1)
- The SQL migration only creates policies, not the bucket itself

### Error: "bucket not found"
- **Solution**: You skipped Step 1 - create the bucket in Storage Dashboard first

### Error: "policy already exists"
- **Solution**: The migration will drop old policies first, so this shouldn't happen
- If it does, manually drop the policy and re-run the migration

### Still getting permission errors after setup
- **Check**: Make sure the bucket is set to **Public**
- **Check**: Verify all 4 policies were created (run the verification query)
- **Check**: Make sure you're logged in when trying to upload

## Quick Checklist

- [ ] Created `avatars` bucket in Storage Dashboard
- [ ] Set bucket to **Public**
- [ ] Set file size limit to 5MB
- [ ] Added allowed MIME types
- [ ] Ran SQL migration `022_fix_storage_policies.sql`
- [ ] Verified 4 policies were created
- [ ] Tested image upload in app
