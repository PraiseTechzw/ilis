# ILIS: User Roles & End-to-End Workflow Analysis

## 1. User Role Mapping

### A. The Innovator (Student, Researcher, Alumni)
*   **What they do:** Submit initial concepts, execute research/business tasks, track milestones, request resources, and engage with mentors.
*   **Data they input:** Project abstracts, TRL (Technology Readiness Level) / IRL (Investment Readiness Level) progress, milestone evidence, pitch decks, resource requests (e.g., lab time, micro-grants).
*   **Decisions they make:** When to request stage-gate advancement, which strategic pivots to make based on feedback, when to accept/reject mentor introductions.
*   **Dashboard needed:** **"My Portfolio"** -> Shows active projects, current viability score, pending tasks, messages from mentors, and resource utilization.
*   **Permissions:** `CRUD` (Create, Read, Update, Delete) on their own projects only. `Read-only` on assigned mentors and approved resources.

### B. The Mentor (Industry Expert, Alumni Catalyst)
*   **What they do:** Guide assigned projects, provide actionable feedback, log interactions, and sometimes provide informal assessments.
*   **Data they input:** Meeting summaries, qualitative feedback notes, readiness assessments, and hours logged.
*   **Decisions they make:** Recommendations on project viability, strategic "go/no-go" advice directly to the Innovator (advisory, not binding).
*   **Dashboard needed:** **"Mentorship Hub"** -> Shows assigned projects, alerts for projects needing attention, and recent milestone updates from their Innovators.
*   **Permissions:** `Read-only` on assigned project details. `Write` access for notes, feedback, and logging hours on assigned projects.

### C. The Evaluator (Review Committee, Domain Expert)
*   **What they do:** Technically and commercially assess projects at critical stage-gates (e.g., moving from Prototyping to Market Validation).
*   **Data they input:** Standardized scoring rubric responses (e.g., technical feasibility rating, market size estimates, IP potential), and final progression recommendations.
*   **Decisions they make:** Approve or Reject progression to the next stage; recommend specific grant amounts or resource allocations.
*   **Dashboard needed:** **"Evaluation Queue"** -> Shows projects awaiting review, due dates, and strict access to the project's data room/evidence.
*   **Permissions:** `Read-only` on projects specifically assigned for review. `Write` access to assigned scoring rubrics.

### D. The Hub Admin (Incubation Manager)
*   **What they do:** Manage the entire incubation pipeline, manually allocate resources, assign Evaluators/Mentors, and intervene when projects stall.
*   **Data they input:** Resource allocations (space, funds), assignation mappings (Mentor->Project), system configurations (updating rubrics or intake forms).
*   **Decisions they make:** Final authoritative say on stage-gate approvals (incorporating Evaluator scores), resource dispersion, and formally closing/archiving failed projects.
*   **Dashboard needed:** **"Command Center"** -> Full pipeline view (Kanban/List), intelligence flags (stagnant projects), resource utilization metrics across the hub, and aggregate portfolio health.
*   **Permissions:** `Full CRUD` access across all projects, users, scoring configurations, and resources (Super Admin).

### E. The Executive Viewer (Innovation Director, University Leadership)
*   **What they do:** Monitor high-level metrics, report to external stakeholders/funders, and assess the Hub's Return on Investment (ROI).
*   **Data they input:** None (Purely analytical role).
*   **Decisions they make:** Strategic hub funding adjustments, high-level university policy changes regarding IP or commercialization.
*   **Dashboard needed:** **"Executive Summary"** -> Aggregated metrics, total IP/patents generated, commercialization ROI, demographic breakdowns, and macro pipeline trends.
*   **Permissions:** `Read-only` access to aggregated dashboards and anonymized macro-data. No direct edit access to individual projects.

---

## 2. Complete End-to-End Workflow Map

The lifecycle of an innovation within ILIS follows these sequential steps:

1.  **Intake & Triage [INNOVATOR + SYSTEM]**
    *   Innovator submits an idea via dynamic form.
    *   *Intelligence Applied:* System calculates baseline Viability Score.
2.  **Baseline Review & Onboarding [HUB ADMIN]**
    *   Admin reviews intake score, approves entry into Stage 1 (Ideation).
3.  **Mentorship & Development [INNOVATOR + MENTOR]**
    *   Innovator works on milestones.
    *   *Intelligence Applied:* System automatically suggests Mentors based on NLP matching of abstract keywords.
4.  **Stage-Gate Evaluation [EVALUATOR]**
    *   Innovator requests to move to Stage 2 (Prototyping).
    *   Evaluators use system rubrics to score the project.
5.  **Review & Resource Allocation [HUB ADMIN]**
    *   Admin reviews aggregated Evaluator scores.
    *   Admin approves advancement and allocates Stage 2 grants/lab space.
6.  **Continuous Monitoring (The Loop)**
    *   Steps 3 -> 5 repeat for subsequent stages (Market Validation, Legal/IP, Commercialization).
    *   *Intelligence Applied:* System constantly monitors velocity. If a project stays in a stage too long, an alert is sent to the Admin.
7.  **Exit / Graduation [ALL]**
    *   Project successfully spins out, licenses IP, or is officially archived (failed). Data is retained for institutional memory.

---

## 3. Role Dependencies Map

*   **Innovator** depends on $\rightarrow$ **Mentor** (for guidance) and **Hub Admin** (for resources and stage advancement).
*   **Mentor** depends on $\rightarrow$ **Hub Admin** (to be matched with relevant projects).
*   **Evaluator** depends on $\rightarrow$ **Innovator** (to provide accurate data/evidence for review).
*   **Hub Admin** depends on $\rightarrow$ **Evaluator** (to provide objective scores so Admins don't have to be experts in every field).
*   **Executive Viewer** depends on $\rightarrow$ **Innovators & Admins** (to keep the system updated to ensure accurate macro-reporting).

---

## 4. Critical Points for System Intelligence

1.  **Algorithmic Triage Score (Intake):** Using predefined weights (e.g., student vs. post-doc, pure software vs. hard-tech) to give a baseline Viability Score before human review.
2.  **Automated Matchmaking (Development):** Using Natural Language Processing (NLP) on the project's description to match tags with Mentor expertise databases. (e.g., *Project mentions "machine learning" and "healthcare" -> System flags Mentor John Doe*).
3.  **Rubric Normalization (Evaluation):** The system automatically normalizes Evaluator scores. If Evaluator A always scores harshly and Evaluator B scores easily, the system weighs them to find a true average.
4.  **Velocity Tracking & Stagnation Detection (Pipeline Management):** The system tracks the days spent in a specific TRL phase. If it exceeds historical averages by 20%, the system flags the project as "At Risk / Stagnant" on the Hub Admin's dashboard and auto-emails the Innovator.
5.  **Pitch Deck Auto-Compilation (Export):** The system intelligently aggregates the Innovator's milestone inputs, market size data, and TRL level to auto-generate a standardized PDF Pitch Deck for downstream investors.
