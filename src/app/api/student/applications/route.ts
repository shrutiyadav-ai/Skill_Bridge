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

    const email = session.user.email.toLowerCase().trim();
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        studentProfile: {
          include: {
            applications: {
              include: {
                opportunity: {
                  include: {
                    industry: true,
                  },
                },
              },
              orderBy: { appliedAt: "desc" },
            },
          },
        },
      },
    });

    if (!user?.studentProfile) {
      return NextResponse.json({ applications: [] });
    }

    const applications = user.studentProfile.applications.map((app) => ({
      id: app.id,
      opportunityId: app.opportunityId,
      opportunityTitle: app.opportunity?.title || "Opportunity",
      companyName: app.opportunity?.industry?.companyName || "Partner Organization",
      type: app.opportunity?.type || "INTERNSHIP",
      location: app.opportunity?.location || (app.opportunity?.remote ? "Remote" : "India"),
      stipend: app.opportunity?.stipend ? Number(app.opportunity.stipend) : null,
      status: app.status,
      appliedAt: app.appliedAt.toISOString(),
      studentName: user.name,
      studentEmail: user.email,
      matchScore: 88,
    }));

    return NextResponse.json({ applications });
  } catch (error: any) {
    console.error("Applications GET error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch applications" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    const body = await request.json();
    const { opportunityId } = body;

    const email = session?.user?.email?.toLowerCase().trim();
    if (!email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email },
      include: { studentProfile: true },
    });

    if (user?.studentProfile && opportunityId) {
      const existing = await prisma.application.findFirst({
        where: {
          studentId: user.studentProfile.id,
          opportunityId,
        },
      });

      if (!existing) {
        await prisma.application.create({
          data: {
            studentId: user.studentProfile.id,
            opportunityId,
            status: "APPLIED",
          },
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: "Application submitted successfully",
    });
  } catch (error: any) {
    console.error("Application submission error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to submit application" },
      { status: 500 }
    );
  }
}
