# 🎯 Simple Migration Steps

## Your backend is 99% ready! Just need to create database tables.

---

## 📋 Quick Checklist

Follow these steps **in order**:

### ☐ Step 1: Open Supabase (30 seconds)
1. Open this link: **https://mirpnmrsjjmmiqbbawab.supabase.co**
2. Log in if needed
3. You should see your project dashboard

### ☐ Step 2: Open SQL Editor (10 seconds)
1. Look at the **left sidebar**
2. Find and click **"SQL Editor"**
3. Click the **"New query"** button

### ☐ Step 3: Get the Migration SQL (20 seconds)
1. In your project, open the file:
   ```
   supabase/migrations/001_initial_schema.sql
   ```
2. Select **ALL** text (Ctrl+A or Cmd+A)
3. Copy it (Ctrl+C or Cmd+C)

### ☐ Step 4: Run the Migration (30 seconds)
1. Back in Supabase SQL Editor
2. **Paste** the SQL (Ctrl+V or Cmd+V)
3. Click the green **"RUN"** button (or Ctrl/Cmd + Enter)
4. Wait 3-5 seconds

### ☐ Step 5: Verify Success (20 seconds)
You should see a message: **"Success. No rows returned"**

If you see errors, let me know!

### ☐ Step 6: Check Tables (30 seconds)
1. Click **"Table Editor"** in the left sidebar
2. You should now see **6 new tables**:
   - profiles
   - pakts
   - milestones
   - reminders
   - achievements
   - activity_log

---

## ✅ After Migration Success

### Your backend is NOW LIVE! 🎉

### Test it:
```bash
# 1. Start your app (if not running)
npm run dev

# 2. Open in browser
# 3. Click "Get Started"
# 4. Sign up with any email/password
# 5. Create a pakt
# 6. Check Supabase - data will be there!
```

---

## 🔍 What to Check in Supabase After Testing

### After you sign up:
- Go to **Authentication** → **Users** tab
- You'll see your new user account

- Go to **Table Editor** → **profiles** table
- Your profile was automatically created!

### After you create a pakt:
- Go to **Table Editor** → **pakts** table
- Your pakt is saved in the database!

- Go to **Table Editor** → **milestones** table
- Your milestones are there too!

---

## 🚨 Common Issues

### "Error: relation does not exist"
**Fix:** The migration didn't run. Try again from Step 2.

### "Error: permission denied"
**Fix:** You might not have the right permissions. Check you're logged into the correct Supabase project.

### Tables don't show up
**Fix:** Refresh the page. If still not there, re-run the migration.

### Can't find SQL Editor
**Fix:** It's in the left sidebar, might be under a collapsed section.

---

## 💡 Pro Tip

Keep the Supabase dashboard open in another tab while testing your app. You can watch data being created in real-time!

---

## 📞 Stuck?

Share a screenshot and I'll help!

---

**Total time needed:** ~2 minutes  
**Difficulty:** Easy  
**Result:** Fully working backend! 🚀

