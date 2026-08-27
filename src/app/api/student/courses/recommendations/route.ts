import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateCourseRecommendations } from "@/lib/course-recommendations";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email.toLowerCase() },
      include: {
        studentProfile: {
          include: {
            courseEnrollments: {
              include: {
                course: true,
              },
            },
            certifications: true,
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
    });

    if (!user || user.role !== "STUDENT" || !user.studentProfile) {
      return NextResponse.json({ error: "Student profile not found" }, { status: 404 });
    }

    const { searchParams } = new URL(request.url);
    const targetRoleIdParam = searchParams.get("roleId");

    // Fetch all active online courses
    const allCourses = await prisma.onlineCourse.findMany({
      where: { isActive: true },
      orderBy: { rating: "desc" },
    });

    // Fetch active career roles
    const allRoles = await prisma.careerRole.findMany({
      where: { isActive: true },
      include: {
        skills: {
          include: { skill: true },
          orderBy: { priority: "asc" },
        },
      },
    });

    // Find student's target role (from query param or profile preferred role or first matching role)
    let selectedRole = null;
    if (targetRoleIdParam) {
      selectedRole = allRoles.find((r) => r.id === targetRoleIdParam) || null;
    }

    if (!selectedRole && user.studentProfile.preferredRoles) {
      const pref = Array.isArray(user.studentProfile.preferredRoles)
        ? (user.studentProfile.preferredRoles as string[])[0]
        : (user.studentProfile.preferredRoles as string);
      if (pref) {
        selectedRole = allRoles.find((r) => r.title.toLowerCase() === pref.toLowerCase()) || null;
      }
    }

    if (!selectedRole && user.studentProfile.careerGoal) {
      selectedRole =
        allRoles.find((r) =>
          user.studentProfile?.careerGoal?.toLowerCase().includes(r.title.toLowerCase())
        ) || null;
    }

    if (!selectedRole && allRoles.length > 0) {
      selectedRole = allRoles[0];
    }

    const formattedTargetRole = selectedRole
      ? {
          id: selectedRole.id,
          title: selectedRole.title,
          domain: selectedRole.domain,
          skills: selectedRole.skills.map((s) => ({
            skillName: s.skill.name,
            requiredLevel: Number(s.requiredLevel),
            weight: Number(s.weight),
            priority: s.priority,
          })),
        }
      : null;

    const studentSkills = user.userSkills.map((us) => ({
      skillName: us.skill.name,
      score: Number(us.score),
      category: us.skill.category,
      verified: us.verified,
    }));

    const existingEnrollments = user.studentProfile.courseEnrollments.map((e) => ({
      id: e.id,
      courseId: e.courseId,
      status: e.status,
      priority: e.priority,
      progressPercent: e.progressPercent,
      recommendationReason: e.recommendationReason,
      targetSkill: e.targetSkill,
      certificateUrl: e.certificateUrl,
      certificateDoc: e.certificateDoc,
      certificateVerified: e.certificateVerified,
      completedAt: e.completedAt,
    }));

    const recommendations = generateCourseRecommendations({
      studentCourse: user.studentProfile.course,
      studentDepartment: user.studentProfile.department,
      careerGoal: user.studentProfile.careerGoal,
      preferredIndustries: (user.studentProfile.preferredIndustries as string[]) || [],
      verifiedSkills: studentSkills,
      targetRole: formattedTargetRole,
      availableCourses: allCourses.map((c) => ({
        id: c.id,
        title: c.title,
        platform: c.platform,
        provider: c.provider,
        url: c.url,
        skillsCovered: c.skillsCovered,
        category: c.category,
        difficulty: c.difficulty,
        duration: c.duration,
        certificationAvailable: c.certificationAvailable,
        isFree: c.isFree,
        pricingType: c.pricingType,
        rating: Number(c.rating),
        enrolledCount: c.enrolledCount,
        description: c.description,
        courses: c.courses,
        departments: c.departments,
        isActive: c.isActive,
      })),
      existingEnrollments,
    });

    return NextResponse.json({
      student: {
        name: user.name,
        email: user.email,
        course: user.studentProfile.course,
        department: user.studentProfile.department,
        careerGoal: user.studentProfile.careerGoal,
      },
      targetRole: formattedTargetRole,
      recommendations,
      stats: {
        totalRecommended: recommendations.length,
        highPriorityCount: recommendations.filter((r) => r.priority === "HIGH_PRIORITY").length,
        inProgressCount: recommendations.filter((r) => r.enrollment.status === "IN_PROGRESS").length,
        completedCount: recommendations.filter((r) => r.enrollment.status === "COMPLETED").length,
      },
    });
  } catch (error: any) {
    console.error("Error generating course recommendations:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate course recommendations" },
      { status: 500 }
    );
  }
}
