# 🔧 Image Upload Fix - "Failed to upload image"

## Problem

When users tried to upload a profile image, they encountered the error:
**"Error: Failed to upload image. Please try again."**

This error occurred because:
1. The `avatars` storage bucket might not exist in Supabase
2. Storage policies might not be configured correctly
3. File upload logic had issues with React Native compatibility
4. Error messages were not specific enough to diagnose the issue

## Solution

### 1. Improved Storage Service (`src/services/storage.service.ts`)

**Changes:**
- ✅ Added `ensureBucketExists()` check before upload
- ✅ Fixed file handling for both web and React Native platforms
- ✅ Improved error messages with specific error types
- ✅ Better content type detection
- ✅ Proper file path structure: `{userId}/{timestamp}.{ext}`

**New Features:**
- Platform-specific file handling (web uses Blob, native uses Uint8Array)
- Automatic content type detection
- Specific error messages for different failure scenarios

### 2. Better Error Messages (`app/profile.tsx`)

**Changes:**
- ✅ More specific error messages based on error type
- ✅ User-friendly messages for common issues:
  - Storage bucket not configured
  - Permission denied
  - File too large
  - Network errors

### 3. Storage Bucket Migration (`supabase/migrations/019_create_storage_bucket.sql`)

**What it does:**
- Creates the `avatars` bucket if it doesn't exist
- Sets up proper RLS policies:
  - Users can upload/update/delete their own avatars
  - Public can view avatars
- Configures bucket settings:
  - Public bucket
  - 5MB file size limit
  - Only image files allowed (JPEG, PNG, GIF, WEBP)

## How to Apply the Fix

### Step 1: Run the Storage Migration

1. Go to your Supabase Dashboard: https://mirpnmrsjjmmiqbbawab.supabase.co
2. Navigate to **SQL Editor** in the left sidebar
3. Click **New Query**
4. Open the file: `supabase/migrations/019_create_storage_bucket.sql`
5. Copy ALL contents and paste into the SQL Editor
6. Click **RUN** (or press Ctrl/Cmd + Enter)
7. You should see: **"Success. No rows returned"**

**OR** Create the bucket manually:

1. Go to **Storage** in the left sidebar
2. Click **New bucket**
3. Name: `avatars`
4. Public bucket: **Yes** (toggle ON)
5. File size limit: `5242880` (5MB)
6. Allowed MIME types: `image/jpeg,image/png,image/jpg,image/webp,image/gif`
7. Click **Create bucket**
8. Then run only the policies part from the migration file

### Step 2: Verify the Setup

1. Go to **Storage** → **avatars** bucket
2. The bucket should be marked as **Public**
3. Check that policies are set up (you can see them in the bucket settings)

### Step 3: Test Image Upload

1. Open the app
2. Go to Profile screen
3. Tap on the profile picture
4. Select an image
5. Upload should work without errors

## Error Messages Explained

The app now shows specific error messages:

| Error Message | Meaning | Solution |
|--------------|---------|----------|
| "Storage is not configured" | Bucket doesn't exist | Run the migration or create bucket manually |
| "Permission denied" | RLS policies not set up | Run the migration policies |
| "Image is too large" | File > 5MB | Choose a smaller image |
| "Network error" | Connection issue | Check internet connection |
| "Upload failed: [details]" | Other error | Check console logs for details |

## File Structure

Images are stored with the format:
```
avatars/
  └── {userId}/
      └── {timestamp}.{ext}
```

Example:
```
avatars/
  └── 550e8400-e29b-41d4-a716-446655440000/
      └── 1701234567890.jpg
```

This ensures:
- Each user has their own folder
- Files are uniquely named (timestamp prevents conflicts)
- Easy to identify file ownership

## Security Features

- ✅ Users can only upload/update/delete their own avatars
- ✅ File size limit: 5MB
- ✅ Only image files allowed
- ✅ Public viewing enabled (for profile images)
- ✅ RLS policies enforce ownership

## Troubleshooting

### Issue: "Storage bucket not found"
**Solution:**
1. Check if `avatars` bucket exists in Supabase Storage
2. If not, create it manually or run the migration
3. Make sure it's marked as Public

### Issue: "Permission denied"
**Solution:**
1. Run the policies part of the migration
2. Check that RLS is enabled on storage.objects
3. Verify policies are created correctly

### Issue: Upload works but image doesn't show
**Solution:**
1. Check that bucket is Public
2. Verify the URL is correct
3. Check browser console for CORS errors

### Issue: "Image is too large"
**Solution:**
- Choose an image smaller than 5MB
- Compress the image before uploading
- Consider increasing the file size limit in bucket settings

## Files Modified

1. `src/services/storage.service.ts` - Improved upload logic and error handling
2. `app/profile.tsx` - Better error messages
3. `supabase/migrations/019_create_storage_bucket.sql` - **NEW** - Storage setup migration

## Testing Checklist

After applying the fix:
- [ ] Bucket exists in Supabase Storage
- [ ] Bucket is marked as Public
- [ ] Policies are set up correctly
- [ ] Can upload small image (< 1MB)
- [ ] Can upload medium image (1-3MB)
- [ ] Error shown for large image (> 5MB)
- [ ] Image displays correctly after upload
- [ ] Can update/change profile image
- [ ] Error messages are helpful and specific

## Need Help?

If you still encounter issues:

1. **Check Supabase Logs**: Dashboard → Logs Explorer
2. **Verify Bucket**: Storage → avatars bucket exists
3. **Check Policies**: Storage → avatars → Policies tab
4. **Test Upload**: Try uploading via Supabase dashboard first
5. **Check Console**: Look for detailed error messages in app console
