-- Optional: Add a database-level constraint to ensure milestone due_date doesn't exceed pakt deadline
-- This provides an additional layer of validation beyond the application code

-- Create a function to check if milestone due_date is within pakt deadline
CREATE OR REPLACE FUNCTION check_milestone_deadline()
RETURNS TRIGGER AS $$
BEGIN
  -- Check if milestone due_date exceeds the parent pakt's deadline
  IF EXISTS (
    SELECT 1 
    FROM public.pakts 
    WHERE id = NEW.pakt_id 
    AND NEW.due_date > deadline
  ) THEN
    RAISE EXCEPTION 'Milestone due_date (%) cannot exceed the Pakt deadline', NEW.due_date;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for INSERT operations
DROP TRIGGER IF EXISTS milestone_deadline_check_insert ON public.milestones;
CREATE TRIGGER milestone_deadline_check_insert
  BEFORE INSERT ON public.milestones
  FOR EACH ROW
  EXECUTE FUNCTION check_milestone_deadline();

-- Create trigger for UPDATE operations
DROP TRIGGER IF EXISTS milestone_deadline_check_update ON public.milestones;
CREATE TRIGGER milestone_deadline_check_update
  BEFORE UPDATE ON public.milestones
  FOR EACH ROW
  WHEN (OLD.due_date IS DISTINCT FROM NEW.due_date OR OLD.pakt_id IS DISTINCT FROM NEW.pakt_id)
  EXECUTE FUNCTION check_milestone_deadline();
