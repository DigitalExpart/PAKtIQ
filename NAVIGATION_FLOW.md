# 🗺️ App Navigation Flow

## 📱 **Complete User Journey**

```
┌─────────────────────────────────────────────────────────────┐
│                     APP STARTS                              │
│                  (Check Auth Status)                        │
└────────────┬────────────────────────────────────────────────┘
             │
             ├─── Loading? ─────► Show LoadingScreen
             │
             ├─── Not Logged In? ───┐
             │                       │
             │                       ▼
             │              ┌─────────────────┐
             │              │ WelcomeScreen   │
             │              │  - Get Started  │
             │              │  - Explore      │
             │              └────────┬────────┘
             │                       │
             │                       ▼
             │              ┌─────────────────┐
             │              │  AuthScreen     │ ◄─── FIXED!
             │              │  - Sign Up      │
             │              │  - Sign In      │
             │              └────────┬────────┘
             │                       │
             │                       ▼
             │              [Creates Account + Profile]
             │                       │
             └───────────────────────┘
                             │
                    Logged In Successfully
                             │
                ┌────────────┴────────────┐
                │                         │
                ▼                         ▼
    Onboarding Not Done         Onboarding Done
                │                         │
                ▼                         │
    ┌─────────────────────┐              │
    │ OnboardingFlow      │              │
    │  - Introduction     │              │
    │  - Benefits         │              │
    │  - Ready to Start   │              │
    └──────────┬──────────┘              │
               │                         │
               └─────────┬───────────────┘
                         │
                         ▼
             ┌─────────────────────┐
             │  CategorySelection  │
             │   - Fitness         │
             │   - Finance         │
             │   - Education       │
             │   - Career          │
             │   - etc...          │
             └──────────┬──────────┘
                        │
                        ▼
             ┌─────────────────────┐
             │   PaktNaming        │
             │   - Name            │
             │   - Description     │
             │   - Target Outcome  │
             │   - Deadline        │
             └──────────┬──────────┘
                        │
                        ▼
             ┌─────────────────────┐
             │  MilestoneBuilder   │
             │   - Add Milestones  │
             │   - Set Due Dates   │
             │   - Set Importance  │
             └──────────┬──────────┘
                        │
                        ▼
             ┌─────────────────────┐
             │  ReminderSetupLive  │ ◄─── LIVE!
             │   - Daily           │
             │   - Weekly          │
             │   - Custom          │
             │   [Saves to DB]     │
             └──────────┬──────────┘
                        │
                        ▼
                [Resolve Created!]
                        │
                        ▼
         ┌──────────────────────────────┐
         │    PaktDashboardLive         │ ◄─── LIVE!
         │    [Main Hub]                │
         │    - Active Resolves            │
         │    - Upcoming Milestones     │
         │    - Today's Tasks           │
         │    - Quick Stats             │
         └──────┬───────────────────────┘
                │
                ├─── Tap Achievement Icon ───►┌─────────────────────┐
                │                              │ AchievementBoardLive│ ◄─── LIVE!
                │                              │  - Earned Badges    │
                │                              │  - Locked Badges    │
                │                              │  - Progress         │
                │                              └─────────────────────┘
                │
                ├─── Tap Insights Icon ───────►┌─────────────────────┐
                │                              │ InsightsOverviewLive│ ◄─── LIVE!
                │                              │  - Completion Rate  │
                │                              │  - Streaks          │
                │                              │  - Weekly Chart     │
                │                              │  - Total Stats      │
                │                              └─────────────────────┘
                │
                ├─── Tap Templates ───────────►┌─────────────────────┐
                │                              │  TemplateLibrary    │
                │                              │  - Fitness          │
                │                              │  - Finance          │
                │                              │  - Education        │
                │                              │  - Relationships    │
                │                              └──────┬──────────────┘
                │                                     │
                │                                     └─► Use Template
                │                                            │
                │                                            └─► PaktNaming
                │
                ├─── Tap Premium ─────────────►┌─────────────────────┐
                │                              │  PremiumFeatures    │
                │                              │  - Feature List     │
                │                              │  - Pricing          │
                │                              │  (No payment yet)   │
                │                              └─────────────────────┘
                │
                └─── Tap Settings ────────────►┌─────────────────────┐
                                               │ SettingsScreenLive  │ ◄─── LIVE!
                                               │  - Dark Mode Toggle │
                                               │  - Notifications    │
                                               │  - Preferences      │
                                               │  [Saves to DB]      │
                                               └─────────────────────┘
```

