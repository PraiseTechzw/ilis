# Algorithmic Scoring Framework: ILIS Viability Engine

## 1. Scorecard Framework & Dimension Weightings

The **Viability Score** (VS) is a weighted metric mathematically designed to evaluate a project's potential for commercialization. The total possible score is 100 points.

| Dimension | Weight | Primary Metric |
| :--- | :--- | :--- |
| **A. Problem Clarity** | 10% | Definition of the pain point and target persona. |
| **B. Demand Evidence** | 15% | Empirical proof that the market wants this solved. |
| **C. Technical Feasibility** | 20% | Scientific/Engineering viability and IP protection. |
| **D. Prototype Readiness** | 15% | Technology Readiness Level (TRL). |
| **E. Market Opportunity** | 15% | TAM/SAM/SOM sizing and competitor analysis. |
| **F. Team Strength** | 10% | Capability, experience, and domain expertise. |
| **G. Commercialization Readiness** | 15% | Investment Readiness Level (IRL) and business model. |
| **Total** | **100%** | |

---

## 2. Scoring Criteria (1-5 Scale per Dimension)

Each dimension is scored by an Evaluator (or automatically inferred from quantitative inputs) on a strict 1-5 scale.

### A. Problem Clarity (10%)
*   **1:** Vague idea, no clear target user.
*   **3:** Problem identified, target user group is broad but defined.
*   **5:** Deeply researched problem, highly specific user persona, high cost of current alternatives defined.

### B. Demand Evidence (15%)
*   **1:** Purely speculative, no secondary research.
*   **3:** Supported by secondary market research and general trends.
*   **5:** Supported by primary data (e.g., $N>50$ customer interviews, letters of intent, waitlist signups).

### C. Technical Feasibility & IP (20%)
*   **1:** Violates laws of physics or relies on currently non-existent core tech.
*   **3:** Theoretically possible, uses existing technology but requires complex integration; IP path unclear.
*   **5:** Path to MVP is proven; Freedom to Operate (FTO) analysis complete; provisional patent filed or clear trade secret strategy.

### D. Prototype Readiness (TRL Mapping) (15%)
*   **1:** Basic principles observed (TRL 1-2).
*   **3:** Component validation in laboratory environment (TRL 4).
*   **5:** System prototype demonstration in an operational environment (TRL 7+).

### E. Market Opportunity (15%)
*   **1:** Niche market, heavily saturated, declining trend.
*   **3:** Moderate Serviceable Addressable Market (SAM), realistic entry strategy, recognized competitors.
*   **5:** Massive SAM, high growth rate, clear "Blue Ocean" strategy or extreme competitive advantage.

### F. Team Strength (10%)
*   **1:** Single founder, no domain expertise, no business experience.
*   **3:** Balanced team (technical + business), some domain knowledge.
*   **5:** Experienced repeat founders or deep Post-Doc domain experts with a complete advisory board.

### G. Commercialization Readiness (IRL Mapping) (15%)
*   **1:** No business model, purely academic research (IRL 1-2).
*   **3:** Value proposition defined, revenue model drafted, rough cost structure (IRL 4-5).
*   **5:** Unit economics proven, initial sales/pilots secured, corporate structure formed (IRL 8-9).

---

## 3. Calculation Logic & Formula

The engine calculates the **Raw Score**, normalizes it out of 100, and categorizes it.

**Formula:**
$$ VS = \sum_{i=1}^{7} (Score_i \times Weight_i) \times 20 $$
*(Multiplying by 20 scales the 1-5 max score to a 100-point scale).*

**Example Calculation:**
*   A. Problem Clarity: 4 (Weight: 0.10) -> $0.4$
*   B. Demand Evidence: 3 (Weight: 0.15) -> $0.45$
*   C. Tech Feasibility: 5 (Weight: 0.20) -> $1.0$
*   D. Prototype Readiness: 3 (Weight: 0.15) -> $0.45$
*   E. Market Opportunity: 4 (Weight: 0.15) -> $0.6$
*   F. Team Strength: 3 (Weight: 0.10) -> $0.3$
*   G. Commercial Readiness: 2 (Weight: 0.15) -> $0.3$

**Sum** = 3.5.
**Viability Score** = $3.5 \times 20 = \mathbf{70 / 100}$

---

## 4. Thresholds & Recommendation Engine Logic

The intelligence layer maps the final Viability Score ($VS$) to automatic pipeline actions and stage-gate recommendations.

| Score Range | Category | System Recommendation / Action |
| :--- | :--- | :--- |
| **85 - 100** | **Tier 1: Fast-Track** | **Action:** Auto-approve stage gate. Alert VC network. Unlock max grant tier.<br>**Nudge:** Prompt Innovator to generate Pitch Deck via system. |
| **65 - 84** | **Tier 2: Prime** | **Action:** Standard progression. Unlock standard lab/grant resources.<br>**Nudge:** Suggest specific Mentor based on the lowest scoring dimension (e.g., if F is low, match with a Team Building mentor). |
| **45 - 64** | **Tier 3: Nurture** | **Action:** Hold at current stage gate.<br>**Nudge:** Deny major funding. Require Innovator to complete specific "Deficiency Modules" (e.g., "Customer Discovery 101" if Dimension B is low). |
| **0 - 44** | **Tier 4: Pivot/Archive**| **Action:** Flag for Hub Admin review for formal archive.<br>**Nudge:** Auto-schedule a "Pivot Consultation" with a Hub Admin to rescue the IP or close the project. |

---

## 5. Implementation Pseudocode

```python
# Constants: Weighting Matrix
WEIGHTS = {
    "problem_clarity": 0.10,
    "demand_evidence": 0.15,
    "tech_feasibility": 0.20,
    "prototype_readiness": 0.15,
    "market_opportunity": 0.15,
    "team_strength": 0.10,
    "commercialization": 0.15
}

def calculate_viability_score(evaluator_scores: dict) -> float:
    """
    Calculates the normalized viability score (0-100).
    evaluator_scores is a dict with 1-5 integer values for each dimension.
    """
    raw_sum = 0.0
    for dimension, weight in WEIGHTS.items():
        score = evaluator_scores.get(dimension, 1) # Default to 1 if missing
        raw_sum += (score * weight)
    
    viability_score = raw_sum * 20
    return round(viability_score, 2)

def generate_system_recommendation(viability_score: float, scores: dict) -> dict:
    """
    Determines the Tier and generates automated actions/nudges.
    """
    # 1. Determine Tier
    if viability_score >= 85:
        tier = "Tier 1: Fast-Track"
        action = "APPROVE_GATE_AND_NOTIFY_VC"
    elif viability_score >= 65:
        tier = "Tier 2: Prime"
        action = "APPROVE_GATE_STANDARD"
    elif viability_score >= 45:
        tier = "Tier 3: Nurture"
        action = "HOLD_GATE"
    else:
        tier = "Tier 4: Pivot/Archive"
        action = "FLAG_FOR_ARCHIVE"
        
    # 2. Intelligence: Find the weakest link for targeted mentorship
    lowest_dimension = min(scores, key=scores.get)
    
    nudge = f"Focus improvement on {lowest_dimension.replace('_', ' ').title()}."
    
    return {
        "score": viability_score,
        "tier": tier,
        "system_action": action,
        "weakest_dimension": lowest_dimension,
        "automated_nudge": nudge
    }
```
