-- ILIS Stage History & Document Access Refinement

-- 1. Create Stage History Table
CREATE TABLE stage_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    old_stage project_stage,
    new_stage project_stage NOT NULL,
    reason TEXT,
    changed_at TIMESTAMPTZ DEFAULT NOW(),
    changed_by UUID REFERENCES auth.users(id)
);

-- 2. Trigger Function to automatic track stage changes
CREATE OR REPLACE FUNCTION track_project_stage_change()
RETURNS TRIGGER AS $$
BEGIN
  IF (OLD.current_stage IS DISTINCT FROM NEW.current_stage) THEN
    INSERT INTO stage_history (project_id, old_stage, new_stage, changed_by)
    VALUES (NEW.id, OLD.current_stage, NEW.current_stage, auth.uid());
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Trigger
CREATE TRIGGER on_project_stage_change
  AFTER UPDATE OF current_stage ON projects
  FOR EACH ROW
  EXECUTE PROCEDURE track_project_stage_change();

-- 4. Initial Entry for New Projects
CREATE OR REPLACE FUNCTION record_initial_project_stage()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO stage_history (project_id, old_stage, new_stage, changed_by)
  VALUES (NEW.id, NULL, NEW.current_stage, auth.uid());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_project_created_history
  AFTER INSERT ON projects
  FOR EACH ROW
  EXECUTE PROCEDURE record_initial_project_stage();

-- 5. Document Table RLS Refinement
-- Allow innovators to insert their own document records
CREATE POLICY "Innovators can insert project documents"
ON documents FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM projects 
    WHERE id = documents.project_id 
    AND pi_id = auth.uid()
  )
);

-- Allow innovators to delete their own document records
CREATE POLICY "Innovators can delete project documents"
ON documents FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM projects 
    WHERE id = documents.project_id 
    AND pi_id = auth.uid()
  )
);

-- Admins can view all history
ALTER TABLE stage_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view history of their own projects"
ON stage_history FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM projects WHERE id = stage_history.project_id AND pi_id = auth.uid()
  )
);

CREATE POLICY "Admins can view all history"
ON stage_history FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role IN ('HUB_ADMIN', 'EXECUTIVE')
  )
);
