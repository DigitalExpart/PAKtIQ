# 🧪 Test Your Backend

## After running the migration, test everything works!

---

## 🎯 Test Plan

### Test 1: Authentication ✨

**Steps:**
1. Start your app: `npm run dev`
2. Open in browser (usually http://localhost:5173)
3. You should see the **Welcome Screen**
4. Click **"Get Started"** or **"Explore"**
5. You'll see the **Auth Screen** (purple background)
6. Click **"Sign Up"** toggle at bottom
7. Fill in:
   - **Name:** Test User
   - **Email:** test@test.com
   - **Password:** test123456
8. Click **"Create Account"**

**Expected Result:**
- ✅ Account created successfully
- ✅ You're automatically logged in
- ✅ You see the onboarding flow

**Verify in Supabase:**
1. Go to **Authentication** → **Users**
2. You should see `test@test.com` in the list!
3. Go to **Table Editor** → **profiles**
4. You should see a profile for that user (auto-created!)

---

### Test 2: Create a Resolve 📊

**Steps:**
1. Complete the onboarding (or skip if available)
2. You'll see **"Choose a Category"** screen (like in your screenshot!)
3. Pick a category (e.g., "Health & Fitness")
4. Enter Resolve details:
   - **Name:** Test Resolve
   - **Description:** Testing backend
   - **Target:** Complete testing
   - **Deadline:** Any future date
5. Add some milestones:
   - Milestone 1: Test milestone
   - Milestone 2: Another test
6. Set reminders (or skip)
7. Complete the flow

**Expected Result:**
- ✅ Resolve created successfully
- ✅ You see it in the dashboard
- ✅ No errors in console

**Verify in Supabase:**
1. Go to **Table Editor** → **Resolves**
2. You should see your "Test Resolve" in the table!
3. Click on it to see details
4. Go to **Table Editor** → **milestones**
5. You should see your test milestones!

---

### Test 3: Complete a Milestone ✅

**Steps:**
1. In your dashboard, open your test Resolve
2. Find a milestone
3. Mark it as complete (checkbox/toggle)

**Expected Result:**
- ✅ Milestone marked as complete
- ✅ **Progress bar updates automatically!** (this is the magic!)
- ✅ No errors

**Verify in Supabase:**
1. Go to **Table Editor** → **milestones**
2. The milestone's `completed` field should be `true`
3. The `completed_at` timestamp should be set
4. Go to **Table Editor** → **Resolves**
5. The `progress` field should have updated! (e.g., if you had 2 milestones and completed 1, progress = 50)

---

### Test 4: Data Persistence 💾

**Steps:**
1. Note what Resolves you have
2. **Close your browser tab**
3. Stop the dev server (Ctrl+C)
4. Restart: `npm run dev`
5. Open the app again
6. Sign in with the same account

**Expected Result:**
- ✅ Your Resolves are still there!
- ✅ Your progress is preserved
- ✅ Everything loads from database

---

## 🎨 What to Look For

### Good Signs ✅
- Auth screen appears
- Sign up creates account
- Sign in works
- Dashboard shows Resolves from database
- Progress updates automatically
- Data persists across sessions
- No red errors in browser console

### Warning Signs ⚠️
- "Missing environment variables" → Restart dev server
- "Relation does not exist" → Migration not run
- "RLS violation" → Auth not working properly
- Empty dashboard but data in Supabase → Check user_id matches

---

## 🐛 Debugging

### Check Browser Console
Press F12 or right-click → Inspect → Console tab

**Look for:**
- Supabase connection messages
- Auth events (sign in/out)
- Error messages

### Check Network Tab
F12 → Network tab

**Look for:**
- Requests to Supabase URL
- Status codes (200 = good, 401 = auth issue, 404 = not found)
- Response data

### Check Supabase Logs
Dashboard → Logs

**See:**
- Database queries
- Auth events
- Errors

---

## 📊 Success Criteria

After all tests, you should have:

- ✅ At least 1 user in Authentication → Users
- ✅ At least 1 profile in Table Editor → profiles
- ✅ At least 1 Resolve in Table Editor → Resolves
- ✅ At least 2 milestones in Table Editor → milestones
- ✅ Progress field in Resolves table showing correct percentage
- ✅ No console errors
- ✅ App works smoothly

---

## 🎉 If Everything Works

**Congratulations!** 🎊 Your backend is fully operational!

You now have:
- ✅ Working authentication
- ✅ Cloud database
- ✅ Real-time data
- ✅ Automatic progress tracking
- ✅ Secure user data
- ✅ Production-ready backend

### What's Next?
- Build more features
- Customize the UI
- Add achievements display
- Create activity feed
- Add search/filter
- Deploy to production!

---

## 🚨 If Something Doesn't Work

1. **Check migration ran:** Supabase → Table Editor → should see 6 tables
2. **Check .env.local:** Should exist with correct Supabase URL and key
3. **Restart dev server:** Stop and `npm run dev` again
4. **Check console:** Look for specific error messages
5. **Share error:** Let me know what's wrong and I'll help!

---

## 📸 Evidence of Success

Take screenshots of:
1. Supabase Table Editor showing your Resolve
2. App dashboard with Resolves
3. Browser console showing no errors

Share if you want to verify everything is working correctly!

---

**Ready to test? Go!** 🚀

Run the migration, then follow these tests one by one.

