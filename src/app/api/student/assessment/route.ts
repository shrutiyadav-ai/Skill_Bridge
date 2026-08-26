import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getAssessmentConfigForStudent } from "@/lib/course-competencies";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const email = session.user.email.toLowerCase().trim();
    const body = await request.json();
    const { answers = {}, durationSeconds = 0 } = body;

    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        studentProfile: true,
        assessmentAttempts: {
          orderBy: { attemptNumber: "desc" },
          take: 1,
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const course = user.studentProfile?.course || "B.Tech";
    const department = user.studentProfile?.department || "Computer Science & Engineering";
    const year = user.studentProfile?.year || 3;
    const config = getAssessmentConfigForStudent(course, department, year);

    const questionIds = Object.keys(answers);
    if (questionIds.length === 0) {
      return NextResponse.json(
        { error: "No answers submitted" },
        { status: 400 }
      );
    }

    // Fetch the actual questions with correctAnswer and rubric securely from the database
    const questions = await prisma.assessmentQuestion.findMany({
      where: {
        id: { in: questionIds },
      },
      include: {
        skill: true,
      },
    });

    if (questions.length === 0) {
      return NextResponse.json(
        { error: "Submitted questions could not be found." },
        { status: 404 }
      );
    }

    // Deterministic Evaluation Engine
    let totalMarksEarned = 0;
    let totalMarksPossible = 0;
    let correctCount = 0;

    let techEarned = 0;
    let techTotal = 0;

    let aptEarned = 0;
    let aptTotal = 0;

    let softEarned = 0;
    let softTotal = 0;

    const skillMap = new Map<
      string,
      {
        skillId: string | null;
        skillName: string;
        category: string;
        earned: number;
        total: number;
      }
    >();

    const questionReviews = questions.map((q) => {
      const selectedAnswer = answers[q.id];
      const marksPossible = q.marks || 1;
      totalMarksPossible += marksPossible;

      let isCorrect = false;
      let marksEarned = 0;

      const userAnsStr = selectedAnswer !== undefined && selectedAnswer !== null ? String(selectedAnswer).trim() : "";
      const correctAnsStr = q.correctAnswer ? String(q.correctAnswer).trim() : "";

      if (q.questionType === "MCQ") {
        if (userAnsStr && userAnsStr.toLowerCase() === correctAnsStr.toLowerCase()) {
          isCorrect = true;
          marksEarned = marksPossible;
          correctCount++;
        }
      } else if (q.questionType === "SCENARIO") {
        if (userAnsStr && userAnsStr.toLowerCase() === correctAnsStr.toLowerCase()) {
          isCorrect = true;
          marksEarned = marksPossible;
          correctCount++;
        } else if (userAnsStr) {
          // Constructive partial credit for engaging with professional scenario
          marksEarned = Math.round(marksPossible * 0.5 * 10) / 10;
        }
      } else if (q.questionType === "RATING") {
        const ratingVal = Number(userAnsStr);
        if (!isNaN(ratingVal) && ratingVal > 0) {
          marksEarned = Math.round(((ratingVal / 5) * marksPossible) * 10) / 10;
          if (ratingVal >= 4) isCorrect = true;
        } else {
          marksEarned = Math.round(marksPossible * 0.6 * 10) / 10;
        }
      } else {
        if (userAnsStr && userAnsStr.toLowerCase() === correctAnsStr.toLowerCase()) {
          isCorrect = true;
          marksEarned = marksPossible;
          correctCount++;
        }
      }

      totalMarksEarned += marksEarned;

      // Category breakdown
      if (q.category === "TECHNICAL" || q.category === "DOMAIN") {
        techEarned += marksEarned;
        techTotal += marksPossible;
      } else if (q.category === "APTITUDE") {
        aptEarned += marksEarned;
        aptTotal += marksPossible;
      } else if (q.category === "SOFT_SKILL") {
        softEarned += marksEarned;
        softTotal += marksPossible;
      }

      // Skill-by-skill breakdown
      const skillKey = q.skillName || "General Competency";
      const existing = skillMap.get(skillKey) || {
        skillId: q.skillId || null,
        skillName: skillKey,
        category: q.category,
        earned: 0,
        total: 0,
      };
      existing.earned += marksEarned;
      existing.total += marksPossible;
      if (q.skillId && !existing.skillId) existing.skillId = q.skillId;
      skillMap.set(skillKey, existing);

      return {
        id: q.id,
        question: q.question,
        questionType: q.questionType,
        category: q.category,
        difficulty: q.difficulty,
        subject: q.subject,
        topic: q.topic,
        skillName: q.skillName,
        options: q.options,
        selectedAnswer: selectedAnswer ?? null,
        correctAnswer: q.correctAnswer,
        isCorrect,
        marksEarned,
        marksPossible,
        explanation: q.explanation || "Review fundamental course materials for this competency.",
      };
    });

    // Calculate normalized percentage scores
    const technicalScore = techTotal > 0 ? Math.round((techEarned / techTotal) * 100) : 75;
    const aptitudeScore = aptTotal > 0 ? Math.round((aptEarned / aptTotal) * 100) : 75;
    const softSkillScore = softTotal > 0 ? Math.round((softEarned / softTotal) * 100) : 80;

    // Overall weighted score: 50% Technical/Domain, 30% Aptitude, 20% Soft Skills
    const overallScore = Math.min(
      100,
      Math.max(
        0,
        Math.round(technicalScore * 0.5 + aptitudeScore * 0.3 + softSkillScore * 0.2)
      )
    );

    const passingThreshold = config.passingScore || 70;
    const passed = overallScore >= passingThreshold;

    // Compute Skill Breakdown & Gaps
    const skillBreakdown = Array.from(skillMap.values()).map((s) => {
      const score = s.total > 0 ? Math.round((s.earned / s.total) * 100) : 70;
      return {
        skillId: s.skillId,
        skillName: s.skillName,
        category: s.category,
        score,
        status: score >= 75 ? "STRONG" : score >= 60 ? "DEVELOPING" : "NEEDS_IMPROVEMENT",
      };
    });

    const strongSkills = skillBreakdown.filter((s) => s.score >= 75).map((s) => s.skillName);
    const weakSkills = skillBreakdown.filter((s) => s.score < 70).map((s) => s.skillName);

    const skillGaps = skillBreakdown.map((s) => ({
      skillName: s.skillName,
      category: s.category,
      currentScore: s.score,
      targetScore: 80,
      gap: Math.max(0, 80 - s.score),
      status: s.score >= 80 ? "MET" : s.score >= 65 ? "DEVELOPING" : "CRITICAL_GAP",
    }));

    const recommendations = weakSkills.map((w) => ({
      skill: w,
      action: `Review standard course modules and complete guided capstone exercises in ${w}.`,
      priority: "HIGH",
    }));

    const attemptNumber = (user.assessmentAttempts[0]?.attemptNumber || 0) + 1;

    // Persist AssessmentAttempt in database
    const attempt = await prisma.assessmentAttempt.create({
      data: {
        userId: user.id,
        course,
        department,
        attemptNumber,
        overallScore,
        technicalScore,
        aptitudeScore,
        softSkillScore,
        passed,
        durationSeconds,
        totalQuestions: questions.length,
        correctAnswers: correctCount,
        skillBreakdown: skillBreakdown as any,
        strongSkills: strongSkills as any,
        weakSkills: weakSkills as any,
        skillGaps: skillGaps as any,
        recommendations: recommendations as any,
      },
    });

    // Persist Question-level AttemptAnswers
    for (const qr of questionReviews) {
      await prisma.attemptAnswer.create({
        data: {
          attemptId: attempt.id,
          questionId: qr.id,
          selectedAnswer: qr.selectedAnswer !== null ? String(qr.selectedAnswer) : null,
          isCorrect: qr.isCorrect,
          marksEarned: qr.marksEarned,
        },
      });
    }

    // Update Student Skill Vector in PostgreSQL (UserSkill and SkillScore)
    const updatedSkillsVector: any[] = [];

    for (const sb of skillBreakdown) {
      // Find skill record in DB or upsert by name
      let skillObj = await prisma.skill.findUnique({
        where: { name: sb.skillName },
      });

      if (!skillObj) {
        skillObj = await prisma.skill.create({
          data: {
            name: sb.skillName,
            category: (sb.category as any) || "TECHNICAL",
            description: `${sb.skillName} competency for ${course}`,
          },
        });
      }

      // Upsert UserSkill
      const userSkill = await prisma.userSkill.upsert({
        where: {
          userId_skillId: {
            userId: user.id,
            skillId: skillObj.id,
          },
        },
        update: {
          score: sb.score,
          verified: true,
          source: "assessment",
        },
        create: {
          userId: user.id,
          skillId: skillObj.id,
          score: sb.score,
          verified: true,
          source: "assessment",
        },
      });

      // Upsert SkillScore
      await prisma.skillScore.upsert({
        where: {
          userId_skillId: {
            userId: user.id,
            skillId: skillObj.id,
          },
        },
        update: {
          score: sb.score,
          source: "assessment",
        },
        create: {
          userId: user.id,
          skillId: skillObj.id,
          score: sb.score,
          source: "assessment",
        },
      });

      updatedSkillsVector.push({
        id: userSkill.id,
        skillId: skillObj.id,
        skillName: sb.skillName,
        category: sb.category,
        score: sb.score,
        verified: true,
        source: "assessment",
      });
    }

    // Legacy sync with AssessmentResult table
    try {
      await prisma.assessmentResult.create({
        data: {
          userId: user.id,
          assessmentId: "70000000-0000-0000-0000-000000000001",
          technicalScore,
          aptitudeScore,
          softSkillScore,
          overallScore,
        },
      });
    } catch {}

    return NextResponse.json({
      success: true,
      attemptId: attempt.id,
      attemptNumber,
      overallScore,
      technicalScore,
      aptitudeScore,
      softSkillScore,
      passed,
      passingScore: passingThreshold,
      totalQuestions: questions.length,
      correctAnswers: correctCount,
      durationSeconds,
      skillBreakdown,
      strongSkills,
      weakSkills,
      skillGaps,
      recommendations,
      questionReviews,
      assessedSkillVector: updatedSkillsVector,
    });
  } catch (error: any) {
    console.error("Error evaluating and submitting assessment:", error);
    return NextResponse.json(
      { error: error.message || "Failed to submit assessment" },
      { status: 500 }
    );
  }
}
