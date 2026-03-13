# Sprint-by-Sprint Development Plan: ILIS MVP

This document outlines a 6-sprint agile development plan (assuming 1-2 week sprints) designed for a solo founder-builder or a small, high-velocity team. The goal is to reach a functional MVP (Phase 0) that can ingest, secure, and display university IP cleanly.

---

## Sprint 1: Foundation & Infrastructure (The Skeleton)
**Goal:** Establish the strict technical foundation, authentication, and database schema. No UI work beyond bare-bones routing.

*   **Development Tasks:**
    *   Initialize Next.js 14 (App Router) with TypeScript and TailwindCSS.
    *   Set up Supabase local development environment and CLI.
    *   Implement Supabase Auth (GoTrue) with generic Email/Password and University SSO placeholders.
    *   Set up Next.js Middleware to protect all `/app/(dashboards)/*` routes.
*   **Backend / Database Tasks:**
    *   Write raw SQL migrations to build the core tables: `profiles`, `user_roles`, `projects`, and `documents`.
    *   Implement foundational Row Level Security (RLS) policies (e.g., Innovators can only read their own row in `projects`).
    *   Implement PostgreSQL trigger to automatically create a `profiles` row when a new user signs up in `auth.users`.
*   **Design Tasks:**
    *   Configure global CSS variables for the "Signal Palette" (Canvas Base, Primary Text, Status Colors).
    *   Define the typography system (`Inter` and `JetBrains Mono`) in `tailwind.config.ts`.
*   **Testing Tasks:**
    *   Unit test RLS policies directly in PostgreSQL (or via Supabase testing tools) to guarantee data sovereignty.
*   **Deliverables:** A blank Next.js app where users can register, log in, be assigned a role, and be securely routed to an empty dashboard skeleton based on their `user_roles`.

---

## Sprint 2: The Core Components & Intake Engine (The Brain)
**Goal:** Build the dynamic form capable of capturing complex IP data and taxonomies.

*   **Development Tasks:**
    *   Build the `Intake Command Form` utilizing `react-hook-form` and `zod` for rigorous client and server-side validation.
    *   Implement the dynamic form logic (e.g., showing MRL sliders only if the category is 'Hardware').
    *   Create reusable UI primitives using `shadcn/ui` (Buttons, Inputs, Selects, Sliders).
*   **Backend / Database Tasks:**
    *   Write Next.js Server Actions to securely mutate the `projects` table upon form submission.
    *   Create the Enums in PostgreSQL for `innovation_category`, `trl_level`, etc.
*   **Design Tasks:**
    *   Style the multi-step form wizard to feel like a "Command Center" terminal, entirely removing generic bubbling/shadows.
*   **Testing Tasks:**
    *   End-to-End (E2E) testing on the intake form: ensure validation prevents submitting a project without an abstract or TRL score.
*   **Deliverables:** An Innovator can successfully submit a new project, and that project immediately appears securely in the Supabase database.

---

## Sprint 3: The Innovator Portfolio & File Storage (The Vault)
**Goal:** Give the Innovator their personal dashboard and allow secure upload of IP documentation (Pitch Decks, Financials).

*   **Development Tasks:**
    *   Build the "My Portfolio" dashboard layout (Left Nav, Center Canvas, Right Action Matrix).
    *   Implement the physical file upload component, restricting file types to PDF/DOCX/XLSX and a 50MB limit.
    *   Build the "Progression Track" visual component showing the current TRL/IRL stage organically.
*   **Backend / Database Tasks:**
    *   Configure Supabase Storage Buckets for `project_documents`.
    *   Write rigorous RLS policies on the Storage bucket so a user can only download files located in their specific `project_id` folder.
*   **Design Tasks:**
    *   Finalize styling for the project data cards, ensuring monospaced fonts are used for numerical data points.
*   **Testing Tasks:**
    *   Attempt to access a document explicitly from an unauthorized user account. It must fail.
