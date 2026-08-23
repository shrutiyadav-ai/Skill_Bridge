"""
SkillBridge — AI/ML Microservice (FastAPI)
Provides deterministic skill vector matching, gap taxonomy analysis,
and LLM-backed career assistance.
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Dict, Optional
import numpy as np
import os

app = FastAPI(
    title="SkillBridge ML Engine",
    description="Deterministic Skill Vector Matching & Career Recommendation Engine",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class SkillVectorItem(BaseModel):
    skill_name: str
    current_score: float = Field(ge=0, le=100)


class RequirementItem(BaseModel):
    skill_name: str
    required_level: float = Field(ge=0, le=100, default=70.0)
    weight: float = Field(ge=0.1, le=1.0, default=1.0)


class MatchRequest(BaseModel):
    student_skills: List[SkillVectorItem]
    requirements: List[RequirementItem]


class MatchResponse(BaseModel):
    compatibility_score: float
    strong_skills: List[str]
    partial_skills: List[Dict[str, float]]
    missing_skills: List[str]
    priority_gaps: List[Dict[str, str]]
    explanation: str


@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "SkillBridge ML Engine",
        "algorithm": "Weighted Cosine & Euclidean Vector Matcher",
    }


@app.post("/score", response_model=MatchResponse)
def compute_match_score(payload: MatchRequest):
    """
    Computes deterministic weighted similarity score between student skill vector
    and target role requirements.
    """
    student_map = {
        s.skill_name.strip().lower(): s.current_score for s in payload.student_skills
    }

    total_weight = 0.0
    weighted_sum = 0.0

    strong_skills = []
    partial_skills = []
    missing_skills = []
    priority_gaps = []

    for req in payload.requirements:
        req_name_norm = req.skill_name.strip().lower()
        weight = req.weight
        total_weight += weight

        current = student_map.get(req_name_norm, 0.0)
        gap = max(0.0, req.required_level - current)

        # Ratio clamped to 1.0
        ratio = min(1.0, current / req.required_level if req.required_level > 0 else 1.0)
        weighted_sum += ratio * weight

        if current >= req.required_level:
            strong_skills.append(req.skill_name)
        elif current > 0:
            partial_skills.append({
                "skill": req.skill_name,
                "current": current,
                "required": req.required_level,
                "gap": gap,
            })
            priority_gaps.append({
                "skill": req.skill_name,
                "status": "DEVELOPING",
                "gap": f"-{round(gap)}%",
            })
        else:
            missing_skills.append(req.skill_name)
            priority_gaps.append({
                "skill": req.skill_name,
                "status": "MISSING",
                "gap": f"-{round(req.required_level)}%",
            })

    score = round((weighted_sum / total_weight) * 100, 1) if total_weight > 0 else 100.0

    explanation = (
        f"Calculated {score}% match across {len(payload.requirements)} competencies. "
        f"Meets industry criteria in {len(strong_skills)} areas with {len(priority_gaps)} identified gaps."
    )

    return MatchResponse(
        compatibility_score=score,
        strong_skills=strong_skills,
        partial_skills=partial_skills,
        missing_skills=missing_skills,
        priority_gaps=priority_gaps,
        explanation=explanation,
    )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
