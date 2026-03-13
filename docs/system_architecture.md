# Full-Stack System Architecture: CUT Innovation Lifecycle Intelligence System (ILIS)

## 1. High-Level System Architecture
ILIS is designed as a secure, scalable, and intelligent platform built on a modern serverless stack.
*   **Frontend (Client/SSR):** Next.js 14 (App Router) with React, TypeScript, and TailwindCSS.
*   **Data Access & Auth (BaaS):** Supabase (PostgreSQL, GoTrue Auth, Storage, Edge Functions).
*   **Intelligence Layer:** Supabase Edge Functions (Deno/TypeScript) or Python Microservices (for heavy NLP/Scoring algorithms).
*   **Infrastructure:** Deployed on Vercel (Frontend/API) and Supabase Cloud (Database/Storage/Edge).

### Data Flow Diagram (Mental Map)
1.  **User Request:** Hits Next.js standard routes or middleware (checking auth).
2.  **Server Components:** Fetches data directly from Supabase via `supabase-js` using the user's secure token.
3.  **Client Components:** Handles interactivity (Recharts dashboards, DND stage-gate boards).
4.  **Algorithmic Triggers:** A database Webhook or Next.js API route triggers an Edge Function when a project's stage changes to calculate the "Viability Score" or update the "Stagnation Risk."

---

## 2. Frontend Architecture (Next.js & React)
*   **Framework:** Next.js 14 (App Router) leveraging React Server Components (RSC) heavily for performance and initial data fetching to reduce client-side JavaScript.
*   **Styling & UI:** TailwindCSS paired with `radix-ui` or `shadcn/ui` for accessible, premium, and uncompromising design aesthetics.
*   **State Management:**
    *   *Server State:* Handled natively by React Server Components and `react-query` (or `SWR`) for client-side caching/revalidation.
    *   *Client State:* Zustand for lightweight global UI state (e.g., active dashboard filters, modal visibility).
*   **Data Visualization:** `Recharts` for the Hub Admin's Executive Dashboard (Pipeline funnels, Risk distribution) and Innovator's Portfolio Health charts.

---

## 3. Backend Architecture (Supabase & Edge Functions)
We employ a Backend-as-a-Service (BaaS) approach, utilizing Supabase to handle the heavy lifting of real-time subscriptions, auth, and database management, augmented by custom compute.
*   **API Routes (Next.js):** Acts as a Backend-For-Frontend (BFF). Handles complex business logic that shouldn't be exposed directly to the client (e.g., orchestrating the compilation of the automatically generated Pitch Deck PDF).
*   **Supabase Edge Functions:** Used specifically for the **Intelligence Modules** (Viability Scoring Engine, Stagnation Detection Algorithm, Mentor Matchmaker). These run globally close to the user and can execute specialized Python/TypeScript logic on database triggers without tying up the Next.js server.
*   **Storage:** Supabase Storage buckets for secure file uploads. Folders are isolated by `project_id`.

---

## 4. Database Architecture (PostgreSQL)
The foundation is a robust relational model enforcing strict referential integrity.
*   **Core Tables:** `profiles`, `projects`, `stage_gates`, `evaluations`, `milestones`, `resources`.
*   **Audit Table:** `audit_logs` (populated entirely via PostgreSQL Triggers on `INSERT/UPDATE/DELETE` on sensitive tables to ensure compliance, capturing old/new values autonomously).
*   **Row Level Security (RLS):** Security is enforced at the database level.
    *   *Rule 1:* Innovators can only `SELECT/UPDATE` projects where they are the mapped "PI" or "Co-Investigator".
    *   *Rule 2:* Evaluators can only `SELECT` projects explicitly bridged to them via the `evaluation_assignments` table.
    *   *Rule 3:* Hub Admins bypass RLS (`service_role` or specific Admin policy) for global dashboard visibility.

---

## 5. API Structure
While Supabase provides an auto-generated REST/GraphQL API via PostgREST, we structure our data access systematically to handle complex algorithms:

**A. PostgREST (Direct DB Access via Client/Server)**
*   `GET /rest/v1/projects?select=*,profiles(name)` -> Fetched in Next.js Server Components for fast UI rendering.

**B. Next.js API Routes (`/api/*`) (Complex Orchestration)**
*   `POST /api/export/pitch-deck` -> Aggregates DB data and generates a PDF buffer.
*   `POST /api/admin/invite-user` -> Bypasses RLS using `supabase_admin` credentials to onboard external mentors.

