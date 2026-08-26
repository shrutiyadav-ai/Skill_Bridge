import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getAssessmentConfigForStudent } from "@/lib/course-competencies";

export const dynamic = "force-dynamic";

export async function GET() {
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
          take: 10,
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Read course, department, and academic details
    const course = user.studentProfile?.course || "B.Tech";
    const department = user.studentProfile?.department || "Computer Science & Engineering";
    const year = user.studentProfile?.year || 3;
    const semester = user.studentProfile?.semester || 5;

    // Resolve course-specific assessment configuration
    const config = getAssessmentConfigForStudent(course, department, year);

    // Compute student's adaptive difficulty track based on recent performance
    const previousAttempts = user.assessmentAttempts || [];
    let adaptiveTrack: "FOUNDATIONAL" | "BALANCED" | "ADVANCED" = "BALANCED";

    if (previousAttempts.length > 0) {
      const lastScore = Number(previousAttempts[0].overallScore);
      if (lastScore >= 75) {
        adaptiveTrack = "ADVANCED";
      } else if (lastScore < 50) {
        adaptiveTrack = "FOUNDATIONAL";
      }
    }

    // Format attempts history for frontend display
    const formattedAttempts = previousAttempts.map((att) => ({
      id: att.id,
      attemptNumber: att.attemptNumber,
      overallScore: Number(att.overallScore),
      technicalScore: att.technicalScore ? Number(att.technicalScore) : null,
      aptitudeScore: att.aptitudeScore ? Number(att.aptitudeScore) : null,
      softSkillScore: att.softSkillScore ? Number(att.softSkillScore) : null,
      passed: att.passed,
      durationSeconds: att.durationSeconds,
      totalQuestions: att.totalQuestions,
      correctAnswers: att.correctAnswers,
      skillBreakdown: att.skillBreakdown,
      strongSkills: att.strongSkills,
      weakSkills: att.weakSkills,
      completedAt: att.completedAt,
    }));

    return NextResponse.json({
      student: {
        id: user.id,
        name: user.name,
        email: user.email,
        course,
        department,
        year,
        semester,
      },
      config: {
        ...config,
        adaptiveTrack,
      },
      attemptCount: previousAttempts.length,
      attempts: formattedAttempts,
    });
  } catch (error: any) {
    console.error("Error fetching assessment profile:", error);
    return NextResponse.json(
      { error: error.message || "Failed to load assessment profile" },
      { status: 500 }
    );
  }
}
