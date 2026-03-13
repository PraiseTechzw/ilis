# Functional Requirements Document: CUT Innovation Lifecycle Intelligence System (ILIS)

## 1. System Overview
The CUT Innovation Lifecycle Intelligence System (ILIS) is a university-grade platform designed to manage, evaluate, and accelerate research projects from ideation to commercialization. It replaces ad-hoc tracking with a structured, data-driven pipeline featuring algorithmic scoring, intelligent matchmaking, and stage-gate progression.

## 2. Global System Rules & Business Logic
*   **Audit Trail:** Every state change (status update, score submission, document upload, resource grant) must be logged with a timestamp, User ID, and the previous state.
*   **Role-Based Access Control (RBAC):** Strict enforcement. A user can hold multiple roles (e.g., a Professor can be an Innovator on one project and an Evaluator on another), but access is strictly delineated per project.
*   **Data Sovereignty:** All uploaded IP documents must be encrypted at rest and in transit.
*   **Soft Deletes:** Records (projects, users, evaluations) are never hard-deleted from the database; they are marked as inactive or archived for institutional memory.

---

## 3. Module Specifications

### Module 1: Authentication & User Management (IAM)
**Objective:** Securely identify users and assign appropriate institutional permissions.

*   **REQ-IAM-001 [SSO Integration]:** The system must support SAML 2.0 / OAuth2 integration with the university's existing Single Sign-On (SSO) infrastructure for Innovators, Admins, and internal Evaluators.
*   **REQ-IAM-002 [External User Onboarding]:** The system must allow Hub Admins to invite external users (Industry Mentors, External Evaluators) via email. These users authenticate via magic link or standard password creation (enforcing complexity rules: 12 chars, alphanumeric + symbol).
*   **REQ-IAM-003 [Role Assignment]:** Hub Admins must be able to assign, revoke, or combine roles (Innovator, Mentor, Evaluator, Hub Admin, Executive Viewer) on a per-user basis.
*   **REQ-IAM-004 [NDA Enforcement]:** Upon first login, Mentors and Evaluators must digitally sign the university's Non-Disclosure Agreement (NDA). Access to project data is blocked until the timestamped signature is recorded.

### Module 2: Intake & Project Submission
**Objective:** Standardize the capture of new intellectual property and assign a baseline viability score.

*   **REQ-INT-001 [Dynamic Intake Form]:** The system must present a dynamic submission form. If a user selects "Software" as the domain, subsequent questions related to "Hardware Manufacturing" must be hidden.
*   **REQ-INT-002 [Standardized Taxonomy]:** Submissions must require selection from standardized institutional drop-downs for: Department, Primary Investigator (PI), Technology Readiness Level (TRL 1-9), and Investment Readiness Level (IRL 1-9).
*   **REQ-INT-003 [Algorithmic Triage Scoring]:** Upon submission, the system must trigger a background job to calculate a "Baseline Viability Score" (0-100) based on weighted inputs (e.g., Existing Patent = +15 pts, TRL 4+ = +20 pts).
*   **REQ-INT-004 [Co-Investigator Linking]:** Innovators must be able to search the user directory and link Co-Innovators to the project, granting them inherit `Write` access to the draft.

### Module 3: Stage-Gate Pipeline & Workflow
**Objective:** Enforce structured progression through predefined incubation phases.

*   **REQ-STG-001 [Defined Lifecycle Stages]:** The system must enforce sequential project states: *Draft $\rightarrow$ Intake Review $\rightarrow$ Ideation (Stage 1) $\rightarrow$ Prototyping (Stage 2) $\rightarrow$ Market Validation (Stage 3) $\rightarrow$ Commercialization (Stage 4) $\rightarrow$ Graduated/Archived.*
*   **REQ-STG-002 [Gate Criteria]:** A project cannot be moved to the next stage unless specific prerequisite fields are populated (e.g., Stage 3 requires a completed "Market Sizing" document and a minimum TRL of 4).
*   **REQ-STG-003 [Advancement Requests]:** Innovators can click "Request Stage Advancement." This locks the project record from further edits by the Innovator and moves it to the Hub Admin's "Pending Review" queue.
*   **REQ-STG-004 [Admin Override]:** Hub Admins must have the authority to manually regress a project to a previous stage or force advance it, provided they enter a mandatory "Justification" note in the audit log.

