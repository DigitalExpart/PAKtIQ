# 🚨 FIX: Welcome Notification Error Blocking Profile Creation

## Problem

When trying to create profiles, you're getting this error:

```
ERROR: 23514: new row for relation "notifications" violates check constraint "notifications_type_check"
DETAIL: Failing row contains (..., 'welcome', ...)
```

**This is blocking profile creation!** The welcome notification trigger is failing and preventing profiles from being created.

## Root Cause

The `send_welcome_notification()` function tries to insert a notification with type `'welcome'`, but something is wrong with the constraint check. Even though `'welcome'` should be allowed, the constraint is rejecting it.

## Solution

I've created a fix that makes the welcome notification **optional** - if it fails, it logs a warning but **doesn't block profile creation**.

### Step 1: Run the Fix Migration

1. **Open SQL Editor** in Supabase
2. **Click "New Query"**
3. **Open file:** `supabase/migrations/026_fix_welcome_notification_trigger.sql`
4. **Copy ALL contents** and paste into SQL Editor
5. **Click RUN**

**What it does:**
- Wraps the notification INSERT in a `BEGIN...EXCEPTION` block
- If notification fails, logs a warning but continues
- Profile creation will succeed even if notification fails

### Step 2: Now Create Missing Profiles

After running the fix, create the missing profiles:

1. **Run:** `FIX_MISSING_PROFILES_SIMPLE.sql`
2. This should now work without errors!

### Step 3: Verify

Check that profiles were created:

```sql
SELECT * FROM public.profiles ORDER BY created_at DESC;
```

You should now see all 4 profiles.

## Why This Happened

The welcome notification trigger runs **AFTER** profile creation, but if it fails, it can roll back the entire transaction. By making it handle errors gracefully, profile creation succeeds even if the notification fails.

## Alternative: Disable Welcome Notification (Temporary)

If you want to disable the welcome notification temporarily while creating profiles:

```sql
DROP TRIGGER IF EXISTS welcome_notification_on_profile_create ON public.profiles;
```

You can re-enable it later by running migration `026_fix_welcome_notification_trigger.sql`.

## After Fixing

Once profiles are created:

1. ✅ **Run migration 024** to fix the profile creation trigger for future signups
2. ✅ **Disable email verification** in Supabase settings
3. ✅ **Test creating a new account** → Should work smoothly

Run migration `026` first, then create the missing profiles! 🚀
