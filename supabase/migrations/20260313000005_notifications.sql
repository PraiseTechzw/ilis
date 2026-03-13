-- ILIS Notification & Messaging System

-- 1. Create Notifications Table
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    title VARCHAR NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR DEFAULT 'INFO', -- INFO, SUCCESS, WARNING, ALERT
    is_read BOOLEAN DEFAULT FALSE,
    link VARCHAR, -- Optional deep link to a project or evaluation
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. RLS Policies
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own notifications"
ON notifications FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications"
ON notifications FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

-- 3. Trigger Function to Notify Innovators on Evaluation Completion
CREATE OR REPLACE FUNCTION notify_on_evaluation_completion()
RETURNS trigger AS $$
DECLARE
    project_owner_id UUID;
    project_title TEXT;
BEGIN
    -- Get project owner and title
    SELECT pi_id, title INTO project_owner_id, project_title
    FROM projects
    WHERE id = NEW.project_id;
    
    -- Insert notification
    INSERT INTO notifications (user_id, title, message, type, link)
    VALUES (
        project_owner_id,
        'Evaluation Complete',
        'Expert review for "' || project_title || '" has been successfully injected into the system.',
        'SUCCESS',
        '/innovator/projects/' || NEW.project_id
    );
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Trigger
CREATE TRIGGER on_evaluation_finished_notify
AFTER UPDATE OF status ON evaluations
FOR EACH ROW
WHEN (NEW.status = 'COMPLETED')
EXECUTE FUNCTION notify_on_evaluation_completion();