---

## 🔄 **Data Flow**

### **When User Signs Up:**
```
AuthScreen
    │
    ├─► Supabase Auth (creates auth.users entry)
    │
    └─► Trigger: on_auth_user_created
            │
            └─► Creates profiles row automatically
                    │
                    └─► User can now create Resolves!
```

### **When User Creates a Resolve:**
```
MilestoneBuilder
    │
    └─► ReminderSetupLive
            │
            ├─► PaktService.createPakt() → Creates Resolve in DB
            │
            ├─► MilestoneService.createMilestone() → Creates milestones
            │       │
            │       └─► Trigger: update_pakt_progress_on_milestone_change
            │               │
            │               └─► Auto-calculates Resolve.progress
            │
            └─► ReminderService.createReminder() → Saves reminder settings
                    │
                    └─► NotificationService.scheduleReminders() → Push notifications
```

### **When User Completes a Milestone:**
```
PaktDashboardLive (user checks off milestone)
    │
    ├─► MilestoneService.updateMilestone({completed: true})
    │       │
    │       ├─► Trigger: update_pakt_progress_on_milestone_change
    │       │       └─► Updates Resolve.progress
    │       │
    │       └─► Trigger: update_analytics_on_milestone_complete
    │               │
    │               ├─► Increments analytics.milestones_completed_today
    │               ├─► Updates analytics.completion_rate
    │               └─► Calls update_user_streak()
    │                       └─► Updates current_streak & longest_streak
    │
    └─► NotificationService.sendCelebration() → Shows congrats notification
```

### **When User Toggles Dark Mode:**
```
SettingsScreenLive
    │
    └─► SettingsService.updateSettings({dark_mode: true})
            │
            └─► Updates profiles.dark_mode in DB
                    │
                    └─► Next time user opens app, dark mode persists!
```

---

## 🎯 **Screen States**

### **Not Authenticated**
- Can see: `welcome`, `auth`
- Cannot see: Everything else

### **Authenticated + Onboarding Not Done**
- Redirected to: `onboarding` → `categorySelection` → ... → `dashboard`

### **Authenticated + Onboarding Done**
- Can access: ALL screens
- Default: `dashboard`

---

## 📊 **Backend Endpoints (via Supabase)**

All operations use Supabase client:

| Action | Service | Database Table | Trigger |
|--------|---------|----------------|---------|
| Sign Up | AuthService | auth.users → profiles | ✅ on_auth_user_created |
| Create Resolve | PaktService | Resolves | - |
| Add Milestone | MilestoneService | milestones | ✅ update_pakt_progress |
| Complete Milestone | MilestoneService | milestones | ✅ 2 triggers |
| Set Reminder | ReminderService | reminders | - |
| Toggle Dark Mode | SettingsService | profiles | - |
| View Analytics | AnalyticsService | analytics | ✅ auto-updates |
| View Achievements | AchievementService | achievements | - |

---

## 🔐 **Row Level Security (RLS)**

Every table has policies:
- Users can ONLY see their own data
- Users can ONLY modify their own data
- Enforced at database level (secure!)

```sql
-- Example: Resolves table
CREATE POLICY "Users can view their own Resolves"
    ON public.Resolves FOR SELECT
    USING (auth.uid() = user_id);
```

---

## 🚀 **Where You Are Now**

✅ **Welcome Screen** → Works  
✅ **Auth Screen** → FIXED (added 'auth' to Screen type)  
✅ **Sign Up Flow** → Creates user + profile  
✅ **Dashboard** → Shows real Resolves from DB  
✅ **Milestones** → Track progress, auto-update Resolve  
✅ **Reminders** → Save to DB + schedule notifications  
✅ **Settings** → Dark mode + preferences persist  
✅ **Insights** → Real-time analytics  
✅ **Achievements** → Show earned badges  

**Your entire navigation flow is LIVE and WORKING!** 🎊

---

## 🧪 **Test the Full Flow**

1. Open app → Welcome Screen
2. Click "Get Started" → Auth Screen ✅ FIXED
3. Sign up → Profile created
4. Onboarding → Learn about app
5. Create first Resolve → Goes through all screens
6. Dashboard → See your Resolve
7. Complete milestone → Analytics update
8. View Insights → See real stats
9. Toggle Dark Mode → Persists
10. View Achievements → See badges

**Every step is connected to real backend data!** 🔥

