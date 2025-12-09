# Setting Up Storage Policies for Avatars Bucket

Your `avatars` bucket is already created! Now you need to set up the security policies.

## Option 1: Using SQL Editor (Recommended)

1. **Go to SQL Editor**
   - In Supabase Dashboard, click **SQL Editor** in the left sidebar
   - Click **New Query**

2. **Run the Policies SQL**
   - Open the file: `supabase/migrations/002_storage_policies_only.sql`
   - Copy **ALL** the contents
   - Paste into the SQL Editor
   - Click **RUN** (or press Ctrl/Cmd + Enter)

3. **If you get permission errors**, try Option 2 below

## Option 2: Using Storage Policies UI

1. **Go to Storage**
   - Click **Storage** in the left sidebar
   - Click on the **avatars** bucket
   - Click the **Policies** tab

2. **Create Policies Manually**

   **Policy 1: Public View Access**
   - Click **New Policy**
   - Policy name: `Anyone can view avatars`
   - Allowed operation: `SELECT`
   - Target roles: `public`
   - USING expression: `bucket_id = 'avatars'`
   - Click **Review** then **Save**

   **Policy 2: Users can upload**
   - Click **New Policy**
   - Policy name: `Users can upload their own avatar`
   - Allowed operation: `INSERT`
   - Target roles: `authenticated`
   - WITH CHECK expression: `bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text`
   - Click **Review** then **Save**

   **Policy 3: Users can update**
   - Click **New Policy**
   - Policy name: `Users can update their own avatar`
   - Allowed operation: `UPDATE`
   - Target roles: `authenticated`
   - USING expression: `bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text`
   - WITH CHECK expression: `bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text`
   - Click **Review** then **Save**

   **Policy 4: Users can delete**
   - Click **New Policy**
   - Policy name: `Users can delete their own avatar`
   - Allowed operation: `DELETE`
   - Target roles: `authenticated`
   - USING expression: `bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text`
   - Click **Review** then **Save**

## Option 3: Simplified Policies (If above don't work)

If you're still getting permission errors, you can use simpler policies that work with the filename format `userId-timestamp.ext`:

1. **First, create the helper function** (run this in SQL Editor):
```sql
CREATE OR REPLACE FUNCTION storage.user_owns_file(file_name text, user_id uuid)
RETURNS boolean AS $$
BEGIN
  RETURN file_name LIKE user_id::text || '-%';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

2. **Then create policies via Storage UI** using these expressions:
   - **Upload (WITH CHECK)**: `bucket_id = 'avatars' AND storage.user_owns_file(name, auth.uid())`
   - **Update (USING)**: `bucket_id = 'avatars' AND storage.user_owns_file(name, auth.uid())`
   - **Update (WITH CHECK)**: `bucket_id = 'avatars' AND storage.user_owns_file(name, auth.uid())`
   - **Delete (USING)**: `bucket_id = 'avatars' AND storage.user_owns_file(name, auth.uid())`
   - **View (USING)**: `bucket_id = 'avatars'`

## Verify Setup

After setting up policies:

1. Go to **Storage** > **avatars** bucket > **Policies** tab
2. You should see 4-5 policies listed
3. Try uploading a profile image in your app
4. Check that the file appears in the bucket

## Troubleshooting

### "must be owner of table objects" error
- Use **Option 2** (Storage Policies UI) instead of SQL
- Or contact your Supabase project admin to grant permissions

### Policies not working
- Make sure the bucket name is exactly `avatars` (case-sensitive)
- Verify the helper function exists: Run `SELECT storage.user_owns_file('test', '00000000-0000-0000-0000-000000000000'::uuid);`
- Check that RLS is enabled on storage.objects (usually enabled by default)

### Files not uploading
- Check browser console for errors
- Verify your Supabase credentials are correct
- Make sure the user is authenticated when uploading
