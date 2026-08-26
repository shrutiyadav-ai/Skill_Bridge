import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getAssessmentConfigForStudent } from "@/lib/course-competencies";

export const dynamic = "force-dynamic";

// Fisher-Yates array shuffle helper
function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const email = session.user.email.toLowerCase().trim();

    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        studentProfile: true,
        assessmentAttempts: {
          orderBy: { attemptNumber: "desc" },
          take: 5,
          include: {
            answers: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const course = user.studentProfile?.course || "B.Tech";
    const department = user.studentProfile?.department || "Computer Science & Engineering";
    const year = user.studentProfile?.year || 3;

    // Resolve course configuration
    const config = getAssessmentConfigForStudent(course, department, year);

    // Identify questions from the immediate previous attempt to avoid duplicates if possible
    const lastAttempt = user.assessmentAttempts[0];
    const previousQuestionIds = new Set(
      lastAttempt?.answers?.map((a) => a.questionId) || []
    );

    // Determine adaptive difficulty target
    let adaptiveTrack: "FOUNDATIONAL" | "BALANCED" | "ADVANCED" = "BALANCED";
    if (lastAttempt) {
      const lastScore = Number(lastAttempt.overallScore);
      if (lastScore >= 75) adaptiveTrack = "ADVANCED";
      else if (lastScore < 50) adaptiveTrack = "FOUNDATIONAL";
    }

    // Query active questions matching student's course + department OR universal pool (aptitude/soft skills)
    const allMatchingQuestions = await prisma.assessmentQuestion.findMany({
      where: {
        isActive: true,
        OR: [
          // Department-specific questions
          {
            department: {
              contains: department.split(" ")[0], // e.g. "Computer", "Artificial", "Accounting", "Finance"
              mode: "insensitive",
            },
          },
          // Course-specific questions
          {
            course: {
              contains: course.split(" ")[0],
              mode: "insensitive",
            },
            department: null,
          },
          // Universal Aptitude & Soft Skill questions
          {
            category: { in: ["APTITUDE", "SOFT_SKILL"] },
          },
          // Universal general questions
          {
            course: null,
            department: null,
          },
        ],
      },
    });

    if (allMatchingQuestions.length === 0) {
      return NextResponse.json(
        { error: "No active questions found for your course domain." },
        { status: 404 }
      );
    }

    // Filter into new vs previously seen questions for fresh attempt generation
    const unseenQuestions = allMatchingQuestions.filter(
      (q) => !previousQuestionIds.has(q.id)
    );

    // If unseen pool is sufficient, use it; otherwise use full pool
    const pool = unseenQuestions.length >= 10 ? unseenQuestions : allMatchingQuestions;

    // Group by category to maintain balanced evaluation
    const technicalQuestions = pool.filter((q) => q.category === "TECHNICAL" || q.category === "DOMAIN");
    const aptitudeQuestions = pool.filter((q) => q.category === "APTITUDE");
    const softSkillQuestions = pool.filter((q) => q.category === "SOFT_SKILL");

    // Target counts: ~60% Technical/Domain, ~25% Aptitude, ~15% Soft Skills
    const targetTotal = Math.min(config.totalQuestions || 15, pool.length);
    const targetTechnical = Math.max(1, Math.round(targetTotal * 0.6));
    const targetAptitude = Math.max(1, Math.round(targetTotal * 0.25));
    const targetSoft = Math.max(1, targetTotal - targetTechnical - targetAptitude);

    // Select and shuffle within each pool
    const selectedTech = shuffleArray(technicalQuestions).slice(0, targetTechnical);
    const selectedApt = shuffleArray(aptitudeQuestions).slice(0, targetAptitude);
    const selectedSoft = shuffleArray(softSkillQuestions).slice(0, targetSoft);

    let selectedQuestions = [...selectedTech, ...selectedApt, ...selectedSoft];

    // If still short of targetTotal, fill with remaining pool
    if (selectedQuestions.length < targetTotal) {
      const selectedIds = new Set(selectedQuestions.map((q) => q.id));
      const remaining = shuffleArray(pool.filter((q) => !selectedIds.has(q.id)));
      selectedQuestions = [
        ...selectedQuestions,
        ...remaining.slice(0, targetTotal - selectedQuestions.length),
      ];
    }

    // Final shuffle of entire question set so categories are mixed naturally
    const randomizedQuestions = shuffleArray(selectedQuestions);

    // SECURITY: Map questions WITHOUT exposing `correctAnswer` or `explanation`
    const secureQuestions = randomizedQuestions.map((q, idx) => {
      let optionsList: string[] = [];
      if (Array.isArray(q.options)) {
        optionsList = q.options as string[];
      } else if (typeof q.options === "string") {
        try {
          optionsList = JSON.parse(q.options);
        } catch {
          optionsList = [];
        }
      }

      // Randomize option order for MCQs and Scenarios
      const randomizedOptions =
        q.questionType === "MCQ" || q.questionType === "SCENARIO"
          ? shuffleArray(optionsList)
          : optionsList;

      return {
        id: q.id,
        orderIndex: idx + 1,
        question: q.question,
        questionType: q.questionType,
        category: q.category,
        difficulty: q.difficulty,
        subject: q.subject || "General",
        topic: q.topic || "Core Concept",
        skillName: q.skillName || "General",
        marks: q.marks || 1,
        options: randomizedOptions,
      };
    });

    const nextAttemptNumber = (user.assessmentAttempts[0]?.attemptNumber || 0) + 1;

    return NextResponse.json({
      success: true,
      attemptNumber: nextAttemptNumber,
      config: {
        ...config,
        adaptiveTrack,
      },
      questions: secureQuestions,
      totalQuestions: secureQuestions.length,
      durationMinutes: config.durationMinutes,
      passingScore: config.passingScore,
    });
  } catch (error: any) {
    console.error("Error starting assessment attempt:", error);
    return NextResponse.json(
      { error: error.message || "Failed to start assessment" },
      { status: 500 }
    );
  }
}
