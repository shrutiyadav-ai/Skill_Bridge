export interface StudentSkillInput {
  skillName: string;
  score: number;
  category?: string;
  verified?: boolean;
}

export interface TargetRoleInput {
  id?: string;
  title: string;
  domain?: string | null;
  skills: Array<{
    skillName: string;
    requiredLevel: number;
    weight?: number;
    priority?: number;
  }>;
}

export interface OnlineCourseItem {
  id: string;
  title: string;
  platform: string;
  provider: string | null;
  url: string;
  skillsCovered: string[] | any;
  category: string;
  difficulty: string;
  duration: string | null;
  certificationAvailable: boolean;
  isFree: boolean;
  pricingType: string;
  rating: number | string | null;
  enrolledCount: number | null;
  description: string | null;
  courses?: string[] | any;
  departments?: string[] | any;
  isActive?: boolean;
}

export interface EnrollmentItem {
  id: string;
  courseId: string;
  status: string; // NOT_STARTED, IN_PROGRESS, COMPLETED
  priority: string;
  progressPercent: number;
  recommendationReason?: string | null;
  targetSkill?: string | null;
  certificateUrl?: string | null;
  certificateDoc?: string | null;
  certificateVerified?: boolean;
  completedAt?: string | Date | null;
}

export interface RecommendedCourseResult {
  course: OnlineCourseItem;
  priority: "HIGH_PRIORITY" | "RECOMMENDED" | "OPTIONAL";
  priorityLabel: string;
  priorityBadge: "danger" | "warning" | "default";
  priorityIcon: string;
  recommendationReason: string;
  targetSkills: string[];
  enrollment: {
    id?: string;
    status: "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED";
    progressPercent: number;
    certificateUrl?: string | null;
    certificateDoc?: string | null;
    certificateVerified: boolean;
    completedAt?: string | null;
  };
  relevanceScore: number;
}

/**
 * Intelligent recommendation engine that analyzes student assessment results,
 * skill gaps, registered degree, target role, and industry expectations to
 * generate prioritized, actionable online course recommendations.
 */
