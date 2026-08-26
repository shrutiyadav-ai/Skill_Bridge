import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email.toLowerCase() },
      include: {
        studentProfile: true,
        userSkills: {
          include: { skill: true },
        },
      },
    });

    if (!user || user.role !== "STUDENT") {
      return NextResponse.json({ error: "Student profile not found" }, { status: 404 });
    }

    const studentCourse = (user.studentProfile?.course || "").trim();
    const studentDept = (user.studentProfile?.department || "").trim();

    // Fetch all active career roles with their required skills & benchmarks
    const allRoles = await prisma.careerRole.findMany({
      where: { isActive: true },
      include: {
        skills: {
          include: {
            skill: true,
          },
          orderBy: { priority: "asc" },
        },
      },
      orderBy: { title: "asc" },
    });

    // Helper to check if role matches student course & department
    const isRoleEligible = (role: any) => {
      // 1. Cross-disciplinary roles are universally accessible
      if (role.isCrossDisciplinary) return true;

      const courses = (role.courses as string[]) || [];
      const departments = (role.departments as string[]) || [];

      if (courses.includes("ALL") && departments.includes("ALL")) return true;

      const normCourse = studentCourse.toLowerCase();
      const normDept = studentDept.toLowerCase();

      // Check course match
      const courseMatch =
        courses.includes("ALL") ||
        courses.some((c) => {
          const lc = c.toLowerCase();
          return normCourse.includes(lc) || lc.includes(normCourse);
        });

      // Check department match
      const deptMatch =
        departments.includes("ALL") ||
        departments.some((d) => {
          const ld = d.toLowerCase();

          // Department keyword matching
          if (normDept.includes("computer") && (ld.includes("computer") || ld.includes("software") || ld.includes("information"))) return true;
          if (normDept.includes("information") && (ld.includes("information") || ld.includes("computer") || ld.includes("cloud"))) return true;
          if ((normDept.includes("artificial") || normDept.includes("ai")) && (ld.includes("artificial") || ld.includes("ai") || ld.includes("data science") || ld.includes("computer"))) return true;
          if ((normDept.includes("finance") || normDept.includes("accounting") || normDept.includes("commerce")) && (ld.includes("finance") || ld.includes("accounting") || ld.includes("tax") || ld.includes("audit") || ld.includes("commerce") || ld.includes("banking"))) return true;
          if (normDept.includes("mechanical") && (ld.includes("mechanical") || ld.includes("automobile") || ld.includes("production") || ld.includes("cad"))) return true;
          if (normDept.includes("civil") && (ld.includes("civil") || ld.includes("structural") || ld.includes("construction") || ld.includes("cad"))) return true;
          if (normDept.includes("electronics") && (ld.includes("electronics") || ld.includes("ece") || ld.includes("embedded") || ld.includes("iot"))) return true;
          if (normDept.includes("marketing") && ld.includes("marketing")) return true;
          if (normDept.includes("hr") || normDept.includes("human resource")) {
            if (ld.includes("hr") || ld.includes("human resource")) return true;
          }
          if (normDept.includes("business") || normDept.includes("management")) {
            if (ld.includes("business") || ld.includes("management") || ld.includes("marketing") || ld.includes("analytics")) return true;
          }

          return normDept.includes(ld) || ld.includes(normDept);
        });

      return courseMatch && deptMatch;
    };

    // Filter roles for the student
    let eligibleRoles = allRoles.filter(isRoleEligible);

    // Fallback: If no strict match, return cross-disciplinary roles
    if (eligibleRoles.length === 0) {
      eligibleRoles = allRoles.filter((r) => r.isCrossDisciplinary);
    }

    // Format roles for client response
    const formattedRoles = eligibleRoles.map((role) => ({
      id: role.id,
      title: role.title,
      domain: role.domain || "Technology",
      description: role.description,
      isCrossDisciplinary: role.isCrossDisciplinary,
      experienceLevel: role.experienceLevel || "Entry Level (0-2 years)",
      educationRequirements: role.educationRequirements || "Relevant Degree or Equivalent",
      salaryRange: role.salaryRange || "Competitive Industry Standard",
      certifications: (role.certifications as string[]) || [],
      toolsAndTechnologies: (role.toolsAndTechnologies as string[]) || [],
      skills: role.skills.map((s) => ({
        id: s.id,
        skillId: s.skillId,
        skillName: s.skill.name,
        category: s.skill.category,
        requiredLevel: Number(s.requiredLevel),
        weight: Number(s.weight),
        priority: s.priority,
      })),
    }));

    return NextResponse.json({
      student: {
        name: user.name,
        email: user.email,
        course: studentCourse,
        department: studentDept,
        year: user.studentProfile?.year,
        semester: user.studentProfile?.semester,
      },
      careerRoles: formattedRoles,
      totalAvailable: formattedRoles.length,
    });
  } catch (error: any) {
    console.error("Error fetching student career roles:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch student career roles" },
      { status: 500 }
    );
  }
}
