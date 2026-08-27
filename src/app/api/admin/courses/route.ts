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

    const courses = await prisma.onlineCourse.findMany({
      orderBy: [{ platform: "asc" }, { title: "asc" }],
      include: {
        _count: {
          select: { enrollments: true },
        },
      },
    });

    return NextResponse.json({ courses, total: courses.length });
  } catch (error: any) {
    console.error("Error fetching courses for admin:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch courses" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      id,
      title,
      platform,
      provider,
      url,
      skillsCovered,
      category = "TECHNICAL",
      difficulty = "BEGINNER",
      duration,
      certificationAvailable = true,
      isFree = false,
      pricingType = "FREE_AUDIT_PAID_CERT",
      rating = 4.8,
      enrolledCount = 1000,
      description,
      courses = ["ALL"],
      departments = ["ALL"],
      isActive = true,
    } = body;

    if (!title || !platform || !url) {
      return NextResponse.json(
        { error: "Title, platform, and URL are required" },
        { status: 400 }
      );
    }

    if (id) {
      // Update existing course
      const updated = await prisma.onlineCourse.update({
        where: { id },
        data: {
          title,
          platform,
          provider,
          url,
          skillsCovered: skillsCovered || [],
          category,
          difficulty,
          duration,
          certificationAvailable,
          isFree,
          pricingType,
          rating,
          enrolledCount,
          description,
          courses,
          departments,
          isActive,
        },
      });

      return NextResponse.json({ success: true, course: updated });
    } else {
      // Create new course
      const created = await prisma.onlineCourse.create({
        data: {
          title,
          platform,
          provider,
          url,
          skillsCovered: skillsCovered || [],
          category,
          difficulty,
          duration,
          certificationAvailable,
          isFree,
          pricingType,
          rating,
          enrolledCount,
          description,
          courses,
          departments,
          isActive,
        },
      });

      return NextResponse.json({ success: true, course: created });
    }
  } catch (error: any) {
    console.error("Error creating/updating course:", error);
    return NextResponse.json(
      { error: error.message || "Failed to save course" },
      { status: 500 }
    );
  }
}
