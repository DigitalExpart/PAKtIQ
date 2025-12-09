-- ============================================
-- DEADLINE MANAGEMENT SQL COMMANDS
-- Run these in Supabase SQL Editor
-- ============================================

-- ============================================
-- 1. VERIFY SCHEMA
-- ============================================

-- Check that deadline column exists and is correct type
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'pakts' AND column_name = 'deadline';

-- Expected: deadline | timestamp with time zone | NO

-- ============================================
-- 2. VIEW ALL PAKTS WITH DEADLINES
-- ============================================

SELECT 
  id,
  name,
  deadline,
  category,
  status,
  progress,
  EXTRACT(DAY FROM (deadline - NOW())) as days_until_deadline,
  created_at
FROM pakts
ORDER BY deadline ASC;

-- ============================================
-- 3. FIX NULL DEADLINES (If Any Exist)
-- ============================================

-- Set any NULL deadlines to 90 days from creation
UPDATE pakts
SET deadline = created_at + INTERVAL '90 days'
WHERE deadline IS NULL;

-- ============================================
-- 4. GET UPCOMING DEADLINES (Next 7 Days)
-- ============================================

SELECT 
  name,
  deadline,
  category,
  progress,
  EXTRACT(DAY FROM (deadline - NOW())) as days_left
FROM pakts
WHERE status = 'active'
  AND deadline > NOW()
  AND deadline < NOW() + INTERVAL '7 days'
ORDER BY deadline ASC;

-- ============================================
-- 5. GET OVERDUE PAKTS
-- ============================================

SELECT 
  name,
  deadline,
  category,
  progress,
  EXTRACT(DAY FROM (NOW() - deadline)) as days_overdue
FROM pakts
WHERE status = 'active'
  AND deadline < NOW()
ORDER BY deadline ASC;

-- ============================================
-- 6. UPDATE SPECIFIC PAKT DEADLINE
-- ============================================

-- Replace 'YOUR_PAKT_ID' and '2026-03-15' with your values
UPDATE pakts
SET deadline = '2026-03-15 00:00:00+00'::timestamp with time zone
WHERE id = 'YOUR_PAKT_ID'::uuid;

-- ============================================
-- 7. EXTEND ALL ACTIVE PAKTS BY 30 DAYS
-- ============================================

UPDATE pakts
SET deadline = deadline + INTERVAL '30 days'
WHERE status = 'active';

-- ============================================
-- 8. GET PAKTS GROUPED BY DEADLINE STATUS
-- ============================================

SELECT 
  CASE 
    WHEN deadline < NOW() THEN 'Overdue'
    WHEN deadline < NOW() + INTERVAL '7 days' THEN 'This Week'
    WHEN deadline < NOW() + INTERVAL '30 days' THEN 'This Month'
    ELSE 'Future'
  END as deadline_status,
  COUNT(*) as count,
  AVG(progress) as avg_progress
FROM pakts
WHERE status = 'active'
GROUP BY deadline_status
ORDER BY 
  CASE deadline_status
    WHEN 'Overdue' THEN 1
    WHEN 'This Week' THEN 2
    WHEN 'This Month' THEN 3
    ELSE 4
  END;

-- ============================================
-- 9. GET USER STATISTICS
-- ============================================

SELECT 
  user_id,
  COUNT(*) as total_pakts,
  COUNT(*) FILTER (WHERE status = 'active') as active,
  COUNT(*) FILTER (WHERE status = 'completed') as completed,
  COUNT(*) FILTER (WHERE deadline < NOW() AND status = 'active') as overdue,
  AVG(progress) FILTER (WHERE status = 'active') as avg_progress,
  MIN(deadline) FILTER (WHERE status = 'active' AND deadline > NOW()) as next_deadline
FROM pakts
GROUP BY user_id;

-- ============================================
-- 10. CLEAN UP TEST DATA (Optional)
-- ============================================

-- Delete all pakts (BE CAREFUL!)
-- DELETE FROM pakts WHERE created_at > NOW() - INTERVAL '1 hour';

-- Or delete pakts for specific user:
-- DELETE FROM pakts WHERE user_id = 'YOUR_USER_ID'::uuid;

-- ============================================
-- 11. CREATE DEADLINE REMINDER TRIGGER (Advanced)
-- ============================================

-- Function to check for upcoming deadlines
CREATE OR REPLACE FUNCTION check_upcoming_deadlines()
RETURNS TABLE (
  pakt_id uuid,
  pakt_name text,
  deadline timestamp with time zone,
  days_left numeric,
  user_id uuid
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    id,
    name,
    pakts.deadline,
    EXTRACT(DAY FROM (pakts.deadline - NOW())),
    pakts.user_id
  FROM pakts
  WHERE status = 'active'
    AND pakts.deadline > NOW()
    AND pakts.deadline < NOW() + INTERVAL '7 days'
  ORDER BY pakts.deadline ASC;
END;
$$ LANGUAGE plpgsql;

-- Use it:
-- SELECT * FROM check_upcoming_deadlines();

-- ============================================
-- 12. DEADLINE ANALYTICS
-- ============================================

-- Average time to complete pakts
SELECT 
  AVG(EXTRACT(EPOCH FROM (updated_at - created_at)) / 86400) as avg_days_to_complete,
  AVG(progress) as avg_progress_at_completion
FROM pakts
WHERE status = 'completed';

-- Success rate by deadline proximity
SELECT 
  CASE 
    WHEN deadline < created_at + INTERVAL '30 days' THEN 'Short Term (<30 days)'
    WHEN deadline < created_at + INTERVAL '90 days' THEN 'Medium Term (30-90 days)'
    ELSE 'Long Term (>90 days)'
  END as deadline_range,
  COUNT(*) as total,
  COUNT(*) FILTER (WHERE status = 'completed') as completed,
  ROUND(100.0 * COUNT(*) FILTER (WHERE status = 'completed') / COUNT(*), 1) as completion_rate
FROM pakts
GROUP BY deadline_range;

-- ============================================
-- NOTES
-- ============================================

-- All timestamps are in UTC
-- Use timezone() function to convert to local time if needed:
-- SELECT name, deadline AT TIME ZONE 'America/New_York' as deadline_local FROM pakts;

-- To get current timestamp in correct format:
-- SELECT NOW();
-- Returns: 2025-12-05 01:23:45.123456+00

-- To format deadline for display:
-- SELECT name, TO_CHAR(deadline, 'Mon DD, YYYY') as formatted_deadline FROM pakts;
