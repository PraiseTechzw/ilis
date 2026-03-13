# UI/UX Interface Architecture: CUT Innovation Lifecycle Intelligence System (ILIS)

## 1. Visual Design Language: "Institutional Cybernetics"
The interface must entirely reject the "bubbly SaaS with a generic left sidebar" aesthetic. Instead, ILIS must feel like a **Strategic Command Center**. It should project authority, precision, and data-density without feeling overwhelming.

*   **Aesthetic Tone:** Clinical precision meets institutional authority. Sharp edges (0px or 2px border radius, not 8px/12px bubbles). Strong contrast.
*   **Data Density:** High. The system favors compact data tables, monospaced numerical readouts, and dense micro-charts over massive whitespace and overly large typography.
*   **Visual Metaphor:** An Air Traffic Control radar mapped over an academic registry.

## 2. Layout System (The "Pipeline-Centered" Interface)
Replacing the standard persistent left-sidebar, ILIS relies on a horizontal, multi-pane architecture focusing entirely on the *Stage-Gate Pipeline*.

*   **Global Command Bar (Top Navigation):** A slim, persistent dark header.
    *   *Left:* ILIS Logo / Context Switcher (e.g., "Hub View" vs "My Portfolio").
    *   *Center:* The Universal Search Bar (`Cmd + K`) capable of jumping instantly to a Project UUID, an Innovator's Name, or a specific Mentor's Tag.
    *   *Right:* Global Intelligence Ticker (e.g., "3 Projects Stagnating | 2 New Intakes"), User Profile, and Notifications.
*   **The Nexus (Sub-Navigation/Context Ribbon):** Immediately below the global bar. Contains tabs specific to the current context (e.g., *Pipeline, Analytics, Evaluator Queue, Resource Ledger*).
*   **The Intelligence Canvas (Main Stage):** The remainder of the screen is an edge-to-edge canvas holding modular panels. It scales beautifully to ultra-wide monitors.

## 3. Color System: "The Signal Palette"
Colors are strictly semantic. We do not use "brand colors" for UI elements; color is reserved exclusively to signal system status or data.

*   **Backgrounds:** 
    *   `Canvas Base:` `#0A0A0E` (Deep space black, not grey) or `#F8F9FA` (Clinical white) depending on the user's forced theme. The default standard should be a striking Dark Mode for the Command Center feel.
    *   `Panel Surface:` `#12121A` (Slightly elevated from base).
*   **Typography:**
    *   `Primary:` `#FFFFFF` (High contrast).
    *   `Secondary:` `#8F929F` (Muted data labels).
*   **The Intelligence Signals (Action Colors):**
    *   `Healthy (TRL Growth):` `#00E676` (Neon Green).
    *   `Velocity Alert (Nudge):` `#FFC107` (Amber).
    *   `Stagnant/Kill Risk:` `#FF1744` (Vibrant Red).
    *   `Intelligence/Algorithmic:` `#00B0FF` (Electric Blue - exclusively highlights when an element on the screen was decided by the AI, e.g., the Matchmaker or baseline score).

## 4. Typography System
We rely on a strict dual-font typographic hierarchy designed for reading dense data matrices quickly.

*   **Display / Interface Typeface:** **`Inter`** (Clean, stark, highly legible geometric sans-serif for headings and UI controls).
    *   *Weight Profile:* Extensively use `Medium (500)` and `Bold (700)`. Avoid lightweight fonts in dark mode to prevent "ghosting".
*   **Data / Intelligence Typeface:** **`JetBrains Mono`** or **`Roboto Mono`**.
    *   *Application:* Used **strictly** for numerical data (Viability Scores, At-Risk Scores, TRL/IRL levels, UUIDs, Grant Amounts). This enforces the "Command Center" feel and ensures numerical columns align perfectly.

## 5. Dashboard Composition: Modular Intelligence Panels
The screen is composed of rigid, bordered panels. No floating elements.

*   **The Radar Panel (Top Left):** A quick visualization of the overall hub health. A Recharts-based radar chart showing the average score across the 7 Viability Dimensions.
*   **The Pipeline Viewport (Center/Full Width):** A dense data grid (like Ag-Grid). Each row is a project. Columns are `UUID`, `Project Name`, `Current Stage`, `Viability Score [Mono]`, `At-Risk Score [Mono]`, and a `Status Sparline` micro-chart showing score velocity over the last 30 days.
*   **The Action Matrix (Right Sidebar Component):** Only appears when a row is selected. Displays the algorithmic recommendations (e.g., "Fast-Track to Stage 3" or "Stagnation Alert: Requires Hub Admin Intervention").

## 6. Pipeline Visualization Innovations
*   **The "Stage-Gate Heatmap":** Instead of a standard Kanban board (which gets messy with 500 projects), we use a dense geometric heatmap. Each column is a Stage (Intake $\rightarrow$ Commercialization). Each dot in the column represents a project. 
    *   Dots are clustered by Innovation Category (Software, Biotech).
    *   Dots are colored by their Viability Score (Bright Blue = High Score, Grey = Average).
    *   Dots pulse red if their At-Risk Score > 75. 
    *   *Interaction:* Hovering a dot instantly reveals the "Intelligence Tooltip" with the project's vital stats.

## 7. Role-Specific Interface Topologies
The single platform dramatically shifts its UI topology based on the authenticated role.

*   **The Hub Admin (The Operator View):**
    *   *Focus:* The macro-pipeline.
    *   *Layout:* Highly dense data tables, Stage-Gate Heatmap, global metrics, and a dedicated queue for "System Flagged Action Items" (projects requiring immediate intervention based on algorithms).
*   **The Innovator (The Mission View):**
    *   *Focus:* Deep vertical progress on their specific IP.
    *   *Layout:* A focused central column. A progression tracker (like an XP bar for TRL levels). A large "Next Critical Action" banner driven by the Intelligence Nudge system (e.g., "Upload Financials by Friday").
*   **The Evaluator (The Assessment Terminal):**
    *   *Focus:* Blind scoring and strict rubrics.
    *   *Layout:* Split-screen. Left side: The Project's secure Data Room (PDF viewer embedded). Right side: A sticky, vertically scrolling 1-5 scoring rubric matrix that updates the live "Normalized Score" calculation as they click.

## 8. Interaction Design Principles
*   **Zero Loading Spinners for Reads:** Using Next.js Server Components, dashboards render instantly. If complex data is loading, use dense, structure-matching skeleton loaders.
*   **"Focus Mode" Overlay:** When reviewing a high-stakes project or approving funding, the UI dims to 10% opacity in the background. A sharp, borderless modal centers focus entirely on the decision metrics without routing to a new page.
*   **Algorithmic Transparency:** If the system suggests "Pivot/Archive" for a project, a small Electric Blue 'AI' icon is present next to the recommendation. Clicking it opens a side-drawer showing the exact mathematical breakdown (e.g., "Score generated due to 30 days inactivity + -5% penalty for missing IP forms").
