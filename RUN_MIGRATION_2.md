# 🚀 Run Migration #2 - Settings & Analytics

## ⚡ Quick Steps

### 1. Open Supabase
https://mirpnmrsjjmmiqbbawab.supabase.co

### 2. Go to SQL Editor
- Click **SQL Editor** in left sidebar
- Click **New Query** button

### 3. Copy the SQL
Open file: `supabase/migrations/002_add_settings_and_analytics.sql`
- Select ALL (it's a long file ~300+ lines)
- Copy it (Ctrl+C)

### 4. Paste & Run
- Paste into SQL Editor (Ctrl+V)
- Click green **RUN** button

### 5. Verify Success
You should see: **"Success. No rows returned"**

### 6. Check Tables
Go to **Table Editor**:

**New table:**
- ✅ `analytics` - Should exist with columns like `current_streak`, `completion_rate`, etc.

**Updated table:**
- ✅ `profiles` - Should have new columns:
  - `dark_mode` (boolean)
  - `notification_preferences` (jsonb)

---

## ✅ What This Migration Does

### Creates `analytics` Table:
- Tracks daily user statistics
- Current streak & longest streak
- Completion rates
- Milestones & pakts completed
- Badges earned
- Time spent

### Adds to `profiles` Table:
- `dark_mode`: Stores user's theme preference
- `notification_preferences`: Stores all notification settings as JSON

### Creates Automatic Triggers:
- Auto-updates analytics when milestone completed
- Auto-updates analytics when pakt completed
- Auto-calculates streaks daily
- Auto-calculates completion rates

### Creates Helper Functions:
- `get_or_create_analytics()` - Gets today's analytics record
- `update_user_streak()` - Updates streak when user is active
- `calculate_completion_rate()` - Calculates user's completion %

---

## 🧪 After Migration - Test It!

### Test 1: Dark Mode
1. Open your app
2. Go to Settings
3. Toggle Dark Mode
4. Check Supabase → profiles → your profile → `dark_mode` = true

### Test 2: Analytics
1. Complete a milestone in your app
2. Go to Supabase → analytics table
3. See today's record with updated counts

### Test 3: Insights Screen
1. Open Insights in your app
2. See real statistics from database:
   - Completion rate
   - Milestones done
   - Current streak
   - Weekly activity chart

---

## 🐛 Troubleshooting

### Error: "column already exists"
**Solution:** Migration already ran. Check if:
- `profiles` table has `dark_mode` and `notification_preferences` columns
- `analytics` table exists

Skip to testing!

### Error: "permission denied"
**Solution:** Make sure you're logged into the correct Supabase project

### Tables don't show up
**Solution:**
- Refresh the Table Editor page
- Check SQL Editor for error messages
- Re-run the migration

---

## ✨ What You Get

After this migration:

1. **Dark Mode** saves to database
2. **Notification settings** save to database
3. **Analytics tracking** automatically works
4. **Streaks** calculate automatically
5. **Insights screen** shows real data
6. **Progress tracking** is automatic

---

**Time needed:** 2 minutes  
**Difficulty:** Easy  
**Result:** Full settings & analytics backend! 🎉

---

**Ready? Run the migration now!**

