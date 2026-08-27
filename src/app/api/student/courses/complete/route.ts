import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
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

    if (!user || user.role !== "STUDENT" || !user.studentProfile) {
      return NextResponse.json({ error: "Student profile not found" }, { status: 404 });
    }

    const body = await request.json();
    const {
      courseId,
      certificateUrl,
      certificateDoc,
      issueDate = new Date().toISOString(),
    } = body;

    if (!courseId) {
      return NextResponse.json({ error: "Course ID is required" }, { status: 400 });
    }

    // Verify course exists
    const course = await prisma.onlineCourse.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    // 1. Update StudentCourseEnrollment to COMPLETED with Certificate
    const enrollment = await prisma.studentCourseEnrollment.upsert({
      where: {
        studentId_courseId: {
          studentId: user.studentProfile.id,
          courseId: course.id,
        },
      },
      update: {
        status: "COMPLETED",
        progressPercent: 100,
        certificateUrl: certificateUrl || undefined,
        certificateDoc: certificateDoc || undefined,
        certificateVerified: true,
        completedAt: new Date(),
      },
      create: {
        studentId: user.studentProfile.id,
        courseId: course.id,
        status: "COMPLETED",
        progressPercent: 100,
        certificateUrl: certificateUrl || undefined,
        certificateDoc: certificateDoc || undefined,
        certificateVerified: true,
        completedAt: new Date(),
      },
    });

    // 2. Add verified Certification to StudentProfile
    const certification = await prisma.certification.create({
      data: {
        studentId: user.studentProfile.id,
        name: course.title,
        issuer: course.provider || course.platform,
        credentialUrl: certificateUrl || course.url,
        documentUrl: certificateDoc || undefined,
        issueDate: new Date(issueDate),
        verified: true,
      },
    });

    // 3. Elevate & Verify Skills in UserSkill Vector
    const skillsToVerify: string[] = Array.isArray(course.skillsCovered)
      ? (course.skillsCovered as string[])
      : [];

    const updatedSkills = [];

    for (const skillName of skillsToVerify) {
      // Find or create the skill in catalog
      let skill = await prisma.skill.findUnique({
        where: { name: skillName },
      });

      if (!skill) {
        skill = await prisma.skill.create({
          data: {
            name: skillName,
            category: course.category,
            description: `Industry skill verified via ${course.title} (${course.platform})`,
          },
        });
      }

      // Check existing user skill
      const existingUserSkill = await prisma.userSkill.findUnique({
        where: {
          userId_skillId: {
            userId: user.id,
            skillId: skill.id,
          },
        },
      });

      const previousScore = existingUserSkill ? Number(existingUserSkill.score) : 0;
      // Set to 85% or increment by 25 if higher
      const newScore = Math.min(100, Math.max(85, previousScore + 20));

      const updatedUserSkill = await prisma.userSkill.upsert({
        where: {
          userId_skillId: {
            userId: user.id,
            skillId: skill.id,
          },
        },
        update: {
          score: newScore,
          verified: true,
          source: "course_completion",
        },
        create: {
          userId: user.id,
          skillId: skill.id,
          score: newScore,
          verified: true,
          source: "course_completion",
        },
        include: { skill: true },
      });

      updatedSkills.push({
        skillName: skill.name,
        previousScore,
        newScore,
        verified: true,
      });
    }

    return NextResponse.json({
      success: true,
      message: `Course completed! Certificate verified and ${updatedSkills.length} skills added to your verified digital portfolio.`,
      enrollment,
      certification,
      updatedSkills,
    });
  } catch (error: any) {
    console.error("Error completing course and adding certificate:", error);
    return NextResponse.json(
      { error: error.message || "Failed to record course completion" },
      { status: 500 }
    );
  }
}
