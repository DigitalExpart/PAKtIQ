# Backend Setup Guide - PaktIQ

This guide will help you set up the Supabase backend for the PaktIQ application.

## 🚀 Quick Start

### 1. Environment Variables

Create a `.env.local` file in the root directory with your Supabase credentials:

```env
VITE_SUPABASE_URL=https://mirpnmrsjjmmiqbbawab.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

> ⚠️ **Important**: Never commit `.env.local` to version control. Use `.env.example` as a template.

### 2. Database Setup

1. Go to your Supabase project dashboard: https://mirpnmrsjjmmiqbbawab.supabase.co

2. Navigate to **SQL Editor** in the left sidebar

3. Click **New Query**

4. Copy and paste the contents of `supabase/migrations/001_initial_schema.sql`

5. Click **Run** to execute the migration

This will create all necessary tables, indexes, Row Level Security (RLS) policies, and triggers.

### 3. Verify Setup

After running the migration, verify that the following tables were created:
- ✅ profiles
- ✅ pakts
- ✅ milestones
- ✅ reminders
- ✅ achievements
- ✅ activity_log

## 📚 Backend Architecture

### Database Schema

#### Tables Overview

| Table | Description |
|-------|-------------|
| `profiles` | User profile information (auto-created on signup) |
| `pakts` | Main commitments/resolutions |
| `milestones` | Sub-goals for each pakt |
| `reminders` | Reminder settings for pakts |
| `achievements` | Gamification achievements |
| `activity_log` | Activity tracking and history |

#### Relationships

```
profiles (user)
  └── pakts (1:many)
      ├── milestones (1:many)
      ├── reminders (1:1)
      └── activity_log (1:many)
  └── achievements (1:many)
  └── activity_log (1:many)
```

### Features

✨ **Automatic Profile Creation**: When a user signs up, a profile is automatically created via database trigger

📊 **Auto Progress Tracking**: Pakt progress is automatically calculated based on completed milestones

🔒 **Row Level Security**: All tables have RLS enabled - users can only access their own data

⏰ **Automatic Timestamps**: All tables have `created_at` and `updated_at` fields that update automatically

🚀 **Optimized Queries**: Indexes on common query patterns for fast performance

## 🛠 Service Layer

The backend is organized into service classes for clean separation of concerns:

### Services

```typescript
// Authentication
AuthService.signUp(email, password, fullName)
AuthService.signIn(email, password)
AuthService.signOut()
AuthService.getCurrentUser()

// Profile Management
ProfileService.getProfile(userId)
ProfileService.updateProfile(userId, updates)
ProfileService.completeOnboarding(userId)
ProfileService.upgradeToPremium(userId)

// Pakt Operations
PaktService.getUserPakts(userId)
PaktService.createPakt(pakt)
PaktService.updatePakt(paktId, updates)
PaktService.deletePakt(paktId)
PaktService.completePakt(paktId)

// Milestone Operations
MilestoneService.getPaktMilestones(paktId)
MilestoneService.createMilestone(milestone)
MilestoneService.toggleMilestone(milestoneId, completed)
MilestoneService.getUpcomingMilestones(userId)

// Reminders
ReminderService.getPaktReminder(paktId)
ReminderService.upsertPaktReminder(paktId, userId, reminderData)

// Achievements
AchievementService.getUserAchievements(userId)
AchievementService.awardAchievement(achievement)
AchievementService.checkMilestoneAchievements(userId, count)

// Activity Tracking
ActivityService.logActivity(activity)
ActivityService.getUserActivity(userId)
ActivityService.logPaktCreated(userId, paktId, paktName)
```

## 🎣 React Hooks

Custom hooks for easy data management in React components:

### Authentication

```typescript
import { useAuth } from '@/contexts/AuthContext';

const { user, profile, loading, signIn, signOut, updateProfile } = useAuth();
```

### Pakts

```typescript
import { usePakts, usePaktStats } from '@/hooks';

const { pakts, loading, createPakt, updatePakt, deletePakt } = usePakts();
const { stats } = usePaktStats();
```

### Milestones

```typescript
import { useMilestones, useUpcomingMilestones } from '@/hooks';

const { milestones, createMilestone, toggleMilestone } = useMilestones(paktId);
const { milestones: upcoming } = useUpcomingMilestones();
```

### Achievements

```typescript
import { useAchievements, useAchievementCount } from '@/hooks';

const { achievements } = useAchievements();
const { count } = useAchievementCount();
```

## 🔐 Authentication Flow

### Sign Up

```typescript
import { AuthService } from '@/services';

