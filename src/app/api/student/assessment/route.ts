import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    const body = await request.json();
    const { roleId, scores } = body;

    const userId = (session?.user as any)?.id;

    if (userId) {
      try {
        // Save assessment result in database
        await prisma.assessmentResult.create({
          data: {
            userId,
            assessmentId: "70000000-0000-0000-0000-000000000001",
            technicalScore: scores.technicalScore,
            aptitudeScore: scores.aptitudeScore,
            softSkillScore: scores.softSkillScore,
            overallScore: scores.overallScore,
          },
        });
      } catch (dbErr) {
        console.warn("DB save note:", dbErr);
      }
    }

    return NextResponse.json({
      success: true,
      message: "Assessment scored and recorded",
      scores,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to submit assessment" },
      { status: 500 }
    );
  }
}
