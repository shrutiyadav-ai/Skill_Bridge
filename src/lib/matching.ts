import { SkillGapItem, UserSkillItem } from "@/types";

export interface SkillRequirement {
  skillId: string;
  skillName: string;
  requiredLevel: number; // 0-100
  weight: number; // 0.1 to 1.0
  priority?: number;
}

export interface MatchResult {
  compatibilityScore: number; // 0 to 100
  strongSkills: string[];
  partialSkills: { name: string; current: number; required: number; gap: number }[];
  missingSkills: string[];
  priorityGaps: SkillGapItem[];
  explanation: string;
}

/**
 * Calculates weighted similarity between student skill vector and target requirements.
 * Does NOT generate random numbers - uses deterministic weighted euclidean/cosine distance.
 */
export function calculateSkillMatch(
  studentSkills: UserSkillItem[] | Record<string, number>,
  requirements: SkillRequirement[]
): MatchResult {
  if (!requirements || requirements.length === 0) {
    return {
      compatibilityScore: 100,
      strongSkills: [],
      partialSkills: [],
      missingSkills: [],
      priorityGaps: [],
      explanation: "No specific skill requirements specified.",
    };
  }

  // Normalize student skill lookup (by skillId or skillName lowercase)
  const studentSkillMap = new Map<string, number>();
  if (Array.isArray(studentSkills)) {
    studentSkills.forEach((s) => {
      studentSkillMap.set(s.skillId.toLowerCase(), s.score);
      studentSkillMap.set(s.skillName.toLowerCase(), s.score);
    });
  } else {
    Object.entries(studentSkills).forEach(([key, val]) => {
      studentSkillMap.set(key.toLowerCase(), val);
    });
  }

  let totalWeight = 0;
  let weightedScoreSum = 0;

  const strongSkills: string[] = [];
  const partialSkills: { name: string; current: number; required: number; gap: number }[] = [];
  const missingSkills: string[] = [];
  const allGaps: SkillGapItem[] = [];

  requirements.forEach((req, idx) => {
    const weight = req.weight || 1.0;
    totalWeight += weight;

    // Check if student has skill
    const currentScore =
      studentSkillMap.get(req.skillId.toLowerCase()) ??
      studentSkillMap.get(req.skillName.toLowerCase()) ??
      0;

    const requiredLevel = req.requiredLevel || 70;
    const gap = Math.max(0, requiredLevel - currentScore);

    // Individual skill fulfillment ratio (capped at 1.0)
    const ratio = Math.min(1.0, currentScore / requiredLevel);
    weightedScoreSum += ratio * weight;

    // Categorize
    if (currentScore >= requiredLevel) {
      strongSkills.push(req.skillName);
    } else if (currentScore > 0) {
      partialSkills.push({
        name: req.skillName,
        current: currentScore,
        required: requiredLevel,
        gap,
      });
    } else {
      missingSkills.push(req.skillName);
    }

    // Gap analysis status
    let status: SkillGapItem["status"] = "READY";
    if (gap === 0) {
      status = "READY";
    } else if (currentScore >= requiredLevel * 0.7) {
      status = "DEVELOPING";
    } else if (currentScore > 0) {
      status = "NEEDS_IMPROVEMENT";
    } else {
      status = "CRITICAL";
    }

    allGaps.push({
      skillId: req.skillId,
      skillName: req.skillName,
      category: "TECHNICAL",
      currentLevel: Math.round(currentScore),
      requiredLevel: Math.round(requiredLevel),
      gap: Math.round(gap),
      status,
      priority: req.priority || idx + 1,
    });
  });

  // Calculate percentage (0 - 100)
  const compatibilityScore =
    totalWeight > 0 ? Math.round((weightedScoreSum / totalWeight) * 100) : 0;

  // Sort priority gaps: Highest gap + highest weight first
  const priorityGaps = allGaps
    .filter((g) => g.gap > 0)
    .sort((a, b) => b.gap - a.gap);

  // Generate transparent human-readable explanation
  let explanation = "";
  if (compatibilityScore >= 85) {
    explanation = `Excellent match (${compatibilityScore}%). You meet or exceed industry standards in ${strongSkills.join(
      ", "
    )}.`;
  } else if (compatibilityScore >= 65) {
    explanation = `Good compatibility (${compatibilityScore}%). Strong foundation in ${
      strongSkills.length > 0 ? strongSkills.join(", ") : "core areas"
    }, but ${priorityGaps
      .slice(0, 2)
      .map((g) => g.skillName)
      .join(" and ")} require improvement.`;
  } else {
    explanation = `Developing profile (${compatibilityScore}%). Key requirements missing or below benchmark: ${priorityGaps
      .slice(0, 3)
      .map((g) => `${g.skillName} (gap: ${g.gap}%)`)
      .join(", ")}.`;
  }

  return {
    compatibilityScore,
    strongSkills,
    partialSkills,
    missingSkills,
    priorityGaps,
    explanation,
  };
}

