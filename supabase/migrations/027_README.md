# Migration 027: Habit and Milestone Edit Permissions

## Overview
This migration ensures all necessary database permissions, constraints, and triggers are in place to support editing habits (including schedules) and milestones.

## What This Migration Does

### 1. **Habits Table Enhancements**
- Adds missing columns: `duration_weeks`, `start_date`, `status`, `completion_rate`
- Ensures all columns needed for editing exist

### 2. **Habit Schedules Table**
- Ensures UNIQUE constraint on `(habit_id, day_of_week)` to prevent duplicates
- Allows users to add/remove days and change times

### 3. **Habit Completions Table**
- Adds `status` column if missing (completed/missed)
- Allows editing completion status

### 4. **Milestones Table**
- Verifies all columns exist for editing (name, due_date, notes, order_index)
- Ensures proper constraints

### 5. **Row Level Security (RLS) Policies**
- **Habits**: SELECT, INSERT, UPDATE, DELETE permissions
- **Habit Schedules**: SELECT, INSERT, UPDATE, DELETE permissions (via habit ownership)
- **Habit Completions**: SELECT, INSERT, UPDATE, DELETE permissions
- **Milestones**: SELECT, INSERT, UPDATE, DELETE permissions

### 6. **Triggers**
- Automatic `updated_at` timestamp updates for all tables
- Ensures data stays current when edited

### 7. **Indexes**
- Performance indexes for common queries
- Faster lookups when editing habits and milestones

## How to Run

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Click **New Query**
4. Copy and paste the contents of `027_ensure_habit_milestone_edit_permissions.sql`
5. Click **Run** to execute

## What Users Can Edit

### Habits
- ✅ Name
- ✅ Description
- ✅ Category
- ✅ Duration (weeks)
- ✅ Status (active/completed/paused)
- ✅ Add/remove days in schedule
- ✅ Change times for each day
- ✅ Enable/disable habit

### Milestones
- ✅ Name
- ✅ Due date
- ✅ Notes
- ✅ Order (reorder milestones)
- ✅ Delete milestones
- ✅ Add new milestones

## Security

All edits are protected by Row Level Security (RLS):
- Users can only edit their own habits and milestones
- All operations require authentication
- No user can access or modify another user's data

## Notes

- This migration is **idempotent** - safe to run multiple times
- Uses `IF NOT EXISTS` checks to avoid errors if columns/policies already exist
- Drops and recreates policies to ensure they're correct
- Includes helpful comments for documentation



