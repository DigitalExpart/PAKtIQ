# 🎯 PaktIQ Backend - Complete Guide

**A production-ready Supabase backend for the PaktIQ commitment tracking application.**

## 📦 What's Included

This backend setup provides everything you need to build a full-featured commitment tracking app:

### 🗄️ Database
- 6 tables with proper relationships
- Row Level Security (RLS) on all tables
- Automatic timestamps and triggers
- Optimized indexes for performance
- PostgreSQL with full SQL support

### 🔐 Authentication
- Email/password authentication
- Session management
- Profile auto-creation on signup
- Password reset functionality
- Secure token handling

### 📊 Features
- **Pakts (Commitments)**: Create, track, and complete goals
- **Milestones**: Break down pakts into actionable steps
- **Progress Tracking**: Automatic calculation based on milestone completion
- **Reminders**: Flexible scheduling (daily, weekly, custom)
- **Achievements**: Gamification with automatic badge awarding
- **Activity Log**: Complete history of user actions
- **Statistics**: Real-time stats and insights

### 🛠️ Developer Tools
- Type-safe service layer
- React hooks for data fetching
- Authentication context
- Complete TypeScript types
- Error handling
- Comprehensive documentation

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Supabase account (free tier works great!)
- Your Supabase project URL and keys

### Installation

**Option 1: Quick Start (5 minutes)**
```bash
# Follow the step-by-step guide
See QUICK_START.md
```

**Option 2: Detailed Setup**
```bash
# Follow the comprehensive guide
See BACKEND_SETUP.md
```

### TL;DR Setup

1. **Create `.env.local`**:
```env
VITE_SUPABASE_URL=https://mirpnmrsjjmmiqbbawab.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
```

2. **Run the SQL migration** in Supabase SQL Editor:
   - File: `supabase/migrations/001_initial_schema.sql`

3. **Wrap your app** with AuthProvider:
```tsx
import { AuthProvider } from './contexts/AuthContext';

<AuthProvider>
  <App />
</AuthProvider>
```

4. **Start building!** 🎉

## 📁 File Structure

```
├── supabase/
│   ├── migrations/
│   │   └── 001_initial_schema.sql    # Database schema
│   └── README.md                       # Database docs
│
├── src/
│   ├── lib/
│   │   └── supabase.ts                # Supabase client
│   │
│   ├── types/
│   │   ├── database.ts                # Generated DB types
│   │   └── index.ts                   # All types
│   │
│   ├── services/                      # Business logic layer
│   │   ├── auth.service.ts            # Authentication
│   │   ├── profile.service.ts         # User profiles
│   │   ├── pakt.service.ts            # Pakt operations
│   │   ├── milestone.service.ts       # Milestone operations
│   │   ├── reminder.service.ts        # Reminder management
│   │   ├── achievement.service.ts     # Achievement system
│   │   ├── activity.service.ts        # Activity logging
│   │   └── index.ts
│   │
│   ├── contexts/
│   │   └── AuthContext.tsx            # Auth state management
│   │
│   └── hooks/                         # React hooks
│       ├── usePakts.ts
│       ├── useMilestones.ts
│       ├── useAchievements.ts
│       └── index.ts
│
├── .env.example                       # Environment template
├── .env.local                         # Your actual config (gitignored)
├── QUICK_START.md                     # 5-minute setup
├── BACKEND_SETUP.md                   # Detailed guide
└── BACKEND_README.md                  # This file
```

## 💡 Usage Examples

### Authentication

```typescript
import { useAuth } from './contexts/AuthContext';

function LoginForm() {
  const { signIn, signUp, user } = useAuth();
  
  return user ? (
    <div>Welcome {user.email}!</div>
  ) : (
    <button onClick={() => signIn('user@example.com', 'password')}>
      Sign In
    </button>
  );
}
```

### Creating a Pakt

```typescript
import { usePakts } from './hooks';

function CreatePakt() {
  const { createPakt } = usePakts();
  const { user } = useAuth();
  
  const handleCreate = async () => {
    await createPakt({
      user_id: user.id,
      name: 'Learn TypeScript',
      description: 'Master TypeScript in 3 months',
      target_outcome: 'Build a full-stack app',
      deadline: '2024-12-31',
      category: 'education',
    });
  };
  
  return <button onClick={handleCreate}>Create Pakt</button>;
}
```

### Managing Milestones

```typescript
import { useMilestones } from './hooks';

function MilestoneList({ paktId }) {
  const { milestones, toggleMilestone } = useMilestones(paktId);
  
  return (
    <ul>
      {milestones.map(m => (
        <li key={m.id}>
          <input
            type="checkbox"
            checked={m.completed}
            onChange={() => toggleMilestone(m.id, !m.completed)}
          />
          {m.name}
        </li>
      ))}
    </ul>
  );
}
```

### Displaying Stats

```typescript
import { usePaktStats } from './hooks';

function Dashboard() {
  const { stats, loading } = usePaktStats();
  
  if (loading) return <div>Loading...</div>;
  
  return (
    <div>
      <h2>Your Progress</h2>
      <p>Total Pakts: {stats?.total}</p>
      <p>Active: {stats?.active}</p>
      <p>Completed: {stats?.completed}</p>
      <p>Average Progress: {stats?.averageProgress}%</p>
    </div>
  );
}
```