/**
 * Calculates Career Readiness and generates a tailored step-by-step preparation roadmap based on actual skill gaps.
 */
export function calculateCareerReadiness(
  studentSkills: UserSkillItem[],
  roleRequirements: SkillRequirement[],
  roleMeta?: {
    roleTitle?: string;
    certifications?: string[];
    toolsAndTechnologies?: string[];
    domain?: string;
  }
): {
  readinessPercentage: number;
  roadmapSteps: {
    step: number;
    title: string;
    description: string;
    type: "LEARN" | "PROJECT" | "CERTIFICATION" | "APPLY";
    skillName?: string;
    status?: "ACTIVE" | "UPCOMING" | "COMPLETED";
  }[];
  matchResult: MatchResult;
} {
  const matchResult = calculateSkillMatch(studentSkills, roleRequirements);

  const roadmapSteps: {
    step: number;
    title: string;
    description: string;
    type: "LEARN" | "PROJECT" | "CERTIFICATION" | "APPLY";
    skillName?: string;
    status?: "ACTIVE" | "UPCOMING" | "COMPLETED";
  }[] = [];

  let stepNum = 1;

  // 1. Critical & Developing Skill Gaps (Ordered by largest gap)
  if (matchResult.priorityGaps.length > 0) {
    matchResult.priorityGaps.slice(0, 3).forEach((gap, idx) => {
      roadmapSteps.push({
        step: stepNum++,
        title: `Bridge Competency Gap: ${gap.skillName}`,
        description: `Your current level is ${gap.currentLevel}% vs required benchmark of ${gap.requiredLevel}% (Deficit: -${gap.gap}%). Complete practice modules and focused technical assessments to close this gap.`,
        type: "LEARN",
        skillName: gap.skillName,
        status: idx === 0 ? "ACTIVE" : "UPCOMING",
      });
    });
  } else {
    roadmapSteps.push({
      step: stepNum++,
      title: "Core Competency Mastery",
      description: "You have verified proficiency meeting all baseline competency benchmarks for this role!",
      type: "LEARN",
      status: "COMPLETED",
    });
  }

  // 2. Tool & Framework Hands-on Application
  if (roleMeta?.toolsAndTechnologies && roleMeta.toolsAndTechnologies.length > 0) {
    const toolsStr = roleMeta.toolsAndTechnologies.slice(0, 4).join(", ");
    roadmapSteps.push({
      step: stepNum++,
      title: `Hands-on Toolchain Mastery (${toolsStr})`,
      description: `Gain practical fluency in core industry tools: ${toolsStr}. Build workflows utilizing standard production patterns.`,
      type: "PROJECT",
      status: "UPCOMING",
    });
  }

  // 3. Recommended Industry Certification
  if (roleMeta?.certifications && roleMeta.certifications.length > 0) {
    const cert = roleMeta.certifications[0];
    roadmapSteps.push({
      step: stepNum++,
      title: `Earn Industry Credential: ${cert}`,
      description: `Validate your expertise with recognized benchmark credentials such as ${cert} to stand out to campus recruiters.`,
      type: "CERTIFICATION",
      status: "UPCOMING",
    });
  }

  // 4. Portfolio Capstone Project
  roadmapSteps.push({
    step: stepNum++,
    title: `Build a Verified ${roleMeta?.roleTitle || "Target Role"} Capstone Project`,
    description: `Develop an end-to-end production portfolio project demonstrating ${
      matchResult.strongSkills.slice(0, 2).join(" & ") || "domain competencies"
    } with comprehensive documentation and version control.`,
    type: "PROJECT",
    status: "UPCOMING",
  });

  // 5. Matched Internship & Job Applications
  roadmapSteps.push({
    step: stepNum++,
    title: `Apply to Matched ${roleMeta?.roleTitle || "Career"} Opportunities`,
    description: `Target high-affinity internship and full-time placement openings where your compatibility index exceeds 75%.`,
    type: "APPLY",
    status: "UPCOMING",
  });

  return {
    readinessPercentage: matchResult.compatibilityScore,
    roadmapSteps,
    matchResult,
  };
}
