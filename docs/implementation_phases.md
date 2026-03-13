# ILIS Implementation Plan: Phased Development Strategy

As the acting CTO, this document outlines the strict, disciplined roadmap for building the Innovation Lifecycle Intelligence System (ILIS). To mitigate risk and ensure high user adoption, we will construct this platform sequentially—proving the core workflow before introducing complex machine learning.

---

## Phase 0: The Foundation (MVP)
**The Objective:** Abolish spreadsheets. Digitize the core pipeline to create a single source of truth for university IP, enforcing structured data capture.

*   **1. Features Included:**
    *   Role-Based Authentication (SSO integration structure).
    *   Project Submission (Dynamic intake forms capturing TRL/IRL).
    *   Stage-Gate Workflow (Manual advancement by Hub Admin).
    *   Secure Document Upload & Categorization (Supabase Storage).
    *   Basic Role Dashboards (Innovator "My Portfolio" & Admin "All Projects" list view).
*   **2. Technical Priorities:**
    *   Finalize the PostgreSQL schema exactly as architected.
    *   Implement unbreakable Row Level Security (RLS) policies.
    *   Set up Next.js 14 App Router boilerplate and the Tailwind UI component library (shadcn).
*   **3. Risks:** Over-engineering the UI early. Focus must remain on bulletproof data capture, not aesthetic animations.
*   **4. Dependencies:** Provisioning of the production/staging Supabase environments.
*   **5. Expected Outputs:** A functional, secure web application where a student can upload a project, and the Admin can view it and move it to Stage 2.
*   **6. Testing Requirements:** Strict Unit Tests on the Database RLS (proving an Innovator cannot query another's IP). End-to-End (E2E) UI testing via Playwright for the Intake Submission flow.

---

## Phase 1: The Intelligence Baseline (Version 1)
**The Objective:** Transform the system from visual data-storage into a strategic intelligence tool. Introduce math into the decision-making process.

*   **1. Features Included:**
    *   The Evaluator View & Rubric Matrix.
    *   **The Viability Scoring Engine:** Edge functions calculating scores instantly upon rubric submission.
    *   **The Stagnation Risk Algorithm:** Nightly cron jobs detecting overdue milestones and 30-day inactivity.
    *   The Executive Summary Dashboard (Materialized View pipeline analytics).
    *   The "Stage-Gate Heatmap" visual interface for Hub Admins.
*   **2. Technical Priorities:**
    *   Deploy Deno/TypeScript Edge Functions for the scoring math (keeping Next.js API clean).
    *   Implement Recharts for the Heatmap and Radar visualizations.
    *   Set up `pg_cron` for nighttime risk calculation batches.
*   **3. Risks:** Formula weights might be misaligned with reality initially, causing the system to falsely flag perfectly fine projects as "High Risk."
*   **4. Dependencies:** MVP must be widely adopted by Innovators so the algorithms have actual data to crunch.
*   **5. Expected Outputs:** Automated pipeline flags. Hub Admins log in and instantly see red notifications for dying projects without clicking through menus.
*   **6. Testing Requirements:** Algorithmic Unit Testing. We must feed the Python/TS scoring scripts extreme edge-case data arrays to ensure they output the expected 0-100 score without crashing.

---

## Phase 2: The Ecosystem (Version 2)
**The Objective:** Connect human capital to the pipeline via the algorithm and automate administrative reporting tasks.

*   **1. Features Included:**
    *   Mentor Onboarding & Profiles.
    *   **The Matchmaker Algorithm:** Jaccard similarity engine pairing Projects to Mentors based on tags and capacity.
    *   The "Pitch Deck Auto-Compiler" (Export to standard PDF).
    *   Automated Email Nudges (e.g., "Your project is flagged as Stagnant. Please log in.").
*   **2. Technical Priorities:**
    *   Integrate a PDF generation library (e.g., `react-pdf` or Puppeteer on an edge instance).
    *   Setup transactional email infrastructure (Resend, SendGrid) bound to systemic triggers.
*   **3. Risks:** Mentor engagement. If mentors refuse to log their hours in the new UI, the Stagnation Risk engine will incorrectly assume they abandoned the project.
*   **4. Dependencies:** Version 1 workflows must be stable and actively utilized.
*   **5. Expected Outputs:** Time saved. Admins no longer manually matchmake. Innovators no longer manually build standard progress reports.
*   **6. Testing Requirements:** Concurrency testing on the Matchmaker function. PDF generation stress testing (ensuring heavy image uploads don't cause server OOM timeouts).

---

## Phase 3: Future AI-Enhanced Phase (Predictive Analytics)
**The Objective:** Augment deterministic hardcoded algorithms with probabilistic Machine Learning and generative AI, moving from "Reporting" to "Predicting."

*   **1. Features Included:**
    *   Predictive Success Probability (e.g., "This project has a 78% likelihood of spinning out, based on 5 years of historical university data").
    *   Semantic RAG (Retrieval-Augmented Generation): Admins can "chat" with a project's Data Room (e.g., "Summarize the major IP risks in these 5 uploaded PDFs").
    *   Auto-drafting Evaluator justifications based on Rubric scores.
    *   An External Investor "Storefront" Portal.
*   **2. Technical Priorities:**
    *   Integrate `pgvector` natively into Supabase for semantic search.
    *   Deploy isolated Python Microservices handling TensorFlow/PyTorch models or secure LLM API calls (e.g., OpenAI API).
*   **3. Risks:** Deep data privacy and IP leakage. Sending unpatented university IP directly to commercial LLMs is a massive legal risk. We may need to run open-source models (like Llama 3) locally/on-premise. Lack of historical data (ML requires hundreds of "failed" and "succeeded" projects to train accurately).
*   **4. Dependencies:** Version 2 must have operated for a minimum of **18 to 24 months** to generate a statistically valid dataset of Graduated vs. Archived projects to train the ML model on.
*   **5. Expected Outputs:** A system that genuinely predicts commercialization outcomes before human experts realize the pattern.
*   **6. Testing Requirements:** Model Accuracy/F1 Score validation. Severe penetration testing and compliance auditing around the AI data pipelines to guarantee IP security.