### Module 4: Evaluation & Scoring Engine
**Objective:** Digitize committee reviews to provide objective, normalized scores for advancement or funding.

*   **REQ-EVAL-001 [Rubric Builder]:** Hub Admins must be able to create standard scoring rubrics consisting of multiple criteria (e.g., Technical Feasibility, Market Need) scaled 1-5, with custom weightings.
*   **REQ-EVAL-002 [Evaluator Assignment]:** Hub Admins must be able to assign a specific project and specific rubric to one or more Evaluators. The system must notify the Evaluator via email.
*   **REQ-EVAL-003 [Blind Scoring]:** Evaluators scoring the same project must not see each other's scores or comments until the Hub Admin formally closes the evaluation round.
*   **REQ-EVAL-004 [Score Normalization]:** The system must calculate an aggregate score. If historical data shows Evaluator A's average score is 2.1 and Evaluator B's is 4.5, the system must display the "Raw Average" alongside a mathematically "Normalized Average" to account for harsh/lenient graders.

### Module 5: Mentor Assignment & Interaction (Matchmaking)
**Objective:** Connect projects with appropriate expertise and track engagement.

*   **REQ-MNT-001 [Mentor Profiling]:** Mentors must complete a profile selecting their specialized tags (e.g., "B2B SaaS," "Medical Devices," "Seed Funding").
*   **REQ-MNT-002 [Algorithmic Match Suggestion]:** The system must analyze project abstract keywords and suggest the Top 3 highest-matching Mentors to the Hub Admin during Stage 1.
*   **REQ-MNT-003 [Interaction Logging]:** Mentors must have a portal to log meeting dates, duration (hours), and structured notes for their assigned projects.
*   **REQ-MNT-004 [Innovator Feedback]:** Innovators must be able to rate Mentor interactions (thumbs up/down) to help the Hub Admin weed out disengaged mentors.

### Module 6: Document Management & Data Rooms
**Objective:** Securely store and organize artifacts required for commercialization.

*   **REQ-DOC-001 [Categorized Uploads]:** Innovators must be able to upload files (PDF, DOCX, XLSX, max 50MB). Files must be tagged by category (e.g., "Financials", "Legal/IP", "Technical Specs").
*   **REQ-DOC-002 [Restricted Data Room]:** During Stage 4 (Commercialization), the system must generate a read-only "Data Room" link containing specific document categories. This link can be temporarily shared with external investors and auto-expires after a Hub Admin-defined period (e.g., 14 days).

### Module 7: Intelligence, Risk Detection & Analytics
**Objective:** Surface actionable insights, rather than just storing data.

*   **REQ-INTEL-001 [Velocity Tracking (Stagnation)]:** The system must calculate the "Days in Current Stage." If this exceeds a configurable threshold (e.g., 90 days in Prototyping), the system flags the project visually (Red Flag) on the Hub Admin dashboard.
*   **REQ-INTEL-002 [Automated Nudges]:** For stagnant projects, the system automatically emails the Innovator asking for a status update, providing a direct link to update their TRL/IRL metrics.
*   **REQ-INTEL-003 [Pitch Deck Auto-Compiler]:** The system must provide an "Export to Pitch Deck" button for Innovators. This queries the database for the abstract, current TRL, market size metadata, and team members, formatting it into a standardized PDF layout.
*   **REQ-INTEL-004 [Institutional Memory Matching]:** When a new project is submitted, the system must surface "Similar Past Projects" based on keyword overlap, indicating whether those past projects Graduated or Failed.

### Module 8: Executive Reporting & Dashboards
**Objective:** Provide high-level ROI and portfolio health metrics to university leadership.

*   **REQ-RPT-001 [Portfolio Valuation]:** The Executive Dashboard must display aggregate numbers: Total Active Projects, Total Projects Graduated, Total Mentorship Hours Logged, and aggregate estimated Market Size of the portfolio.
*   **REQ-RPT-002 [Pipeline Funnel]:** A visual funnel chart showing attrition rates (e.g., 100 Intake -> 40 Stage 1 -> 10 Stage 3 -> 2 Commercialized).
*   **REQ-RPT-003 [Diversity & Department Analytics]:** Bar charts breaking down active projects by originating University Faculty/Department and demographic data of the Innovators (if explicitly provided).
*   **REQ-RPT-004 [Exportable Reports]:** Executives must be able to export aggregate dashboard views as CSV or PDF for university board meetings.
