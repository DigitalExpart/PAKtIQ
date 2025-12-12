# 🚨 URGENT: Run Database Migration to Fix Analytics Error

## The Error You're Seeing

```
Error loading analytics: {"code": "23503", "details": "Key is not present in table \"profiles\".", "hint": null, "message": "insert or update on table \"analytics\" violates foreign key constraint \"analytics_user_id_fkey\""}
```

## Why This Happens

The database triggers are trying to create analytics records **before** your profile is fully created. This is a database-level issue that needs to be fixed with a migration.

## ✅ SOLUTION: Run This Migration NOW

### Step 1: Open Supabase SQL Editor

1. Go to: **https://mirpnmrsjjmmiqbbawab.supabase.co**
2. Click **SQL Editor** in the left sidebar
3. Click **New Query**

### Step 2: Copy and Run the Migration

1. Open the file: `supabase/migrations/021_fix_analytics_trigger.sql`
2. Copy **ALL** contents (it's about 180 lines)
3. Paste into the SQL Editor
4. Click **RUN** (or press Ctrl/Cmd + Enter)
5. You should see: **"Success. No rows returned"**

### Step 3: Test

After running the migration:
1. Log out and log back in
2. The error should be gone
3. Analytics should load without errors

## What This Migration Does

The migration fixes 4 database functions that were causing the error:

1. ✅ `update_analytics_on_milestone_complete()` - Checks profile exists before inserting
2. ✅ `update_analytics_on_pakt_complete()` - Checks profile exists before inserting  
3. ✅ `get_or_create_analytics()` - Checks profile exists before inserting
4. ✅ `update_user_streak()` - Checks profile exists before updating

All functions now:
- Check if profile exists first
- Handle errors gracefully
- Skip analytics updates if profile isn't ready yet

## Important Notes

- ⚠️ **You MUST run this migration** - The frontend code can't fix this alone
- ✅ **Safe to run multiple times** - The migration is idempotent
- ✅ **Won't affect existing data** - Only fixes the trigger functions
- ✅ **Takes 2-3 seconds** - Very quick to run

## If You Still Get Errors After Running Migration

1. **Clear browser cache** and refresh
2. **Log out and log back in**
3. **Check Supabase logs** to see if migration ran successfully
4. **Verify the functions** by running this in SQL Editor:
   ```sql
   SELECT proname FROM pg_proc 
   WHERE proname IN (
     'update_analytics_on_milestone_complete',
     'update_analytics_on_pakt_complete',
     'get_or_create_analytics',
     'update_user_streak'
   );
   ```
   You should see all 4 functions listed.

## Need Help?

If the migration doesn't work:
1. Check for error messages in Supabase SQL Editor
2. Make sure you copied the ENTIRE migration file
3. Try running each function separately if needed
