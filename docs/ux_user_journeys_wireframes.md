# UX User Journeys & Wireframe Descriptions: ILIS

This document details the critical user journeys and low-fidelity structural descriptions for the CUT Innovation Lifecycle Intelligence System (ILIS). These wireframes follow the "Institutional Cybernetics" design language (high data density, horizontal pipeline focus, command center aesthetic).

---

## 1. Innovator Onboarding & Project Submission
**Primary Goal:** Reduce friction for capturing technical IP while algorithmically structuring the data for the Triaging Engine.

**Journey:** User logs in via University SSO $\rightarrow$ Lands on Empty State $\rightarrow$ Clicks "Initialize New Project" $\rightarrow$ Completes Dynamic Intake $\rightarrow$ Receives Baseline Viability Score.

### Screen: Intake Command Form
*   **Layout:** Single column, centered, max-width 800px. Stepper navigation at the top (e.g., 1. Core Concept $\rightarrow$ 2. Domain & Market $\rightarrow$ 3. Team).
*   **Major Sections:**
    *   *Top Bar:* Standard ILIS Global Nav (Dark mode).
    *   *Progress Header:* Monospaced tracker (e.g., `INTAKE_SEQ: 01/03`).
    *   *Dynamic Form Area:* Inputs that render based on previous answers (e.g., Selecting "Hardware" reveals "Manufacturing Readiness Level" slider).
*   **Components:**
    *   Dropdowns for standardized University Taxonomy (Departments, PI names).
    *   Dual-Slider input for TRL (Technology Readiness Level) and IRL (Investment Readiness Level) with helper tooltips explaining each level.
    *   Multi-select pill tags for 'Expertise Matching' (used by the Mentor Algorithm).
*   **Data Shown:** Real-time form validation errors.
*   **Interactions:** "Save Draft" or "Execute Submission". On submit, the system calculates the baseline score immediately before routing to the Portfolio Dashboard.

---

## 2. Innovator: Project Tracking & Intelligence Nudges
**Primary Goal:** Show the Innovator what they need to do *today* to advance their IP, gamifying the commercialization process without feeling like generic task management.

### Screen: The Innovator Command Center ("My Portfolio")
*   **Layout:** 3-Column Split. Left: Quick Nav (20%). Center: Active Project Hub (55%). Right: Intelligence & Resource Action Matrix (25%).
*   **Major Sections:**
    *   *Center - Project Vitality Board:* A large, prominent display of their single active project (or a list if they have multiple). Shows Current Stage, Days in Stage, and the algorithmic Viability Score.
    *   *Center - The Progression Track:* A horizontal timeline visualization of the 4 Stage-Gates. The current stage pulses with the "Healthy" or "At-Risk" semantic color.
    *   *Right - Intelligence Action Panel:* The system-generated "Next Best Actions".
*   **Components:**
    *   **The Intelligence Nudge Block (Top Right):** e.g., "⚠️ *Milestone Overdue:* Customer Discovery Interviews (0/50). Your Risk Score will increase in 3 days."
    *   **Resource Request Button:** To request micro-grants or lab time associated with their current stage.
    *   **"Generate Pitch Deck" Action Button:** Auto-compiles their data into a PDF.
*   **Data Shown:** TRL/IRL progress, Mentor Meeting hours logged, pending document uploads (Checklist), Algorithmic Viability Score (monospaced font).

---

## 3. The Evaluator: Stage-Gate Assessment Terminal
**Primary Goal:** Provide a hyper-focused, distraction-free environment for domain experts to blind-score complex projects against standardized rubrics.

### Screen: The Assessment Terminal
*   **Layout:** 50/50 Split Screen (The "Focus Mode" layout).
*   **Major Sections:**
    *   *Left Pane (Data Room Context):* Embedded PDF viewer or structured data readout showing the Innovator's abstract, TRL evidence, and market size estimates.
    *   *Right Pane (The Rubric Matrix):* A sticky, vertically scrolling form containing the 1-5 scoring dimensions (Problem Clarity, Tech Feasibility, etc.).
*   **Components:**
    *   *Top Bar:* Evaluator Name, Project UUID, and a countdown timer if the review has a strict deadline.
    *   *Segmented Controls:* Fast 1-5 clickable buttons for each dimension, rather than dropdowns, to speed up grading.
    *   *Live Calculation Footer:* As they click scores, a sticky footer calculates the "Raw Final Score" in real-time.
