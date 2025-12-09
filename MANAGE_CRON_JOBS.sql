-- MANAGE CRON JOBS - Useful commands for managing scheduled notifications

-- ============================================
-- VIEW ALL CRON JOBS
-- ============================================
SELECT 
  jobid,
  schedule,
  command,
  nodename,
  nodeport,
  database,
  username,
  active,
  jobname
FROM cron.job
ORDER BY jobid;

-- ============================================
-- VIEW SPECIFIC NOTIFICATION JOBS
-- ============================================
SELECT 
  jobid,
  jobname,
  schedule,
  command,
  active
FROM cron.job
WHERE jobname LIKE '%notification%' 
   OR jobname LIKE '%milestone%' 
   OR jobname LIKE '%motivation%'
ORDER BY jobname;

-- ============================================
-- PAUSE A CRON JOB (set active = false)
-- ============================================
-- Example: Pause the minute-by-minute notification processing
-- UPDATE cron.job SET active = false WHERE jobname = 'process-notifications-every-minute';

-- ============================================
-- RESUME A CRON JOB (set active = true)
-- ============================================
-- Example: Resume the minute-by-minute notification processing
-- UPDATE cron.job SET active = true WHERE jobname = 'process-notifications-every-minute';

-- ============================================
-- DELETE A CRON JOB
-- ============================================
-- Example: Remove the minute-by-minute job
-- SELECT cron.unschedule('process-notifications-every-minute');

-- ============================================
-- UPDATE A CRON JOB SCHEDULE
-- ============================================
-- Example: Change daily motivation to 9 AM instead of 8 AM
-- SELECT cron.unschedule('daily-motivation-8am');
-- SELECT cron.schedule(
--   'daily-motivation-9am',
--   '0 9 * * *', -- 9 AM every day
--   $$SELECT send_daily_motivation();$$
-- );

-- ============================================
-- VIEW CRON JOB EXECUTION HISTORY
-- ============================================
-- Note: This requires pg_cron to log executions
SELECT 
  jobid,
  runid,
  job_pid,
  database,
  username,
  command,
  status,
  return_message,
  start_time,
  end_time
FROM cron.job_run_details
WHERE jobid IN (
  SELECT jobid FROM cron.job 
  WHERE jobname LIKE '%notification%' 
     OR jobname LIKE '%milestone%' 
     OR jobname LIKE '%motivation%'
)
ORDER BY start_time DESC
LIMIT 20;

-- ============================================
-- MANUALLY TRIGGER A JOB (for testing)
-- ============================================
-- You can also manually run the functions:
-- SELECT process_all_notifications();
-- SELECT send_reminder_notifications();
-- SELECT send_daily_motivation();
-- SELECT check_upcoming_milestones();
-- SELECT check_missed_milestones();