export function generateCourseRecommendations(params: {
  studentCourse?: string | null;
  studentDepartment?: string | null;
  careerGoal?: string | null;
  preferredIndustries?: string[] | null;
  verifiedSkills: StudentSkillInput[];
  targetRole?: TargetRoleInput | null;
  availableCourses: OnlineCourseItem[];
  existingEnrollments?: EnrollmentItem[];
}): RecommendedCourseResult[] {
  const {
    studentCourse = "",
    studentDepartment = "",
    careerGoal = "",
    preferredIndustries = [],
    verifiedSkills = [],
    targetRole = null,
    availableCourses = [],
    existingEnrollments = [],
  } = params;

  const normStudentCourse = (studentCourse || "").toLowerCase();
  const normStudentDept = (studentDepartment || "").toLowerCase();
  const enrollmentMap = new Map<string, EnrollmentItem>();
  for (const enr of existingEnrollments) {
    enrollmentMap.set(enr.courseId, enr);
  }

  // 1. Identify student verified skill map
  const skillScoreMap = new Map<string, number>();
  for (const s of verifiedSkills) {
    skillScoreMap.set(s.skillName.toLowerCase().trim(), s.score);
  }

  // 2. Identify target role required skills & deficits
  const criticalGapSkills: string[] = [];
  const developingSkills: string[] = [];
  const targetRoleSkillNames: string[] = [];

  if (targetRole && targetRole.skills) {
    for (const req of targetRole.skills) {
      const normName = req.skillName.toLowerCase().trim();
      targetRoleSkillNames.push(req.skillName);
      const currentScore = skillScoreMap.get(normName) || 0;
      const deficit = req.requiredLevel - currentScore;

      if (deficit >= 20 || currentScore === 0) {
        criticalGapSkills.push(req.skillName);
      } else if (deficit > 0) {
        developingSkills.push(req.skillName);
      }
    }
  }

  // Also include general low scores from assessment (<60%)
  for (const s of verifiedSkills) {
    if (s.score < 60 && !criticalGapSkills.some((g) => g.toLowerCase() === s.skillName.toLowerCase())) {
      criticalGapSkills.push(s.skillName);
    }
  }

  // 3. Score and prioritize each available course
  const results: RecommendedCourseResult[] = [];

  for (const course of availableCourses) {
    if (course.isActive === false) continue;

    const courseSkills: string[] = Array.isArray(course.skillsCovered)
      ? course.skillsCovered
      : [];

    const applicableCourses: string[] = Array.isArray(course.courses)
      ? course.courses
      : ["ALL"];
    const applicableDepts: string[] = Array.isArray(course.departments)
      ? course.departments
      : ["ALL"];

    // Degree / Department eligibility check
    const courseMatch =
      applicableCourses.includes("ALL") ||
      applicableCourses.some((c) => normStudentCourse.includes(c.toLowerCase()) || c.toLowerCase().includes(normStudentCourse));

    const deptMatch =
      applicableDepts.includes("ALL") ||
      applicableDepts.some((d) => {
        const ld = d.toLowerCase();
        if (normStudentDept.includes("computer") && (ld.includes("computer") || ld.includes("software") || ld.includes("information"))) return true;
        if ((normStudentDept.includes("artificial") || normStudentDept.includes("ai")) && (ld.includes("artificial") || ld.includes("ai") || ld.includes("data") || ld.includes("computer"))) return true;
        if ((normStudentDept.includes("finance") || normStudentDept.includes("accounting") || normStudentDept.includes("commerce")) && (ld.includes("finance") || ld.includes("accounting") || ld.includes("tax") || ld.includes("commerce"))) return true;
        if (normStudentDept.includes("mechanical") && ld.includes("mechanical")) return true;
        if (normStudentDept.includes("civil") && ld.includes("civil")) return true;
        return normStudentDept.includes(ld) || ld.includes(normStudentDept);
      });

    if (!courseMatch && !deptMatch && !applicableCourses.includes("ALL")) {
      continue; // Skip entirely incompatible courses
    }

    // Check which skills this course addresses
    const matchedCriticalGaps = courseSkills.filter((cs) =>
      criticalGapSkills.some((cg) => cg.toLowerCase() === cs.toLowerCase() || cs.toLowerCase().includes(cg.toLowerCase()))
    );

    const matchedRoleSkills = courseSkills.filter((cs) =>
      targetRoleSkillNames.some((ts) => ts.toLowerCase() === cs.toLowerCase() || cs.toLowerCase().includes(ts.toLowerCase()))
    );

    const matchedDeveloping = courseSkills.filter((cs) =>
      developingSkills.some((ds) => ds.toLowerCase() === cs.toLowerCase() || cs.toLowerCase().includes(ds.toLowerCase()))
    );

    // Calculate dynamic relevance score
    let relevanceScore = 10;
    if (courseMatch) relevanceScore += 15;
    if (deptMatch) relevanceScore += 15;

    relevanceScore += matchedCriticalGaps.length * 40;
    relevanceScore += matchedRoleSkills.length * 25;
    relevanceScore += matchedDeveloping.length * 15;

    // Career interest match
    if (careerGoal && courseSkills.some((cs) => careerGoal.toLowerCase().includes(cs.toLowerCase()))) {
      relevanceScore += 20;
    }

    // Determine priority tier
    let priority: "HIGH_PRIORITY" | "RECOMMENDED" | "OPTIONAL" = "OPTIONAL";
    let priorityLabel = "Optional — Skill Enhancement";
    let priorityBadge: "danger" | "warning" | "default" = "default";
    let priorityIcon = "📚";
    let reason = "";

    const roleName = targetRole?.title || "your target role";

    if (matchedCriticalGaps.length > 0) {
      priority = "HIGH_PRIORITY";
      priorityLabel = "High Priority — Critical Skill Gap";
      priorityBadge = "danger";
      priorityIcon = "🔥";
      reason = `Recommended because ${matchedCriticalGaps.join(" and ")} were identified as skill gaps in your assessment and are essential for ${roleName}.`;
    } else if (matchedRoleSkills.length > 0 || matchedDeveloping.length > 0) {
      priority = "RECOMMENDED";
      priorityLabel = "Recommended — Important Skill";
      priorityBadge = "warning";
      priorityIcon = "⚡";
      const targetList = matchedRoleSkills.length > 0 ? matchedRoleSkills : courseSkills.slice(0, 2);
      reason = `Recommended because ${targetList.join(" and ")} are core benchmark competencies required for ${roleName}.`;
    } else {
      priority = "OPTIONAL";
      priorityLabel = "Optional — Skill Enhancement";
      priorityBadge = "default";
      priorityIcon = "📚";
      reason = `Recommended as an elective course to deepen practical industry foundations in ${courseSkills.slice(0, 2).join(" & ")}.`;
    }

    // Attach student's current enrollment status
    const existingEnr = enrollmentMap.get(course.id);
    const enrollmentData = {
      id: existingEnr?.id,
      status: (existingEnr?.status as "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED") || "NOT_STARTED",
      progressPercent: existingEnr?.progressPercent || 0,
      certificateUrl: existingEnr?.certificateUrl || null,
      certificateDoc: existingEnr?.certificateDoc || null,
      certificateVerified: existingEnr?.certificateVerified || false,
      completedAt: existingEnr?.completedAt ? new Date(existingEnr.completedAt).toISOString() : null,
    };

    results.push({
      course,
      priority,
      priorityLabel,
      priorityBadge,
      priorityIcon,
      recommendationReason: existingEnr?.recommendationReason || reason,
      targetSkills: courseSkills,
      enrollment: enrollmentData,
      relevanceScore,
    });
  }

  // 4. Sort results: HIGH_PRIORITY first, then RECOMMENDED, then OPTIONAL, ordered by relevance & rating
  const priorityWeight = {
    HIGH_PRIORITY: 3,
    RECOMMENDED: 2,
    OPTIONAL: 1,
  };

  results.sort((a, b) => {
    // If student is currently IN_PROGRESS, boost slightly
    const aWeight = priorityWeight[a.priority] + (a.enrollment.status === "IN_PROGRESS" ? 0.5 : 0);
    const bWeight = priorityWeight[b.priority] + (b.enrollment.status === "IN_PROGRESS" ? 0.5 : 0);

    if (bWeight !== aWeight) {
      return bWeight - aWeight;
    }

    if (b.relevanceScore !== a.relevanceScore) {
      return b.relevanceScore - a.relevanceScore;
    }

    const ratingA = Number(a.course.rating) || 4.5;
    const ratingB = Number(b.course.rating) || 4.5;
    return ratingB - ratingA;
  });

  return results;
}