*   **Interactions:** Evaluators can highlight text in the Left Pane (Data Room) and copy it directly into a "Justification Notes" component in the Right Pane.
*   **Data Shown:** All project evidence submitted by the Innovator for this specific stage gate. NO scores from other Evaluators are visible.

---

## 4. The Mentor: Advisory Interaction Hub
**Primary Goal:** Allow industry experts to quickly digest project progress, log their advisory hours, and provide qualitative feedback to the system without administrative burden.

### Screen: The Mentorship Roster
*   **Layout:** Horizontal Data Table (Full Width).
*   **Major Sections:**
    *   *Top Header:* "Active Mentees" count vs "Max Capacity" (e.g., 2/3).
    *   *Main Roster:* A dense table of assigned projects.
*   **Components:**
    *   *The Nudge Column:* A specific column highlighting if the system detects the Mentor hasn't interacted with a project in >30 days (High Risk trigger).
    *   *Quick-Log Modal:* A button on each row opening a fast pop-up: [Date] | [Hours Spent] | [Advisory Notes] | [Submit].
*   **Data Shown:** Innovator Names, Current Stage, Days in Stage, Last Contact Date.
*   **Interactions:** Clicking a project row expands an accordion showing the Innovator's recent milestone completions.

---

## 5. Hub Admin: Global Pipeline & Command Center
**Primary Goal:** Turn the Hub Admin from an administrator into an active portfolio manager by surfacing stagnant or high-potential projects instantly.

### Screen: The Stage-Gate Heatmap (Macro View)
*   **Layout:** Edge-to-Edge Canvas. No sidebars.
*   **Major Sections:**
    *   *Top Metrics Ribbon:* Small, dense cards showing: Total Active IPs, System Average Viability Score, Projects "At-Risk", Total Capital Deployed.
    *   *The Main Heatmap:* 5 massive vertical columns representing the Stages (Intake $\rightarrow$ Commercialization).
*   **Components:**
    *   *Project Nodes:* Inside the columns, projects are represented as small, dense cards (or pure data rows).
    *   *Algorithmic Sorting:* The system auto-sorts each column. The highest "Viability Score" projects float to the top. Projects with a critical "At-Risk Score" (>75) are pinned mechanically to a "Needs Intervention" section at the top of the screen.
*   **Data Shown:** Hundreds of projects simultaneously. Viability Score, At-Risk Score, Innovation Category, assigned Mentor.
*   **Interactions:**
    *   *Hover:* Brings up the "Intelligence Tooltip" showing exactly *why* the At-Risk score is high (e.g., "Overdue Milestone + Evaluator Rejection").
    *   *Action Panel:* Clicking a Node opens a right-side drawer to override a stage gate, assign a new Mentor (triggering the Matchmaker preview), or formally lock/archive the project.

---

## 6. Executive Viewer: Institutional Intelligence Dashboard
**Primary Goal:** Provide the University Chancellor, Innovation Director, or external funders with aggregated ROI and macro-pipeline health metrics. Read-only.

### Screen: The Executive Summary
*   **Layout:** Classic Analytics Dashboard Grid (Masonry or strict responsive grid).
*   **Major Sections & Components:**
    *   *Top Row (The Big Numbers):* Monospaced readouts for "Aggregate Market Size (TAM)", "Total IP Generated", "Spin-out Capital Raised", and "Overall Hub Attrition Rate".
    *   *Center Graphic (The Funnel):* A large Recharts D3 funnel visualization showing massive drop-offs between stages (e.g., Intake: 300 $\rightarrow$ Prototyping: 80 $\rightarrow$ Commercialized: 5).
    *   *Bottom Left (Diversity/Department Radar):* A radar or bar chart breaking down innovation origin by University Department (e.g., Computer Science generates 60% of volume, but Bio-Med generates 80% of actual commercializations).
    *   *Bottom Right (The Fast-Track Roster):* A pure-data table listing the Top 10 projects system-wide by Viability Score, ready for VIP investor introductions.
*   **Data Shown:** Strictly aggregated analytics via PostgreSQL Materialized Views. No PII or specific IP secrets are exposed on this top-level dash unless drill-down access is explicitly granted.
*   **Interactions:** "Export Portfolio Report to PDF/CSV" button for board meetings. Date range toggles (e.g., "View pipeline health: 2024 vs 2025").
