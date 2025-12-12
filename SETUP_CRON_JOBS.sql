-- SETUP CRON JOBS FOR NOTIFICATIONS
-- Run this AFTER running QUICK_SETUP_NOTIFICATIONS.sql
-- This will schedule automatic notification processing

-- Schedule notification processing to run every minute
-- This checks for reminders that match the current time
SELECT cron.schedule(
  'process-notifications-every-minute',
  '* * * * *', -- Every minute
  $$SELECT process_all_notifications();$$
);

-- Schedule daily motivation at 8 AM (UTC)
-- Note: Adjust timezone if needed
SELECT cron.schedule(
  'daily-motivation-8am',
  '0 8 * * *', -- 8 AM every day (UTC)
  $$SELECT send_daily_motivation();$$
);

-- Schedule missed milestone check at midnight (UTC)
SELECT cron.schedule(
  'check-missed-milestones',
  '0 0 * * *', -- Midnight every day (UTC)
  $$SELECT check_missed_milestones();$$
);

-- Schedule upcoming milestone check every 6 hours
SELECT cron.schedule(
  'check-upcoming-milestones',
  '0 */6 * * *', -- Every 6 hours
  $$SELECT check_upcoming_milestones();$$
);

-- Verify cron jobs were created
SELECT 
  jobid,
  schedule,
  command,
  nodename,
  nodeport,
  database,
  username,
  active
FROM cron.job
WHERE jobname LIKE '%notification%' OR jobname LIKE '%milestone%' OR jobname LIKE '%motivation%';

-- Success message
DO $$
BEGIN
  RAISE NOTICE 'Cron jobs scheduled successfully!';
  RAISE NOTICE 'Notifications will now run automatically:';
  RAISE NOTICE '  - Reminder checks: Every minute';
  RAISE NOTICE '  - Daily motivation: 8 AM daily';
  RAISE NOTICE '  - Missed milestones: Midnight daily';
  RAISE NOTICE '  - Upcoming milestones: Every 6 hours';
END $$;
