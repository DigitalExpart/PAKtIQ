# 🚀 Quick Start - Supabase Backend

Get your PaktIQ backend up and running in 5 minutes!

## Step 1: Install Dependencies ✅

Already done! Supabase client is installed.

## Step 2: Configure Environment Variables

**You need to manually create `.env.local`** (it's gitignored for security):

```bash
# In project root, create .env.local with:
VITE_SUPABASE_URL=https://mirpnmrsjjmmiqbbawab.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1pcnBubXJzamptbWlxYmJhd2FiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ3MjQ5NDcsImV4cCI6MjA4MDMwMDk0N30.0INXVgxZsdjsD0DL8Ot_Q3RfYPqwBwz5O1_E6Lu4q9g
```

## Step 3: Set Up Database

1. Open your Supabase dashboard:
   👉 https://mirpnmrsjjmmiqbbawab.supabase.co

2. Go to **SQL Editor** (left sidebar)

3. Click **New Query**

4. Copy the entire contents of `supabase/migrations/001_initial_schema.sql`

5. Paste into the SQL Editor

6. Click **RUN** (or press Ctrl/Cmd + Enter)

7. ✅ You should see "Success. No rows returned" - this is good!

## Step 4: Verify Database Setup

In Supabase dashboard, go to **Table Editor**. You should see these tables:
- ✅ profiles
- ✅ pakts
- ✅ milestones
- ✅ reminders
- ✅ achievements
- ✅ activity_log

## Step 5: Integrate with Your App

Update your main `App.tsx` or `main.tsx`:

```typescript
import { AuthProvider } from './contexts/AuthContext';

function App() {
  return (
    <AuthProvider>
      {/* Your app components */}
    </AuthProvider>
  );
}
```

See `src/App.example.tsx` for a complete example!

## Step 6: Test Authentication

Try signing up a test user:

```typescript
import { AuthService } from './services';

// Sign up
await AuthService.signUp({
  email: 'test@example.com',
  password: 'testpassword123',
  fullName: 'Test User'
});

// Sign in
await AuthService.signIn({
  email: 'test@example.com',
  password: 'testpassword123'
});
```

Or use the `useAuth` hook in a component:

```typescript
import { useAuth } from './contexts/AuthContext';

function MyComponent() {
  const { signIn, signUp, user } = useAuth();
  
  const handleSignIn = async () => {
    await signIn('test@example.com', 'password123');
  };
  
  return <div>{user ? `Hello ${user.email}` : 'Not logged in'}</div>;
}
```

## 🎉 That's It!

You now have a fully functional backend with:
- ✅ User authentication
- ✅ Database with RLS security
- ✅ Type-safe service layer
- ✅ React hooks for data fetching
- ✅ Automatic profile creation
- ✅ Progress tracking
- ✅ Achievement system

## Next Steps

1. **Create your first Pakt**: Use `PaktService.createPakt()`
2. **Add milestones**: Use `MilestoneService.createMilestone()`
3. **Track progress**: It updates automatically!
4. **Earn achievements**: Happens automatically when you hit milestones

## 📚 Full Documentation

See `BACKEND_SETUP.md` for:
- Detailed API documentation
- Service layer guide
- Hook usage examples
- Security best practices
- Troubleshooting tips

## Need Help?

- Check `supabase/README.md` for database schema details
- Review example code in `src/App.example.tsx`
- Look at service files in `src/services/` for usage examples
- Read hook implementations in `src/hooks/` for data patterns

---

**Happy coding! 🚀**

