# 🔧 Fix Missing Profile for Existing User

## Problem

You created an account with email `jumatomosany@gmail.com` and can log in/log out, but the profile doesn't exist in the `public.profiles` table.

## Why This Happens

The database trigger `handle_new_user()` should automatically create a profile when a user signs up, but sometimes:
- The trigger didn't fire
- The trigger failed silently
- There was a timing issue during signup

## Solution: Create the Missing Profile

### Option 1: Run SQL Migration (Recommended)

1. Go to Supabase Dashboard: https://mirpnmrsjjmmiqbbawab.supabase.co
2. Click **SQL Editor** in the left sidebar
3. Click **New Query**
4. Open: `supabase/migrations/023_create_missing_profile.sql`
5. Copy **ALL** contents and paste into SQL Editor
6. Click **RUN**
7. You should see: **"Success. No rows returned"** or a notice message

This will create the profile for `jumatomosany@gmail.com`.

### Option 2: Create Profile Manually via SQL

Run this query in SQL Editor:

```sql
-- Find the user ID first
SELECT id, email FROM auth.users WHERE email = 'jumatomosany@gmail.com';

-- Then create the profile (replace USER_ID_HERE with the actual ID from above)
INSERT INTO public.profiles (id, email, full_name, avatar_url, onboarding_completed, premium)
SELECT 
    u.id,
    u.email,
    u.raw_user_meta_data->>'full_name' as full_name,
    NULL as avatar_url,
    false as onboarding_completed,
    false as premium
FROM auth.users u
WHERE u.email = 'jumatomosany@gmail.com'
AND NOT EXISTS (SELECT 1 FROM public.profiles WHERE id = u.id);
```

### Option 3: Fix All Missing Profiles at Once

If you have multiple users with missing profiles, run this:

```sql
-- Create profiles for ALL users missing profiles
INSERT INTO public.profiles (id, email, full_name, avatar_url, onboarding_completed, premium)
SELECT 
    u.id,
    u.email,
    u.raw_user_meta_data->>'full_name' as full_name,
    NULL as avatar_url,
    false as onboarding_completed,
    false as premium
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
WHERE p.id IS NULL;
```

## Verify the Fix

After running the migration, verify:

1. **Check profiles table:**
   ```sql
   SELECT * FROM public.profiles WHERE email = 'jumatomosany@gmail.com';
   ```

2. **Check in Table Editor:**
   - Go to **Table Editor** → **profiles**
   - You should see the account listed

3. **Test in app:**
   - Log out and log back in
   - Profile should load correctly
   - You should be able to see your profile data

## Prevent This in the Future

Make sure the signup trigger is working:

1. **Check if trigger exists:**
   ```sql
   SELECT * FROM pg_trigger WHERE tgname = 'on_auth_user_created';
   ```

2. **Check if function exists:**
   ```sql
   SELECT * FROM pg_proc WHERE proname = 'handle_new_user';
   ```

3. **If missing, run the signup fix migration:**
   - Run `supabase/migrations/020_robust_user_signup_fix.sql`
   - This ensures profiles are created automatically for new signups

## What the Migration Does

The migration `023_create_missing_profile.sql`:
- Finds the user by email in `auth.users`
- Checks if a profile already exists
- Creates the profile if it doesn't exist
- Uses the user's email and metadata from auth.users
- Sets default values (onboarding_completed: false, premium: false)

## Notes

- The profile will be created with the user's email from `auth.users`
- Full name will be taken from `raw_user_meta_data` if available
- Avatar URL will be NULL (can be set later)
- The profile will have the same ID as the user (UUID from auth.users)
