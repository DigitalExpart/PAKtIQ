-- Enable pg_cron extension (if available)
-- Note: This requires pg_cron extension to be enabled in Supabase
-- If pg_cron is not available, you'll need to use Supabase Edge Functions or external cron service

-- Create function to be called by cron
CREATE OR REPLACE FUNCTION cron_process_notifications()
RETURNS void AS $$
BEGIN
  PERFORM process_all_notifications();
END;
$$ LANGUAGE plpgsql;

-- Schedule notification processing to run every minute
-- This checks for reminders that match the current time
-- Note: Uncomment these if pg_cron is enabled in your Supabase instance
/*
SELECT cron.schedule(
  'process-notifications-every-minute',
  '* * * * *', -- Every minute
  $$SELECT process_all_notifications();$$
);

-- Schedule daily motivation at 8 AM
SELECT cron.schedule(
  'daily-motivation-8am',
  '0 8 * * *', -- 8 AM every day
  $$SELECT send_daily_motivation();$$
);

-- Schedule missed milestone check at midnight
SELECT cron.schedule(
  'check-missed-milestones',
  '0 0 * * *', -- Midnight every day
  $$SELECT check_missed_milestones();$$
);

-- Schedule upcoming milestone check every 6 hours
SELECT cron.schedule(
  'check-upcoming-milestones',
  '0 */6 * * *', -- Every 6 hours
  $$SELECT check_upcoming_milestones();$$
);
*/

-- Alternative: If pg_cron is not available, you can use Supabase Edge Functions
-- or an external service to call these functions via HTTP
