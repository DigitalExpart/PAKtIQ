# Storage Bucket Setup for Profile Images

This guide will help you set up the `avatars` storage bucket in Supabase for profile image uploads.

## Quick Setup (Recommended Method)

### Method 1: Using Supabase Dashboard (Easiest)

1. **Create the Bucket via UI**
   - Go to your Supabase Dashboard: https://mirpnmrsjjmmiqbbawab.supabase.co
   - Click **Storage** in the left sidebar
   - Click **New bucket**
   - Name: `avatars`
   - Public bucket: **Yes** (toggle ON)
   - File size limit: `5242880` (5MB)
   - Allowed MIME types: `image/jpeg,image/png,image/jpg,image/webp`
   - Click **Create bucket**

2. **Set up RLS Policies via SQL**
   - Go to **SQL Editor** in the left sidebar
   - Click **New Query**
   - Open the file: `supabase/migrations/002_storage_avatars_simple.sql`
   - Copy **ALL** the contents (starting from the helper function)
   - Paste into the SQL Editor
   - Click **RUN** (or press Ctrl/Cmd + Enter)

3. **Verify Setup**
   - Go back to **Storage**
   - You should see the `avatars` bucket
   - The bucket should be marked as **Public**

### Method 2: Using SQL Only (If you have proper permissions)

1. **Go to your Supabase Dashboard**
   - Navigate to: https://mirpnmrsjjmmiqbbawab.supabase.co

2. **Open SQL Editor**
   - Click on **SQL Editor** in the left sidebar
   - Click **New Query**

3. **Run the Migration**
   - Open the file: `supabase/migrations/002_storage_avatars.sql`
   - Copy **ALL** the contents
   - Paste into the SQL Editor
   - Click **RUN** (or press Ctrl/Cmd + Enter)

4. **If you get permission errors**, use Method 1 instead

## What This Migration Does

1. **Creates the `avatars` bucket**
   - Public bucket (anyone can view images)
   - 5MB file size limit
   - Only allows image files (JPEG, PNG, JPG, WEBP)

2. **Sets up Row Level Security (RLS)**
   - Users can only upload/update/delete their own avatars
   - Files are identified by filename format: `{userId}-{timestamp}.{ext}`
   - Anyone can view avatars (public bucket)

3. **Creates Helper Function**
   - `storage.user_owns_file()` - Checks if a file belongs to a user

## Security Features

- ✅ Users can only modify their own avatar files
- ✅ File size limit: 5MB
- ✅ Only image files allowed
- ✅ Public viewing enabled (for profile images)

## File Structure

Files are stored with the format: `{userId}-{timestamp}.{ext}`

Example: `550e8400-e29b-41d4-a716-446655440000-1701234567890.jpg`

This ensures:
- Each user can only access their own files
- Easy identification of file ownership
- Unique filenames (timestamp prevents conflicts)

## Troubleshooting

### If you get "must be owner of table objects" error:
**Solution:** Use Method 1 (Dashboard UI) to create the bucket first, then run only the policies SQL from `002_storage_avatars_simple.sql`

### If the bucket already exists:
The migration uses `ON CONFLICT DO NOTHING`, so it's safe to run multiple times. Or just skip the bucket creation and run only the policies.

### If policies don't work:
1. Make sure the bucket exists first (check in Storage dashboard)
2. Verify the helper function exists: 
   ```sql
   SELECT storage.user_owns_file('test-file', '00000000-0000-0000-0000-000000000000'::uuid);
   ```
3. Check existing policies:
   ```sql
   SELECT * FROM pg_policies WHERE tablename = 'objects' AND schemaname = 'storage';
   ```

### If you get "function does not exist" error:
Run the helper function creation part first:
```sql
CREATE OR REPLACE FUNCTION storage.user_owns_file(file_name text, user_id uuid)
RETURNS boolean AS $$
BEGIN
  RETURN file_name LIKE user_id::text || '-%';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

## Testing

After setup, you can test by:
1. Uploading a profile image in your app
2. Checking the `avatars` bucket in Supabase Storage
3. Verifying the file appears with the correct naming format

## Next Steps

Once the bucket is set up:
1. Restart your app
2. Try uploading a profile image
3. The image should appear in the `avatars` bucket
4. The profile screen should display the uploaded image
