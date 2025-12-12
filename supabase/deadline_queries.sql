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
WHERE table_name = 'Resolves' AND column_name = 'deadline';

-- Expected: deadline | timestamp with time zone | NO

-- ============================================
-- 2. VIEW ALL Resolves WITH DEADLINES
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
FROM Resolves
ORDER BY deadline ASC;

-- ============================================
-- 3. FIX NULL DEADLINES (If Any Exist)
-- ============================================

-- Set any NULL deadlines to 90 days from creation
UPDATE Resolves
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
FROM Resolves
WHERE status = 'active'
  AND deadline > NOW()
  AND deadline < NOW() + INTERVAL '7 days'
ORDER BY deadline ASC;

-- ============================================
-- 5. GET OVERDUE Resolves
-- ============================================

SELECT 
  name,
  deadline,
  category,
  progress,
  EXTRACT(DAY FROM (NOW() - deadline)) as days_overdue
FROM Resolves
WHERE status = 'active'
  AND deadline < NOW()
ORDER BY deadline ASC;

-- ============================================
-- 6. UPDATE SPECIFIC Resolve DEADLINE
-- ============================================

-- Replace 'YOUR_PAKT_ID' and '2026-03-15' with your values
UPDATE Resolves
SET deadline = '2026-03-15 00:00:00+00'::timestamp with time zone
WHERE id = 'YOUR_PAKT_ID'::uuid;

-- ============================================
-- 7. EXTEND ALL ACTIVE Resolves BY 30 DAYS
-- ============================================

UPDATE Resolves
SET deadline = deadline + INTERVAL '30 days'
WHERE status = 'active';

-- ============================================
-- 8. GET Resolves GROUPED BY DEADLINE STATUS
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
FROM Resolves
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
FROM Resolves
GROUP BY user_id;

-- ============================================
-- 10. CLEAN UP TEST DATA (Optional)
-- ============================================

-- Delete all Resolves (BE CAREFUL!)
-- DELETE FROM Resolves WHERE created_at > NOW() - INTERVAL '1 hour';

-- Or delete Resolves for specific user:
-- DELETE FROM Resolves WHERE user_id = 'YOUR_USER_ID'::uuid;

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
    Resolves.deadline,
    EXTRACT(DAY FROM (Resolves.deadline - NOW())),
    Resolves.user_id
  FROM Resolves
  WHERE status = 'active'
    AND Resolves.deadline > NOW()
    AND Resolves.deadline < NOW() + INTERVAL '7 days'
  ORDER BY Resolves.deadline ASC;
END;
$$ LANGUAGE plpgsql;

-- Use it:
-- SELECT * FROM check_upcoming_deadlines();

-- ============================================
-- 12. DEADLINE ANALYTICS
-- ============================================

-- Average time to complete Resolves
SELECT 
  AVG(EXTRACT(EPOCH FROM (updated_at - created_at)) / 86400) as avg_days_to_complete,
  AVG(progress) as avg_progress_at_completion
FROM Resolves
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
FROM Resolves
GROUP BY deadline_range;

-- ============================================
-- NOTES
-- ============================================

-- All timestamps are in UTC
-- Use timezone() function to convert to local time if needed:
-- SELECT name, deadline AT TIME ZONE 'America/New_York' as deadline_local FROM Resolves;

-- To get current timestamp in correct format:
-- SELECT NOW();
-- Returns: 2025-12-05 01:23:45.123456+00

-- To format deadline for display:
-- SELECT name, TO_CHAR(deadline, 'Mon DD, YYYY') as formatted_deadline FROM Resolves;
