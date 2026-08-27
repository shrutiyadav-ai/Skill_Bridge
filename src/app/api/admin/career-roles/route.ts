import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { SkillCategory } from "@prisma/client";

export const dynamic = "force-dynamic";

// GET: List all career roles (with optional filters)
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const domain = searchParams.get("domain");
    const activeOnly = searchParams.get("activeOnly") === "true";

    const where: any = {};
    if (domain) where.domain = { contains: domain, mode: "insensitive" };
    if (activeOnly) where.isActive = true;

    const roles = await prisma.careerRole.findMany({
      where,
      include: {
        skills: {
          include: { skill: true },
          orderBy: { priority: "asc" },
        },
      },
      orderBy: { title: "asc" },
    });

    return NextResponse.json({
      careerRoles: roles.map((r) => ({
        id: r.id,
        title: r.title,
        domain: r.domain,
        description: r.description,
        courses: r.courses,
        departments: r.departments,
        isCrossDisciplinary: r.isCrossDisciplinary,
        isActive: r.isActive,
        experienceLevel: r.experienceLevel,
        educationRequirements: r.educationRequirements,
        salaryRange: r.salaryRange,
        certifications: r.certifications,
        toolsAndTechnologies: r.toolsAndTechnologies,
        skills: r.skills.map((s) => ({
          id: s.id,
          skillId: s.skillId,
          skillName: s.skill.name,
          category: s.skill.category,
          requiredLevel: Number(s.requiredLevel),
          weight: Number(s.weight),
          priority: s.priority,
        })),
      })),
      total: roles.length,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to fetch career roles" },
      { status: 500 }
    );
  }
}

// POST: Add a new career role with course associations and skill benchmarks
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify admin role
    const user = await prisma.user.findUnique({
      where: { email: session.user.email.toLowerCase() },
    });

    if (!user || ((user.role as string) !== "ADMIN" && user.role !== "INSTITUTION")) {
      return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 });
    }

    const body = await request.json();
    const {
      title,
      domain,
      description,
      courses,
      departments,
      isCrossDisciplinary,
      experienceLevel,
      educationRequirements,
      salaryRange,
      certifications,
      toolsAndTechnologies,
      skills,
    } = body;

    if (!title) {
      return NextResponse.json({ error: "Role title is required" }, { status: 400 });
    }

    const createdRole = await prisma.careerRole.create({
      data: {
        title,
        domain: domain || "Technology",
        description,
        courses: courses || ["ALL"],
        departments: departments || ["ALL"],
        isCrossDisciplinary: Boolean(isCrossDisciplinary),
        isActive: true,
        experienceLevel: experienceLevel || "Entry Level (0-2 years)",
        educationRequirements,
        salaryRange,
        certifications: certifications || [],
        toolsAndTechnologies: toolsAndTechnologies || [],
      },
    });

    // Add skills if provided
    if (Array.isArray(skills)) {
      for (const s of skills) {
        let skillRecord = await prisma.skill.findUnique({
          where: { name: s.skillName },
        });

        if (!skillRecord) {
          skillRecord = await prisma.skill.create({
            data: {
              name: s.skillName,
              category: s.category || SkillCategory.TECHNICAL,
              description: `${s.skillName} competency`,
            },
          });
        }

        await prisma.careerRoleSkill.create({
          data: {
            careerRoleId: createdRole.id,
            skillId: skillRecord.id,
            requiredLevel: s.requiredLevel || 75,
            weight: s.weight || 1.0,
            priority: s.priority || 1,
          },
        });
      }
    }

    return NextResponse.json(
      { message: "Career role created successfully", roleId: createdRole.id },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to create career role" },
      { status: 500 }
    );
  }
}
