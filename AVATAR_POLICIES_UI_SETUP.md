# Setting Up Avatar Bucket Policies via UI (No SQL Permissions Needed)

Since you're getting "permission denied for schema storage" errors, use the Supabase Dashboard UI to set up policies. This method doesn't require SQL permissions.

## Step-by-Step Guide

### Step 1: Create Helper Function (One-time SQL)

First, you need to create the helper function. This should work even if policy creation doesn't:

1. Go to **SQL Editor** in Supabase Dashboard
2. Click **New Query**
3. Paste this SQL and run it:

```sql
CREATE OR REPLACE FUNCTION storage.user_owns_file(file_name text, user_id uuid)
RETURNS boolean AS $$
BEGIN
  RETURN file_name LIKE user_id::text || '-%';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

4. Click **RUN**
5. You should see "Success. No rows returned"

### Step 2: Set Up Policies via Storage UI

1. **Navigate to Storage**
   - Click **Storage** in the left sidebar
   - Click on the **avatars** bucket (or create it if it doesn't exist)
   - Click the **Policies** tab

2. **Create Policy 1: Public View Access**
   - Click **New Policy** button
   - **Policy name**: `Anyone can view avatars`
   - **Allowed operation**: Select `SELECT`
   - **Target roles**: Select `public`
   - **USING expression**: `bucket_id = 'avatars'`
   - Leave **WITH CHECK** empty
   - Click **Review** then **Save policy**

3. **Create Policy 2: Users Can Upload**
   - Click **New Policy** button
   - **Policy name**: `Users can upload their own avatar`
   - **Allowed operation**: Select `INSERT`
   - **Target roles**: Select `authenticated`
   - **WITH CHECK expression**: 
     ```
     bucket_id = 'avatars' AND storage.user_owns_file(name, auth.uid())
     ```
   - Leave **USING** empty
   - Click **Review** then **Save policy**

4. **Create Policy 3: Users Can Update**
   - Click **New Policy** button
   - **Policy name**: `Users can update their own avatar`
   - **Allowed operation**: Select `UPDATE`
   - **Target roles**: Select `authenticated`
   - **USING expression**: 
     ```
     bucket_id = 'avatars' AND storage.user_owns_file(name, auth.uid())
     ```
   - **WITH CHECK expression**: 
     ```
     bucket_id = 'avatars' AND storage.user_owns_file(name, auth.uid())
     ```
   - Click **Review** then **Save policy**

5. **Create Policy 4: Users Can Delete**
   - Click **New Policy** button
   - **Policy name**: `Users can delete their own avatar`
   - **Allowed operation**: Select `DELETE`
   - **Target roles**: Select `authenticated`
   - **USING expression**: 
     ```
     bucket_id = 'avatars' AND storage.user_owns_file(name, auth.uid())
     ```
   - Leave **WITH CHECK** empty
   - Click **Review** then **Save policy**

## Verification

After creating all policies:

1. Go to **Storage** > **avatars** bucket > **Policies** tab
2. You should see 4 policies listed:
   - ✅ Anyone can view avatars (SELECT, public)
   - ✅ Users can upload their own avatar (INSERT, authenticated)
   - ✅ Users can update their own avatar (UPDATE, authenticated)
   - ✅ Users can delete their own avatar (DELETE, authenticated)

## Alternative: Simpler Policies (If helper function doesn't work)

If you get errors using the helper function, use these simpler expressions:

**For Upload (WITH CHECK):**
```
bucket_id = 'avatars' AND name LIKE auth.uid()::text || '-%'
```

**For Update (USING and WITH CHECK):**
```
bucket_id = 'avatars' AND name LIKE auth.uid()::text || '-%'
```

**For Delete (USING):**
```
bucket_id = 'avatars' AND name LIKE auth.uid()::text || '-%'
```

**For View (USING):**
```
bucket_id = 'avatars'
```

## Testing

1. Try uploading a profile image in your app
2. Check the **avatars** bucket in Storage
3. Verify the file appears with format: `{userId}-{timestamp}.{ext}`
4. Try viewing the image URL - it should be publicly accessible

## Troubleshooting

### "Function does not exist" error
- Make sure you ran Step 1 (helper function creation) first
- Verify the function exists: Go to SQL Editor and run:
  ```sql
  SELECT storage.user_owns_file('test', '00000000-0000-0000-0000-000000000000'::uuid);
  ```

### Policies not saving
- Make sure you're in the correct bucket (avatars)
- Check that you selected the correct operation (SELECT, INSERT, UPDATE, DELETE)
- Verify the expressions are correct (copy-paste from above)

### Files still not uploading
- Check browser console for errors
- Verify user is authenticated
- Make sure bucket name is exactly `avatars` (case-sensitive)
- Check that policies are active (should show in Policies tab)