*   **Deliverables:** Innovators can log in, see the project they submitted in Sprint 2, track its stage visually, and securely upload business documents to a private vault.

---

## Sprint 4: The Hub Admin Pipeline (The Heatmap Overview)
**Goal:** Give the Hub Admin the ability to see all projects across the university and manually manage the stage-gate progression.

*   **Development Tasks:**
    *   Build the Admin "Stage-Gate Heatmap" interface. Fetch all active projects via Server Components.
    *   Implement front-end sorting/filtering (e.g., Filter by Department or Category).
    *   Build the "Action Drawer" (a right-side slide-over UI that appears when the Admin clicks a project node).
*   **Backend / Database Tasks:**
    *   Implement the Next.js Server Action allowing a Hub Admin to update a project's `current_stage`.
    *   Write the PostgreSQL Trigger that automatically logs any stage change into the `stage_history` audit table.
*   **Design Tasks:**
    *   Design the dense data-nodes for the Heatmap. Ensure they are legible at 50% scale.
*   **Testing Tasks:**
    *   Verify the Admin UI does not crash or lag when artificially seeded with 500 mock projects.
*   **Deliverables:** A Hub Admin can log in, view the entire pipeline grid, click on a student's project, download their uploaded pitch deck, and formally bump them from 'Prototyping' to 'Market Validation'.

---

## Sprint 5: Hardcoded Intelligence (The Engine Revs)
**Goal:** Integrate the mathematical models (from our architecture phase) into the platform, replacing blank integers with calculated algorithmic scores.

*   **Development Tasks:**
    *   Inject the `Viability Score` and `At-Risk Score` (currently hardcoded or mocked in UI) into the Heatmap cards and Portfolio view.
    *   Build the "Intelligence Tooltip" UI component explaining *how* the score was calculated.
*   **Backend / Database Tasks:**
    *   Deploy the first Supabase Edge Function: `calculate-baseline-viability`.
    *   Wire the Edge Function to trigger instantly via a DB Webhook whenever a new project is created in Sprint 2's intake form.
    *   Implement the initial nightly DB cron job to check for `days_inactive` $>14$ to drive a basic Risk Score.
*   **Design Tasks:**
    *   Implement the "Signal Palette" conditionally. Make the Heatmap pulse red or display warning icons purely based on the new Edge Function logic.
*   **Testing Tasks:**
    *   Unit test the Edge Function logic directly with known inputs to verify the mathematical formula outputs the exact expected Viability Score.
*   **Deliverables:** The system is now "smart." When a project is submitted, it instantly receives an algebraic viability score based on its taxonomy, which is immediately visible to the Admin.

---

## Sprint 6: Polish, Auditing, & MVP Production Launch
**Goal:** Clean up the UI, enforce compliance requirements, and deploy the system for initial Beta usage by the university Hub.

*   **Development Tasks:**
    *   Refine responsive design (ensure Innovator views work flawlessly on mobile browsers; Admins can remain desktop-focused).
    *   Implement global loading skeletons (Suspense) and error boundaries to prevent "white screens of death."
    *   Build a rudimentary "Audit Log" admin view, reading directly from the `stage_history` and `activity_logs` tables.
*   **Backend / Database Tasks:**
    *   Finalize and double-check all RLS policies. Ensure no "Full Access to Public" rules exist in Supabase storage or databases.
    *   Migrate database to the Production environment.
*   **Design Tasks:**
    *   Final visual QA. Ensure the "Institutional Cybernetics" theme feels distinct and professional.
*   **Testing Tasks:**
    *   End-to-End User Flow verification: (Admin invites User $\rightarrow$ User Submits Project $\rightarrow$ System Scores It $\rightarrow$ User Uploads Doc $\rightarrow$ Admin Reviews Doc $\rightarrow$ Admin Advances Stage).
*   **Deliverables:** ILIS v0.1 (MVP) is deployed on Vercel and officially handed over to the Hub Director for onboarding the first cohort of 10-20 alpha innovators.
