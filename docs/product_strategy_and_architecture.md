# CUT Innovation Lifecycle Intelligence System (ILIS)

## Product Strategy & Architecture Blueprint

### 1. The Product Vision
To be the **central nervous system for university innovation**—an intelligent, data-driven ecosystem that accelerates research from raw ideation to viable commercialization. The platform transcends traditional project management by utilizing predictive scoring, strategic resource matchmaking, and rigorous pipeline intelligence to ensure high-potential IP never languishes in the "valley of death."

### 2. The Core Problem Being Solved (The "Innovation Black Box")
Currently, the Hub operates in the dark. While the university generates a high volume of ideas, publications, and prototypes, it lacks a systematic, data-supported framework to:
*   Objectively benchmark and evaluate commercial viability across vastly different disciplines.
*   Prevent administrative bottlenecks where incubation managers spend more time tracking down updates than providing strategic value.
*   Capture institutional memory—we don't know *why* past projects failed, meaning we cannot predict the success of future ones.
*   Dynamically match capital, lab space, and mentor expertise to the projects mathematically most likely to succeed.

### 3. User Roles (Access & Interaction Models)
*   **The Innovator (Student/Researcher/Alumni):** Submits concepts, tracks milestones (TRL/IRL), accesses assigned resources, and receives automated guidance.
*   **The Incubation Manager (Hub Admin):** Monitors portfolio health, controls the stage-gate pipeline, dynamically allocates grants/space, and reviews algorithmic flags.
*   **The Evaluator (Review Committee/Domain Expert):** Assesses projects during critical gateways using standardized scoring rubrics provided by the system.
*   **The Catalyst (Mentor/Industry Partner):** Accesses a curated selection of matched projects to provide targeted guidance or scout for investment/licensing opportunities.
*   **The Innovation Director (Executive):** Consumes high-level pipeline analytics, commercialization ROI, and portfolio valuation dashboards.

### 4. Core Workflows
1.  **Algorithmic Triage & Intake:** Dynamic onboarding forms that adapt based on previous answers (e.g., software vs. hardware vs. biotech). The system automatically assigns a baseline "Viability Score."
2.  **The Stage-Gate Pipeline:** Projects are pushed through strict phases (Ideation -> Prototyping -> Market Validation -> Commercialization). Transitioning between gates requires specific metric thresholds.
3.  **Smart Resource Provisioning:** Workflows to request, approve, and track the ROI of distributed micro-grants, legal consultation hours, and physical lab space.
4.  **IP & Equity Tracking:** Dedicated workflows for tracking patent filings, licensing negotiations, and university equity splits in spin-off companies.

### 5. Intelligence Modules (The "Smart" Engine)
*   **The Viability Scoring Engine:** A weighted algorithm evaluating projects based on Technology Readiness Level (TRL), Investment Readiness Level (IRL), Market Size, and Team Capability. Scores adjust automatically as milestones are met or missed.
*   **The Algorithmic Matchmaker:** Uses Natural Language Processing (NLP) to analyze project abstracts and automatically connect them to mentors or grants with matching tags and expertise profiles.
*   **Pipeline Health Predictor:** Monitors project velocity (time spent in unstructured phases). Automatically flags "stagnant" projects to admins and sends automated nudges to Innovators to update their metrics.
*   **Pitch/Report Auto-Compiler:** To incentivize Innovator usage, the system aggregates their uploaded metrics, financials, and milestones to auto-generate standardized Pitch Decks or Grant Progress Reports.

### 6. What Makes It Innovative and Non-Generic
*   **Built on TRL/IRL Standards:** It speaks the language of research commercialization. Progress is measured by hard scientific and market validation milestones, not just "tasks completed."
*   **Decision Support, Not Just Data Storage:** It tells the Incubation Manager *which project needs their attention today* based on velocity alerts and shifting viability scores.
*   **Institutional Memory Loop:** When a project is closed or fails, a "post-mortem" is recorded. Over time, the system builds a dataset to evaluate the likelihood of success for future, similar ideas.
*   **IP-Centric Architecture:** Deep native understanding of commercialization vehicles (Licensing vs. Spin-out vs. Open Source) and the associated legal checkpoints.

### 7. MVP vs. Future Versions
**Phase 1: The Foundation (MVP)**
*   Standardized intake forms with a basic weighted scoring system.
*   Manual stage-gate pipeline tracking (TRL & IRL).
*   Role-based access control (Innovator, Admin, Evaluator).
*   Core portfolio dashboard and basic resource allocation tracking.

**Phase 2: The Intelligence Layer**
*   Automated nudge system for stagnant projects.
*   NLP-based Mentor-to-Project matchmaking.
*   Integration with University SSO and Academic databases (e.g., ORCID).
*   The "Pitch Deck Auto-Compiler."

**Phase 3: The Ecosystem (Scale)**
*   Machine Learning-driven success prediction based on historical university data.
*   API integrations with patent databases for automated IP landscape scanning.
*   External Investor Portal (a curated "storefront" for VCs to browse top-tier spin-outs).

### 8. Product Risks & Mitigations
*   **Risk:** *Adoption Friction.* Researchers view it as "just more admin work."
    *   **Mitigation:** The tool must give value back (Pitch Deck Auto-Compiler) and become the *exclusive* gateway to apply for university grants and lab space.
*   **Risk:** *Algorithmic Bias/Subjectivity.* The viability score favors certain departments.
    *   **Mitigation:** Highly configurable weighting systems that allow scoring rubrics to adapt based on the industry vertical.
*   **Risk:** *IP Leakage.* Sensitive, unpatented university IP in a database.
    *   **Mitigation:** End-to-end encryption, strict Role-Based Access Control (RBAC), audit logs, and digital NDAs for Evaluators.

### 9. Technical Constraints
*   **Data Sovereignty & Compliance:** Must comply with university data policies, FERPA, and strict IP security standards.
*   **Integration Complexities:** Eventual need to integrate with legacy university systems (HR, Finance). The MVP must be built API-first.
*   **Scalability:** Must be architected to eventually handle multi-tenancy.
