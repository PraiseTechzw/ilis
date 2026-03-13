# Database Schema Design: CUT Innovation Lifecycle Intelligence System (ILIS)

This document outlines the PostgreSQL schema optimized for Supabase. It is designed to support the intelligence engines (Viability Scoring, Risk Detection) while maintaining strict referential integrity, auditability, and analytical aggregation capabilities.

## 1. Core Definitions & Enums
Before defining tables, we define specific PostgreSQL `ENUM` types to enforce data consistency at the database level.

*   `role_type`: 'INNOVATOR', 'MENTOR', 'EVALUATOR', 'HUB_ADMIN', 'EXECUTIVE'
*   `project_stage`: 'INTAKE', 'IDEATION', 'PROTOTYPING', 'MARKET_VALIDATION', 'COMMERCIALIZATION', 'GRADUATED', 'ARCHIVED'
*   `innovation_category`: 'SOFTWARE', 'HARDWARE', 'BIOTECH', 'CLEANTECH', 'SERVICE'
*   `risk_level`: 'HEALTHY', 'LOW_RISK', 'MEDIUM_RISK', 'HIGH_RISK_STAGNANT'

---

## 2. Table Definitions

### A. Identity & Access Control
All authentication is handled by Supabase Auth (`auth.users`), but we extend it with public profiles and RBAC.

**Table: `profiles`**
*   `id` (UUID, PK, FK -> `auth.users.id`): Unique user identifier.
*   `email` (VARCHAR, Unique, Not Null): User email.
*   `first_name`, `last_name` (VARCHAR, Not Null)
*   `department_id` (UUID, FK -> `departments.id`, Nullable)
*   `created_at` (TIMESTAMPTZ, Default NOW)
*   **Indexes:** `idx_profiles_email`

**Table: `user_roles`**
*   `id` (UUID, PK)
*   `user_id` (UUID, FK -> `profiles.id`, Cascade Delete)
*   `role` (ENUM `role_type`, Not Null)
*   **Constraints:** Unique compound key `(user_id, role)` to prevent duplicate role assignments.

### B. Core Innovation Pipeline
The central nervous system tracking the IP and its lifecycle.

**Table: `projects`**
*   `id` (UUID, PK)
*   `title` (VARCHAR, Not Null)
*   `abstract` (TEXT)
*   `pi_id` (UUID, FK -> `profiles.id`): Primary Investigator/Lead Innovator.
*   `current_stage` (ENUM `project_stage`, Default 'INTAKE')
*   `innovation_category` (ENUM `innovation_category`)
*   `tags` (TEXT[]): Array of keywords for NLP matching (e.g., `['ai', 'fintech']`).
*   `trl_level` (INTEGER, Check 1-9): Technology Readiness Level.
*   `irl_level` (INTEGER, Check 1-9): Investment Readiness Level.
*   `latest_viability_score` (DECIMAL(5,2), Nullable): Cached from algorithm for fast dashboard reading.
*   `latest_risk_score` (INTEGER, Check 0-100): Cached from algorithm.
*   `created_at`, `updated_at` (TIMESTAMPTZ)
*   `is_active` (BOOLEAN, Default True): Used for soft deletes.
*   **Indexes:** `idx_projects_pi_id`, `idx_projects_stage_category` (for fast filtering).

**Table: `stage_history`**
*   `id` (UUID, PK)
*   `project_id` (UUID, FK -> `projects.id`, Cascade Delete)
*   `previous_stage` (ENUM `project_stage`, Nullable)
*   `new_stage` (ENUM `project_stage`, Not Null)
*   `transitioned_by` (UUID, FK -> `profiles.id`): Admin who approved it.
*   `transitioned_at` (TIMESTAMPTZ, Default NOW)
*   `notes` (TEXT)
*   **Usage:** Calculates physical velocity/time-in-stage for the Stagnation Risk Algorithm.

### C. Evaluation & Intelligence Engine Output
Storing the raw human input and the algorithmic computation.

**Table: `evaluations`** (The grading round)
*   `id` (UUID, PK)
*   `project_id` (UUID, FK -> `projects.id`)
*   `evaluator_id` (UUID, FK -> `profiles.id`)
*   `stage_reviewed` (ENUM `project_stage`)
*   `status` (VARCHAR): 'PENDING', 'COMPLETED'
*   `submitted_at` (TIMESTAMPTZ)

**Table: `scoring_results`** (The Rubric dimensions)
*   `id` (UUID, PK)
*   `evaluation_id` (UUID, FK -> `evaluations.id`, Cascade Delete)
*   `dimension` (VARCHAR): e.g., 'problem_clarity', 'tech_feasibility'
*   `raw_score` (INTEGER, Check 1-5)
*   `normalized_score` (DECIMAL): Algorithmic output mapped to system weights.

