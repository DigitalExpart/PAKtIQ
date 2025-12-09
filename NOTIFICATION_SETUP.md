# Notification System Setup Guide

This guide explains how to set up the notification system for scheduled reminders and daily motivation messages.

## Overview

The notification system includes:
- **Reminder Notifications**: Sent based on user's reminder preferences (daily/weekly/custom) at their set time
- **Daily Motivation**: Random motivational messages sent at 8 AM to users who have it enabled
- **Upcoming Milestones**: Notifications for milestones due within 3 days
- **Missed Milestones**: Notifications for milestones that have passed their deadline

## Database Setup

### Step 1: Run Migrations

Run these SQL migrations in your Supabase SQL Editor:

1. `006_create_notifications_table.sql` - Creates the notifications table
2. `007_notification_scheduler.sql` - Creates notification processing functions
3. `008_setup_pg_cron.sql` - Sets up scheduled jobs (if pg_cron is available)

### Step 2: Enable pg_cron (Optional but Recommended)

If your Supabase instance supports `pg_cron`, you can enable scheduled jobs:

1. Go to Supabase Dashboard → Database → Extensions
2. Enable the `pg_cron` extension
3. Uncomment the cron schedule commands in `008_setup_pg_cron.sql`
4. Run the uncommented SQL

### Step 3: Alternative - Use Supabase Edge Functions

If `pg_cron` is not available, you can use Supabase Edge Functions or an external cron service:

#### Option A: Supabase Edge Functions

Create an Edge Function that calls the notification functions:

```typescript
// supabase/functions/process-notifications/index.ts
import { createClient } from '@supabase/supabase-js'

Deno.serve(async (req) => {
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  )

  // Call the notification processing function
  const { error } = await supabase.rpc('process_all_notifications')

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  return new Response(JSON.stringify({ success: true }), {
    headers: { 'Content-Type': 'application/json' },
  })
})
```

Then set up a cron job (using a service like cron-job.org or GitHub Actions) to call this Edge Function every minute.

#### Option B: External Cron Service

Use a service like:
- **cron-job.org**: Free cron service
- **GitHub Actions**: Scheduled workflows
- **Vercel Cron**: If deploying to Vercel
- **AWS EventBridge**: For AWS deployments

Set up a cron job to call:
```
POST https://your-project.supabase.co/functions/v1/process-notifications
Headers: Authorization: Bearer YOUR_ANON_KEY
```

## How It Works

### Reminder Notifications

1. **Daily Reminders**: Sent every day at the user's set time (e.g., 7 AM)
2. **Weekly Reminders**: Sent on Monday at the user's set time
3. **Custom Reminders**: Sent on selected days at the user's set time

The system checks:
- If the current time matches the reminder time (within 1 minute)
- If the frequency matches (daily/weekly/custom)
- If the day matches (for weekly/custom)
- If there are active milestones in the Pakt

### Daily Motivation

- Sent at 8 AM to users who have `daily_motivation` enabled in their notification preferences
- Uses a pool of 15 random motivational messages
- Only one message per user per day

### Upcoming Milestones

- Checks milestones due within 3 days
- Sends notifications:
  - "Due Today" for milestones due today
  - "Due Tomorrow" for milestones due tomorrow
  - "Due in X days" for milestones due in 2-3 days
- Only one notification per milestone per day

### Missed Milestones

- Checks milestones that are past due and not completed
- Sends one notification per missed milestone
- Runs once per day at midnight

## Testing

### Manual Testing

You can manually trigger the notification functions:

```sql
-- Test reminder notifications
SELECT send_reminder_notifications();

-- Test daily motivation
SELECT send_daily_motivation();

-- Test upcoming milestones
SELECT check_upcoming_milestones();

-- Test missed milestones
SELECT check_missed_milestones();

-- Run all checks
SELECT process_all_notifications();
```

### Testing Reminder Times

To test reminders at different times, you can temporarily modify the time check in `send_reminder_notifications()`:

```sql
-- For testing: accept any time within 5 minutes
IF ABS(EXTRACT(EPOCH FROM (current_time - reminder_record.time::TIME)) / 60) <= 5 THEN
```

## Notification Preferences

Users can control notifications in the Settings screen:
- Enable/disable push notifications
- Set reminder frequency (daily/weekly/custom)
- Set reminder time
- Enable/disable daily motivation
- Set quiet hours

## Viewing Notifications

Users can view all their notifications in the Notifications Feed screen (`/notifications-feed`), which shows:
- All notification types
- Read/unread status
- Time since notification
- Ability to mark as read

## Troubleshooting

### Notifications Not Sending

1. **Check if functions exist**:
   ```sql
   SELECT routine_name FROM information_schema.routines 
   WHERE routine_schema = 'public' 
   AND routine_name LIKE '%notification%';
   ```

2. **Check if cron jobs are running**:
   ```sql
   SELECT * FROM cron.job;
   ```

3. **Check notification preferences**:
   ```sql
   SELECT id, notification_preferences FROM profiles WHERE id = 'user-id';
   ```

4. **Check reminders are enabled**:
   ```sql
   SELECT * FROM reminders WHERE enabled = true;
   ```

### Common Issues

- **Time zone issues**: Ensure your Supabase instance timezone matches your users' timezone
- **Cron not running**: If using pg_cron, ensure the extension is enabled
- **No notifications created**: Check that reminders exist and are enabled, and that Pakts are active

## Next Steps

1. Run the migrations
2. Set up cron jobs (pg_cron or external service)
3. Test the notification system
4. Monitor notification delivery
5. Adjust timing and messages as needed
