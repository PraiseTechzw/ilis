-- ILIS Admin Analytics & Materialized Views

-- 1. Create a view for Project Stage Distribution (The Heatmap Data)
CREATE MATERIALIZED VIEW mv_project_stage_metrics AS
SELECT 
    current_stage,
    COUNT(*) as project_count,
    AVG(trl_level) as avg_trl,
    AVG(latest_viability_score) as avg_viability
FROM projects
GROUP BY current_stage;

-- 2. Index the view for fast reads
CREATE UNIQUE INDEX idx_mv_project_stage_metrics_stage ON mv_project_stage_metrics (current_stage);

-- 3. Function to refresh the view (trigger-based or manual)
CREATE OR REPLACE FUNCTION refresh_project_metrics()
RETURNS trigger AS $$
BEGIN
    REFRESH MATERIALIZED VIEW CONCURRENTLY mv_project_stage_metrics;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- 4. Triggers to refresh stats when projects change
CREATE TRIGGER refresh_metrics_on_change
AFTER INSERT OR UPDATE OR DELETE ON projects
FOR EACH STATEMENT EXECUTE FUNCTION refresh_project_metrics();

-- 5. Helper Function for Admin Pipeline Overview
CREATE OR REPLACE FUNCTION get_admin_pipeline_stats()
RETURNS TABLE (
    total_projects bigint,
    active_innovators bigint,
    avg_pipeline_velocity numeric,
    projects_at_risk bigint
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        (SELECT COUNT(*) FROM projects) as total_projects,
        (SELECT COUNT(DISTINCT pi_id) FROM projects) as active_innovators,
        (SELECT COALESCE(AVG(TRL_LEVEL), 0) FROM projects) as avg_pipeline_velocity,
        (SELECT COUNT(*) FROM projects WHERE latest_risk_score > 60) as projects_at_risk;
END;
$$ LANGUAGE plpgsql;
