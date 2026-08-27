import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const departmentFilter = searchParams.get("department");
    const courseFilter = searchParams.get("course");
    const batchFilter = searchParams.get("batch");
    const tierFilter = searchParams.get("tier"); // READY, DEVELOPING, FOUNDATIONAL

    // Fetch all registered student users with profiles, skills, and assessment attempts
    const students = await prisma.user.findMany({
      where: { role: "STUDENT" },
      include: {
        studentProfile: {
          include: {
            certifications: true,
            applications: {
              include: { opportunity: true },
            },
          },
        },
        userSkills: {
          include: { skill: true },
        },
        assessmentAttempts: {
          orderBy: { completedAt: "desc" },
          take: 1,
        },
      },
      orderBy: { name: "asc" },
    });

    // Map each student's readiness and metrics
    const studentRoster = students.map((s) => {
      const skills = s.userSkills || [];
      const verifiedCount = skills.filter((sk) => sk.verified).length;
      const avgScore =
        skills.length > 0
          ? Math.round(
              skills.reduce((acc, curr) => acc + Number(curr.score), 0) / skills.length
            )
          : 0;

      let readinessTier: "READY" | "DEVELOPING" | "FOUNDATIONAL" = "FOUNDATIONAL";
      if (avgScore >= 70) readinessTier = "READY";
      else if (avgScore >= 50) readinessTier = "DEVELOPING";

      const hasActiveApplications = (s.studentProfile?.applications || []).length > 0;
      const isSelected = (s.studentProfile?.applications || []).some(
        (app) => app.status === "SELECTED"
      );

      return {
        id: s.id,
        name: s.name,
        email: s.email,
        course: s.studentProfile?.course || "B.Tech",
        department: s.studentProfile?.department || "Computer Science & Engineering",
        year: s.studentProfile?.year || 3,
        semester: s.studentProfile?.semester || 6,
        cgpa: Number(s.studentProfile?.cgpa) || 8.2,
        totalSkills: skills.length,
        verifiedSkills: verifiedCount,
        readinessScore: avgScore,
        readinessTier,
        hasAssessment: s.assessmentAttempts.length > 0 || skills.length > 0,
        placementStatus: isSelected
          ? "Placed"
          : hasActiveApplications
          ? "Interviewing"
          : "Available",
      };
    });

    // Filter roster based on query params
    let filteredRoster = studentRoster;
    if (departmentFilter && departmentFilter !== "ALL") {
      filteredRoster = filteredRoster.filter(
        (s) => s.department.toLowerCase() === departmentFilter.toLowerCase()
      );
    }
    if (courseFilter && courseFilter !== "ALL") {
      filteredRoster = filteredRoster.filter(
        (s) => s.course.toLowerCase() === courseFilter.toLowerCase()
      );
    }
    if (batchFilter && batchFilter !== "ALL") {
      filteredRoster = filteredRoster.filter((s) => String(s.year) === String(batchFilter));
    }
    if (tierFilter && tierFilter !== "ALL") {
      filteredRoster = filteredRoster.filter((s) => s.readinessTier === tierFilter);
    }

    // Compute cohort statistics
    const totalStudents = studentRoster.length;
    const assessedCount = studentRoster.filter((s) => s.hasAssessment).length;
    const readyCount = studentRoster.filter((s) => s.readinessTier === "READY").length;
    const developingCount = studentRoster.filter((s) => s.readinessTier === "DEVELOPING").length;
    const foundationalCount = studentRoster.filter(
      (s) => s.readinessTier === "FOUNDATIONAL"
    ).length;

    const avgCohortReadiness =
      totalStudents > 0
        ? Math.round(
            studentRoster.reduce((acc, curr) => acc + curr.readinessScore, 0) / totalStudents
          )
        : 0;

    // Department breakdown
    const departmentsMap = new Map<string, any>();
    studentRoster.forEach((s) => {
      if (!departmentsMap.has(s.department)) {
        departmentsMap.set(s.department, {
          department: s.department,
          studentsCount: 0,
          assessedCount: 0,
          readyCount: 0,
          totalReadiness: 0,
        });
      }
      const dept = departmentsMap.get(s.department);
      dept.studentsCount += 1;
      if (s.hasAssessment) dept.assessedCount += 1;
      if (s.readinessTier === "READY") dept.readyCount += 1;
      dept.totalReadiness += s.readinessScore;
    });

    const departmentStats = Array.from(departmentsMap.values()).map((d) => ({
      department: d.department,
      studentsCount: d.studentsCount,
      assessedCount: d.assessedCount,
      readyCount: d.readyCount,
      averageReadiness:
        d.studentsCount > 0 ? Math.round(d.totalReadiness / d.studentsCount) : 0,
      placementReadyPercentage:
        d.studentsCount > 0 ? Math.round((d.readyCount / d.studentsCount) * 100) : 0,
    }));

    return NextResponse.json({
      summary: {
        totalStudents,
        assessedCount,
        assessmentCompletionRate:
          totalStudents > 0 ? Math.round((assessedCount / totalStudents) * 100) : 0,
        averageReadiness: avgCohortReadiness,
        readyCount,
        developingCount,
        foundationalCount,
        readyPercentage:
          totalStudents > 0 ? Math.round((readyCount / totalStudents) * 100) : 0,
      },
      departmentStats,
      roster: filteredRoster,
      totalRoster: filteredRoster.length,
    });
  } catch (error: any) {
    console.error("Error fetching student readiness metrics:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch readiness data" },
      { status: 500 }
    );
  }
}