**Table: `algorithm_snapshots`** (Historical Viability & Risk Data)
*   `id` (UUID, PK)
*   `project_id` (UUID, FK -> `projects.id`)
*   `calculated_at` (TIMESTAMPTZ, Default NOW)
*   `viability_score` (DECIMAL)
*   `risk_score` (INTEGER)
*   `risk_level` (ENUM `risk_level`)
*   `trigger_event` (VARCHAR): What caused the recalc (e.g., 'STAGE_CHANGE', 'CRON_NIGHTLY')
*   **Usage:** Plotting the Viability vs. Risk trendlines over time on the Innovator/Admin dashboards.

### D. Mentorship & Activity Management
Tracking workload capacity and intervention mapping.

**Table: `mentors`** (Extends `profiles` explicitly for matching logic)
*   `id` (UUID, PK, FK -> `profiles.id`)
*   `max_capacity` (INTEGER, Default 3)
*   `expertise_tags` (TEXT[])
*   `commercialization_exp` (TEXT[])
*   `nda_signed_at` (TIMESTAMPTZ)

**Table: `mentor_assignments`**
*   `id` (UUID, PK)
*   `project_id` (UUID, FK -> `projects.id`)
*   `mentor_id` (UUID, FK -> `mentors.id`)
*   `assigned_by` (UUID, FK -> `profiles.id`)
*   `assigned_at` (TIMESTAMPTZ)
*   `status` (VARCHAR): 'ACTIVE', 'CONCLUDED'
*   `match_affinity_score` (DECIMAL): What the algorithm rated them at time of assignment.

**Table: `activity_logs`** (The unified timeline & stagnation prevention)
*   `id` (UUID, PK)
*   `project_id` (UUID, FK -> `projects.id`)
*   `user_id` (UUID, FK -> `profiles.id`)
*   `action_type` (VARCHAR): 'DOCUMENT_UPLOAD', 'MILESTONE_MET', 'MENTOR_MEETING'
*   `description` (TEXT)
*   `logged_at` (TIMESTAMPTZ)
*   **Indexes:** `idx_activity_logs_project_date` (Critical for checking `days_inactive` instantly).

### E. Market & Commercialization (The "Impact" Data)
Tracking the actual ROI of the incubation hub.

**Table: `commercialization_metrics`**
*   `id` (UUID, PK)
*   `project_id` (UUID, FK -> `projects.id`, Unique)
*   `target_tam` (BIGINT): Total Addressable Market in USD.
*   `funds_raised` (BIGINT, Default 0)
*   `patents_filed` (INTEGER, Default 0)
*   `spinoff_company_name` (VARCHAR, Nullable)
*   `university_equity_pct` (DECIMAL(5,2), Nullable)
*   `last_updated` (TIMESTAMPTZ)

### F. File System Mapping
Mapping secure object storage to projects.

**Table: `documents`**
*   `id` (UUID, PK)
*   `project_id` (UUID, FK -> `projects.id`)
*   `uploaded_by` (UUID, FK -> `profiles.id`)
*   `bucket_path` (VARCHAR, Not Null): Path exactly as stored in Supabase Storage.
*   `file_name` (VARCHAR)
*   `document_type` (VARCHAR): 'PITCH_DECK', 'FINANCIALS', 'IP_DISCLOSURE'
*   `uploaded_at` (TIMESTAMPTZ)

---

## 3. Data Strategy Guidelines

### A. How Algorithm Scores are Stored
*   **Real-time querying:** `projects.latest_viability_score` and `projects.latest_risk_score` serve as cached values for instant Kanban board sorting and dashboard rendering without complex JOINs.
*   **Historical querying:** Every time an edge function recalculates a score, it `INSERTS` a row into `algorithm_snapshots` before updating the `projects` table. This allows us to plot Recharts line graphs showing exactly when a project's risk spiked.

### B. Supporting Dashboard Aggregation (Executive View)
To support the Executive Director's high-level queries (e.g., "Total University IP Valuation" or "Pipeline Funnel Attrition"), we utilize **PostgreSQL Materialized Views**.

```sql
-- Example Materialized View Concept for Dashboard Speed
CREATE MATERIALIZED VIEW exec_pipeline_funnel AS
SELECT 
    current_stage, 
    COUNT(id) as project_count,
    AVG(latest_viability_score) as avg_viability,
    SUM(cm.target_tam) as aggregate_market_size
FROM projects p
LEFT JOIN commercialization_metrics cm ON p.id = cm.project_id
WHERE is_active = true
GROUP BY current_stage;
```
This view can be refreshed concurrently every hour via a `pg_cron` schedule, guaranteeing sub-100ms load times for complex executive reports.
