import { SkillCategory } from "@/types";

export interface QuestionAnswerSubmission {
  questionId: string;
  selectedAnswer?: string | number | null;
  timeSpentSeconds?: number;
}

export interface QuestionDefinition {
  id: string;
  category: SkillCategory;
  questionType: "MCQ" | "RATING" | "SCENARIO" | "SHORT_ANSWER";
  correctAnswer?: string | null;
  marks: number;
  skillId?: string | null;
  skillName?: string | null;
}

export interface AssessmentScoreResult {
  technicalScore: number; // 0-100
  aptitudeScore: number; // 0-100
  softSkillScore: number; // 0-100
  overallScore: number; // 0-100
  skillBreakdown: {
    skillId?: string;
    skillName: string;
    category: SkillCategory;
    score: number;
  }[];
}

/**
 * Deterministic Assessment Evaluator.
 * Scores technical, aptitude, and soft skills using rubric and answer keys.
 */
export function evaluateAssessment(
  questions: QuestionDefinition[],
  submissions: QuestionAnswerSubmission[]
): AssessmentScoreResult {
  const submissionMap = new Map<string, string | number | null>();
  submissions.forEach((s) => submissionMap.set(s.questionId, s.selectedAnswer ?? null));

  let techMarksEarned = 0;
  let techMarksTotal = 0;

  let aptMarksEarned = 0;
  let aptMarksTotal = 0;

  let softMarksEarned = 0;
  let softMarksTotal = 0;

  // Track per-skill scores
  const skillMarksEarned = new Map<string, { earned: number; total: number; category: SkillCategory; name: string }>();

  questions.forEach((q) => {
    const userAns = submissionMap.get(q.id);
    let marksEarned = 0;

    if (q.questionType === "MCQ") {
      if (userAns && String(userAns).trim().toLowerCase() === String(q.correctAnswer).trim().toLowerCase()) {
        marksEarned = q.marks;
      }
    } else if (q.questionType === "SCENARIO") {
      // Scenario questions with rubric evaluation
      if (userAns && String(userAns).trim().toLowerCase() === String(q.correctAnswer).trim().toLowerCase()) {
        marksEarned = q.marks;
      } else if (userAns) {
        marksEarned = Math.round(q.marks * 0.5); // Partial credit for constructive engagement
      }
    } else if (q.questionType === "RATING") {
      // Rating questions (e.g. 1 to 5 scale converted to percentage of marks)
      const numVal = Number(userAns);
      if (!isNaN(numVal) && numVal > 0) {
        marksEarned = (numVal / 5) * q.marks;
      } else {
        marksEarned = q.marks * 0.6; // Default baseline rating
      }
    } else {
      if (userAns) marksEarned = q.marks;
    }

    // Accumulate by category
    if (q.category === "TECHNICAL") {
      techMarksEarned += marksEarned;
      techMarksTotal += q.marks;
    } else if (q.category === "APTITUDE") {
      aptMarksEarned += marksEarned;
      aptMarksTotal += q.marks;
    } else if (q.category === "SOFT_SKILL") {
      softMarksEarned += marksEarned;
      softMarksTotal += q.marks;
    }

    // Accumulate by skill
    if (q.skillName) {
      const existing = skillMarksEarned.get(q.skillName) || {
        earned: 0,
        total: 0,
        category: q.category,
        name: q.skillName,
      };
      existing.earned += marksEarned;
      existing.total += q.marks;
      skillMarksEarned.set(q.skillName, existing);
    }
  });

  const technicalScore = techMarksTotal > 0 ? Math.round((techMarksEarned / techMarksTotal) * 100) : 75;
  const aptitudeScore = aptMarksTotal > 0 ? Math.round((aptMarksEarned / aptMarksTotal) * 100) : 75;
  const softSkillScore = softMarksTotal > 0 ? Math.round((softMarksEarned / softMarksTotal) * 100) : 80;

  // Weighted overall score: 50% Technical, 30% Aptitude, 20% Soft Skills
  const overallScore = Math.round(technicalScore * 0.5 + aptitudeScore * 0.3 + softSkillScore * 0.2);

  const skillBreakdown = Array.from(skillMarksEarned.values()).map((s) => ({
    skillName: s.name,
    category: s.category,
    score: s.total > 0 ? Math.round((s.earned / s.total) * 100) : 70,
  }));

  return {
    technicalScore,
    aptitudeScore,
    softSkillScore,
    overallScore,
    skillBreakdown,
  };
}