**C. Supabase Edge Functions (`/functions/v1/*`) (Intelligence Layer)**
*   `POST /functions/v1/calculate-viability` -> Triggered via DB Webhook whenever an Evaluator submits a rubric.
*   `GET /functions/v1/run-stagnation-cron` -> Triggered by a pg_cron scheduled job every night at 2:00 AM to calculate At-Risk Scores and flag stagnant projects.

---

## 6. Security Model
*   **Authentication:** Supabase Auth (GoTrue). Next.js Middleware intercepts every request to ensure valid session tokens. Unauthenticated users are redirected to `/login`.
*   **Authorization (RBAC):** `role` is stored securely in the `auth.users` metadata (not directly editable by the user) or a protected `user_roles` table.
*   **Secure File Storage:** Storage Buckets are marked as "Private". To download an IP document, the client requests a signed, short-lived URL from Supabase, ensuring the user has the RLS policy clearance to view that specific `project_id` bucket.
*   **Immutable Auditing:** As mandated by the Non-Functional Requirements, Postgres Triggers handle audit logging so that even direct DB manipulation is permanently recorded.

---

## 7. Deployment Model
*   **Frontend & BFF:** **Vercel** with automatic preview deployments on every Pull Request. Environment variables define the `NEXT_PUBLIC_SUPABASE_URL`.
*   **Database, Auth & Storage:** **Supabase Managed Cloud**. Automated daily backups (PITR) configured to meet the disaster recovery SLAs.
*   **CI/CD Pipeline:** GitHub Actions runs ESLint, Prettier, Typescript Typechecking, and Jest unit tests before allowing merges to the `main` branch.

---

## 8. Suggested Folder Structure (Next.js 14 App Router)

```text
c:\Users\Prais\projects\ilis\
├── supabase/
│   ├── migrations/         # Raw SQL for schema, RLS, and Audit Triggers
│   └── functions/          # Deno/TS Edge Functions (Intelligence algorithms)
├── src/
│   ├── app/                # Next.js 14 App Router
│   │   ├── (auth)/         # Group: Login, Signup, Reset
│   │   ├── (dashboards)/   # Group: Layouts for different roles
│   │   │   ├── admin/      # Command Center, Executive Views
│   │   │   ├── innovator/  # My Portfolio, Project Submission
│   │   │   └── mentor/     # Mentorship Hub, Evaluations
│   │   ├── api/            # Next.js API Routes (BFF)
│   │   └── layout.tsx      # Root layout, providers
│   ├── components/
│   │   ├── ui/             # Reusable generic components (Buttons, Inputs - shadcn)
│   │   ├── charts/         # Reusable Recharts/D3 components (Viability Radar, Pipeline Funnel)
│   │   └── features/       # Complex domain components (e.g., EvaluationRubricForm)
│   ├── lib/
│   │   ├── supabase/       # Supabase client instantiation (server & client variants)
│   │   ├── constants/      # TRL/IRL mappings, Role definitions
│   │   └── utils.ts        # CN (Tailwind merge), formatting helpers
│   ├── services/           # Abstraction layer for data fetching (Repository pattern)
│   │   ├── projects.ts
│   │   └── intelligence.ts # API calls to edge functions
│   └── types/              # Global TypeScript interfaces matching DB schema
```

---

## 9. Suggested Coding Patterns
1.  **Repository Pattern via Services:** Do not write Supabase `select().eq()` calls directly inside your UI components. Create a `services/projects.ts` file containing `async function getProjectWithMilestones(id)`. This keeps components clean and centralized data fetching logic.
2.  **Server Components Default:** By default, every Next.js page should be a Server Component fetching initial data. Only components requiring interactivity (e.g., the interactive Kanban board for the Stage-Gate pipeline, or the Recharts tooltip) should have the `"use client"` directive.
3.  **Strict Typing:** Use Supabase CLI to generate TypeScript types directly from the PostgreSQL schema (`supabase gen types typescript`). Intersect these with custom UI types to guarantee type safety from the DB column to the React prop.
4.  **Error Boundaries & Loading Skeletons:** Utilize Next.js `loading.tsx` to display premium skeletal loading states while awaiting Supabase queries, and `error.tsx` to catch database constraint errors gracefully without crashing the application.
