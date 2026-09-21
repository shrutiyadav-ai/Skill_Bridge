import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    const body = await request.json();
    const { opportunityId } = body;

    const userId = (session?.user as any)?.id;

    if (userId && opportunityId) {
      try {
        const studentProfile = await prisma.studentProfile.findUnique({
          where: { userId },
        });

        if (studentProfile) {
          await prisma.application.create({
            data: {
              studentId: studentProfile.id,
              opportunityId,
              status: "APPLIED",
            },
          });
        }
      } catch (dbErr) {
        console.warn("DB save note:", dbErr);
      }
    }

    return NextResponse.json({
      success: true,
      message: "Application submitted successfully",
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to submit application" },
      { status: 500 }
    );
  }
}