## 🎯 Key Features Explained

### Automatic Progress Tracking

When you mark a milestone as complete, the pakt's progress automatically updates:

```typescript
// Complete a milestone
await MilestoneService.toggleMilestone(milestoneId, true);

// Pakt progress updates automatically via database trigger!
// No need to manually calculate or update
```

### Achievement System

Achievements are awarded automatically when milestones are reached:

```typescript
// After completing a milestone, check for achievements
const newAchievements = await AchievementService.checkMilestoneAchievements(
  userId,
  totalCompletedMilestones
);

// Show toast notifications for new achievements
newAchievements.forEach(achievement => {
  showToast(`🎉 ${achievement.title}: ${achievement.description}`);
});
```

### Activity Logging

Track everything users do for analytics and history:

```typescript
// Automatically log important actions
await ActivityService.logPaktCreated(userId, paktId, paktName);
await ActivityService.logMilestoneCompleted(userId, paktId, milestoneId, name);

// View user's activity feed
const activities = await ActivityService.getUserActivity(userId, 50);
```

### Row Level Security

All data is automatically secured by user:

```sql
-- Users can only see their own data
CREATE POLICY "Users can view their own pakts"
  ON pakts FOR SELECT
  USING (auth.uid() = user_id);
```

No need to add `WHERE user_id = ?` in your queries - Supabase handles it!

## 🔒 Security Best Practices

✅ **DO**:
- Use the anon key in client-side code
- Rely on RLS policies for data access control
- Validate user input before database operations
- Handle errors gracefully
- Use TypeScript for type safety

❌ **DON'T**:
- Expose the service role key in client code
- Store sensitive data in local storage
- Bypass RLS policies
- Trust client-side validation alone
- Skip error handling

## 📊 Database Schema Overview

### profiles
User accounts and settings
- Auto-created on signup
- Stores display name, avatar, premium status

### pakts
Main commitments/goals
- Belongs to a user
- Has progress calculated from milestones
- Can be active, completed, or archived

### milestones
Sub-goals within a pakt
- Ordered list of steps
- Importance rating (1-5)
- Completion tracking with timestamps

### reminders
Notification settings
- One per pakt
- Supports daily, weekly, custom schedules
- Can be enabled/disabled

### achievements
Gamification badges
- Earned automatically
- Includes milestone & pakt achievements
- Stores metadata about when earned

### activity_log
User action history
- Tracks all important events
- Used for analytics and feed
- Links to pakts and milestones

## 🧪 Testing

### Test Authentication

```typescript
// Create a test user
await AuthService.signUp({
  email: 'test@example.com',
  password: 'testpass123',
  fullName: 'Test User'
});

// Sign in
await AuthService.signIn({
  email: 'test@example.com',
  password: 'testpass123'
});
```

### Test Database Operations

```typescript
// Create a test pakt
const pakt = await PaktService.createPakt({
  user_id: userId,
  name: 'Test Pakt',
  description: 'Testing',
  target_outcome: 'Success',
  deadline: new Date().toISOString(),
  category: 'other',
});

// Verify it was created
const pakts = await PaktService.getUserPakts(userId);
console.assert(pakts.length > 0, 'Pakt should be created');
```

## 🐛 Troubleshooting

### "Missing Supabase environment variables"
- Ensure `.env.local` exists in project root
- Check variable names match exactly
- Restart dev server after adding variables

### "Row Level Security violation"
- User must be authenticated
- Check that user_id matches authenticated user
- Verify RLS policies in Supabase dashboard

### Profile not created on signup
- Check the `on_auth_user_created` trigger exists
- Look in Supabase Auth settings for auto-confirm settings
- Verify email confirmation if required

### Types not updating
- Regenerate types from Supabase dashboard
- Or manually update `src/types/database.ts`

## 📚 API Reference

Full API documentation available in:
- **Services**: See `BACKEND_SETUP.md` > Service Layer section
- **Hooks**: See individual hook files in `src/hooks/`
- **Database**: See `supabase/README.md`

## 🚀 Performance Tips

1. **Use hooks for caching**: Hooks automatically cache data
2. **Batch operations**: Create multiple milestones at once
3. **Index queries**: Database has indexes on common queries
4. **Limit results**: Use `.limit()` for large datasets
5. **Optimize RLS**: Policies are optimized for common patterns

## 🎓 Learn More

- [Supabase Docs](https://supabase.com/docs)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [JavaScript Client](https://supabase.com/docs/reference/javascript)
- [Database Functions](https://supabase.com/docs/guides/database/functions)

## 📝 License

This backend setup is part of the PaktIQ project.

## 🤝 Contributing

To improve the backend:
1. Update service methods in `src/services/`
2. Add new hooks in `src/hooks/`
3. Update types in `src/types/`
4. Document changes in this README

## ✨ What's Next?

Now that your backend is set up:

1. ✅ Build your UI components
2. ✅ Connect components to hooks
3. ✅ Add authentication screens
4. ✅ Implement pakt creation flow
5. ✅ Build milestone tracking
6. ✅ Add reminder notifications
7. ✅ Display achievements
8. ✅ Show activity feed
9. ✅ Deploy your app!

---

**Built with ❤️ using Supabase + TypeScript + React**

Need help? Review the documentation files or check the Supabase dashboard.

