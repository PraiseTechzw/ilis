# Algorithm Design: Stagnation Detection & Project Risk Classification (ILIS)

## 1. Core Concept & Risk Indicators
The goal of the **Stagnation Risk Engine** is to proactively identify projects that are burning university resources (time, mentor hours, lab space) without making commercialization progress. The system shifts the Hub Admin from a reactive manager to a proactive interventionist.

We calculate an **At-Risk Score (ARS)** from 0 to 100, where 100 represents actively dying/stagnant projects.

### The Six Key Risk Indicators
1.  **Inactivity Duration:** Time elapsed since the Innovator last logged a milestone, updated a metric, or uploaded a document.
2.  **Overdue Milestones:** The percentage or absolute number of critical stage-gate milestones (e.g., "Complete 50 customer interviews") that have passed their deadline.
3.  **Missing Deliverables:** Required documents (e.g., IP disclosure forms) not submitted for the current phase.
4.  **Repeated Stage-Gate Rejections:** How many times the project has been denied advancement by Evaluators due to insufficient evidence.
5.  **Low Evaluation Score Velocity:** The project's Viability Score ($VS$) has flatlined or dropped over the last two evaluation cycles.
6.  **Lack of Mentor Engagement:** Zero hours logged by assigned mentors in the last 30/60 days, indicating loss of faith from industry experts.

---

## 2. The Weighted Risk Model

The Total At-Risk Score (ARS) is a sum of these weighted dimensions (Total 100).

| Risk Dimension | Weight (Max Pts) | Calculation Logic / Penalty |
| :--- | :--- | :--- |
| **A. Inactivity Duration** | 25 | $+1$ point for every day inactive beyond a 14-day grace period. (Max 25 pts at 39 days inactive). |
| **B. Overdue Milestones** | 20 | $+5$ points per overdue critical milestone. (Max 20 pts at 4 overdue milestones). |
| **C. Evaluator Rejections** | 20 | $+10$ points per stage-gate rejection in the current phase. (Max 20 pts at 2 rejections). |
| **D. Missing Deliverables** | 15 | $+5$ points per missing mandatory document past due. (Max 15 pts at 3 documents). |
| **E. Score Velocity (Drop)** | 10 | $+10$ points if the project's $VS$ dropped by $>5\%$ since the last round. |
| **F. Mentor Ghosting** | 10 | $+10$ points if no mentor interaction is logged in the last 30 days (for projects in Stage 2+). |

---

## 3. Thresholds & Intervention Actions

The system categorizes the ARS and triggers automated logic and UI flags for the Hub Admin.

| Risk Level | Score Range (ARS) | Visual UI Flag | Automated Intervention Logic |
| :--- | :--- | :--- | :--- |
| **Healthy** | **0 - 20** | Green Check | **Action:** None. Project is moving at acceptable velocity. |
| **Low Risk** | **21 - 45** | Yellow Alert | **Action (Nudge):** System auto-emails the Innovator: *"You have overdue milestones. Update your dashboard."* <br>**Admin UI:** Silent flag on portfolio view. |
| **Medium Risk** | **46 - 75** | Orange Warning | **Action (Block):** System automatically freezes the project's ability to draw down micro-grant funds.<br>**Admin UI:** Pushed to the top of the Admin's "Needs Attention" queue. Admin prompted to schedule a checking meeting. |
| **High Risk (Stagnant)**| **76 - 100** | Red Critical | **Action (Kill/Pivot):** System changes status to `STAGNANT_REVIEW`. Project is locked representing a high risk of failure.<br>**Admin UI:** Hard trigger for a "Kill/Pivot Board Review" to formally archive the IP or restructure the team. |

---

## 4. Implementation Pseudocode (Python)

```python
import datetime

# Max Risk Weightings
MAX_RISK_WEIGHTS = {
    "inactivity_duration": 25,
    "overdue_milestones": 20,
    "evaluator_rejections": 20,
    "missing_deliverables": 15,
    "score_velocity_drop": 10,
    "mentor_ghosting": 10
}

def calculate_at_risk_score(project_data: dict) -> int:
    """
    Calculates the At-Risk Score (ARS) for a given project (0-100).
    Higher score means higher risk of stagnation/failure.
    """
    ars = 0
    today = datetime.date.today()
    
    # 1. Inactivity Penalty (Max 25)
    last_activity_date = project_data.get('last_activity_date')
    days_inactive = (today - last_activity_date).days
    if days_inactive > 14:
        penalty = min(days_inactive - 14, MAX_RISK_WEIGHTS['inactivity_duration'])
        ars += penalty
        
    # 2. Overdue Milestones Penalty (Max 20)
    overdue_count = project_data.get('overdue_milestones_count', 0)
    ars += min(overdue_count * 5, MAX_RISK_WEIGHTS['overdue_milestones'])
    
    # 3. Evaluator Rejections (Max 20)
    rejection_count = project_data.get('current_stage_rejections', 0)
    ars += min(rejection_count * 10, MAX_RISK_WEIGHTS['evaluator_rejections'])
    
    # 4. Missing Deliverables (Max 15)
    missing_docs = project_data.get('missing_deliverables_count', 0)
    ars += min(missing_docs * 5, MAX_RISK_WEIGHTS['missing_deliverables'])
    
    # 5. Viability Score Velocity (Max 10)
    previous_vs = project_data.get('previous_viability_score', 0)
    current_vs = project_data.get('current_viability_score', 0)
    if previous_vs > 0 and (current_vs < previous_vs * 0.95): # Dropped by > 5%
        ars += MAX_RISK_WEIGHTS['score_velocity_drop']
        
    # 6. Mentor Ghosting (Max 10)
    days_since_mentor_contact = project_data.get('days_since_mentor_log', 0)
    if project_data.get('current_stage') >= 2 and days_since_mentor_contact > 30:
        ars += MAX_RISK_WEIGHTS['mentor_ghosting']
        
    return min(ars, 100) # Cap at 100

def trigger_interventions(ars: int, project_id: str):
    """
    Triggers system actions based on the classified Risk Level.
    """
    if ars <= 20:
        return {"level": "Healthy", "action": "NONE"}
        
    elif ars <= 45:
        # LOW RISK -> Nudge the Innovator heavily
        send_automated_email(project_id, template="UPDATE_OVERDUE_MILESTONES")
        return {"level": "Low Risk", "action": "NUDGE_SENT"}
        
    elif ars <= 75:
        # MEDIUM RISK -> Protect capital, alert admin immediately
        freeze_grant_drawdown(project_id)
        alert_hub_admin(project_id, alert_type="ATTENTION_REQUIRED_ORANGE")
        return {"level": "Medium Risk", "action": "FUNDS_FROZEN_ADMIN_ALERTED"}
        
    else:
        # HIGH RISK -> Lock project, require formal pivot or archive hearing
        lock_project_status(project_id, status="STAGNANT_REVIEW")
        trigger_kill_board_review(project_id)
        return {"level": "High Risk (Stagnant)", "action": "PROJECT_LOCKED_BOARD_REVIEW"}
        
```
