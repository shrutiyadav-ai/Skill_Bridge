import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email.toLowerCase() },
      include: { studentProfile: true },
    });

    if (!user || user.role !== "STUDENT" || !user.studentProfile) {
      return NextResponse.json({ error: "Student profile not found" }, { status: 404 });
    }

    const body = await request.json();
    const {
      courseId,
      status = "IN_PROGRESS",
      progressPercent = 0,
      priority = "RECOMMENDED",
      recommendationReason,
      targetSkill,
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

    const enrollment = await prisma.studentCourseEnrollment.upsert({
      where: {
        studentId_courseId: {
          studentId: user.studentProfile.id,
          courseId: course.id,
        },
      },
      update: {
        status,
        progressPercent: Number(progressPercent),
        priority,
        recommendationReason: recommendationReason || undefined,
        targetSkill: targetSkill || undefined,
        completedAt: status === "COMPLETED" ? new Date() : undefined,
      },
      create: {
        studentId: user.studentProfile.id,
        courseId: course.id,
        status,
        progressPercent: Number(progressPercent),
        priority,
        recommendationReason: recommendationReason || undefined,
        targetSkill: targetSkill || undefined,
        completedAt: status === "COMPLETED" ? new Date() : undefined,
      },
    });

    return NextResponse.json({
      success: true,
      enrollment,
      message: `Course status updated to ${status}`,
    });
  } catch (error: any) {
    console.error("Error updating course enrollment:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update course enrollment" },
      { status: 500 }
    );
  }
}
