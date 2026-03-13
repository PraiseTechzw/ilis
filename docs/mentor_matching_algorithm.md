# Recommendation Engine: Mentor-Project Matchmaker (ILIS)

## 1. Core Concept & Matching Philosophy
The Mentor-Matchmaker algorithm aims to automate the "who should advise whom" problem inherent in university incubation hubs. It pairs academic projects with industry mentors based on technical overlap, commercialization experience, and current workload capacity, outputting a ranked list of the **Top 3 Suggested Mentors** for the Hub Admin to review.

The algorithm outputs a **Match Affinity Score (MAS)** out of 100 for every potential Mentor-Project pairing.

---

## 2. Match Affinity Score (MAS) - Ranking Formula & Weightings

The MAS evaluates a Mentor against a Project across 5 core dimensions.

| Dimension | Weight | Scoring Logic |
| :--- | :--- | :--- |
| **A. Expertise Domain (Tags)** | 35% | Jaccard similarity index between Project tags ("SaaS", "AI") and Mentor's declared expertise tags. |
| **B. Innovation Category** | 20% | Hard match (1.0) or mismatch (0.0) between primary categories (e.g., Software vs. Hard-Tech Bio). |
| **C. Commercialization Exp.** | 15% | Does the mentor have experience at the project's *target* scale (e.g., Seed Funding vs. Corporate Licensing)? |
| **D. Department Alignment** | 10% | $+10\%$ if the mentor is an alumnus/partner from the project's originating academic department (creates cultural affinity). |
| **E. Workload / Capacity** | 20% | Inverse penalty. 100% score if Mentor has 0 active projects. 0% score if Mentor is fully booked. |

**Final MAS Calculation:**
$$ MAS = (A \times 0.35) + (B \times 0.20) + (C \times 0.15) + (D \times 0.10) + (E \times 0.20) \times 100 $$

---

## 3. Data Model Requirements

To support this algorithm mathematically, the database schema must rigidly enforce these fields:

**Entity: `Project`**
*   `innovation_category` (Enum: Software, Hardware, Biotech, Cleantech, Service)
*   `target_commercialization` (Enum: B2B, B2C, Enterprise Licensing, Open Source)
*   `originating_department` (UUID of University Department)
*   `expertise_tags` (Array of Strings: ['machine learning', 'fintech'])
*   `current_stage` (Integer: Stage 1-4)

**Entity: `Mentor`**
*   `preferred_category` (Enum, matches Project category)
*   `commercialization_exp` (Array of Enums: [B2B, Enterprise Licensing])
*   `alumni_department` (UUID of University Department, nullable)
*   `expertise_tags` (Array of Strings: ['ai', 'banking', 'fintech'])
*   `max_capacity` (Integer: How many concurrent projects they can handle, e.g., 3)
*   `current_active_mentees` (Integer)

---

## 4. Fallback Logic: The "No Ideal Mentor" Scenario

If the algorithm runs and the highest MAS in the entire Mentor database is **< 40/100**, the system triggers the fallback protocol:

1.  **Relax Constraints:** The system reruns the algorithm but drops the "Innovation Category" (B) and "Department" (D) constraints entirely, focusing *only* on broad commercialization experience and workload.
2.  **The "Generalist" Suggestion:** The system suggests a "Generalist Mentor" (e.g., a seasoned Entrepreneur in Residence who understands the business model, even if they don't understand the specific hard science).
3.  **Hub Admin Alert:** The system physically flags the Hub Admin: *"WARNING: Low Domain Expertise Match. Consider sourcing a new external mentor for this specific niche."*

---

## 5. Implementation Pseudocode (Python)

```python
def jaccard_similarity(list1: list, list2: list) -> float:
    """Calculates keyword overlap between project tags and mentor tags (0.0 to 1.0)"""
    set1, set2 = set(list1), set(list2)
    intersection = len(set1.intersection(set2))
    union = len(set1.union(set2))
    return float(intersection) / union if union != 0 else 0.0

def calculate_capacity_score(current: int, max_cap: int) -> float:
    """Returns 1.0 for empty capacity, 0.0 for full capacity"""
    if current >= max_cap:
        return 0.0
    return ((max_cap - current) / max_cap)

def calculate_match_affinity_score(project: dict, mentor: dict) -> float:
    """
    Calculates the Match Affinity Score (MAS) for a single Mentor-Project pair.
    Returns a score from 0.0 to 100.0
    """
    
    # A. Expertise Domain (35%)
    tag_score = jaccard_similarity(project.get('tags', []), mentor.get('tags', []))
    weighted_A = tag_score * 0.35
    
    # B. Innovation Category (20%)
    cat_match = 1.0 if project.get('category') == mentor.get('category') else 0.0
    weighted_B = cat_match * 0.20
    
    # C. Commercialization Experience (15%)
    target = project.get('target_commercialization')
    comm_match = 1.0 if target in mentor.get('commercialization_exp', []) else 0.0
    weighted_C = comm_match * 0.15
    
    # D. Department Alignment (10%)
    dept_match = 1.0 if project.get('originating_department') == mentor.get('alumni_department') else 0.0
    weighted_D = dept_match * 0.10
    
    # E. Workload / Capacity (20%)
    cap_score = calculate_capacity_score(mentor.get('active_mentees', 0), mentor.get('max_capacity', 1))
    weighted_E = cap_score * 0.20
    
    # Total MAS
    mas = (weighted_A + weighted_B + weighted_C + weighted_D + weighted_E) * 100
    return round(mas, 2)

def generate_mentor_shortlist(project: dict, all_mentors: list) -> dict:
    """
    Generates the Top 3 mentor recommendations.
    Includes Fallback Logic if no good matches exist.
    """
    scored_mentors = []
    
    # 1. Score all mentors who have capacity
    for mentor in all_mentors:
        if mentor.get('active_mentees', 0) < mentor.get('max_capacity', 1):
            score = calculate_match_affinity_score(project, mentor)
            scored_mentors.append({"mentor_id": mentor["id"], "score": score, "name": mentor["name"]})
            
    # 2. Sort intensely by score descending
    scored_mentors.sort(key=lambda x: x['score'], reverse=True)
    
    top_3 = scored_mentors[:3]
    
    # 3. Fallback Check: Are the best available matches actually terrible?
    if not top_3 or top_3[0]['score'] < 40:
        return {
            "status": "FALLBACK_TRIGGERED",
            "warning": "No Ideal Mentor Available. Suggesting Generalist or External Hire.",
            "top_matches": top_3 # These are weak matches, flagged for Admin
        }
        
    return {
        "status": "SUCCESS",
        "top_matches": top_3
    }
```
