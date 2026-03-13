-- ILIS Evaluation & Scoring Engine

-- 1. Create Evaluation Table
CREATE TABLE evaluations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    evaluator_id UUID NOT NULL REFERENCES profiles(id),
    status VARCHAR DEFAULT 'PENDING', -- PENDING, COMPLETED, REJECTED
    overall_score DECIMAL(5,2),
    feedback TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create Scoring Results Table (Detailed scores per criteria)
CREATE TABLE scoring_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    evaluation_id UUID NOT NULL REFERENCES evaluations(id) ON DELETE CASCADE,
    criteria_name VARCHAR NOT NULL, -- e.g., 'Market Potential', 'Technical Feasibility'
    score INTEGER CHECK (score >= 1 AND score <= 10),
    weight DECIMAL(3,2) DEFAULT 1.0,
    comments TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Function to update project viability score
CREATE OR REPLACE FUNCTION update_project_viability_score()
RETURNS trigger AS $$
DECLARE
    new_avg_score DECIMAL(5,2);
BEGIN
    -- Calculate average score from all COMPLETED evaluations for this project
    SELECT AVG(overall_score) INTO new_avg_score
    FROM evaluations
    WHERE project_id = NEW.project_id AND status = 'COMPLETED';
    
    -- Update the project table
    UPDATE projects
    SET latest_viability_score = new_avg_score,
        updated_at = NOW()
    WHERE id = NEW.project_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 4. Trigger to update viability score when an evaluation is completed
CREATE TRIGGER on_evaluation_completed
AFTER UPDATE OF status ON evaluations
FOR EACH ROW
WHEN (NEW.status = 'COMPLETED')
EXECUTE FUNCTION update_project_viability_score();

-- 5. RLS Policies for Evaluations
ALTER TABLE evaluations ENABLE ROW LEVEL SECURITY;
ALTER TABLE scoring_results ENABLE ROW LEVEL SECURITY;

-- Evaluators can view and update their own assigned evaluations
CREATE POLICY "Evaluators can handle their own evaluations"
ON evaluations FOR ALL
TO authenticated
USING (auth.uid() = evaluator_id);

-- Evaluators can manage scoring results for their evaluations
CREATE POLICY "Evaluators can manage scoring results"
ON scoring_results FOR ALL
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM evaluations 
        WHERE evaluations.id = scoring_results.evaluation_id 
        AND evaluations.evaluator_id = auth.uid()
    )
);

-- Admins and Executives can view all evaluations
CREATE POLICY "Admins can view ALL evaluations"
ON evaluations FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM user_roles 
        WHERE user_id = auth.uid() 
        AND role IN ('HUB_ADMIN', 'EXECUTIVE')
    )
);

-- Innovators can view evaluations of THEIR projects
CREATE POLICY "Innovators can view evaluations of their projects"
ON evaluations FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM projects 
        WHERE projects.id = evaluations.project_id 
        AND projects.pi_id = auth.uid()
    )
);
