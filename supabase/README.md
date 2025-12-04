# Supabase Database Setup

## Running the Migration

To set up your database schema in Supabase:

1. Go to your Supabase project dashboard: https://mirpnmrsjjmmiqbbawab.supabase.co

2. Navigate to **SQL Editor** in the left sidebar

3. Click **New Query**

4. Copy and paste the contents of `migrations/001_initial_schema.sql`

5. Click **Run** to execute the migration

## Database Schema

### Tables

#### `profiles`
User profile information automatically created on signup.
- Stores user metadata, onboarding status, and premium status

#### `pakts`
Main table for user commitments/resolutions.
- Each pakt has a name, description, target outcome, deadline, and category
- Progress is automatically calculated based on completed milestones

#### `milestones`
Sub-goals for each pakt.
- Linked to a specific pakt
- Can be ordered and marked as completed
- Automatically updates pakt progress when completed

#### `reminders`
Reminder settings for pakts.
- Supports daily, weekly, and custom frequencies

#### `achievements`
Gamification achievements earned by users.

#### `activity_log`
Tracks all user actions for analytics and history.

## Security

Row Level Security (RLS) is enabled on all tables:
- Users can only access their own data
- Authentication is required for all operations

## Features

- **Automatic Profile Creation**: When a user signs up, a profile is automatically created
- **Progress Tracking**: Pakt progress is automatically calculated based on completed milestones
- **Timestamps**: All tables have automatic `created_at` and `updated_at` timestamps
- **Indexes**: Optimized with indexes for common queries

## Environment Variables

Make sure to set up your `.env.local` file with:
```
VITE_SUPABASE_URL=https://mirpnmrsjjmmiqbbawab.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
```

