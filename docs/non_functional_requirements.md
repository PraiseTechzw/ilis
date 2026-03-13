# Non-Functional Requirements (NFRs): CUT Innovation Lifecycle Intelligence System (ILIS)

## 1. Security & Access Management
*   **NFR-SEC-001 [Encryption]:** All sensitive IP data, PII (Personally Identifiable Information), and uploaded documents must be encrypted at rest using AES-256 and in transit using TLS 1.3 or higher.
*   **NFR-SEC-002 [Authentication]:** Support integration with university SSO (e.g., Azure AD, Keycloak) using SAML 2.0 or OAuth 2.0. Passwords for external accounts (Mentors, VCs) must enforce minimum complexity (12 chars, uppercase, lowercase, number, special character) and undergo forced rotation every 90 days if not using SSO.
*   **NFR-SEC-003 [Session Management]:** Application sessions must automatically time out after 30 minutes of inactivity. Concurrent logins from different IP addresses for the same user account must trigger a security alert to the Hub Admin.
*   **NFR-SEC-004 [Vulnerability Mitigation]:** The architecture must inherently protect against OWASP Top 10 vulnerabilities, specifically utilizing parameterized queries to prevent SQL injection and strict input sanitization to prevent XSS.

## 2. Performance & Capacity
*   **NFR-PER-001 [Response Time]:** 95% of standard read operations (e.g., loading the "My Portfolio" dashboard or rendering a project abstract) must complete in under 800 milliseconds. Complex analytical queries (e.g., executing the Viability Scoring algorithm or generating the Executive Pipeline Funnel) must complete in under 3.5 seconds.
*   **NFR-PER-002 [Throughput]:** The system must smoothly handle 200 concurrent user sessions performing read/write operations without degrading performance below the thresholds defined in NFR-PER-001.
*   **NFR-PER-003 [Storage]:** The system must accommodate an initial capacity of at least 500 active projects, assuming an average of 100MB of supplementary documentation (pitch decks, PDFs) per project, equating to ~50GB of hot storage initially, with seamless autoscale capabilities.

## 3. Scalability & Elasticity
*   **NFR-SCA-001 [Horizontal Scaling]:** The application architecture (API layer, web serving layer) must be stateless to allow for horizontal scaling via a load balancer automatically adding/removing instances based on CPU utilization exceeding 75%.
*   **NFR-SCA-002 [Multi-Tenancy Readiness]:** While the MVP is for a single university, the database schema MUST implement a `tenant_id` on all core tables (Users, Projects, Configurations) to allow future SaaS white-labeling for other institutions without requiring a full database refactor.

## 4. Usability & User Experience (UX)
*   **NFR-USE-001 [Cognitive Load]:** The core Stage-Gate advancement workflow must require no more than 3 distinct clicks for an Innovator to submit a progression request, assuming all prerequisite data fields are inherently satisfied.
*   **NFR-USE-002 [Error Handling]:** All validation errors must be displayed inline (next to the offending field) in human-readable language, explicitly stating *why* the input failed and *how* to fix it (e.g., "TRL Score cannot exceed 9. Please select a value between 1 and 9.").
*   **NFR-USE-003 [Onboarding]:** The system must provide initial tooltips or a "guided tour" overlay for first-time logins corresponding to the user's specific role (Innovator vs. Mentor).

## 5. Maintainability & Code Quality
*   **NFR-MNT-001 [Documentation]:** All API endpoints must be fully documented using OpenAPI/Swagger specifications, including request/response schemas and error codes, generated automatically from code annotations.
*   **NFR-MNT-002 [Modularity]:** The Intelligence Modules (e.g., the NLP Matchmaker script, Viability Scoring algorithm) must be decoupled from the core CRUD application logic, allowing the data science team to update the scoring formulas without requiring a redeployment of the web frontend.
*   **NFR-MNT-003 [CI/CD]:** The deployment pipeline must require a minimum of 80% automated test coverage (unit + integration tests) for any pull request to be merged into the main development branch.

## 6. Auditability & Compliance
*   **NFR-AUD-001 [Event Sourcing / Immutable Logs]:** Every critical action (Role change, Stage advancement, Score submission, Document deletion) MUST generate an immutable log entry containing: `Timestamp`, `User_ID`, `IP_Address`, `Action_Type`, `Old_Value`, and `New_Value`.
*   **NFR-AUD-002 [Data Export]:** Hub Admins must have the ability to export a complete, unalterable audit history of a specific Project ID in CSV or JSON format for university compliance reviews.
*   **NFR-AUD-003 [Soft Deletes]:** Database schemas for Users, Projects, and Evaluations must implement soft deletes (`is_active` boolean or `deleted_at` timestamp) to preserve historical data integrity. Hard destructive deletes (`DELETE FROM...`) are strictly prohibited in application logic.

## 7. Reliability & Availability
*   **NFR-REL-001 [Uptime]:** The platform must maintain 99.9% availability during university operating hours and 99.5% general availability, allowing for scheduled maintenance windows.
*   **NFR-REL-002 [Disaster Recovery]:** The database must perform automated point-in-time backups. In the event of catastrophic failure, the Recovery Time Objective (RTO) must be under 4 hours, and the Recovery Point Objective (RPO) must be less than 1 hour of data loss.

## 8. Accessibility
*   **NFR-ACC-001 [WCAG Compliance]:** The user interface must comply with WCAG 2.1 Level AA standards, ensuring appropriate color contrast ratios, screen reader compatibility (ARIA labels on all form elements), and full keyboard navigability (no "mouse-only" traps).

## 9. Responsiveness
*   **NFR-RES-001 [Device Support]:** The Web UI must be fully responsive, rendering gracefully and maintaining core functionality on desktop monitors (1920x1080), standard laptops (1366x768), and modern mobile devices (viewport width $\ge$ 360px), prioritizing the Innovator "My Portfolio" view for mobile access.

## 10. Data Integrity
*   **NFR-DAT-001 [Referential Integrity]:** The database schema must enforce foreign key constraints. An Evaluator's score cannot exist if the corresponding Project or corresponding User is missing.
*   **NFR-DAT-002 [Concurrent Operations]:** Optimistic concurrency control (via version numbers or updated timestamps) must be implemented to prevent "lost updates" if a Hub Admin and an Innovator attempt to modify the same project record simultaneously.