await AuthService.signUp({
  email: 'user@example.com',
  password: 'securePassword123',
  fullName: 'John Doe'
});
```

### Sign In

```typescript
await AuthService.signIn({
  email: 'user@example.com',
  password: 'securePassword123'
});
```

### Using Auth Context

```typescript
import { AuthProvider } from '@/contexts/AuthContext';

function App() {
  return (
    <AuthProvider>
      <YourApp />
    </AuthProvider>
  );
}
```

## 📝 Usage Examples

### Creating a Pakt with Milestones

```typescript
import { PaktService, MilestoneService } from '@/services';

// Create a pakt
const pakt = await PaktService.createPakt({
  user_id: user.id,
  name: 'Get Fit in 2024',
  description: 'Complete fitness transformation',
  target_outcome: 'Lose 20 pounds and run a 5K',
  deadline: '2024-12-31',
  category: 'fitness',
});

// Add milestones
const milestones = [
  { name: 'Lose 5 pounds', due_date: '2024-03-31', importance: 3 },
  { name: 'Run 1K without stopping', due_date: '2024-04-30', importance: 4 },
  { name: 'Complete first 5K', due_date: '2024-12-31', importance: 5 },
];

for (const milestone of milestones) {
  await MilestoneService.createMilestone({
    ...milestone,
    pakt_id: pakt.id,
    user_id: user.id,
  });
}
```

### Completing a Milestone

```typescript
import { MilestoneService, AchievementService, ActivityService } from '@/services';

// Toggle milestone completion
await MilestoneService.toggleMilestone(milestoneId, true);

// Log the activity
await ActivityService.logMilestoneCompleted(
  user.id,
  paktId,
  milestoneId,
  'Lose 5 pounds'
);

// Check for new achievements
const newAchievements = await AchievementService.checkMilestoneAchievements(
  user.id,
  totalCompletedCount
);
```

### Setting Up Reminders

```typescript
import { ReminderService } from '@/services';

await ReminderService.upsertPaktReminder(paktId, user.id, {
  frequency: 'daily',
  time: '09:00',
  enabled: true,
});
```

## 🔍 Debugging

### Check User Authentication

```typescript
const user = await AuthService.getCurrentUser();
console.log('Current user:', user);
```

### View Database Errors

All services throw errors that can be caught:

```typescript
try {
  await PaktService.createPakt(data);
} catch (error) {
  console.error('Failed to create pakt:', error);
}
```

### Supabase Dashboard

Monitor your database in real-time:
- **Table Editor**: View and edit data
- **SQL Editor**: Run custom queries
- **Database** > **Roles**: Check RLS policies
- **Authentication** > **Users**: Manage users

## 🛡 Security Best Practices

1. ✅ **Never expose service role key** in client-side code
2. ✅ **Always use RLS policies** for data access control
3. ✅ **Validate user input** before sending to database
4. ✅ **Use TypeScript types** for type safety
5. ✅ **Handle errors gracefully** in production

## 📦 Project Structure

```
src/
├── lib/
│   └── supabase.ts           # Supabase client configuration
├── types/
│   ├── database.ts            # Database type definitions
│   └── index.ts               # Exported types
├── services/
│   ├── auth.service.ts        # Authentication service
│   ├── profile.service.ts     # Profile management
│   ├── pakt.service.ts        # Pakt operations
│   ├── milestone.service.ts   # Milestone operations
│   ├── reminder.service.ts    # Reminder operations
│   ├── achievement.service.ts # Achievement system
│   ├── activity.service.ts    # Activity logging
│   └── index.ts               # Service exports
├── contexts/
│   └── AuthContext.tsx        # Authentication context
└── hooks/
    ├── usePakts.ts            # Pakt hooks
    ├── useMilestones.ts       # Milestone hooks
    ├── useAchievements.ts     # Achievement hooks
    └── index.ts               # Hook exports

supabase/
├── migrations/
│   └── 001_initial_schema.sql # Database schema
└── README.md                   # Database documentation
```

## 🚨 Troubleshooting

### Issue: "Missing Supabase environment variables"

**Solution**: Ensure `.env.local` exists with correct variables

### Issue: RLS policy preventing access

**Solution**: Check that:
1. User is authenticated
2. User ID matches the `user_id` in the record
3. RLS policies are properly configured

### Issue: Profile not created on signup

**Solution**: 
1. Check that the `on_auth_user_created` trigger exists
2. Verify the trigger is enabled in Supabase dashboard

## 📖 Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)

## 🎉 Next Steps

1. ✅ Set up environment variables
2. ✅ Run database migration
3. ✅ Wrap your app with `AuthProvider`
4. ✅ Start using services and hooks in your components
5. 🚀 Build amazing features!

---

**Need Help?** Check the Supabase dashboard or review the service layer code for examples.

